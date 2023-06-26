import { Coins, MsgExecuteContract, MsgSend } from "@terra-money/feather.js";
import BigNumber from "bignumber.js";

const DEFAULT_TOKEN_DECIMALS = 10 ** 6;

export const getTokenDecimals = (denom: string): number => {
  switch (denom) {
    case "inj":
      return 10 ** 18;
    default:
      return DEFAULT_TOKEN_DECIMALS;
  }
};

export const isNativeAsset = (assetAddress: string): boolean => {
  return (
    assetAddress.startsWith("u") ||
    assetAddress === "inj" ||
    assetAddress.startsWith("ibc/")
  );
};

export const convertTokenDecimals = (
  amount: string,
  assetAddress: string
): string => {
  return BigNumber(amount).times(getTokenDecimals(assetAddress)).toString();
};

type ConstructSendTokenMsgProps = {
  tokenAddress: string;
  senderAddress: string;
  receiverAddress: string;
  // readable amount, e.g. 1 LUNA, we will convert it to uluna internally
  humanAmount: string;
};

export const constructSendTokenMsg = ({
  tokenAddress,
  senderAddress,
  receiverAddress,
  humanAmount,
}: ConstructSendTokenMsgProps) => {
  return isNativeAsset(tokenAddress)
    ? new MsgSend(
        senderAddress,
        receiverAddress,
        new Coins({
          [tokenAddress]: convertTokenDecimals(humanAmount, tokenAddress),
        })
      )
    : new MsgExecuteContract(senderAddress, tokenAddress, {
        transfer: {
          recipient: receiverAddress,
          amount: convertTokenDecimals(humanAmount, tokenAddress),
        },
      });
};
