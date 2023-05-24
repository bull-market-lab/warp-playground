import { useMemo } from "react";
import { MsgExecuteContract, MsgSend } from "@delphi-labs/shuttle";
import useWallet from "./useWallet";
import BigNumber from "bignumber.js";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import { toBase64 } from "@/utils/encoding";
import {
  constructJobNameForAstroportLimitSwap,
  constructJobVarNameForAstroportLimitSwap,
} from "@/utils/naming";

type UseWarpCreateJobAstroportLimitSwapProps = {
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  poolAddress: string;
  offerAmount: string;
  minimumReturnAmount: string;
  offerAssetAddress: string;
  returnAssetAddress: string;
};

export const useWarpCreateJobAstroportLimitSwap = ({
  warpControllerAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  poolAddress,
  offerAmount,
  minimumReturnAmount,
  offerAssetAddress,
  returnAssetAddress,
}: UseWarpCreateJobAstroportLimitSwapProps) => {
  const wallet = useWallet();

  const lunaJobReward = "1";
  const lunaJobRewardAndCreationFee = BigNumber(lunaJobReward)
    .times(BigNumber(warpJobCreationFeePercentage).plus(100).div(100))
    .toString();
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
      !wallet
    ) {
      return [];
    }

    const fundWarpAccountForJobRewardAndCreationFee = new MsgSend({
      fromAddress: wallet.account.address,
      toAddress: warpAccountAddress,
      amount: [
        {
          denom: wallet.network.defaultCurrency!.coinMinimalDenom,
          amount: convertTokenDecimals(
            lunaJobRewardAndCreationFee,
            wallet.network.defaultCurrency!.coinMinimalDenom
          ),
        },
      ],
    });

    const fundWarpAccountForOfferedAsset = isNativeAsset(offerAssetAddress)
      ? new MsgSend({
          fromAddress: wallet.account.address,
          toAddress: warpAccountAddress,
          amount: [
            {
              denom: wallet.network.defaultCurrency!.coinMinimalDenom,
              amount: convertTokenDecimals(offerAmount, offerAssetAddress),
            },
          ],
        })
      : new MsgExecuteContract({
          sender: wallet.account.address,
          contract: offerAssetAddress,
          msg: {
            transfer: {
              recipient: warpAccountAddress,
              amount: convertTokenDecimals(offerAmount, offerAssetAddress),
            },
          },
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

    const jobVarName = constructJobVarNameForAstroportLimitSwap(
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
          name: constructJobNameForAstroportLimitSwap(
            offerAmount,
            offerAssetAddress,
            returnAssetAddress,
            minimumReturnAmount
          ),
          recurring: false,
          requeue_on_evict: false,
          reward: convertTokenDecimals(
            lunaJobReward,
            wallet.network.defaultCurrency!.coinMinimalDenom
          ),
          condition: condition,
          msgs: [swapJsonString],
          vars: [jobVar],
        },
      },
    });

    return [
      fundWarpAccountForJobRewardAndCreationFee,
      fundWarpAccountForOfferedAsset,
      createJob,
    ];
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
