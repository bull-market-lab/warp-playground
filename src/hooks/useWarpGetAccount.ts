import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import useWallet from "./useWallet";

type UseWarpGetAccountProps = {
  warpControllerAddress: string;
};

export const useWarpGetAccount = ({
  warpControllerAddress,
}: UseWarpGetAccountProps) => {
  const wallet = useWallet();
  const accountResult = useQuery(
    ["get-account", wallet, warpControllerAddress],
    async () => {
      if (!wallet || !warpControllerAddress) {
        return null;
      }
      const client = await CosmWasmClient.connect(wallet.network.rpc || "");
      const response = await client.queryContractSmart(warpControllerAddress, {
        query_account: {
          owner: wallet.account.address,
        },
      });
      return {
        account: response.account.account,
      };
    },
    {
      enabled: !!warpControllerAddress && !!wallet,
    }
  );
  return useMemo(() => {
    return { accountResult };
  }, [accountResult]);
};
