import { useMemo } from "react";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { toBase64 } from "@/utils/encoding";
import {
  constructJobVarNameForAstroportLimitOrder,
  constructJobDescriptionForAstroportLimitOrder,
} from "@/utils/naming";
import {
  DEFAULT_JOB_REWARD_AMOUNT,
  LABEL_ASTROPORT_LIMIT_ORDER,
  LABEL_WARP_WORLD,
  NAME_WARP_WORLD_ASTROPORT_LIMIT_ORDER,
} from "@/utils/constants";
import { constructHelperMsgs } from "@/utils/warpHelpers";
import { MsgExecuteContract } from "@terra-money/feather.js";

type UseWarpCreateJobAstroportLimitOrderProps = {
  senderAddress?: string;
  // token denom used to pay for warp fee, now is always uluna
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpTotalJobFee: string;
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
  warpTotalJobFee,
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
      !warpTotalJobFee ||
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

    const helperMsgs = constructHelperMsgs({
      senderAddress,
      warpControllerAddress,
      warpFeeTokenAddress,
      warpTotalJobFee,
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
          name: NAME_WARP_WORLD_ASTROPORT_LIMIT_ORDER,
          description: constructJobDescriptionForAstroportLimitOrder(
            offerAmount,
            offerAssetAddress,
            returnAssetAddress,
            minimumReturnAmount
          ),
          labels: [LABEL_WARP_WORLD, LABEL_ASTROPORT_LIMIT_ORDER],
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
    warpTotalJobFee,
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
