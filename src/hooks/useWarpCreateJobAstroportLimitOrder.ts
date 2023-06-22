import { useMemo } from "react";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { toBase64 } from "@/utils/encoding";
import {
  constructJobVarNameForAstroportLimitOrder,
  constructJobNameForAstroportLimitOrder,
} from "@/utils/naming";
import { DEFAULT_JOB_REWARD_AMOUNT, EVICTION_FEE } from "@/utils/constants";
import { constructHelperMsgs } from "@/utils/warpHelpers";
import { MsgExecuteContract } from "@terra-money/feather.js";
import BigNumber from "bignumber.js";

type UseWarpCreateJobAstroportLimitOrderProps = {
  senderAddress?: string;
  // token denom used to pay for warp fee, now is always uluna
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  poolAddress: string;
  offerAmount: string;
  minimumReturnAmount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  expiredAfterDays: number;
};

export const useWarpCreateJobAstroportLimitOrder = ({
  senderAddress,
  warpFeeTokenAddress,
  warpControllerAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  poolAddress,
  offerAmount,
  minimumReturnAmount,
  offerAssetAddress,
  returnAssetAddress,
  expiredAfterDays,
}: UseWarpCreateJobAstroportLimitOrderProps) => {
  // this can be set arbitrarily large since condition guarantee we always get minimumReturnAmount
  // TODO: verify that's the case in production
  const maxSpread = "0.1";

  const msgs = useMemo(() => {
    if (
      !warpControllerAddress ||
      !warpAccountAddress ||
      !warpJobCreationFeePercentage ||
      !poolAddress ||
      !offerAmount ||
      !minimumReturnAmount ||
      !offerAssetAddress ||
      !returnAssetAddress ||
      !expiredAfterDays ||
      !senderAddress
    ) {
      return [];
    }

    let jobFee = BigNumber(DEFAULT_JOB_REWARD_AMOUNT)
      .times(BigNumber(warpJobCreationFeePercentage).plus(100).div(100))
      // if expire after 1 day, we don't need to pay eviction fee at all
      .plus(BigNumber(EVICTION_FEE).multipliedBy(expiredAfterDays - 1))
      .toString();

    const helperMsgs =
    constructHelperMsgs({
        senderAddress,
        warpControllerAddress,
        warpFeeTokenAddress,
        jobFee,
        offerAssetAddress,
        offerAmount,
      });

    const astroportSwapMsg = isNativeAsset(offerAssetAddress)
      ? {
          swap: {
            offer_asset: {
              info: {
                native_token: {
                  denom: offerAssetAddress,
                },
              },
              amount: convertTokenDecimals(offerAmount, offerAssetAddress),
            },
            max_spread: maxSpread,
            to: senderAddress,
          },
        }
      : {
          send: {
            contract: poolAddress,
            amount: convertTokenDecimals(offerAmount, offerAssetAddress),
            msg: toBase64({
              swap: {
                ask_asset_info: {
                  native_token: {
                    denom: returnAssetAddress,
                  },
                },
                // offer_asset
                // "belief_price": beliefPrice,
                max_spread: maxSpread,
                to: senderAddress,
              },
            }),
          },
        };
    const swap = {
      wasm: {
        execute: {
          contract_addr: isNativeAsset(offerAssetAddress)
            ? poolAddress
            : offerAssetAddress,
          msg: toBase64(astroportSwapMsg),
          funds: isNativeAsset(offerAssetAddress)
            ? [
                {
                  denom: offerAssetAddress,
                  amount: convertTokenDecimals(offerAmount, offerAssetAddress),
                },
              ]
            : [],
        },
      },
    };
    const swapJsonString = JSON.stringify(swap);

    const astroportSimulateSwapMsg = {
      simulation: {
        offer_asset: {
          info: isNativeAsset(offerAssetAddress)
            ? {
                native_token: {
                  denom: offerAssetAddress,
                },
              }
            : {
                token: {
                  contract_addr: offerAssetAddress,
                },
              },
          amount: convertTokenDecimals(offerAmount, offerAssetAddress),
        },
      },
    };

    const jobVarName = constructJobVarNameForAstroportLimitOrder(
      offerAmount,
      offerAssetAddress,
      returnAssetAddress
    );
    const jobVar = {
      query: {
        kind: "amount",
        name: jobVarName,
        init_fn: {
          query: {
            wasm: {
              smart: {
                msg: toBase64(astroportSimulateSwapMsg),
                contract_addr: poolAddress,
              },
            },
          },
          selector: "$.return_amount",
        },
        reinitialize: false,
      },
    };

    const condition = {
      expr: {
        decimal: {
          op: "gte",
          left: {
            ref: `$warp.variable.${jobVarName}`,
          },
          right: {
            simple: convertTokenDecimals(
              minimumReturnAmount,
              returnAssetAddress
            ),
          },
        },
      },
    };

    const createJob = new MsgExecuteContract(
      senderAddress,
      warpControllerAddress,
      {
        create_job: {
          name: constructJobNameForAstroportLimitOrder(
            offerAmount,
            offerAssetAddress,
            returnAssetAddress,
            minimumReturnAmount
          ),
          description: "limit order",
          labels: [],
          recurring: false,
          requeue_on_evict: expiredAfterDays > 1,
          reward: convertTokenDecimals(
            DEFAULT_JOB_REWARD_AMOUNT,
            warpFeeTokenAddress
          ),
          condition: condition,
          msgs: [swapJsonString],
          vars: [jobVar],
        },
      }
    );

    return [...helperMsgs, createJob];
  }, [
    senderAddress,
    warpFeeTokenAddress,
    warpControllerAddress,
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount,
    minimumReturnAmount,
    offerAssetAddress,
    expiredAfterDays,
    returnAssetAddress,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
