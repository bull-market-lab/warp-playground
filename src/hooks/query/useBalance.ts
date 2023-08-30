import { useQuery } from "@tanstack/react-query";
import { getTokenDecimals, isNativeAsset } from "@/utils/token";
import useMyWallet from "../useMyWallet";

type Cw20BalanceResponse = {
  balance: string;
};

type UseBalanceProps = {
  tokenAddress?: string;
};

const useBalance = ({ tokenAddress }: UseBalanceProps) => {
  const { lcd, myAddress } = useMyWallet();

  return useQuery(
    ["balance", myAddress, tokenAddress],
    async () => {
      if (!lcd || !myAddress || !tokenAddress) {
        return 0;
      }

      if (isNativeAsset(tokenAddress)) {
        const [coins, pagination] = await lcd.bank.balance(myAddress);
        // console.log("coins", coins, pagination);
        // TODO: handle pagination
        const coin = coins
          .toData()
          .filter((coin) => coin.denom === tokenAddress);
        if (coin.length !== 1) {
          return 0;
        } else {
          return Number(coin[0].amount) / getTokenDecimals(tokenAddress);
        }
      } else {
        const response: Cw20BalanceResponse = await lcd.wasm.contractQuery(
          tokenAddress,
          {
            balance: {
              address: myAddress,
            },
          }
        );
        return Number(response.balance) / getTokenDecimals(tokenAddress);
      }
    },
    {
      enabled: !!myAddress && !!tokenAddress && !!lcd,
      initialData: 0,
      placeholderData: 0,
    }
  );
};

export default useBalance;
