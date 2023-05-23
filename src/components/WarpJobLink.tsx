import { constructJobUrl } from "@/utils/warpHelpers";
import { Link } from "@chakra-ui/react";

type WarpJobLinkProps = {
  jobId: string;
};

export const WarpJobLink = ({ jobId }: WarpJobLinkProps) => {
  return (
    <Link
      href={constructJobUrl(jobId)}
      color="blue.500"
      fontWeight="bold"
      _hover={{ textDecoration: "underline" }}
      isExternal
    >
      {jobId}
    </Link>
  );
};
