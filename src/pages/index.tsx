import Head from "next/head";
import { DcaOrderPage } from "@/components/page/DcaOrder";

export default function DCA() {
  return (
    <>
      <Head>
        <title>Warp World | DCA Order</title>
      </Head>
      <DcaOrderPage />
    </>
  );
}
