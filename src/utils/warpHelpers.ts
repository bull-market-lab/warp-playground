import BigNumber from "bignumber.js";
import { MsgExecuteContract, MsgSend } from "@terra-money/feather.js";
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

type ConstructIncreaseCw20AllowanceMsgProps = {
  myAddress: string;
  warpControllerAddress: string;
  offerTokenAddress: string;
  offerTokenAmount: string;
};

const constructIncreaseCw20AllowanceMsg = ({
  myAddress,
  warpControllerAddress,
  offerTokenAddress,
  offerTokenAmount,
}: ConstructIncreaseCw20AllowanceMsgProps) => {
  return new MsgExecuteContract(myAddress, offerTokenAddress, {
    increase_allowance: {
      spender: warpControllerAddress,
      amount: convertTokenDecimals(offerTokenAmount, offerTokenAddress),
      expires: {
        never: {},
      },
    },
  });
};

type ConstructDepositAccountViaCreateAccountIfNotExistMsgProps = {
  myAddress: string;
  warpControllerAddress: string;
  warpFeeTokenAddress: string;
  warpTotalJobFee: string;
  offerTokenAddress: string;
  offerTokenAmount: string;
};

// not used: we should use direct deposit instead, since we usually use sub account now
// create warp account if not exist, send protocol fee and offered token to warp account
const constructDepositAccountViaCreateAccountIfNotExistMsg = ({
  myAddress,
  warpControllerAddress,
  warpFeeTokenAddress,
  warpTotalJobFee,
  offerTokenAddress,
  offerTokenAmount,
}: ConstructDepositAccountViaCreateAccountIfNotExistMsgProps) => {
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
    return new MsgExecuteContract(
      myAddress,
      warpControllerAddress,
      {
        create_account: {
          funds: cwFunds,
        },
      },
      nativeFunds
    );
  } else {
    return new MsgExecuteContract(
      myAddress,
      warpControllerAddress,
      {
        create_account: {
          funds: cwFunds,
        },
      },
      nativeFunds
    );
  }
};

type ConstructDepositProtocolFeeToAccountViaDirectDepositMsgProps = {
  myAddress: string;
  warpAccountAddress: string;
  warpFeeTokenAddress: string;
  warpTotalJobFee: string;
};

// send protocol fee to warp account
const constructDepositProtocolFeeToAccountViaDirectDepositMsg = ({
  myAddress,
  warpAccountAddress,
  warpFeeTokenAddress,
  warpTotalJobFee,
}: ConstructDepositProtocolFeeToAccountViaDirectDepositMsgProps) => {
  let nativeFunds = {
    [warpFeeTokenAddress]: convertTokenDecimals(
      warpTotalJobFee,
      warpFeeTokenAddress
    ),
  };
  return new MsgSend(myAddress, warpAccountAddress, nativeFunds);
};

type ConstructDepositOfferedTokenToAccountViaDirectDepositMsgProps = {
  myAddress: string;
  warpAccountAddress: string;
  offerTokenAddress: string;
  offerTokenAmount: string;
};

// send offered token to warp account
const constructDepositOfferedTokenToAccountViaDirectDepositMsg = ({
  myAddress,
  warpAccountAddress,
  offerTokenAddress,
  offerTokenAmount,
}: ConstructDepositOfferedTokenToAccountViaDirectDepositMsgProps) => {
  if (isNativeAsset(offerTokenAddress)) {
    const nativeFunds = {
      [offerTokenAddress]: convertTokenDecimals(
        offerTokenAmount,
        offerTokenAddress
      ),
    };
    return new MsgSend(myAddress, warpAccountAddress, nativeFunds);
  } else {
    return new MsgExecuteContract(myAddress, offerTokenAddress, {
      transfer: {
        recipient: warpAccountAddress,
        amount: convertTokenDecimals(offerTokenAmount, offerTokenAddress),
      },
    });
  }
};

type ConstructCreateSubAccountMsgProps = {
  myAddress: string;
  warpControllerAddress: string;
};

// send offered token to warp account
const constructCreateSubAccountMsg = ({
  myAddress,
  warpControllerAddress,
}: ConstructCreateSubAccountMsgProps) => {
  return new MsgExecuteContract(myAddress, warpControllerAddress, {
    create_account: {
      is_sub_account: true,
    },
  });
};

type ConstructHelperMsgsProps = {
  myAddress: string;
  warpAccountAddress: string;
  warpControllerAddress: string;
  warpFeeTokenAddress: string;
  warpTotalJobFee: string;
  offerTokenAddress: string;
  offerTokenAmount: string;
};

export const constructHelperMsgs = ({
  myAddress,
  warpAccountAddress,
  warpControllerAddress,
  warpFeeTokenAddress,
  warpTotalJobFee,
  offerTokenAddress,
  offerTokenAmount,
}: ConstructHelperMsgsProps) => {
  const msgs = [];
  if (!isNativeAsset(offerTokenAddress)) {
    msgs.push(
      constructIncreaseCw20AllowanceMsg({
        myAddress,
        warpControllerAddress,
        offerTokenAddress,
        offerTokenAmount,
      })
    );
  }
  msgs.push(
    constructDepositProtocolFeeToAccountViaDirectDepositMsg({
      myAddress,
      warpAccountAddress,
      warpFeeTokenAddress,
      warpTotalJobFee,
    })
  );
  msgs.push(
    constructDepositOfferedTokenToAccountViaDirectDepositMsg({
      myAddress,
      warpAccountAddress,
      offerTokenAddress,
      offerTokenAmount,
    })
  );
  msgs.push(
    constructCreateSubAccountMsg({
      myAddress,
      warpControllerAddress,
    })
  );
  return msgs;
};
