import { useQuery } from "@tanstack/react-query";
import { getTokenDecimals, isNativeAsset } from "@/config/tokens";
import { LCDClient } from "@terra-money/feather.js";

type Cw20BalanceResponse = {
  balance: string;
}

type UseBalanceProps = {
  lcd: LCDClient;
  chainID?: string;
  ownerAddress?: string;
  tokenAddress?: string;
};

export default function useBalance({
  lcd,
  chainID,
  ownerAddress,
  tokenAddress,
}: UseBalanceProps) {
  return useQuery(
    ["balance", chainID, ownerAddress, tokenAddress],
    async () => {
      if (!ownerAddress || !tokenAddress || !chainID) {
        return 0;
      }

      if (isNativeAsset(tokenAddress)) {
        const [coins, pagination] = await lcd.bank.balance(ownerAddress);
        console.log("coins", coins, pagination);
        // TODO: handle multiple native coins
        return (
          Number(coins.toData()[0].amount) / getTokenDecimals(tokenAddress)
        );
      } else {
        const response: Cw20BalanceResponse = await lcd.wasm.contractQuery(tokenAddress, {
          balance: {
            address: ownerAddress,
          },
        });
        return Number(response.balance) / getTokenDecimals(tokenAddress);
      }
    },
    {
      enabled: !!ownerAddress && !!tokenAddress && !!chainID,
      initialData: 0,
      placeholderData: 0,
    }
  );
}
