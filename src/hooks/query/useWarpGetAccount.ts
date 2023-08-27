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
  warpControllerAddress?: string;
};

const useWarpGetAccount = ({
  warpControllerAddress,
}: UseWarpGetAccountProps) => {
  const { lcd, myAddress } = useMyWallet();

  const accountResult = useQuery(
    ["get-account", myAddress, warpControllerAddress],
    async () => {
      if (!lcd || !myAddress || !warpControllerAddress) {
        return null;
      }

      const response: GetWarpAccountResponse = await lcd.wasm.contractQuery(
        warpControllerAddress,
        {
          query_account: {
            owner: myAddress,
          },
        }
      );
      return {
        account: response.account.account,
      };
    },
    {
      enabled: !!lcd && !!warpControllerAddress && !!myAddress,
    }
  );
  return useMemo(() => {
    return { accountResult };
  }, [accountResult]);
};

export default useWarpGetAccount;
