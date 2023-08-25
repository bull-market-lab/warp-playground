import { MsgExecuteContract } from "@terra-money/feather.js";
import { useMemo } from "react";

type UseWarpCancelJobProps = {
  senderAddress?: string;
  warpControllerAddress?: string;
  jobId: string;
};

const useWarpCancelJob = ({
  senderAddress,
  warpControllerAddress,
  jobId,
}: UseWarpCancelJobProps) => {
  const msgs = useMemo(() => {
    if (!warpControllerAddress || !jobId || !senderAddress) {
      return [];
    }
    return [
      new MsgExecuteContract(senderAddress, warpControllerAddress, {
        delete_job: { id: jobId },
      }),
    ];
  }, [senderAddress, warpControllerAddress, jobId]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useWarpCancelJob;
