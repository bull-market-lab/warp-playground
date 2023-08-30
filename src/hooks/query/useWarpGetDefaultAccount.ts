import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";

type WarpGetDefaultAccountResponse = {
  account: {
    owner: string;
    account: string;
  };
};

const useWarpGetDefaultAccount = () => {
  const { lcd, myAddress, currentChainConfig } = useMyWallet();
  const warpControllerAddress = currentChainConfig.warp.controllerAddress;

  const accountResult = useQuery(
    ["get-default-account", myAddress, warpControllerAddress],
    async () => {
      if (!lcd || !myAddress || !warpControllerAddress) {
        return null;
      }

      const response: WarpGetDefaultAccountResponse =
        await lcd.wasm.contractQuery(warpControllerAddress, {
          query_account: {
            owner: myAddress,
          },
        });
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

export default useWarpGetDefaultAccount;
