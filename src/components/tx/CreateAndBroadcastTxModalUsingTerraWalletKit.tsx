import axios from "axios";
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
  const { currentChainId, connectionStatus, post, lcd, myAddress } =
    useMyWallet();

  const onCreateAndBroadcastTx = async () => {
    setIsProcessing(true);

    // console.log(
    //   "msgs",
    //   JSON.stringify(
    //     msgs.map((msg) => msg.toJSON()),
    //     null,
    //     2
    //   )
    // );

    const estimatedFee = await lcd!.auth
      .accountInfo(myAddress!)
      .then((accountInfo) => {
        return lcd!.tx.estimateFee(
          [
            {
              sequenceNumber: accountInfo.getSequenceNumber(),
              publicKey: accountInfo.getPublicKey(),
            },
          ],
          {
            msgs,
            chainID: currentChainId,
          }
        );
      })
      .catch((e) => {
        let errorDescription = `${JSON.stringify(e.response?.data)}`;
        if (axios.isAxiosError(e)) {
          if (e.response) {
            console.log(e.response.status);
            console.log(e.response.headers);
            if (
              typeof e.response.data === "object" &&
              e.response.data !== null &&
              "code" in e.response.data &&
              "message" in e.response.data
            ) {
              errorDescription = `Code=${e.response?.data["code"]} Message=${e.response?.data["message"]} \n`;
            } else {
              errorDescription = JSON.stringify(e.response.data);
            }
          }
        }
        toast({
          title: "Error estimating fee",
          description: errorDescription,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
        throw e;
      })
      .finally(() => {
        setIsProcessing(false);
      });

    // console.log("fee", JSON.stringify(estimatedFee, null, 2));

    post({
      chainID: currentChainId,
      msgs,
      fee: estimatedFee,
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
