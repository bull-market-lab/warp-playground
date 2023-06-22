import { useMemo } from "react";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { toBase64 } from "@/utils/encoding";
import { constructJobNameForAstroportDcaOrder } from "@/utils/naming";
import {
  DAY_IN_SECONDS,
  DEFAULT_JOB_REWARD_AMOUNT,
  EVICTION_FEE,
} from "@/utils/constants";
import { constructHelperMsgs } from "@/utils/warpHelpers";
import { MsgExecuteContract } from "@terra-money/feather.js";
import BigNumber from "bignumber.js";

type UseWarpCreateJobAstroportDcaOrderProps = {
  senderAddress?: string;
  // token denom used to pay for warp fee, now is always uluna
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  poolAddress: string;
  // total offer amount, each order will be offerAmount / dcaCount
  offerAmount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  // how many times to repeat the job, e.g. 10 means the job will run 10 times
  dcaCount: number;
  // how often to repeat the job, unit is day, e.g. 1 means the job will run everyday
  dcaInterval: number;
  // when to start the job, in unix timestamp
  dcaStartTimestamp: number;
  // max spread for astroport swap
  maxSpread: string;
};

export const useWarpCreateJobAstroportDcaOrder = ({
  senderAddress,
  warpFeeTokenAddress,
  warpControllerAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  poolAddress,
  offerAmount,
  offerAssetAddress,
  returnAssetAddress,
  dcaCount,
  dcaInterval,
  dcaStartTimestamp,
  maxSpread,
}: UseWarpCreateJobAstroportDcaOrderProps) => {
  // we need to set max spread carefully as this is a market order
  // use default spread 1% for now
  // const maxSpread = "0.01";

  const msgs = useMemo(() => {
    if (
      !senderAddress ||
      !warpFeeTokenAddress ||
      !warpControllerAddress ||
      !warpAccountAddress ||
      !warpJobCreationFeePercentage ||
      !poolAddress ||
      !offerAmount ||
      !offerAssetAddress ||
      !returnAssetAddress ||
      !dcaCount ||
      !dcaInterval ||
      !dcaStartTimestamp ||
      !maxSpread
    ) {
      return [];
    }

    const howManyDaysUntilStartTime = Math.ceil(
      (dcaStartTimestamp - Date.now() / 1000) / DAY_IN_SECONDS
    );

    // we might be overpaying eviction fee, but it's fine, as long as it's not underpaid
    const jobFee = BigNumber(DEFAULT_JOB_REWARD_AMOUNT)
      // creation fee + reward for a single job
      .times(BigNumber(warpJobCreationFeePercentage).plus(100).div(100))
      // pay eviction fee between each interval
      .plus(BigNumber(EVICTION_FEE).times(dcaInterval))
      // times how many times the job will run
      .times(dcaCount)
      // pay eviction fee between now and start time
      .plus(BigNumber(EVICTION_FEE).times(howManyDaysUntilStartTime))
      .toString();

    const helperMsgs = constructHelperMsgs({
      senderAddress,
      warpControllerAddress,
      warpFeeTokenAddress,
      jobFee,
      offerAssetAddress,
      offerAmount: BigNumber(offerAmount).times(dcaCount).toString(),
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

    const jobVarNameNextExecution = "dca-execution";
    const jobVarNextExecution = {
      static: {
        kind: "uint", // NOTE: it's better to use uint instead of timestamp to keep it consistent with condition
        name: jobVarNameNextExecution,
        value: dcaStartTimestamp.toString(),
        update_fn: {
          // update value to current timestamp + dcaInterval, i.e. make next execution 1 day later
          on_success: {
            uint: {
              expr: {
                left: {
                  simple: dcaInterval.toString(),
                },
                op: "add",
                right: {
                  env: "time",
                },
              },
            },
          },
          // TODO: high priority think about swap fail (e.g. max spread too low) and how to handle it
          // on error, do nothing for now, this will stop creating new jobs
          // on_error: {
          // }
        },
      },
    };

    const jobVarNameAlreadyRunCounter = "dca-already-run-counter";
    const jobVarAlreadyRunCounter = {
      static: {
        kind: "int",
        name: jobVarNameAlreadyRunCounter,
        value: (0).toString(), // initial counter value is 0
        update_fn: {
          // increment counter
          on_success: {
            int: {
              expr: {
                left: {
                  ref: `$warp.variable.${jobVarNameAlreadyRunCounter}`,
                },
                op: "add",
                right: {
                  simple: (1).toString(),
                },
              },
            },
          },
          // on error, do nothing for now, this will stop creating new jobs
          // on_error: {
          // }
        },
      },
    };

    const condition = {
      and: [
        {
          expr: {
            uint: {
              // NOTE: we must use uint instead of timestamp here as timestamp can only compare current time with var
              // there is no left side of expression
              left: {
                env: "time",
              },
              op: "gt",
              right: {
                ref: `$warp.variable.${jobVarNameNextExecution}`,
              },
            },
          },
        },
        {
          expr: {
            int: {
              left: {
                ref: `$warp.variable.${jobVarNameAlreadyRunCounter}`,
              },
              op: "lt",
              right: {
                simple: dcaCount.toString(),
              },
            },
          },
        },
      ],
    };

    const createJob = new MsgExecuteContract(
      senderAddress,
      warpControllerAddress,
      {
        create_job: {
          name: constructJobNameForAstroportDcaOrder(
            offerAmount,
            offerAssetAddress,
            returnAssetAddress
          ),
          description: "dca order",
          labels: [],
          recurring: true,
          requeue_on_evict: false,
          reward: convertTokenDecimals(
            DEFAULT_JOB_REWARD_AMOUNT,
            warpFeeTokenAddress
          ),
          condition: condition,
          msgs: [swapJsonString],
          vars: [jobVarAlreadyRunCounter, jobVarNextExecution],
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
    offerAssetAddress,
    returnAssetAddress,
    dcaCount,
    dcaInterval,
    dcaStartTimestamp,
    maxSpread,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
