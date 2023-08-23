"use client";

import {
  Box,
  Flex,
  Link,
  ListItem,
  Text,
  UnorderedList,
  CardBody,
  Card,
  Stack,
  StackDivider,
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
      <Header text="Warning" />
      <Flex align="center" justify="center" direction="column">
        <Card align="center" justify="center" direction="column">
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Text>
                Warp world is still in active development and there are many
                things that are not user friendly, at this moment only
                developers or people who knows how to check data on chain (know
                how to use explorer) are recommended to use this app.
              </Text>
              <Text>
                Executed order will send the target token to your wallet
                automatically, but for closed order, you need to withdraw the
                source token from your Warp account manually, because when you
                create a limit order you first send the offered token to your
                Warp account, if the order is not executed the offered token
                will stay at your Warp account.
              </Text>
              <Text>
                Another caveat is tokens in your Warp account are not locked, it
                is recommended to only withdraw the asset when you do not have
                pending jobs, otherwise pending jobs might fail because you
                accidentally withdraw the token that is reserved for the job. We
                are working on a withdraw function on this UI so you do not need
                to interact with Warp account directly. Also Warp team is
                working on a fund locker so we do not accidentally withdraw the
                fund used for any pending job.
              </Text>
              <Link
                href={"https://app.warp.money/#/balances"}
                color="blue.500"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
                isExternal
              >
                Your Warp account balance
              </Link>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};

export default Home;
