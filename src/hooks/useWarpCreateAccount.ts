import { useMemo } from "react";
import { MsgExecuteContract } from "@delphi-labs/shuttle";
import useWallet from "./useWallet";

type UseWarpCreateAccountProps = {
  warpControllerAddress: string;
};

export const useWarpCreateAccount = ({
  warpControllerAddress,
}: UseWarpCreateAccountProps) => {
  const wallet = useWallet();
  const msgs = useMemo(() => {
    if (!warpControllerAddress || !wallet) {
      return [];
    }
    return [
      new MsgExecuteContract({
        sender: wallet.account.address,
        contract: warpControllerAddress,
        msg: {
          create_account: {},
        },
      }),
    ];
  }, [wallet, warpControllerAddress]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
