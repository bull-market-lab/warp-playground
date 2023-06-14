import {
  Link,
  Flex,
  CardBody,
  Text, Card,
  Stack,
  StackDivider
} from "@chakra-ui/react";
import Header from "./Header";

export const UsageWarning = () => {
  return (
    <>
    <Header text="Limitation" />
    <Flex align="center" justify="center" direction="column">
      <Card align="center" justify="center" direction="column">
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Text>
              Executed order will send the target token to your wallet
              automatically, but for closed order, you need to withdraw the
              source token from your warp account manually, because when you
              create a limit order you first send the from token to your warp
              account, if the order is not executed the source token will stay
              there. Be careful, because token in warp account is not locked, it
              is recommended to only withdraw the asset when you do not have
              pending jobs, otherwise pending jobs might fail because you
              withdraw the token that is used for the job. I am working on a
              withdraw function on this UI so you do not need to interact with
              warp account directly. Also warp team is working on a fund locker
              so we do not accidentally withdraw the fund used for any pending
              job.
            </Text>
            <Link
              // TODO: url may change after warp comes out of beta
              href={"https://beta.warp.money/#/balances"}
              color="blue.500"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
              isExternal
            >
              warp account balance
            </Link>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
    </>

  );
};
