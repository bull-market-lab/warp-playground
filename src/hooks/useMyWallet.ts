// import { useShuttle } from "@delphi-labs/shuttle-react";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";
// import { useChain } from "@cosmos-kit/react";
import { useContext } from "react";

import ChainContext from "@/contexts/ChainContext";
// import { getCosmosKitChainNameByChainId } from "@/utils/cosmosKitNetwork";

const useMyWallet = () => {
  const { myAddress, currentChain, currentChainId, currentChainConfig, lcd } =
    useContext(ChainContext);

  //// terra wallet kit specific
  const {
    connect,
    disconnect,
    availableWallets,
    post,
    status: connectionStatus,
  } = useWallet();

  //   const { getWallets } = useShuttle();
  //   const connectedWallets = getWallets({ chainId: currentChainId });
  //   const currentWallet = connectedWallets[0];

  // const {
  //   wallet: currentWallet,
  //   connect,
  //   disconnect,
  //   status: connectionStatus,
  //   getSigningCosmWasmClient,
  // } = useChain(getCosmosKitChainNameByChainId(currentChainId));

  return {
    myAddress,
    currentChain,
    currentChainId,
    currentChainConfig,
    lcd,
    connect,
    disconnect,
    //// terra wallet kit specific
    availableWallets,
    post,
    connectionStatus,
    //// shuttle specific
    // currentWallet,
    //// cosmos kit specific
    // getSigningCosmWasmClient,
  };
};

export default useMyWallet;
