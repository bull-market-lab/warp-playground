import { useMemo } from "react";
import { MsgExecuteContract, WalletConnection } from "@delphi-labs/shuttle";
import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import useWallet from "./useWallet";

type GetAccountProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
};
function getAccount({ wallet, warpControllerAddress }: GetAccountProps) {
  return useQuery(
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
      console.log(
        `${warpControllerAddress} getWarpAccount query_account response ${JSON.stringify(
          response,
          null,
          2
        )})}}`
      );
      return {
        account: response.account.account,
      };
    },
    {
      enabled: !!warpControllerAddress && !!wallet,
    }
  );
}

type UseWarpGetAccountProps = {
  warpControllerAddress: string;
};
export const useWarpGetAccount = ({
  warpControllerAddress,
}: UseWarpGetAccountProps) => {
  const wallet = useWallet();
  const accountResult = getAccount({ wallet, warpControllerAddress });
  return useMemo(() => {
    return { accountResult };
  }, [accountResult]);
};

type UseWarpCreateAccountProps = {
  warpControllerAddress: string;
};
export const useWarpCreateAccount = ({
  warpControllerAddress,
}: UseWarpCreateAccountProps) => {
  const wallet = useWallet();
  const msgs = useMemo(() => {
    if (!warpControllerAddress || !wallet) {
      return [];
    }
    return [
      new MsgExecuteContract({
        sender: wallet.account.address,
        contract: warpControllerAddress,
        msg: {
          create_account: {},
        },
      }),
    ];
  }, [wallet, warpControllerAddress]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

type UseWarpCreateAstroportLimitOrderProps = {
  warpControllerAddress: string;
};
export const useWarpCreateAstroportLimitOrder = ({
  warpControllerAddress,
}: UseWarpCreateAstroportLimitOrderProps) => {
  const wallet = useWallet();
  const msgs = useMemo(() => {
    if (!warpControllerAddress || !wallet) {
      return [];
    }
    return [
      new MsgExecuteContract({
        sender: wallet.account.address,
        contract: warpControllerAddress,
        msg: {
          create_account: {},
        },
      }),
    ];
  }, [wallet, warpControllerAddress]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};
