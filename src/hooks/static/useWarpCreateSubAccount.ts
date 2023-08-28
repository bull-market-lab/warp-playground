import { MsgExecuteContract } from "@terra-money/feather.js";
import { useMemo } from "react";
import useMyWallet from "../useMyWallet";

const useWarpCreateSubAccount = () => {
  const { myAddress, currentChainConfig } = useMyWallet();
  const warpControllerAddress = currentChainConfig.warp.controllerAddress;

  const msgs = useMemo(() => {
    if (!warpControllerAddress || !myAddress) {
      return [];
    }
    return [
      new MsgExecuteContract(myAddress, warpControllerAddress, {
        create_account: { is_sub_account: true },
      }),
    ];
  }, [myAddress, warpControllerAddress]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useWarpCreateSubAccount;
