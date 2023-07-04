import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useWallet, useConnectedWallet } from "@terra-money/wallet-kit";
import { Msg } from "@terra-money/feather.js";
import { getChainIDByNetwork } from "@/utils/network";

type CreateAndBroadcastTxModalProps = {
  msgs: Msg[];
  buttonText: string;
  disabled: boolean;
};

export const CreateAndBroadcastTxModal = ({
  msgs,
  buttonText,
  disabled,
}: CreateAndBroadcastTxModalProps) => {
  const wallet = useWallet();
  const connectedWallet = useConnectedWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const chainID = getChainIDByNetwork(connectedWallet?.network);

  const onCreateAndBroadcastTx = () => {
    setIsProcessing(true);

    wallet
      .post({
        chainID,
        msgs: msgs,
      })
      .then((postResponse) => {
        console.log(JSON.stringify(postResponse, null, 2));
      })
      .catch((e) => {})
      .finally(() => {
        setIsProcessing(false);
      });

    // simulate({
    //   messages: msgs,
    //   wallet: wallet,
    // })
    //   .then((result) => {
    //     return broadcast({
    //       wallet,
    //       messages: msgs,
    //       mobile: isMobile(),
    //       // use automatic gas estimation
    //       feeAmount: result.fee!.amount[0].amount,
    //       gasLimit: result.fee!.gas,
    //     });
    //   })
    //   .catch((error) => {
    //     // TODO: think about how to handle error
    //     console.log("in simulate", error);
    //     alert(error.message);
    //     throw error;
    //   })
    //   // broadcast({
    //   //   wallet,
    //   //   messages: msgs,
    //   //   mobile: isMobile(),
    //   //   // use automatic gas estimation, this is not working for some reason, TODO: fix it in shuttle
    //   // })
    //   .then((result) => {
    //     // TODO: think about what to do with result, maybe display it and update some state to avoid reload page
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log("in broadcast", error);
    //     // TODO: think about how to handle error
    //     alert(error.message);
    //     throw error;
    //   })
    //   .finally(() => {
    //     setIsProcessing(false);
    //     window.location.reload();
    //   });
  };

  return (
    <Button
      colorScheme="blue"
      onClick={onCreateAndBroadcastTx}
      isDisabled={disabled || isProcessing || wallet.status !== "CONNECTED"}
    >
      {isProcessing ? "broadcasting tx..." : buttonText}
    </Button>
  );
};
