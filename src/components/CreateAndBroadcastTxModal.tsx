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
      wallet: wallet,
    })
      .then((result) => {
        return broadcast({
          wallet,
          messages: msgs,
          mobile: isMobile(),
          // use automatic gas estimation
          feeAmount: result.fee!.amount[0].amount,
          gasLimit: result.fee!.gas,
        });
      })
      .catch((error) => {
        // TODO: think about how to handle error
        console.log('in simulate', error);
        alert(error.message);
        throw error;
      })
    // broadcast({
    //   wallet,
    //   messages: msgs,
    //   mobile: isMobile(),
    //   // use automatic gas estimation, this is not working for some reason, TODO: fix it in shuttle
    // })
      .then((result) => {
        // TODO: think about what to do with result, maybe display it and update some state to avoid reload page
        console.log(result);
      })
      .catch((error) => {
        console.log("in broadcast", error);
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
