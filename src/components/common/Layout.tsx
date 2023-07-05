import { Flex, Container, Spacer } from "@chakra-ui/react";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
