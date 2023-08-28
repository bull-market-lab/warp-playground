import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/utils/warpHelpers";
import useMyWallet from "../useMyWallet";

type GetWarpJobsResponse = {
  jobs: Job[];
  total_count: number;
};

type UseWarpGetJobsProps = {
  status: string;
};

const useWarpGetJobs = ({ status }: UseWarpGetJobsProps) => {
  const { lcd, myAddress, currentChainConfig } = useMyWallet();
  const warpControllerAddress = currentChainConfig.warp.controllerAddress;

  const jobsResult = useQuery(
    [`get-jobs`, status, myAddress, warpControllerAddress],
    async () => {
      if (!lcd || !myAddress || !warpControllerAddress || !status) {
        return null;
      }

      const response: GetWarpJobsResponse = await lcd.wasm.contractQuery(
        warpControllerAddress,
        {
          query_jobs: {
            owner: myAddress,
            job_status: status,
            // TODO: support pagination, default limit is 50 now
            //   start_after: { _0: "", _1: "" },
          },
        }
      );
      return {
        jobs: response.jobs,
        totalCount: response.total_count,
      };
    },
    {
      enabled: !!warpControllerAddress && !!myAddress && !!status && !!lcd,
    }
  );
  return useMemo(() => {
    return { jobsResult };
  }, [jobsResult]);
};

export default useWarpGetJobs;
