import useWarpCancelJob from "@/hooks/static/useWarpCancelJob";
import CreateAndBroadcastTxModal from "../tx/CreateAndBroadcastTxModal";

type WarpCancelJobProps = {
  jobId: string;
};

const WarpCancelJob = ({ jobId }: WarpCancelJobProps) => {
  const cancelJob = useWarpCancelJob({
    jobId,
  });

  return (
    <CreateAndBroadcastTxModal
      msgs={cancelJob.msgs}
      buttonText={"cancel job"}
      disabled={false}
    />
  );
};

export default WarpCancelJob;
