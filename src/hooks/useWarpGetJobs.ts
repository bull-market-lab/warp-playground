import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/utils/warpHelpers";
import { LCDClient } from "@terra-money/feather.js";

type GetWarpJobsResponse = {
  jobs: Job[];
  total_count: number;
};

type UseWarpGetJobsProps = {
  lcd?: LCDClient;
  chainID: string;
  ownerAddress?: string;
  warpControllerAddress: string;
  status: string;
};

export const useWarpGetJobs = ({
  lcd,
  chainID,
  ownerAddress,
  warpControllerAddress,
  status,
}: UseWarpGetJobsProps) => {
  const jobsResult = useQuery(
    [`get-jobs`, status, chainID, ownerAddress, warpControllerAddress],
    async () => {
      if (
        !lcd ||
        !chainID ||
        !ownerAddress ||
        !warpControllerAddress ||
        !status
      ) {
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
      enabled:
        !!warpControllerAddress &&
        !!ownerAddress &&
        !!chainID &&
        !!status &&
        !!lcd,
    }
  );
  return useMemo(() => {
    return { jobsResult };
  }, [jobsResult]);
};
