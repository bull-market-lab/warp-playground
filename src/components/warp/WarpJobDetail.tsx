import { Job } from "@/utils/warpHelpers";
import { Box } from "@chakra-ui/react";

type WarpJobDetailProps = {
  job: Job;
};

export const WarpJobDetail = ({ job }: WarpJobDetailProps) => {
  return <Box>{job.description}</Box>;
};
