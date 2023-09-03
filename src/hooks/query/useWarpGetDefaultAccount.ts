import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";
import { queryWasmContractWithCatch } from "@/utils/lcdHelper";

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
    ["get_warp_default_account", myAddress, warpControllerAddress],
    async () => {
      if (!lcd || !myAddress || !warpControllerAddress) {
        return null;
      }

      const response: WarpGetDefaultAccountResponse =
        await queryWasmContractWithCatch(lcd, warpControllerAddress, {
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
