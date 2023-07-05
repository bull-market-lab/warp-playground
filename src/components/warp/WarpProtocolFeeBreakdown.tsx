import {
  DEFAULT_JOB_REWARD_AMOUNT,
  EVICTION_FEE,
  Token,
} from "@/utils/constants";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

type WarpProtocolFeeBreakdownProps = {
  warpJobCreationFee: string;
  warpJobEvictionFee: string;
  warpJobRewardFee: string;
  warpTotalJobFee: string;
  warpFeeToken: Token;
};

export const WarpProtocolFeeBreakdown = ({
  warpJobCreationFee,
  warpJobEvictionFee,
  warpJobRewardFee,
  warpTotalJobFee,
  warpFeeToken,
}: WarpProtocolFeeBreakdownProps) => {
  return (
    <Flex style={{ marginTop: "10px" }}>
      <Card>
        <CardHeader>
          <Heading size="md">
            Total Warp protocol fee paid: {warpTotalJobFee} {warpFeeToken.name},
            breaking it down:
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs">
                Job creation fee paid to Warp protocol, required creation fee
                per job is 5% of execution reward
              </Heading>
              <Text pt="2" fontSize="sm">
                {warpJobCreationFee} {warpFeeToken.name}
              </Text>
            </Box>
            <Box>
              <Heading size="xs">
                Job execution reward paid to Warp keeper, default reward per job{" "}
                is {DEFAULT_JOB_REWARD_AMOUNT} {warpFeeToken.name}
              </Heading>
              <Text pt="2" fontSize="sm">
                {warpJobRewardFee} {warpFeeToken.name}
              </Text>
            </Box>
            <Box>
              <Heading size="xs">
                Job eviction fee paid to Warp keeper every 24 hours, single
                required eviction fee is {EVICTION_FEE} {warpFeeToken.name}
              </Heading>
              <Text pt="2" fontSize="sm">
                {warpJobEvictionFee} {warpFeeToken.name}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
};
