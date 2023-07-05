import { Metadata } from "next";

import UsageWarning from "@/components/common/UsageWarning";
import Home from "@/components/page/Home";

export const metadata: Metadata = {
  title: "Warp World",
  description: "UI to harness the power of Warp Protocol",
};

const Page = () => {
  return (
    <>
      <Home />
      <UsageWarning />
    </>
  );
};

export default Page;
