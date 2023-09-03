import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMyWallet from "../useMyWallet";
import { queryWasmContractWithCatch } from "@/utils/lcdHelper";

type WarpGetMarsCollateralResponse = {
  amount: string;
};

type UseMarsGetCollateralProps = {
  user: string;
  denom: string;
};

const useMarsGetCollateral = ({ user, denom }: UseMarsGetCollateralProps) => {
  const { lcd, currentChainConfig } = useMyWallet();

  const marsCollateralResult = useQuery(
    ["get_mars_collateral", user, denom],
    async () => {
      if (!lcd || !user || !denom) {
        return null;
      }
      const response: WarpGetMarsCollateralResponse =
        await queryWasmContractWithCatch(
          lcd,
          currentChainConfig.mars.redBankAddress,
          {
            user_collateral: {
              user,
              denom,
            },
          }
        );
      // console.log(
      //   "query mars collateral response",
      //   JSON.stringify(response, null, 2)
      // );
      return {
        amount: response.amount,
      };
    },
    {
      enabled: !!lcd && !!user && !!denom,
    }
  );
  return useMemo(() => {
    return { marsCollateralResult };
  }, [marsCollateralResult]);
};

export default useMarsGetCollateral;
