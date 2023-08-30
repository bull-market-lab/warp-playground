import CreateAndBroadcastTxModal from "../tx/CreateAndBroadcastTxModal";
import useWarpCreateDefaultAccountAndSubAccount from "@/hooks/static/useWarpCreateDefaultAccountAndSubAccount";

const WarpCreateDefaultAccountAndSubAccount = () => {
  const createDefaultAccountAndSubAccount =
    useWarpCreateDefaultAccountAndSubAccount();

  return (
    <CreateAndBroadcastTxModal
      msgs={createDefaultAccountAndSubAccount.msgs}
      buttonText={"create warp default account and sub account"}
      disabled={false}
    />
  );
};

export default WarpCreateDefaultAccountAndSubAccount;
