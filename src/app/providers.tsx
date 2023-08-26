"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Container, Flex, Spacer } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChainProvider as CosmosKitProvider } from "@cosmos-kit/react";
import { chains } from "chain-registry";
import { wallets } from "@cosmos-kit/keplr";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import theme from "@/theme/theme";
import CosmosKitChainContextProvider from "@/contexts/CosmosKitChainContextProvider";
import { AVAILABLE_CHAIN_IDS } from "@/utils/network";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  // workaround for window undefined error at launch, terra wallet provider needs window
  useEffect(() => {
    setIsClient(true);
  }, []);

  const supportedChains = chains.filter(
    (chain) => chain.chain_id in AVAILABLE_CHAIN_IDS
  );

  return isClient ? (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {/* <TerraWalletProvider defaultNetworks={DEFAULT_LCD_CONFIG}> */}
          {/* <ShuttleProvider
            mobileProviders={[]}
            extensionProviders={extensionProviders}
            persistent
          > */}
          <CosmosKitProvider
            chains={supportedChains}
            assetLists={[]}
            wallets={wallets}
            // walletConnectOptions={...} // required if `wallets` contains mobile wallets
          >
            <CosmosKitChainContextProvider>
              <Flex minHeight="100vh" direction="column">
                <Container maxW="1000px" mx="auto" mb="20">
                  <Navbar />
                  {children}
                </Container>
                <Spacer />
                <Footer />
              </Flex>
            </CosmosKitChainContextProvider>
          </CosmosKitProvider>
          {/* </TerraWalletProvider> */}
          {/* </ShuttleProvider> */}
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  ) : null;
};

export default Providers;
