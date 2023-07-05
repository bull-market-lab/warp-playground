"use client";

import {
  Box,
  Flex,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { FC } from "react";

import Header from "@/components/common/Header";
import ExternalLinkIcon from "@/components/common/ExternalLinkIcon";

const ExternalLinkIconWrapper = () => {
  return <ExternalLinkIcon ml="1" mr="6" transform="translateY(-2px)" />;
};

const Home: FC = () => {
  return (
    <>
      <Header text="About" />
      <Box bg="white" p="6" mb="4" borderRadius="2xl">
        <Text mb="3">
          <b>Warp World</b> is a UI that provides a set of functionalities
          powered by Warp Protocol.
        </Text>
        <Text mb="3">
          By combining Warp with different protocols, users can many things that
          are not possible before.
        </Text>
        <Text>Combining with dex like Astroport:</Text>
        <UnorderedList mb="6">
          <ListItem>(feature is LIVE ✅) Users can place limit order.</ListItem>
          <ListItem>
            (feature is LIVE ✅) Users can create dollar cost averaging
            strategy.
          </ListItem>
        </UnorderedList>
        <Text>Combining with Authz:</Text>
        <UnorderedList mb="6">
          <ListItem>
            (feature is under development 🚧) Users can auto claim and compound
            their staking reward everyday.
          </ListItem>
          <ListItem>
            (feature is under development 🚧) Users can program how they want to
            spend their vested token, e.g. automatically sell vested token on
            Astroport on a daily basic.
          </ListItem>
        </UnorderedList>
        <hr />
        <Box mt="6" mb="1">
          <b>Useful links</b>
        </Box>
        <Flex direction={["column", null, "row", null]} mb="1">
          <Link variant="docs" isExternal={true} href="https://warp.money/">
            Warp Protocol Home Page <ExternalLinkIconWrapper />
          </Link>
          <Link
            variant="docs"
            isExternal={true}
            href="https://github.com/terra-money/warp-contracts"
          >
            Warp Protocol Github <ExternalLinkIconWrapper />
          </Link>
        </Flex>
        <Flex direction={["column", null, "row", null]}>
          <Link
            variant="docs"
            isExternal={true}
            href="https://github.com/llllllluc/warp-world"
          >
            Warp World UI Github <ExternalLinkIconWrapper />
          </Link>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
