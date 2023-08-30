import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { Msg } from "@terra-money/feather.js";
import useMyWallet from "@/hooks/useMyWallet";

type CreateAndBroadcastTxModalProps = {
  msgs: Msg[];
  buttonText: string;
  disabled: boolean;
};

const CreateAndBroadcastTxModal = ({
  msgs,
  buttonText,
  disabled,
}: CreateAndBroadcastTxModalProps) => {
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentChainId, connectionStatus, post } = useMyWallet();

  const onCreateAndBroadcastTx = () => {
    setIsProcessing(true);

    post({
      chainID: currentChainId,
      msgs,
    })
      .then((postResponse) => {
        toast({
          title: "Successfully broadcasted TX",
          description: `TX hash: ${postResponse.txhash}`,
          status: "success",
          duration: 6000,
          isClosable: true,
        });
      })
      .catch((e) => {
        toast({
          title: "Error broadcasting TX",
          description: `${JSON.stringify(e)}`,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      })
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
      isDisabled={disabled || isProcessing || connectionStatus !== "CONNECTED"}
    >
      {isProcessing ? "broadcasting tx..." : buttonText}
    </Button>
  );
};

export default CreateAndBroadcastTxModal;
