import { useState } from "react";
import {
  MsgExecuteContract,
  MsgSend,
  WalletConnection,
  useShuttle,
} from "@delphi-labs/shuttle";
import { isMobile } from "@/utils/device";
import { Button } from "@chakra-ui/react";

type CreateAndBroadcastTxModalProps = {
  wallet: WalletConnection;
  msgs: (MsgExecuteContract | MsgSend)[];
  buttonText: string;
  disabled: boolean;
};

export const CreateAndBroadcastTxModal = ({
  wallet,
  msgs,
  buttonText,
  disabled,
}: CreateAndBroadcastTxModalProps) => {
  const { broadcast, simulate } = useShuttle();
  const [isProcessing, setIsProcessing] = useState(false);

  const onCreateAndBroadcastTx = () => {
    setIsProcessing(true);
    simulate({
      messages: msgs,
      wallet,
    })
      .then((result) => {
        broadcast({
          wallet,
          messages: msgs,
          feeAmount: result.fee!.amount[0].amount,
          gasLimit: result.fee!.gas,
          mobile: isMobile(),
        });
      })
      .catch((error) => {
        // TODO: think about how to handle error
        alert(error.message);
        throw error;
      })
      .then((result) => {
        // TODO: think about what to do with result, maybe display it and update some state to avoid reload page
        console.log(result)
      })
      .catch((error) => {
        // TODO: think about how to handle error
        alert(error.message);
        throw error;
      })
      .finally(() => {
        setIsProcessing(false);
        window.location.reload();
      });
  };

  return (
    <Button
      colorScheme="blue"
      onClick={onCreateAndBroadcastTx}
      isDisabled={disabled || isProcessing}
    >
      {isProcessing ? "broadcasting tx..." : buttonText}
    </Button>
  );
};
