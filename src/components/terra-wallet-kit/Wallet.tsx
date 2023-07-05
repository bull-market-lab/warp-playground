import { useConnectedWallet } from "@terra-money/wallet-kit";

import WalletInfo from "@/components/terra-wallet-kit/WalletInfo";
import WalletConnect from "@/components/terra-wallet-kit/WalletConnect";

export const Wallet = () => {
  const connectedWallet = useConnectedWallet();

  return connectedWallet ? <WalletInfo /> : <WalletConnect />;
};
