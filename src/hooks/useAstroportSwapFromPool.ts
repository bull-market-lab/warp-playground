import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { toBase64 } from "@/utils/encoding";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import { Coins, MsgExecuteContract } from "@terra-money/feather.js";

type UseSwapProps = {
  senderAddress: string;
  amount: string;
  exchangeRate: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  poolAddress: string;
  slippage?: string;
};

export const useSwap = ({
  senderAddress,
  amount,
  exchangeRate,
  offerAssetAddress,
  returnAssetAddress,
  poolAddress,
  slippage = "0.005",
}: UseSwapProps) => {
  const msgs = useMemo(() => {
    if (
      !amount ||
      !exchangeRate ||
      !offerAssetAddress ||
      !returnAssetAddress ||
      !poolAddress ||
      !senderAddress
    ) {
      return [];
    }

    if (BigNumber(amount).isLessThanOrEqualTo(0)) {
      return [];
    }

    if (isNativeAsset(offerAssetAddress)) {
      return [
        new MsgExecuteContract(
          senderAddress,
          poolAddress,
          {
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
          new Coins({
            [offerAssetAddress]: convertTokenDecimals(
              amount,
              offerAssetAddress
            ),
          })
        ),
      ];
    }

    return [
      new MsgExecuteContract(senderAddress, offerAssetAddress, {
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
      }),
    ];
  }, [
    senderAddress,
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
