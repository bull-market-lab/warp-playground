import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider as TerraWalletProvider } from "@terra-money/wallet-kit";
import {
  CHAIN_ID_NEUTRON_ONE,
  CHAIN_ID_PHOENIX_ONE,
  CHAIN_ID_PION_ONE,
  CHAIN_ID_PISCO_ONE,
  NETWORKS,
} from "@/utils/network";
import Layout from "@/components/common/Layout";
import theme from "@/theme/theme";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { ChainContextProvider } from "@/contexts/ChainContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  const supportedWalletKitChains = chains.filter((chain) =>
    [
      CHAIN_ID_PHOENIX_ONE,
      CHAIN_ID_PISCO_ONE,
      CHAIN_ID_NEUTRON_ONE,
      CHAIN_ID_PION_ONE,
    ].includes(chain.chain_id)
  );

  const main = (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  const cosmosKit = (
    <ChainProvider
      chains={supportedWalletKitChains} // supported chains
      assetLists={assets} // supported asset lists
      wallets={keplrWallets} // supported wallets
      wrappedWithChakra={true}
      // walletConnectOptions={...} // required if `wallets` contains mobile wallets
    >
      {main}
    </ChainProvider>
  );

  const terraWalletKit = (
    <ChainContextProvider>
      <TerraWalletProvider defaultNetworks={NETWORKS}>
        {main}
      </TerraWalletProvider>
    </ChainContextProvider>
  );

  // workaround for window undefined error at launch, terra wallet provider needs window
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {/* {cosmosKit} */}
        {terraWalletKit}
      </QueryClientProvider>
    </ChakraProvider>
  ) : null;
}
