import { useMemo } from "react";
import { MsgExecuteContract } from "@delphi-labs/shuttle";
import BigNumber from "bignumber.js";
import { toBase64 } from "@/utils/encoding";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import useWallet from "./useWallet";

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
  const msgs = useMemo(() => {
    if (
      !amount ||
      !exchangeRate ||
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

    if (isNativeAsset(offerAssetAddress)) {
      return [
        new MsgExecuteContract({
          sender: wallet.account.address,
          contract: poolAddress,
          msg: {
            swap: {
              offer_asset: {
                amount: convertTokenDecimals(amount, offerAssetAddress),
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
              amount: convertTokenDecimals(amount, offerAssetAddress),
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
            amount: convertTokenDecimals(amount, offerAssetAddress),
            contract: poolAddress,
            msg: toBase64({
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
    exchangeRate,
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
