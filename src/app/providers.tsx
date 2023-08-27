"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Container, Flex, Spacer } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
// import { ChainProvider as CosmosKitProvider } from "@cosmos-kit/react";
// import { wallets as KeplrWallets } from "@cosmos-kit/keplr-extension";
import { WalletProvider as TerraWalletKitProvider } from "@terra-money/wallet-kit";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import theme from "@/theme/theme";
// import CosmosKitChainContextProvider from "@/contexts/CosmosKitChainContextProvider";
import TerraWalletKitChainContextProvider from "@/contexts/TerraWalletKitChainContextProvider";

import { DEFAULT_LCD_CONFIG } from "@/utils/network";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  //// required for terra wallet kit
  // workaround for window undefined error at launch, terra wallet kit needs window
  useEffect(() => {
    setIsClient(true);
  }, []);

  //// required for cosmos kit
  // const supportedChains = chains.filter((chain) =>
  //   AVAILABLE_CHAIN_IDS.includes(chain.chain_id)
  // );

  return isClient ? (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <TerraWalletKitProvider defaultNetworks={DEFAULT_LCD_CONFIG}>
            {/* <ShuttleProvider
            mobileProviders={[]}
            extensionProviders={extensionProviders}
            persistent
          > */}
            {/* <CosmosKitProvider
            chains={supportedChains}
            assetLists={[]}
            wallets={KeplrWallets}
            // walletConnectOptions={...} // required if `wallets` contains mobile wallets
          > */}
            <TerraWalletKitChainContextProvider>
              <Flex minHeight="100vh" direction="column">
                <Container maxW="1000px" mx="auto" mb="20">
                  <Navbar />
                  {children}
                </Container>
                <Spacer />
                <Footer />
              </Flex>
            </TerraWalletKitChainContextProvider>
            {/* </CosmosKitProvider> */}
            {/* </ShuttleProvider> */}
          </TerraWalletKitProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  ) : null;
};

export default Providers;
