import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { toBase64 } from "@/utils/encoding";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { Coins, MsgExecuteContract } from "@terra-money/feather.js";

type UseSwapProps = {
  senderAddress: string;
  amount: string;
  exchangeRate: string;
  offerTokenAddress: string;
  returnTokenAddress: string;
  poolAddress: string;
  slippage?: string;
};

const useSwap = ({
  senderAddress,
  amount,
  exchangeRate,
  offerTokenAddress,
  returnTokenAddress,
  poolAddress,
  slippage = "0.005",
}: UseSwapProps) => {
  const msgs = useMemo(() => {
    if (
      !amount ||
      !exchangeRate ||
      !offerTokenAddress ||
      !returnTokenAddress ||
      !poolAddress ||
      !senderAddress
    ) {
      return [];
    }

    if (BigNumber(amount).isLessThanOrEqualTo(0)) {
      return [];
    }

    if (isNativeAsset(offerTokenAddress)) {
      return [
        new MsgExecuteContract(
          senderAddress,
          poolAddress,
          {
            swap: {
              offer_asset: {
                amount: convertTokenDecimals(amount, offerTokenAddress),
                info: { native_token: { denom: offerTokenAddress } },
              },
              max_spread: slippage,
              // belief_price: BigNumber(simulate.data?.beliefPrice || "1").toFixed(18).toString(),
              belief_price: BigNumber(exchangeRate).toFixed(18).toString(),
            },
          },
          new Coins({
            [offerTokenAddress]: convertTokenDecimals(
              amount,
              offerTokenAddress
            ),
          })
        ),
      ];
    }

    return [
      new MsgExecuteContract(senderAddress, offerTokenAddress, {
        send: {
          amount: convertTokenDecimals(amount, offerTokenAddress),
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
    offerTokenAddress,
    returnTokenAddress,
    poolAddress,
    amount,
    slippage,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useSwap;
