import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider as TerraWalletProvider } from "@terra-money/wallet-kit";

import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { NETWORKS } from "@/utils/network";
import Layout from "@/components/common/Layout";
import theme from "@/theme/theme";
import { ChainContextProvider } from "@/contexts/ChainContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  const main = (
    <Layout>
      <Component {...pageProps} />
    </Layout>
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
        {terraWalletKit}
      </QueryClientProvider>
    </ChakraProvider>
  ) : null;
}
