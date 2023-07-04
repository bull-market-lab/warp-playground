import { Metadata } from "next";

import UsageWarning from "@/components/common/UsageWarning";
import About from "@/components/page/About";

export const metadata: Metadata = {
  title: "Warp World",
  description: "UI to harness the power of Warp Protocol",
};

const Page = () => {
  return (
    <>
      <About />
      <UsageWarning />
    </>
  );
};

export default Page;
