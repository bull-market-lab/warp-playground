import { Job, isMarsYieldBearingOrder } from "@/utils/warpHelpers";
import { Box, Flex } from "@chakra-ui/react";
import MarsYield from "./MarsYield";

type WarpJobDetailProps = {
  job: Job;
  isPending: boolean;
};

const WarpJobDetail = ({ job, isPending }: WarpJobDetailProps) => {
  return (
    <Flex direction="column">
      <Box>{job.description}</Box>
      {isPending && isMarsYieldBearingOrder(job.labels) && (
        <MarsYield job={job} />
      )}
    </Flex>
  );
};

export default WarpJobDetail;
