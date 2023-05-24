import { Box } from "@chakra-ui/react";

type WarpJobDetailProps = {
  jobName: string;
};

export const WarpJobDetail = ({ jobName }: WarpJobDetailProps) => {
  const detail = jobName.replaceAll("-", " ");
  return <Box>{detail}</Box>;
};
