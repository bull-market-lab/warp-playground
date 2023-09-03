import { useMemo } from "react";
import { MsgExecuteContract } from "@terra-money/feather.js";
import BigNumber from "bignumber.js";

import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { toBase64 } from "@/utils/encoding";
import { constructJobDescriptionForAstroportDcaOrder } from "@/utils/naming";
import {
  DEFAULT_JOB_REWARD_AMOUNT,
  LABEL_ASTROPORT,
  LABEL_DCA_ORDER,
  LABEL_WARP_PLAYGROUND,
  NAME_WARP_PLAYGROUND_ASTROPORT_DCA_ORDER,
  Token,
} from "@/utils/constants";
import useMyWallet from "../useMyWallet";
import {
  constructAssetsToWithdraw,
  constructHelperMsgs,
  constructOfferTokenLabel,
  constructReturnTokenLabel,
} from "@/utils/warpHelpers";
import useWarpGetFirstFreeSubAccount from "../query/useWarpGetFirstFreeSubAccount";

type UseWarpCreateJobAstroportDcaOrderProps = {
  warpTotalJobFee: string;
  poolAddress: string;
  // total offer amount, each order will be offerTokenAmount / dcaCount
  offerTokenAmount: string;
  offerToken: Token;
  returnToken: Token;
  // how many times to repeat the job, e.g. 10 means the job will run 10 times
  dcaCount: number;
  // how often to repeat the job, unit is day, e.g. 1 means the job will run everyday
  dcaInterval: number;
  // when to start the job, in unix timestamp
  dcaStartTimestamp: number;
  // max spread for astroport swap
  maxSpread: string;
};

const useWarpCreateJobAstroportDcaOrder = ({
  warpTotalJobFee,
  poolAddress,
  offerTokenAmount,
  offerToken,
  returnToken,
  dcaCount,
  dcaInterval,
  dcaStartTimestamp,
  maxSpread,
}: UseWarpCreateJobAstroportDcaOrderProps) => {
  const { currentChainConfig, myAddress } = useMyWallet();
  const getWarpFirstFreeSubAccountResult =
    useWarpGetFirstFreeSubAccount().accountResult.data;

  const warpControllerAddress = currentChainConfig.warp.controllerAddress;
  const warpFeeTokenAddress = currentChainConfig.warp.feeToken.address;

  // we need to set max spread carefully as this is a market order
  // use default spread 1% for now
  // const maxSpread = "0.01";

  const msgs = useMemo(() => {
    if (
      !myAddress ||
      !warpTotalJobFee ||
      !getWarpFirstFreeSubAccountResult ||
      !poolAddress ||
      !offerTokenAmount ||
      !offerToken ||
      !returnToken ||
      !dcaCount ||
      !dcaInterval ||
      !dcaStartTimestamp ||
      !maxSpread
    ) {
      return [];
    }

    const warpSubAccountAddress = getWarpFirstFreeSubAccountResult.account;

    /// =========== vars ===========

    const jobVarNameNextExecution = "dca-execution";
    const jobVarNextExecution = {
      static: {
        kind: "uint", // NOTE: it's better to use uint instead of timestamp to keep it consistent with condition
        name: jobVarNameNextExecution,
        encode: false,
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
        encode: false,
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

    /// =========== condition ===========

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

    /// =========== job msgs ===========

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
            to: myAddress,
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
                    denom: returnToken.address,
                  },
                },
                // offer_asset
                // "belief_price": beliefPrice,
                max_spread: maxSpread,
                to: myAddress,
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

    /// =========== cosmos msgs ===========

    const helperMsgs = constructHelperMsgs({
      myAddress,
      warpAccountAddress: warpSubAccountAddress,
      warpControllerAddress,
      warpFeeTokenAddress,
      warpTotalJobFee,
      offerTokenAddress: offerToken.address,
      offerTokenAmount: BigNumber(offerTokenAmount).times(dcaCount).toString(),
    });

    const createJob = new MsgExecuteContract(myAddress, warpControllerAddress, {
      create_job: {
        name: NAME_WARP_PLAYGROUND_ASTROPORT_DCA_ORDER,
        description: constructJobDescriptionForAstroportDcaOrder(
          offerTokenAmount,
          offerToken,
          returnToken,
          dcaCount,
          dcaInterval,
          false
        ),
        labels: [
          LABEL_WARP_PLAYGROUND,
          LABEL_DCA_ORDER,
          LABEL_ASTROPORT,
          constructOfferTokenLabel(offerToken.address, offerTokenAmount),
          constructReturnTokenLabel(returnToken.address, ""),
        ],
        account: warpSubAccountAddress,
        recurring: true,
        requeue_on_evict: false,
        reward: convertTokenDecimals(
          DEFAULT_JOB_REWARD_AMOUNT,
          warpFeeTokenAddress
        ),
        assets_to_withdraw: constructAssetsToWithdraw({
          tokenAddresses: [
            warpFeeTokenAddress,
            offerToken.address,
            returnToken.address,
          ],
        }),
        vars: JSON.stringify([jobVarAlreadyRunCounter, jobVarNextExecution]),
        condition: JSON.stringify(condition),
        msgs: JSON.stringify([swap]),
      },
    });

    return [...helperMsgs, createJob];
  }, [
    myAddress,
    warpFeeTokenAddress,
    warpControllerAddress,
    getWarpFirstFreeSubAccountResult,
    warpTotalJobFee,
    poolAddress,
    offerTokenAmount,
    offerToken,
    returnToken,
    dcaCount,
    dcaInterval,
    dcaStartTimestamp,
    maxSpread,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useWarpCreateJobAstroportDcaOrder;
