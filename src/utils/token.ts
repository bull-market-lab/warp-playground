import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import { Coins, MsgExecuteContract, MsgSend } from "@terra-money/feather.js";

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
