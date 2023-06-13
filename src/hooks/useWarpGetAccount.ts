import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LCDClient } from "@terra-money/feather.js";

type GetWarpAccountResponse = {
  account: {
    owner: string;
    account: string;
  };
};

type UseWarpGetAccountProps = {
  lcd?: LCDClient;
  chainID: string;
  ownerAddress?: string;
  warpControllerAddress?: string;
};

export const useWarpGetAccount = ({
  lcd,
  chainID,
  ownerAddress,
  warpControllerAddress,
}: UseWarpGetAccountProps) => {
  const accountResult = useQuery(
    ["get-account", chainID, ownerAddress, warpControllerAddress],
    async () => {
      if (!lcd || !chainID || !ownerAddress || !warpControllerAddress) {
        return null;
      }

      const response: GetWarpAccountResponse = await lcd.wasm.contractQuery(
        warpControllerAddress,
        {
          query_account: {
            owner: ownerAddress,
          },
        }
      );
      return {
        account: response.account.account,
      };
    },
    {
      enabled: !!lcd && !!warpControllerAddress && !!ownerAddress && !!chainID,
    }
  );
  return useMemo(() => {
    return { accountResult };
  }, [accountResult]);
};
