import { Flex, Container, Spacer } from "@chakra-ui/react";
import { FC } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

type Props = {
  children: React.ReactNode;
};

const Layout: FC<Props> = ({ children }: Props) => {
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
