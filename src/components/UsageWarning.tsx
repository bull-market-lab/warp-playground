import {
  Link,
  Flex,
  CardBody,
  Text,
  CardHeader,
  Heading,
  Card,
  Stack,
  StackDivider,
} from "@chakra-ui/react";

export const UsageWarning = () => {
  return (
    <Flex align="center" justify="center" direction="column">
      <Card align="center" justify="center" direction="column">
        <CardHeader>
          <Heading size="md">Please Read</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Text>
              Limit order will expire after a day, im working on making it live
              longer. I'm working on supporting custom expiration time now.
            </Text>
            <Text>
              Executed order will send the target token to your wallet
              automatically, but for closed order, you need to withdraw the
              source token from your warp account manually, because when you
              create a limit order you first send the from token to your warp
              account. Be careful, because token used for limit order is not
              locked in your warp account, it's recommended to only withdraw the
              asset when you don't have pending jobs, otherwise those pending
              jobs might fail. I'm working on a withdraw function on this UI so
              you don't need to interact with warp account directly. Also warp
              team is working on a fund locker so we don't accidentally withdraw
              the fund used for any pending jobs.
            </Text>
            <Link
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
  );
};
