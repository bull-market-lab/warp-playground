import BigNumber from "bignumber.js";
import { MsgExecuteContract } from "@terra-money/feather.js";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";

export type Job = {
  id: string;
  name: string;
  description: string;
  labels: string[];
  status: string;
};

export const constructJobUrl = (jobId: string) =>
  `https://app.warp.money/#/jobs/${jobId}`;

type ConstructHelperMsgsProps = {
  senderAddress: string;
  warpControllerAddress: string;
  warpFeeTokenAddress: string;
  warpTotalJobFee: string;
  offerTokenAddress: string;
  offerTokenAmount: string;
};

// msg 1. increase allowance if it's sending cw20 token
// msg 2. create warp account if not exist, send job reward, job creation fee and eviction fee to warp account
export const constructHelperMsgs = ({
  senderAddress,
  warpControllerAddress,
  warpFeeTokenAddress,
  warpTotalJobFee,
  offerTokenAddress,
  offerTokenAmount,
}: ConstructHelperMsgsProps) => {
  let cwFunds: { cw20: { contract_addr: string; amount: string } }[] = [];
  let nativeFunds = {};

  if (isNativeAsset(offerTokenAddress)) {
    if (warpFeeTokenAddress === offerTokenAddress) {
      nativeFunds = {
        [offerTokenAddress]: convertTokenDecimals(
          BigNumber(warpTotalJobFee).plus(offerTokenAmount).toString(),
          offerTokenAddress
        ),
      };
    } else {
      nativeFunds = {
        [warpFeeTokenAddress]: convertTokenDecimals(
          warpTotalJobFee,
          warpFeeTokenAddress
        ),
        [offerTokenAddress]: convertTokenDecimals(
          offerTokenAmount,
          offerTokenAddress
        ),
      };
    }
  } else {
    cwFunds = [
      {
        cw20: {
          contract_addr: offerTokenAddress,
          amount: convertTokenDecimals(offerTokenAmount, offerTokenAddress),
        },
      },
    ];
    nativeFunds = {
      [warpFeeTokenAddress]: convertTokenDecimals(
        warpTotalJobFee,
        warpFeeTokenAddress
      ),
    };
  }

  if (isNativeAsset(offerTokenAddress)) {
    return [
      new MsgExecuteContract(
        senderAddress,
        warpControllerAddress,
        {
          create_account: {
            funds: cwFunds,
          },
        },
        nativeFunds
      ),
    ];
  } else {
    return [
      new MsgExecuteContract(senderAddress, offerTokenAddress, {
        increase_allowance: {
          spender: warpControllerAddress,
          amount: convertTokenDecimals(offerTokenAmount, offerTokenAddress),
          expires: {
            never: {},
          },
        },
      }),
      new MsgExecuteContract(
        senderAddress,
        warpControllerAddress,
        {
          create_account: {
            funds: cwFunds,
          },
        },
        nativeFunds
      ),
    ];
  }
};
