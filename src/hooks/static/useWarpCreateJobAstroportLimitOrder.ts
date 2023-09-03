import { MsgExecuteContract } from "@terra-money/feather.js";
import { useMemo } from "react";

import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { toBase64 } from "@/utils/encoding";
import { constructJobDescriptionForAstroportLimitOrder } from "@/utils/naming";
import {
  DEFAULT_JOB_REWARD_AMOUNT,
  LABEL_ASTROPORT,
  LABEL_LIMIT_ORDER,
  LABEL_WARP_PLAYGROUND,
  NAME_WARP_PLAYGROUND_ASTROPORT_LIMIT_ORDER,
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

type UseWarpCreateJobAstroportLimitOrderProps = {
  warpTotalJobFee: string;
  poolAddress: string;
  offerTokenAmount: string;
  minimumReturnTokenAmount: string;
  offerToken: Token;
  returnToken: Token;
  expiredAfterDays: number;
};

const useWarpCreateJobAstroportLimitOrder = ({
  warpTotalJobFee,
  poolAddress,
  offerTokenAmount,
  minimumReturnTokenAmount,
  offerToken,
  returnToken,
  expiredAfterDays,
}: UseWarpCreateJobAstroportLimitOrderProps) => {
  const { currentChainConfig, myAddress } = useMyWallet();
  const getWarpFirstFreeSubAccountResult =
    useWarpGetFirstFreeSubAccount().accountResult.data;

  const warpControllerAddress = currentChainConfig.warp.controllerAddress;
  const warpFeeTokenAddress = currentChainConfig.warp.feeToken.address;

  // this can be set arbitrarily large since condition guarantee we always get minimumReturnTokenAmount
  // TODO: verify that's the case in production
  const maxSpread = "0.1";

  const msgs = useMemo(() => {
    if (
      !warpTotalJobFee ||
      !getWarpFirstFreeSubAccountResult ||
      !poolAddress ||
      !offerTokenAmount ||
      !minimumReturnTokenAmount ||
      !offerToken ||
      !returnToken ||
      !expiredAfterDays ||
      !myAddress
    ) {
      return [];
    }

    const warpSubAccountAddress = getWarpFirstFreeSubAccountResult.account;

    /// =========== vars ===========

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
    const jobVarNamePrice = `${offerToken.name}_to_${returnToken.name}_price`;
    const jobVarPrice = {
      query: {
        kind: "amount",
        name: jobVarNamePrice,
        reinitialize: false,
        encode: false,
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
      },
    };

    /// =========== condition ===========

    const condition = {
      expr: {
        decimal: {
          op: "gte",
          left: {
            ref: `$warp.variable.${jobVarNamePrice}`,
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
                    denom: offerToken.address,
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
      offerTokenAmount,
    });

    const createJob = new MsgExecuteContract(myAddress, warpControllerAddress, {
      create_job: {
        name: NAME_WARP_PLAYGROUND_ASTROPORT_LIMIT_ORDER,
        description: constructJobDescriptionForAstroportLimitOrder(
          offerTokenAmount,
          offerToken,
          returnToken,
          minimumReturnTokenAmount,
          false
        ),
        labels: [
          LABEL_WARP_PLAYGROUND,
          LABEL_LIMIT_ORDER,
          LABEL_ASTROPORT,
          constructOfferTokenLabel(offerToken.address, offerTokenAmount),
          constructReturnTokenLabel(
            returnToken.address,
            minimumReturnTokenAmount
          ),
        ],
        account: warpSubAccountAddress,
        recurring: false,
        requeue_on_evict: expiredAfterDays > 1,
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
        vars: JSON.stringify([jobVarPrice]),
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
    minimumReturnTokenAmount,
    offerToken,
    expiredAfterDays,
    returnToken,
  ]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useWarpCreateJobAstroportLimitOrder;
