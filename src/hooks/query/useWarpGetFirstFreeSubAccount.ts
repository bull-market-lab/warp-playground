import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";
import useWarpGetDefaultAccount from "./useWarpGetDefaultAccount";
import { queryWasmContractWithCatch } from "@/utils/lcdHelper";

type WarpGetFirstFreeSubAccountResponse = {
  addr: string;
};

const useWarpGetFirstFreeSubAccount = () => {
  const { lcd, myAddress } = useMyWallet();
  const { accountResult: defaultAccountResult } = useWarpGetDefaultAccount();
  const warpDefaultAccountAddress = defaultAccountResult?.data?.account;

  const accountResult = useQuery(
    ["get_warp_first_free_sub_account", myAddress, warpDefaultAccountAddress],
    async () => {
      if (!lcd || !myAddress || !warpDefaultAccountAddress) {
        return null;
      }

      const response: WarpGetFirstFreeSubAccountResponse =
        await queryWasmContractWithCatch(lcd, warpDefaultAccountAddress, {
          query_first_free_sub_account: {},
        });
      return {
        account: response.addr,
      };
    },
    {
      enabled: !!lcd && !!warpDefaultAccountAddress && !!myAddress,
    }
  );
  return useMemo(() => {
    return { accountResult };
  }, [accountResult]);
};

export default useWarpGetFirstFreeSubAccount;
