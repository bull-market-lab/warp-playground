import { Job } from "@/utils/warpHelpers";
import { Box } from "@chakra-ui/react";

type WarpJobDetailProps = {
  job: Job;
};

const WarpJobDetail = ({ job }: WarpJobDetailProps) => {
  return <Box>{job.description}</Box>;
};

export default WarpJobDetail;
