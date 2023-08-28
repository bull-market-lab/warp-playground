import WalletInfo from "@/components/wallet/WalletInfo";
import WalletConnect from "@/components/wallet/WalletConnect";
import useMyWallet from "@/hooks/useMyWallet";

const Wallet = () => {
  const { connectionStatus } = useMyWallet();
  return connectionStatus === "CONNECTED" ? <WalletInfo /> : <WalletConnect />;
};

export default Wallet;
