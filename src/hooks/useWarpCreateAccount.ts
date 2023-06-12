import { useMemo } from "react";
import { MsgExecuteContract } from "@terra-money/feather.js";

type UseWarpCreateAccountProps = {
  senderAddress?: string;
  warpControllerAddress?: string;
};

export const useWarpCreateAccount = ({
  senderAddress,
  warpControllerAddress,
}: UseWarpCreateAccountProps) => {
  const msgs = useMemo(() => {
    if (!warpControllerAddress || !senderAddress) {
      return [];
    }
    return [
      new MsgExecuteContract(senderAddress, warpControllerAddress, {
        create_account: {},
      }),
    ];
  }, [senderAddress, warpControllerAddress]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
