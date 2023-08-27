import { MsgExecuteContract } from "@terra-money/feather.js";
import { useMemo } from "react";
import useMyWallet from "../useMyWallet";

type UseWarpCancelJobProps = {
  jobId: string;
};

const useWarpCancelJob = ({ jobId }: UseWarpCancelJobProps) => {
  const { myAddress, currentChainConfig } = useMyWallet();
  const warpControllerAddress = currentChainConfig.warp.controllerAddress;

  const msgs = useMemo(() => {
    if (!warpControllerAddress || !jobId || !myAddress) {
      return [];
    }
    return [
      new MsgExecuteContract(myAddress, warpControllerAddress, {
        delete_job: { id: jobId },
      }),
    ];
  }, [myAddress, warpControllerAddress, jobId]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useWarpCancelJob;
