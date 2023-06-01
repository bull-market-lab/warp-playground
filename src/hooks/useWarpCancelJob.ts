import { useMemo } from "react";
import { MsgExecuteContract } from "@delphi-labs/shuttle";
import useWallet from "./useWallet";

type UseWarpCancelJobProps = {
  warpControllerAddress: string;
  jobId: string;
};

export const useWarpCancelJob = ({
  warpControllerAddress,
  jobId,
}: UseWarpCancelJobProps) => {
  const wallet = useWallet();
  const msgs = useMemo(() => {
    if (!warpControllerAddress || !jobId || !wallet) {
      return [];
    }
    return [
      new MsgExecuteContract({
        sender: wallet.account.address,
        contract: warpControllerAddress,
        msg: {
          delete_job: { id: jobId },
        },
      }),
    ];
  }, [wallet, warpControllerAddress, jobId]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
