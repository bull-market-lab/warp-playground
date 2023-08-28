import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";
import useWarpGetDefaultAccount from "./useWarpGetDefaultAccount";

type WarpGetFirstFreeSubAccountResponse = {
  addr: string;
};

const useWarpGetFirstFreeSubAccount = () => {
  const { lcd, myAddress } = useMyWallet();
  const { accountResult: defaultAccountResult } = useWarpGetDefaultAccount();
  const warpDefaultAccountAddress = defaultAccountResult?.data?.account;

  const accountResult = useQuery(
    ["get-first-free-sub-account", myAddress, warpDefaultAccountAddress],
    async () => {
      if (!lcd || !myAddress || !warpDefaultAccountAddress) {
        return null;
      }

      const response: WarpGetFirstFreeSubAccountResponse =
        await lcd.wasm.contractQuery(warpDefaultAccountAddress, {
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
