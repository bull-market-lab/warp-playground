import { Msg } from "@terra-money/feather.js";
// import CreateAndBroadcastTxModalUsingCosmosKit from "./CreateAndBroadcastTxModalUsingCosmosKit";
import CreateAndBroadcastTxModalUsingTerraWalletKit from "./CreateAndBroadcastTxModalUsingTerraWalletKit";

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
  return (
    <CreateAndBroadcastTxModalUsingTerraWalletKit
      msgs={msgs}
      buttonText={buttonText}
      disabled={disabled}
    />
  );
};

export default CreateAndBroadcastTxModal;
