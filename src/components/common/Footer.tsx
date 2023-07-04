import { Container, Box, Link } from "@chakra-ui/react";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <Box w="100%" color="white" bg="brand.black">
      <Container maxW="900px" py="12" px="6">
        <Box>
          <p style={{ marginBottom: "1rem", fontWeight: 800 }}>About</p>
          <p style={{ marginBottom: "1rem" }}>
            <Link
              variant="footer"
              isExternal={true}
              href="https://github.com/llllllluc/warp-world"
            >
              GitHub
            </Link>
          </p>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
