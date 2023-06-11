import { WalletConnection } from "@delphi-labs/shuttle";
import { Flex } from "@chakra-ui/react";
import { useWarpCancelJob } from "@/hooks/useWarpCancelJob";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCancelJobProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
  jobId: string;
};

export const WarpCancelJob = ({
  wallet,
  warpControllerAddress,
  jobId,
}: WarpCancelJobProps) => {
  const cancelJob = useWarpCancelJob({
    warpControllerAddress,
    jobId,
  });

  return (
    <Flex align="center" justify="center">
      <CreateAndBroadcastTxModal
        wallet={wallet}
        msgs={cancelJob.msgs}
        buttonText={"cancel job"}
        disabled={false}
      />
    </Flex>
  );
};
