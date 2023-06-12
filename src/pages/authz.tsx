import Head from "next/head";
import { useWallet } from "@terra-money/wallet-kit";
import { Text } from "@chakra-ui/react";

export default function Authz() {
  const wallet = useWallet();
  // TODO: support dummy data when wallet is not connected
  // currently LCD client is not available when wallet is not connected
  // need to wait for wallet-kit update
  return (
    <>
      <Head>
        <title>Warp World | Authz</title>
      </Head>
      {wallet.status !== "CONNECTED" ? <></> : <Text>🏗coming soon🚧</Text>}
    </>
  );
}
