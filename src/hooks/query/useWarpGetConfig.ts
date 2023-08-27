import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";

type GetWarpConfigResponse = {
  config: {
    owner: string;
    fee_collector: string;
    warp_account_code_id: string;
    minimum_reward: string;
    creation_fee_percentage: string;
    cancellation_fee_percentage: string;
    template_fee: string;
    t_max: string;
    t_min: string;
    a_max: string;
    a_min: string;
    q_max: string;
  };
};

const useWarpGetConfig = () => {
  const { lcd, currentChainConfig } = useMyWallet();
  const warpControllerAddress = currentChainConfig.warp.controllerAddress;

  const configResult = useQuery(
    ["get-config", warpControllerAddress],
    async () => {
      if (!lcd || !warpControllerAddress) {
        return null;
      }

      const response: GetWarpConfigResponse = await lcd.wasm.contractQuery(
        warpControllerAddress,
        {
          query_config: {},
        }
      );
      return {
        config: response.config,
      };
    },
    {
      enabled: !!warpControllerAddress && !!lcd,
    }
  );
  return useMemo(() => {
    return { configResult };
  }, [configResult]);
};

export default useWarpGetConfig;
