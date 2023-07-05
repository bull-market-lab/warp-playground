"use client";

import {
  Link,
  Flex,
  CardBody,
  Text,
  Card,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import Header from "./Header";

const UsageWarning = () => {
  return (
    <>
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
                Warp account balance
              </Link>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};

export default UsageWarning;
