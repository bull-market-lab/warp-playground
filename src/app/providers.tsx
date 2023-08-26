"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Container, Flex, Spacer } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  KeplrExtensionProvider,
  ShuttleProvider,
} from "@delphi-labs/shuttle-react";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import theme from "@/theme/theme";
import { NEUTRON_TESTNET, TERRA_TESTNET } from "@/utils/shuttleNetworks";
import ChainContextProvider from "@/contexts/ShuttleWalletChainContextProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  const extensionProviders = [
    new KeplrExtensionProvider({
      // networks: [OSMOSIS_TESTNET, TERRA_TESTNET, NEUTRON_TESTNET],
      networks: [TERRA_TESTNET, NEUTRON_TESTNET],
    }),
  ];

  // workaround for window undefined error at launch, terra wallet provider needs window
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {/* <TerraWalletProvider defaultNetworks={DEFAULT_LCD_CONFIG}> */}
          <ShuttleProvider
            mobileProviders={[]}
            extensionProviders={extensionProviders}
            persistent
          >
            <ChainContextProvider>
              <Flex minHeight="100vh" direction="column">
                <Container maxW="1000px" mx="auto" mb="20">
                  <Navbar />
                  {children}
                </Container>
                <Spacer />
                <Footer />
              </Flex>
            </ChainContextProvider>
            {/* </TerraWalletProvider> */}
          </ShuttleProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  ) : null;
};

export default Providers;
