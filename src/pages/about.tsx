import Head from "next/head";
import { NextPage } from "next";

import { About } from "@/components/common/About";
import { UsageWarning } from "@/components/common/UsageWarning";

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Warp World | Risk</title>
      </Head>
      <About />
      <UsageWarning />
    </>
  );
};

export default AboutPage;
