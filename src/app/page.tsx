import { Metadata } from "next";

import Home from "@/components/page/Home";

export const metadata: Metadata = {
  title: "Warp World",
  description: "UI to demonstrate the power of Warp Protocol",
};

const Page = () => {
  return <Home />;
};

export default Page;
