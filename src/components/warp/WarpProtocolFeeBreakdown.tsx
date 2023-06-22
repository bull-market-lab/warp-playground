import { DEFAULT_JOB_REWARD_AMOUNT, EVICTION_FEE } from "@/utils/constants";
import { DENOM_TO_TOKEN_NAME } from "@/utils/token";
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
  warpFeeTokenAddress: string;
};

export const WarpProtocolFeeBreakdown = ({
  warpJobCreationFee,
  warpJobEvictionFee,
  warpJobRewardFee,
  warpTotalJobFee,
  warpFeeTokenAddress,
}: WarpProtocolFeeBreakdownProps) => {
  return (
    <Flex style={{ marginTop: "10px" }}>
      <Card>
        <CardHeader>
          <Heading size="md">
            Total Warp protocol fee paid: {warpTotalJobFee}{" "}
            {DENOM_TO_TOKEN_NAME[warpFeeTokenAddress]}, breaking it down:
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
                {warpJobCreationFee} {DENOM_TO_TOKEN_NAME[warpFeeTokenAddress]}
              </Text>
            </Box>
            <Box>
              <Heading size="xs">
                Job execution reward paid to Warp keeper, default reward per job{" "}
                is {DEFAULT_JOB_REWARD_AMOUNT}{" "}
                {DENOM_TO_TOKEN_NAME[warpFeeTokenAddress]}
              </Heading>
              <Text pt="2" fontSize="sm">
                {warpJobRewardFee} {DENOM_TO_TOKEN_NAME[warpFeeTokenAddress]}
              </Text>
            </Box>
            <Box>
              <Heading size="xs">
                Job eviction fee paid to Warp keeper every 24 hours, single
                required eviction fee is {EVICTION_FEE}{" "}
                {DENOM_TO_TOKEN_NAME[warpFeeTokenAddress]}
              </Heading>
              <Text pt="2" fontSize="sm">
                {warpJobEvictionFee} {DENOM_TO_TOKEN_NAME[warpFeeTokenAddress]}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
};
