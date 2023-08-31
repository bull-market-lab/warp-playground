import { MsgExecuteContract } from "@terra-money/feather.js";
import { useMemo } from "react";

import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import { toBase64 } from "@/utils/encoding";
import { constructJobDescriptionForAstroportLimitOrder } from "@/utils/naming";
import {
  DEFAULT_JOB_REWARD_AMOUNT,
  LABEL_ASTROPORT_LIMIT_ORDER,
  LABEL_WARP_PLAYGROUND,
  NAME_WARP_PLAYGROUND_ASTROPORT_LIMIT_ORDER,
  Token,
} from "@/utils/constants";
import useMyWallet from "../useMyWallet";
import {
  constructAssetsToWithdraw,
  constructHelperMsgs,
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

const useWarpCreateJobAstroportYieldBearingLimitOrderNativeTokenOnly = ({
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

  const marsRedBankAddress = currentChainConfig.mars.redBankAddress;
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

    const queryMarsBalanceMsg = {
      user_collateral: {
        user: warpSubAccountAddress,
        denom: offerToken.address,
      },
    };
    const jobVarNameMarsBalance = "usdc_balance_in_mars";
    const jobVarMarsBalance = {
      query: {
        kind: "amount",
        name: jobVarNameMarsBalance,
        reinitialize: false,
        encode: false,
        init_fn: {
          query: {
            wasm: {
              smart: {
                msg: toBase64(queryMarsBalanceMsg),
                contract_addr: marsRedBankAddress,
              },
            },
          },
          selector: "$.amount",
        },
      },
    };

    const astroportNativeSwapMsg = {
      swap: {
        offer_asset: {
          info: {
            native_token: {
              denom: offerToken.address,
            },
          },
          amount: `$warp.variable.${jobVarNameMarsBalance}`,
          // amount: swapAmount,
        },
        /*
          Belief Price + Max Spread
          If belief_price is provided in combination with max_spread, 
          the pool will check the difference between the return amount (using belief_price) and the real pool price.
          The belief_price +/- the max_spread is the range of possible acceptable prices for this swap.
          */
        // belief_price: beliefPrice,
        // max_spread: '0.005',
        max_spread: maxSpread,
        // to: '...', // default to sender, need to set explicitly cause default is sub account
        to: myAddress,
      },
    };
    const jobVarNameAstroportSwapMsg = "astroport_swap_msg";
    const jobVarAstroportSwapMsg = {
      static: {
        kind: "string",
        name: jobVarNameAstroportSwapMsg,
        encode: true,
        value: JSON.stringify(astroportNativeSwapMsg),
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

    const withdrawFromMarsMsg = {
      withdraw: {
        // amount unset will default to withdraw full amount
        denom: offerToken.address,
      },
    };
    const withdrawFromMars = {
      wasm: {
        execute: {
          contract_addr: marsRedBankAddress,
          msg: toBase64(withdrawFromMarsMsg),
          funds: [],
        },
      },
    };

    const swap = {
      wasm: {
        execute: {
          contract_addr: poolAddress,
          msg: `$warp.variable.${jobVarNameAstroportSwapMsg}`,
          funds: [
            {
              denom: offerToken.address,
              amount: `$warp.variable.${jobVarNameMarsBalance}`,
            },
          ],
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

    const depositToMarsMsg = {
      deposit: {},
    };
    const subAccountDepositToMars = new MsgExecuteContract(
      myAddress,
      warpSubAccountAddress,
      {
        generic: {
          msgs: [
            {
              wasm: {
                execute: {
                  contract_addr: marsRedBankAddress,
                  msg: toBase64(depositToMarsMsg),
                  funds: [
                    {
                      denom: offerToken.address,
                      amount: convertTokenDecimals(
                        offerTokenAmount,
                        offerTokenAmount
                      ),
                    },
                  ],
                },
              },
            },
          ],
        },
      }
    );

    const createJob = new MsgExecuteContract(myAddress, warpControllerAddress, {
      create_job: {
        name: NAME_WARP_PLAYGROUND_ASTROPORT_LIMIT_ORDER,
        description: constructJobDescriptionForAstroportLimitOrder(
          offerTokenAmount,
          offerToken,
          returnToken,
          minimumReturnTokenAmount
        ),
        labels: [LABEL_WARP_PLAYGROUND, LABEL_ASTROPORT_LIMIT_ORDER],
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
        vars: JSON.stringify([
          jobVarPrice,
          jobVarMarsBalance,
          jobVarAstroportSwapMsg,
        ]),
        condition: JSON.stringify(condition),
        msgs: JSON.stringify([withdrawFromMars, swap]),
      },
    });

    return [...helperMsgs, subAccountDepositToMars, createJob];
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

export default useWarpCreateJobAstroportYieldBearingLimitOrderNativeTokenOnly;
