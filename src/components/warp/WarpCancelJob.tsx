import { Flex } from "@chakra-ui/react";

import useWarpCancelJob from "@/hooks/static/useWarpCancelJob";
import CreateAndBroadcastTxModal from "./CreateAndBroadcastTxModal";

type WarpCancelJobProps = {
  jobId: string;
};

const WarpCancelJob = ({ jobId }: WarpCancelJobProps) => {
  const cancelJob = useWarpCancelJob({
    jobId,
  });

  return (
    <Flex align="center" justify="center">
      <CreateAndBroadcastTxModal
        msgs={cancelJob.msgs}
        buttonText={"cancel job"}
        disabled={false}
      />
    </Flex>
  );
};

export default WarpCancelJob;
