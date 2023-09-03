import { constructJobUrl } from "@/utils/warpHelpers";
import { Box, Flex, Link } from "@chakra-ui/react";

type WarpJobLinkProps = {
  jobId: string;
};

const WarpJobLink = ({ jobId }: WarpJobLinkProps) => {
  return (
    <Flex direction="column">
      <Link
        href={constructJobUrl(jobId)}
        color="blue.500"
        fontWeight="bold"
        _hover={{ textDecoration: "underline" }}
        isExternal
      >
        {jobId}
      </Link>
      <Box>link is wrong please ignore</Box>
    </Flex>
  );
};

export default WarpJobLink;
