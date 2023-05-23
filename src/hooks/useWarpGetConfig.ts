import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import useWallet from "./useWallet";

type UseWarpGetConfigProps = {
  warpControllerAddress: string;
};

export const useWarpGetConfig = ({
  warpControllerAddress,
}: UseWarpGetConfigProps) => {
  const wallet = useWallet();
  const configResult = useQuery(
    ["get-config", wallet, warpControllerAddress],
    async () => {
      if (!wallet || !warpControllerAddress) {
        return null;
      }
      const client = await CosmWasmClient.connect(wallet.network.rpc || "");
      const response = await client.queryContractSmart(warpControllerAddress, {
        query_config: {},
      });
      return {
        config: response.config,
      };
    },
    {
      enabled: !!warpControllerAddress && !!wallet,
    }
  );
  return useMemo(() => {
    return { configResult };
  }, [configResult]);
};
