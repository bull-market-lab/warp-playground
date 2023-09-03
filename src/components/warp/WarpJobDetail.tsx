import useMyWallet from "@/hooks/useMyWallet";
import {
  Job,
  getMarsYield,
  isMarsYieldBearingOrder,
} from "@/utils/warpHelpers";
import { Box, Flex } from "@chakra-ui/react";

type WarpJobDetailProps = {
  job: Job;
};

const WarpJobDetail = ({ job }: WarpJobDetailProps) => {
  const { lcd, currentChainConfig } = useMyWallet();
  return (
    <Flex>
      <Box>{job.description}</Box>
      {isMarsYieldBearingOrder(job.labels) &&
        `offer token yield generated from mars: ${getMarsYield({
          lcd,
          redBankAddress: currentChainConfig.mars.redBankAddress,
          job,
        })}`}
    </Flex>
  );
};

export default WarpJobDetail;
