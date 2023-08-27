import { Metadata } from "next";

import { DcaOrderPage } from "@/components/page/DcaOrder";

export const metadata: Metadata = {
  title: "Warp Playground | Stream Order",
  description: "Stream swap into your favorite crypto assets",
};

const Page = () => {
  return <DcaOrderPage />;
};

export default Page;
