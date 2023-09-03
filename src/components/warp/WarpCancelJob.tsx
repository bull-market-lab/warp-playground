import useWarpCancelJob from "@/hooks/static/useWarpCancelJob";
import CreateAndBroadcastTxModal from "../tx/CreateAndBroadcastTxModal";
import { Job } from "@/utils/warpHelpers";

type WarpCancelJobProps = {
  job: Job;
};

const WarpCancelJob = ({ job }: WarpCancelJobProps) => {
  const cancelJob = useWarpCancelJob({
    job,
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
