import { MsgExecuteContract } from "@terra-money/feather.js";
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
  Token,
} from "@/utils/constants";
import { constructHelperMsgs } from "@/utils/warpHelpers";

type UseWarpCreateJobAstroportLimitOrderProps = {
  senderAddress?: string;
  // token denom used to pay for warp fee, now is always uluna
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpTotalJobFee: string;
  poolAddress: string;
  offerTokenAmount: string;
  minimumReturnTokenAmount: string;
  offerToken: Token;
  returnToken: Token;
  expiredAfterDays: number;
};

export const useWarpCreateJobAstroportLimitOrder = ({
  senderAddress,
  warpFeeTokenAddress,
  warpControllerAddress,
  warpTotalJobFee,
  poolAddress,
  offerTokenAmount,
  minimumReturnTokenAmount,
  offerToken,
  returnToken,
  expiredAfterDays,
}: UseWarpCreateJobAstroportLimitOrderProps) => {
  // this can be set arbitrarily large since condition guarantee we always get minimumReturnTokenAmount
  // TODO: verify that's the case in production
  const maxSpread = "0.1";

  const msgs = useMemo(() => {
    if (
      !warpControllerAddress ||
      !warpTotalJobFee ||
      !poolAddress ||
      !offerTokenAmount ||
      !minimumReturnTokenAmount ||
      !offerToken ||
      !returnToken ||
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
      offerTokenAddress: offerToken.address,
      offerTokenAmount,
    });

    const astroportSwapMsg = isNativeAsset(offerToken.address)
      ? {
          swap: {
            offer_asset: {
              info: {
                native_token: {
                  denom: offerToken.address,
                },
              },
              amount: convertTokenDecimals(
                offerTokenAmount,
                offerToken.address
              ),
            },
            max_spread: maxSpread,
            to: senderAddress,
          },
        }
      : {
          send: {
            contract: poolAddress,
            amount: convertTokenDecimals(offerTokenAmount, offerToken.address),
            msg: toBase64({
              swap: {
                ask_asset_info: {
                  native_token: {
                    denom: offerToken.address,
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
          contract_addr: isNativeAsset(offerToken.address)
            ? poolAddress
            : offerToken.address,
          msg: toBase64(astroportSwapMsg),
          funds: isNativeAsset(offerToken.address)
            ? [
                {
                  denom: offerToken.address,
                  amount: convertTokenDecimals(
                    offerTokenAmount,
                    offerToken.address
                  ),
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
          info: isNativeAsset(offerToken.address)
            ? {
                native_token: {
                  denom: offerToken.address,
                },
              }
            : {
                token: {
                  contract_addr: offerToken.address,
                },
              },
          amount: convertTokenDecimals(offerTokenAmount, offerToken.address),
        },
      },
    };

    const jobVarName = constructJobVarNameForAstroportLimitOrder(
      offerTokenAmount,
      offerToken,
      returnToken
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
              minimumReturnTokenAmount,
              returnToken.address
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
            offerTokenAmount,
            offerToken,
            returnToken,
            minimumReturnTokenAmount
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
    warpTotalJobFee,
    poolAddress,
    offerTokenAmount,
    minimumReturnTokenAmount,
    offerToken,
    expiredAfterDays,
    returnToken,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
