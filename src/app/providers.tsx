"use client";

import { WalletProvider as TerraWalletProvider } from "@terra-money/wallet-kit";
import { ChainContextProvider } from "@/contexts/ChainContext";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Container, Flex, Spacer } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Navbar from "@/components/common/Navbar";
import { NETWORKS } from "@/utils/network";
import Footer from "@/components/common/Footer";
import theme from "@/theme/theme";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  // workaround for window undefined error at launch, terra wallet provider needs window
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <ChainContextProvider>
            <TerraWalletProvider defaultNetworks={NETWORKS}>
              <Flex minHeight="100vh" direction="column">
                <Container maxW="900px" mx="auto" mb="20">
                  <Navbar />
                  {children}
                </Container>
                <Spacer />
                <Footer />
              </Flex>
            </TerraWalletProvider>
          </ChainContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  ) : null;
};

export default Providers;
