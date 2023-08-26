import { EncodeObject } from "@cosmjs/proto-signing";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { Msg } from "@terra-money/feather.js";
import { getCosmosKitChainNameByChainId } from "@/utils/cosmosKitNetwork";
import { useChain } from "@cosmos-kit/react";
import useCurrentChainId from "@/hooks/useCurrentChainId";

type CreateAndBroadcastTxModalProps = {
  msgs: Msg[];
  buttonText: string;
  disabled: boolean;
};

// By default we all use amino encoding
const convertFeatherJsMsgsToCosmJsMsgs = (
  featherJsMsgs: Msg[]
): EncodeObject[] => {
  return featherJsMsgs.map((featherJsMsg) => {
    return {
      typeUrl: featherJsMsg.toAmino().type,
      value: featherJsMsg.toAmino().value,
    };
  });
};

const CreateAndBroadcastTxModal = ({
  msgs,
  buttonText,
  disabled,
}: CreateAndBroadcastTxModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentChainId } = useCurrentChainId();
  const {
    status: connectionStatus,
    address,
    getSigningCosmWasmClient,
  } = useChain(getCosmosKitChainNameByChainId(currentChainId));

  const onCreateAndBroadcastTx = () => {
    setIsProcessing(true);
    getSigningCosmWasmClient()
      .then((client) => {
        client.signAndBroadcast(
          address!,
          convertFeatherJsMsgsToCosmJsMsgs(msgs),
          "auto"
        );
      })
      .then(() => {
        setIsProcessing(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log("error in sign and broadcast", error);
        // TODO: think about how to handle error
        alert(error.message);
        throw error;
      });
  };

  return (
    <Button
      colorScheme="blue"
      onClick={onCreateAndBroadcastTx}
      isDisabled={disabled || isProcessing || connectionStatus !== "Connected"}
    >
      {isProcessing ? "broadcasting tx..." : buttonText}
    </Button>
  );
};

export default CreateAndBroadcastTxModal;
