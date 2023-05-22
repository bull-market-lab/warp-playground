import { useMemo } from "react";
import { WalletConnection } from "@delphi-labs/shuttle";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import BigNumber from "bignumber.js";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import useWallet from "./useWallet";

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

type GetSimulateResultProps = {
  amount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  poolAddress: string;
  wallet: WalletConnection;
};

function getSimulateResult({
  amount,
  offerAssetAddress,
  returnAssetAddress,
  poolAddress,
  wallet,
}: GetSimulateResultProps) {
  return useQuery(
    [
      "swap-simulate",
      amount,
      offerAssetAddress,
      returnAssetAddress,
      poolAddress,
    ],
    async () => {
      if (
        !amount ||
        !offerAssetAddress ||
        !returnAssetAddress ||
        !poolAddress ||
        !wallet
      ) {
        return null;
      }

      if (BigNumber(amount).isLessThanOrEqualTo(0)) {
        return null;
      }

      // console.log(
      //   "swap-simulate",
      //   amount,
      //   offerAssetAddress,
      //   returnAssetAddress,
      //   poolAddress
      // );
      const client = await CosmWasmClient.connect(wallet.network.rpc || "");

      let assetInfo: AssetInfo = {
        token: { contract_addr: offerAssetAddress },
      };
      if (isNativeAsset(offerAssetAddress)) {
        assetInfo = { native_token: { denom: offerAssetAddress } };
      }

      console.log("useSwapSimulate", poolAddress, {
        simulation: {
          offer_asset: {
            amount: convertTokenDecimals(amount, offerAssetAddress),
            info: assetInfo,
          },
        },
      });

      const response = await client.queryContractSmart(poolAddress, {
        simulation: {
          offer_asset: {
            amount: convertTokenDecimals(amount, offerAssetAddress),
            info: assetInfo,
          },
        },
      });

      // console.log("amount", amount);
      // console.log("response.return_amount", response.return_amount);
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
        !!amount &&
        !!offerAssetAddress &&
        !!returnAssetAddress &&
        !!poolAddress &&
        !!wallet,
    }
  );
}

type UseSimulateSwapProps = {
  amount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  poolAddress: string;
};

export const useSimulateSwap = ({
  amount,
  offerAssetAddress,
  returnAssetAddress,
  poolAddress,
}: UseSimulateSwapProps) => {
  const wallet = useWallet();
  const simulateResult = getSimulateResult({
    amount,
    offerAssetAddress,
    returnAssetAddress,
    poolAddress,
    wallet,
  });
  console.log("useSwap simulate", simulateResult);

  return useMemo(() => {
    return { simulateResult };
  }, [simulateResult]);
};
