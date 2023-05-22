import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import useWallet from "./useWallet";

type UseWarpGetJobsProps = {
  warpControllerAddress: string;
  isPending: boolean;
};

export const useWarpGetJobs = ({
  warpControllerAddress,
  isPending,
}: UseWarpGetJobsProps) => {
  const wallet = useWallet();
  const jobsResult = useQuery(
    [
      `get-${isPending ? "pending" : "finished"}-jobs`,
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
          active: isPending,
          limit: 50,
          // TODO: support pagination
          //   start_after: { _0: "", _1: "" },
        },
      });
      console.log(
        `${warpControllerAddress} getWarpJobs query_jobs response ${JSON.stringify(
          response,
          null,
          2
        )})}}`
      );
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
