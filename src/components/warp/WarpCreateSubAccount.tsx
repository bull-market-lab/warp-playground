import CreateAndBroadcastTxModal from "../tx/CreateAndBroadcastTxModal";
import useWarpCreateSubAccount from "@/hooks/static/useWarpCreateSubAccount";

const WarpCreateSubAccount = () => {
  const createSubAccount = useWarpCreateSubAccount();

  return (
    <CreateAndBroadcastTxModal
      msgs={createSubAccount.msgs}
      buttonText={"create warp sub account"}
      disabled={false}
    />
  );
};

export default WarpCreateSubAccount;
