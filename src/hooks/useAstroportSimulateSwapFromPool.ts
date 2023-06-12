import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import { LCDClient } from "@terra-money/feather.js";

type AssetInfo =
  | {
      token: {
        contract_addr: string;
      };
    }
  | {
      native_token: {
        denom: string;
      };
    };

type SimulateSwapResponse = {
  return_amount: string;
  commission_amount: string;
  spread_amount: string;
};

type UseSimulateSwapProps = {
  lcd: LCDClient;
  chainID: string;
  amount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  poolAddress: string;
};

export const useSimulateSwap = ({
  lcd,
  chainID,
  amount,
  offerAssetAddress,
  returnAssetAddress,
  poolAddress,
}: UseSimulateSwapProps) => {
  const simulateResult = useQuery(
    [
      "swap-simulate",
      amount,
      offerAssetAddress,
      returnAssetAddress,
      poolAddress,
    ],
    async () => {
      if (
        !chainID ||
        !amount ||
        !offerAssetAddress ||
        !returnAssetAddress ||
        !poolAddress
      ) {
        return null;
      }

      if (BigNumber(amount).isLessThanOrEqualTo(0)) {
        return null;
      }

      let assetInfo: AssetInfo = {
        token: { contract_addr: offerAssetAddress },
      };
      if (isNativeAsset(offerAssetAddress)) {
        assetInfo = { native_token: { denom: offerAssetAddress } };
      }

      const response: SimulateSwapResponse = await lcd.wasm.contractQuery(
        poolAddress,
        {
          simulation: {
            offer_asset: {
              amount: convertTokenDecimals(amount, offerAssetAddress),
              info: assetInfo,
            },
          },
        }
      );

      return {
        // no need to convert decimals for amount, commission, spread
        amount: response.return_amount,
        commission: response.commission_amount,
        spread: response.spread_amount,
        beliefPrice: BigNumber(convertTokenDecimals(amount, offerAssetAddress))
          .div(response.return_amount)
          .toString(),
        price: BigNumber(convertTokenDecimals(amount, offerAssetAddress))
          .div(response.return_amount)
          .toString(),
      };
    },
    {
      enabled:
        !!chainID &&
        !!amount &&
        !!offerAssetAddress &&
        !!returnAssetAddress &&
        !!poolAddress,
    }
  );

  return useMemo(() => {
    return { simulateResult };
  }, [simulateResult]);
};
