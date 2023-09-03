import useMarsGetCollateral from "@/hooks/query/useMarsGetCollateral";
import {
  Job,
  extractOfferTokenAddress,
  calculateMarsYield,
  isMarsYieldBearingOrder,
} from "@/utils/warpHelpers";
import { Box } from "@chakra-ui/react";

type MarsYieldProps = {
  job: Job;
};

const MarsYield = ({ job }: MarsYieldProps) => {
  const marsCollateral = useMarsGetCollateral({
    user: job.account,
    denom: extractOfferTokenAddress(job.labels),
  });
  return (
    <Box>
      {isMarsYieldBearingOrder(job.labels) &&
        `offer token yield generated from mars: ${calculateMarsYield(
          job,
          marsCollateral.marsCollateralResult.data?.amount!
        )}`}
    </Box>
  );
};

export default MarsYield;
