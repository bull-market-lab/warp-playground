import type { AppProps } from "next/app";
import {
  CosmostationProvider,
  KeplrProvider,
  LeapCosmosProvider,
  MetamaskProvider,
  MobileCosmostationProvider,
  MobileKeplrProvider,
  MobileLeapCosmosProvider,
  MobileMetamaskProvider,
  ShuttleProvider,
  TerraStationProvider,
  XDEFICosmosProvider,
  XDefiProvider,
} from "@delphi-labs/shuttle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  OSMOSIS_MAINNET,
  MARS_MAINNET,
  TERRA_MAINNET,
  TERRA_TESTNET,
  INJECTIVE_MAINNET,
  INJECTIVE_TESTNET,
  TERRA_LOCALTERRA,
} from "@/config/networks";
// import Header from "@/components/common/Header";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "@/components/common/Layout";
import {
  WalletProvider,
} from "@terra-money/wallet-kit";
import theme from "@/theme/theme";
import { NETWORKS } from "@/utils/network";
import { useEffect, useState } from "react";

const providers = [
  new XDefiProvider({
    networks: [TERRA_MAINNET],
  }),
  new XDEFICosmosProvider({
    networks: [OSMOSIS_MAINNET, MARS_MAINNET],
  }),
  new CosmostationProvider({
    networks: [OSMOSIS_MAINNET, TERRA_MAINNET],
  }),
  new LeapCosmosProvider({
    networks: [OSMOSIS_MAINNET, TERRA_MAINNET],
  }),
  new TerraStationProvider({
    networks: [
      OSMOSIS_MAINNET,
      MARS_MAINNET,
      TERRA_MAINNET,
      TERRA_TESTNET,
      TERRA_LOCALTERRA,
    ],
  }),
  new KeplrProvider({
    networks: [
      OSMOSIS_MAINNET,
      MARS_MAINNET,
      TERRA_MAINNET,
      TERRA_TESTNET,
      INJECTIVE_MAINNET,
      INJECTIVE_TESTNET,
    ],
  }),
  new MetamaskProvider({
    networks: [INJECTIVE_MAINNET, INJECTIVE_TESTNET],
  }),
];

const mobileProviders = [
  new MobileKeplrProvider({
    networks: [
      OSMOSIS_MAINNET,
      MARS_MAINNET,
      TERRA_MAINNET,
      TERRA_TESTNET,
      INJECTIVE_MAINNET,
      INJECTIVE_TESTNET,
    ],
  }),
  new MobileLeapCosmosProvider({
    networks: [
      OSMOSIS_MAINNET,
      MARS_MAINNET,
      TERRA_MAINNET,
      TERRA_TESTNET,
      INJECTIVE_MAINNET,
      INJECTIVE_TESTNET,
    ],
  }),
  new MobileCosmostationProvider({
    networks: [
      OSMOSIS_MAINNET,
      MARS_MAINNET,
      TERRA_MAINNET,
      TERRA_TESTNET,
      INJECTIVE_MAINNET,
      INJECTIVE_TESTNET,
    ],
  }),
  new MobileMetamaskProvider({
    networks: [INJECTIVE_MAINNET, INJECTIVE_TESTNET],
  }),
];

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

  // if (typeof window === "undefined") {
  //   return null
  // }
  // const defaultMain = (
  //   <ChakraProvider>
  //     <ShuttleProvider
  //       mobileProviders={mobileProviders}
  //       providers={providers}
  //       persistent
  //     >
  //       <QueryClientProvider client={queryClient}>
  //         <Layout>
  //           <Header />
  //           <Component {...pageProps} />
  //         </Layout>
  //       </QueryClientProvider>
  //     </ShuttleProvider>
  //   </ChakraProvider>
  // );
  return isClient ? (
    <WalletProvider defaultNetworks={NETWORKS}>{main}</WalletProvider>
  ) : null;
  // return typeof window !== "undefined" ? (
  //   <WalletProvider defaultNetworks={NETWORKS}>{main}</WalletProvider>
  // ) : (
  //   <StaticWalletProvider>{main}</StaticWalletProvider>
  // );
}

// App.getInitialProps = async () => {
//   console.log("get initial props");
//   const defaultNetworks = await getInitialConfig();
//   console.log("default networks", defaultNetworks);

//   return {
//     ...defaultNetworks,
//   };
// };
