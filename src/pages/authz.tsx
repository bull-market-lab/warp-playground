import Head from "next/head";
import { AuthzPage } from "@/components/page/Authz";

export default function Authz() {
  return (
    <>
      <Head>
        <title>Warp World | Authz</title>
      </Head>
      <AuthzPage />
    </>
  );
}
