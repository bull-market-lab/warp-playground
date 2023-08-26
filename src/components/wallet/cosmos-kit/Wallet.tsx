import { useChain } from "@cosmos-kit/react";

import WalletInfo from "@/components/wallet/cosmos-kit/WalletInfo";
import WalletConnect from "@/components/wallet/cosmos-kit/WalletConnect";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { getCosmosKitChainNameByChainId } from "@/utils/cosmosKitNetwork";

const Wallet = () => {
  const { currentChainId } = useCurrentChainId();
  const { wallet } = useChain(getCosmosKitChainNameByChainId(currentChainId));
  return wallet ? <WalletInfo /> : <WalletConnect />;
};

export default Wallet;
