import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "@terra-money/wallet-kit";
import { NETWORKS } from "@/utils/network";
import Layout from "@/components/common/Layout";
import theme from "@/theme/theme";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  const supportedWalletKitChains = chains.filter((chain) =>
    ["phoenix-1", "pisco-1", "neutron-1", "pion-1"].includes(chain.chain_id)
  );

  const main = (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  // workaround for window undefined error at launch, terra wallet provider needs window
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ChainProvider
          chains={supportedWalletKitChains} // supported chains
          assetLists={assets} // supported asset lists
          wallets={keplrWallets} // supported wallets
          wrappedWithChakra={true}
          // walletConnectOptions={...} // required if `wallets` contains mobile wallets
        >
          <WalletProvider defaultNetworks={NETWORKS}>{main}</WalletProvider>
        </ChainProvider>
      </QueryClientProvider>
    </ChakraProvider>
  ) : null;
}
