import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "@terra-money/wallet-kit";
import { NETWORKS } from "@/utils/network";
import Layout from "@/components/common/Layout";
import theme from "@/theme/theme";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  const queryClient = new QueryClient();

  const main = (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ChakraProvider>
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <WalletProvider defaultNetworks={NETWORKS}>{main}</WalletProvider>
  ) : null;
}
