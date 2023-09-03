import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import useMyWallet from "../useMyWallet";
import { queryWasmContractWithCatch } from "@/utils/lcdHelper";

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
  amount: string;
  offerTokenAddress: string;
  returnTokenAddress: string;
  poolAddress: string;
};

const useSimulateSwap = ({
  amount,
  offerTokenAddress,
  returnTokenAddress,
  poolAddress,
}: UseSimulateSwapProps) => {
  const { lcd } = useMyWallet();

  const simulateResult = useQuery(
    [
      "simulate_swap",
      amount,
      offerTokenAddress,
      returnTokenAddress,
      poolAddress,
    ],
    async () => {
      if (
        !lcd ||
        !amount ||
        !offerTokenAddress ||
        !returnTokenAddress ||
        !poolAddress
      ) {
        return null;
      }

      if (BigNumber(amount).isLessThanOrEqualTo(0)) {
        return null;
      }

      let assetInfo: AssetInfo = {
        token: { contract_addr: offerTokenAddress },
      };
      if (isNativeAsset(offerTokenAddress)) {
        assetInfo = { native_token: { denom: offerTokenAddress } };
      }

      const response: SimulateSwapResponse = await queryWasmContractWithCatch(
        lcd,
        poolAddress,
        {
          simulation: {
            offer_asset: {
              amount: convertTokenDecimals(amount, offerTokenAddress),
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
        beliefPrice: BigNumber(convertTokenDecimals(amount, offerTokenAddress))
          .div(response.return_amount)
          .toString(),
        price: BigNumber(convertTokenDecimals(amount, offerTokenAddress))
          .div(response.return_amount)
          .toString(),
      };
    },
    {
      enabled:
        !!lcd &&
        !!amount &&
        !!offerTokenAddress &&
        !!returnTokenAddress &&
        !!poolAddress,
    }
  );

  return useMemo(() => {
    return { simulateResult };
  }, [simulateResult]);
};

export default useSimulateSwap;
