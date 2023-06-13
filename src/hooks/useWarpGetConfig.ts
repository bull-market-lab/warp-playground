import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LCDClient } from "@terra-money/feather.js";

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

type UseWarpGetConfigProps = {
  lcd?: LCDClient;
  chainID: string;
  warpControllerAddress: string;
};

export const useWarpGetConfig = ({
  lcd,
  chainID,
  warpControllerAddress,
}: UseWarpGetConfigProps) => {
  const configResult = useQuery(
    ["get-config", chainID, warpControllerAddress],
    async () => {
      if (!lcd || !chainID || !warpControllerAddress) {
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
      enabled: !!warpControllerAddress && !!chainID && !!lcd,
    }
  );
  return useMemo(() => {
    return { configResult };
  }, [configResult]);
};
