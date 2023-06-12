import Head from "next/head";
import { LimitOrderPage } from "@/components/page/LimitOrder";
import { useWallet } from "@terra-money/wallet-kit";

export default function LimitOrder() {
  const wallet = useWallet();
  // TODO: support dummy data when wallet is not connected
  // currently LCD client is not available when wallet is not connected
  // need to wait for wallet-kit update
  return (
    <>
      <Head>
        <title>Warp World | Limit Order</title>
      </Head>
      {wallet.status !== "CONNECTED" ? <></> : <LimitOrderPage />}
    </>
  );
}
