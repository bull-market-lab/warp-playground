import { Box } from "@chakra-ui/react";

type WarpJobDetailProps = {
  jobName: string;
};

// job will soon have description and labels field
// https://github.com/terra-money/warp-contracts/pull/31
// TODO: currently name has length limit, switch to description when it's available
export const WarpJobDetail = ({ jobName }: WarpJobDetailProps) => {
  const detail = jobName.replaceAll("-", " ");
  return <Box>{detail}</Box>;
};
