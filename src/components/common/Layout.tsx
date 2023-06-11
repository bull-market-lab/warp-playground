import { Flex, Container, Spacer } from "@chakra-ui/react";
import { useConnectedWallet } from "@terra-money/wallet-kit";
import { FC, useEffect } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useStore } from "@/hooks/useStore";

type Props = {
  children: React.ReactNode;
};

const Layout: FC<Props> = ({ children }: Props) => {
  const wallet = useConnectedWallet();
  const store = useStore();

  // Update store if wallet is changed
  useEffect(() => {
    store.update(wallet);
  }, [wallet]);

  return (
    <Flex minHeight="100vh" direction="column">
      <Container maxW="900px" mx="auto" mb="20">
        <Navbar />
        {children}
      </Container>
      <Spacer />
      <Footer />
    </Flex>
  );
};

export default Layout;
