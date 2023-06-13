import Head from "next/head";
import { LimitOrderPage } from "@/components/page/LimitOrder";

export default function LimitOrder() {
  return (
    <>
      <Head>
        <title>Warp World | Limit Order</title>
      </Head>
      <LimitOrderPage />
    </>
  );
}
