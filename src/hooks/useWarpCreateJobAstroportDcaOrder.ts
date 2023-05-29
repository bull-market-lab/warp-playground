import { useMemo } from "react";
import { MsgExecuteContract } from "@delphi-labs/shuttle";
import useWallet from "./useWallet";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import { toBase64 } from "@/utils/encoding";
import {
  constructJobVarNameForAstroportDcaOrder,
  constructJobNameForAstroportDcaOrder,
} from "@/utils/naming";
import { DEFAULT_JOB_REWARD_AMOUNT } from "@/utils/constants";
import {
  constructFundJobForOfferedAssetMsg,
  constructFundJobForFeeMsg,
} from "@/utils/warpHelpers";

type UseWarpCreateJobAstroportDcaOrderProps = {
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  poolAddress: string;
  offerAmount: string;
  minimumReturnAmount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
  // how many times to repeat the job, e.g. 10 means the job will run 10 times
  dcaNumber: string;
  // how often to repeat the job
  // e.g. 1d means the job will run every day, 2d means every 2 days, 1w means every week
  dcaInterval: string;
  // when to start the job, e.g. 2021-09-01T00:00:00Z means the job will start on 2021-09-01
  dcaStartTime: string;
};

export const useWarpCreateJobAstroportDcaOrder = ({
  warpControllerAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  poolAddress,
  offerAmount,
  minimumReturnAmount,
  offerAssetAddress,
  returnAssetAddress,
}: UseWarpCreateJobAstroportDcaOrderProps) => {
  const wallet = useWallet();

  // we need to set max spread carefully as this is a market order
  // use default spread 1% for now
  const maxSpread = "0.01";

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
      !wallet
    ) {
      return [];
    }

    const fundWarpAccountForFee = constructFundJobForFeeMsg({
      wallet,
      warpAccountAddress,
      warpJobCreationFeePercentage,
      daysLived: 1,
    });

    const fundWarpAccountForOfferedAsset = constructFundJobForOfferedAssetMsg({
      wallet,
      warpAccountAddress,
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
            to: wallet.account.address,
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
                to: wallet.account.address,
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

    const jobVarName = constructJobVarNameForAstroportDcaOrder(
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

    const createJob = new MsgExecuteContract({
      sender: wallet.account.address,
      contract: warpControllerAddress,
      msg: {
        create_job: {
          name: constructJobNameForAstroportDcaOrder(
            offerAmount,
            offerAssetAddress,
            returnAssetAddress,
            minimumReturnAmount
          ),
          recurring: true,
          requeue_on_evict: false,
          reward: convertTokenDecimals(
            DEFAULT_JOB_REWARD_AMOUNT,
            wallet.network.defaultCurrency!.coinMinimalDenom
          ),
          condition: condition,
          msgs: [swapJsonString],
          vars: [jobVar],
        },
      },
    });

    return [fundWarpAccountForFee, fundWarpAccountForOfferedAsset, createJob];
  }, [
    wallet,
    warpControllerAddress,
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount,
    minimumReturnAmount,
    offerAssetAddress,
    returnAssetAddress,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
