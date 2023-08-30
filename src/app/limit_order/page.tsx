import { Metadata } from "next";

import { LimitOrderPage } from "@/components/page/LimitOrder";

export const metadata: Metadata = {
  title: "Warp Playground | Limit Order",
  description: "Limit swap into your favorite crypto assets",
};

const Page = () => {
  return <LimitOrderPage />;
};

export default Page;
