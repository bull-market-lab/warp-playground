import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";

type GetWarpAccountResponse = {
  account: {
    owner: string;
    account: string;
  };
};

type UseWarpGetAccountProps = {
  ownerAddress?: string;
  warpControllerAddress?: string;
};

const useWarpGetAccount = ({
  ownerAddress,
  warpControllerAddress,
}: UseWarpGetAccountProps) => {
  const { lcd } = useMyWallet();

  const accountResult = useQuery(
    ["get-account", ownerAddress, warpControllerAddress],
    async () => {
      if (!lcd || !ownerAddress || !warpControllerAddress) {
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
      enabled: !!lcd && !!warpControllerAddress && !!ownerAddress,
    }
  );
  return useMemo(() => {
    return { accountResult };
  }, [accountResult]);
};

export default useWarpGetAccount;
