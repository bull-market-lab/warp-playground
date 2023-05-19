import { useMemo } from "react";
import { MsgExecuteContract, WalletConnection } from "@delphi-labs/shuttle";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import BigNumber from "bignumber.js";
import { objectToBase64 } from "@/utils/encoding";
import { getTokenDecimals } from "@/config/tokens";
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
      if (
        offerAssetAddress.startsWith("u") ||
        offerAssetAddress === "inj" ||
        offerAssetAddress.startsWith("ibc/")
      ) {
        assetInfo = { native_token: { denom: offerAssetAddress } };
      }

      console.log("useSwapSimulate", poolAddress, {
        simulation: {
          offer_asset: {
            amount: BigNumber(amount)
              .times(getTokenDecimals(offerAssetAddress))
              .toString(),
            info: assetInfo,
          },
        },
      });

      const response = await client.queryContractSmart(poolAddress, {
        simulation: {
          offer_asset: {
            amount: BigNumber(amount)
              .times(getTokenDecimals(offerAssetAddress))
              .toString(),
            info: assetInfo,
          },
        },
      });

      // console.log("amount", amount);
      // console.log("response.return_amount", response.return_amount);
      return {
        amount: BigNumber(response.return_amount)
          .div(getTokenDecimals(returnAssetAddress))
          .toString(),
        commission: BigNumber(response.commission_amount)
          .div(getTokenDecimals(returnAssetAddress))
          .toString(),
        spread: BigNumber(response.spread_amount)
          .div(getTokenDecimals(returnAssetAddress))
          .toString(),
        beliefPrice: BigNumber(amount)
          .times(getTokenDecimals(offerAssetAddress))
          .div(response.return_amount)
          .toString(),
        price: BigNumber(amount)
          .times(getTokenDecimals(offerAssetAddress))
          .div(
            BigNumber(response.return_amount).div(
              getTokenDecimals(returnAssetAddress)
            )
          )
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

type UseSwapProps = {
  amount: string;
  exchangeRate: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  poolAddress: string;
  slippage?: string;
};

export const useSwap = ({
  amount,
  exchangeRate,
  offerAssetAddress,
  returnAssetAddress,
  poolAddress,
  slippage = "0.005",
}: UseSwapProps) => {
  const wallet = useWallet();
  console.log("useSwap real");
  const msgs = useMemo(() => {
    if (
      !amount ||
      !offerAssetAddress ||
      !returnAssetAddress ||
      !poolAddress ||
      !wallet
    ) {
      return [];
    }

    if (BigNumber(amount).isLessThanOrEqualTo(0)) {
      return [];
    }

    if (
      offerAssetAddress.startsWith("u") ||
      offerAssetAddress === "inj" ||
      offerAssetAddress.startsWith("ibc/")
    ) {
      return [
        new MsgExecuteContract({
          sender: wallet.account.address,
          contract: poolAddress,
          msg: {
            swap: {
              offer_asset: {
                amount: BigNumber(amount)
                  .times(getTokenDecimals(offerAssetAddress))
                  .toString(),
                info: { native_token: { denom: offerAssetAddress } },
              },
              max_spread: slippage,
              // belief_price: BigNumber(simulate.data?.beliefPrice || "1").toFixed(18).toString(),
              belief_price: BigNumber(exchangeRate).toFixed(18).toString(),
            },
          },
          funds: [
            {
              denom: offerAssetAddress,
              amount: BigNumber(amount)
                .times(getTokenDecimals(offerAssetAddress))
                .toString(),
            },
          ],
        }),
      ];
    }

    return [
      new MsgExecuteContract({
        sender: wallet.account.address,
        contract: offerAssetAddress,
        msg: {
          send: {
            amount: BigNumber(amount)
              .times(getTokenDecimals(offerAssetAddress))
              .toString(),
            contract: poolAddress,
            msg: objectToBase64({
              swap: {
                max_spread: slippage,
                // belief_price: BigNumber(simulate.data?.beliefPrice || "1").toFixed(18).toString(),
                belief_price: BigNumber(exchangeRate).toFixed(18).toString(),
              },
            }),
          },
        },
      }),
    ];
  }, [
    wallet,
    offerAssetAddress,
    returnAssetAddress,
    poolAddress,
    amount,
    slippage,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

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
