import BigNumber from "bignumber.js";
import {
  LCDClient,
  MsgExecuteContract,
  MsgSend,
} from "@terra-money/feather.js";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import {
  LABEL_MARS,
  LABEL_YIELD_BEARING_DCA_ORDER,
  LABEL_YIELD_BEARING_LIMIT_ORDER,
} from "./constants";

export type Job = {
  id: string;
  name: string;
  description: string;
  labels: string[];
  account: string;
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

type ConstructAssetsToWithdrawProps = {
  tokenAddresses: string[];
};

export const constructAssetsToWithdraw = ({
  tokenAddresses,
}: ConstructAssetsToWithdrawProps) => {
  const assetsToWithdraw = [];
  const nativeTokenSet = new Set<string>([]);
  const cw20TokenSet = new Set<string>([]);
  for (const tokenAddress of tokenAddresses) {
    if (isNativeAsset(tokenAddress)) {
      nativeTokenSet.add(tokenAddress);
    } else {
      cw20TokenSet.add(tokenAddress);
    }
  }
  const nativeTokens = Array.from(nativeTokenSet);
  const cw20Tokens = Array.from(cw20TokenSet);
  assetsToWithdraw.push(
    ...nativeTokens.map((nativeToken) => ({ native: nativeToken }))
  );
  assetsToWithdraw.push(
    ...cw20Tokens.map((cw20Token) => ({ cw20: cw20Token }))
  );
  return assetsToWithdraw;
};

export const constructOfferTokenLabel = (
  offerTokenAddress: string,
  offerTokenAmount: string
) => {
  return `offerToken:${offerTokenAddress}:${offerTokenAmount}`;
};

export const constructReturnTokenLabel = (
  returnTokenAddress: string,
  returnTokenAmount: string
) => {
  return `returnToken:${returnTokenAddress}:${returnTokenAmount}`;
};

export const extractOfferTokenAddress = (labels: string[]) => {
  const offerTokenLabel = labels.find((label) =>
    label.startsWith("offerToken:")
  );
  if (offerTokenLabel) {
    return offerTokenLabel.split(":")[1];
  }
  return "";
};

export const extractReturnTokenAddress = (labels: string[]) => {
  const returnTokenLabel = labels.find((label) =>
    label.startsWith("returnToken:")
  );
  if (returnTokenLabel) {
    return returnTokenLabel.split(":")[1];
  }
  return "";
};

export const extractOfferTokenAmount = (labels: string[]) => {
  const offerTokenLabel = labels.find((label) =>
    label.startsWith("offerToken:")
  );
  if (offerTokenLabel) {
    return offerTokenLabel.split(":")[2];
  }
  return "";
};

export const extractReturnTokenAmount = (labels: string[]) => {
  const returnTokenLabel = labels.find((label) =>
    label.startsWith("returnToken:")
  );
  if (returnTokenLabel) {
    return returnTokenLabel.split(":")[2];
  }
  return "";
};

export const isYieldBearingOrder = (labels: string[]) => {
  return (
    labels.includes(LABEL_YIELD_BEARING_DCA_ORDER) ||
    labels.includes(LABEL_YIELD_BEARING_LIMIT_ORDER)
  );
};

export const isMarsYieldBearingOrder = (labels: string[]) => {
  return isYieldBearingOrder(labels) && labels.includes(LABEL_MARS);
};

type getMarsYieldProps = {
  lcd?: LCDClient;
  redBankAddress: string;
  job: Job;
};

export const getMarsYield = ({
  lcd,
  redBankAddress,
  job,
}: getMarsYieldProps) => {
  if (!lcd) {
    return "0";
  }
  const initialDepositAmount = extractOfferTokenAmount(job.labels);
  const currentCollateralAmount = lcd.wasm.contractQuery(redBankAddress, {
    user_collateral: {
      user: job.account,
      denom: extractOfferTokenAddress(job.labels),
    },
    // @ts-ignore
  }).amount;
  return new BigNumber(currentCollateralAmount)
    .minus(new BigNumber(initialDepositAmount))
    .toString();
};
