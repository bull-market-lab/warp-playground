import { SimulateResult, TransactionMsg, useShuttle } from "@delphi-labs/shuttle";
import { useQuery } from "@tanstack/react-query";

import useWallet from "./useWallet";

type Props = {
  messages: TransactionMsg[];
};

// NOT USED, we make estimate fee and broadcast tx in 1 step so we don't need this
export default function useFeeEstimate({ messages }: Props) {
  const { simulate } = useShuttle();
  const wallet = useWallet();
  return useQuery(['fee-estimate', JSON.stringify(messages), wallet?.id], async () => {
    if (!messages || messages.length <= 0 || !wallet) {
      return null;
    }
    
    const response : SimulateResult = await simulate({
      messages,
      wallet,
    });
    return {
      fee: response.fee?.amount[0],
      gasLimit: response.fee?.gas,
    }
  }, {
    enabled: !!messages && messages.length > 0 && !!wallet,
  });
}