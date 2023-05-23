import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import useWallet from "./useWallet";

type UseWarpGetJobsProps = {
  warpControllerAddress: string;
  status: string;
};

export const useWarpGetJobs = ({
  warpControllerAddress,
  status,
}: UseWarpGetJobsProps) => {
  const wallet = useWallet();
  const jobsResult = useQuery(
    [
      `get-jobs`,
      status,
      wallet,
      warpControllerAddress,
    ],
    async () => {
      if (!wallet || !warpControllerAddress) {
        return null;
      }
      const client = await CosmWasmClient.connect(wallet.network.rpc || "");
      const response = await client.queryContractSmart(warpControllerAddress, {
        query_jobs: {
          owner: wallet.account.address,
          job_status: status,
          // TODO: support pagination
          //   start_after: { _0: "", _1: "" },
        },
      });
      return {
        jobs: response.jobs,
        totalCount: response.total_count,
      };
    },
    {
      enabled: !!warpControllerAddress && !!wallet,
    }
  );
  return useMemo(() => {
    return { jobsResult };
  }, [jobsResult]);
};
