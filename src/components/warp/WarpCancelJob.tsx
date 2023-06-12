import { Flex } from "@chakra-ui/react";
import { useWarpCancelJob } from "@/hooks/useWarpCancelJob";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCancelJobProps = {
  senderAddress?: string;
  warpControllerAddress: string;
  jobId: string;
};

export const WarpCancelJob = ({
  senderAddress,
  warpControllerAddress,
  jobId,
}: WarpCancelJobProps) => {
  const cancelJob = useWarpCancelJob({
    senderAddress,
    warpControllerAddress,
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
