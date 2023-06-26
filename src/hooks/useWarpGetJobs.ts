import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/utils/warpHelpers";
import { ChainContext } from "@/contexts/ChainContext";

type GetWarpJobsResponse = {
  jobs: Job[];
  total_count: number;
};

type UseWarpGetJobsProps = {
  ownerAddress?: string;
  warpControllerAddress?: string;
  status: string;
};

export const useWarpGetJobs = ({
  ownerAddress,
  warpControllerAddress,
  status,
}: UseWarpGetJobsProps) => {
  const { lcd } = useContext(ChainContext);

  const jobsResult = useQuery(
    [`get-jobs`, status, ownerAddress, warpControllerAddress],
    async () => {
      if (!lcd || !ownerAddress || !warpControllerAddress || !status) {
        return null;
      }

      const response: GetWarpJobsResponse = await lcd.wasm.contractQuery(
        warpControllerAddress,
        {
          query_jobs: {
            owner: ownerAddress,
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
      enabled: !!warpControllerAddress && !!ownerAddress && !!status && !!lcd,
    }
  );
  return useMemo(() => {
    return { jobsResult };
  }, [jobsResult]);
};
