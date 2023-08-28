import useWarpCreateJobAstroportDcaOrder from "@/hooks/static/useWarpCreateJobAstroportDcaOrder";
import { Token } from "@/utils/constants";
import CreateAndBroadcastTxModal from "../tx/CreateAndBroadcastTxModal";

type WarpCreateJobAstroportDcaOrderProps = {
  warpTotalJobFee: string;
  poolAddress: string;
  offerToken: Token;
  offerTokenAmount: string;
  returnToken: Token;
  offerTokenBalance: number;
  // how many times to repeat the job, e.g. 10 means the job will run 10 times
  dcaCount: number;
  // how often to repeat the job, unit is day, e.g. 1 means the job will run everyday
  dcaInterval: number;
  // when to start the job, in unix timestamp
  dcaStartTimestamp: number;
  // max spread for astroport swap
  maxSpread: string;
};

const WarpCreateJobAstroportDcaOrder = ({
  warpTotalJobFee,
  poolAddress,
  offerToken,
  offerTokenAmount,
  returnToken,
  offerTokenBalance,
  dcaCount,
  dcaInterval,
  dcaStartTimestamp,
  maxSpread,
}: WarpCreateJobAstroportDcaOrderProps) => {
  const createJobAstroportDcaOrder = useWarpCreateJobAstroportDcaOrder({
    warpTotalJobFee,
    poolAddress,
    offerTokenAmount,
    offerToken,
    returnToken,
    dcaCount,
    dcaInterval,
    dcaStartTimestamp,
    maxSpread,
  });

  return (
    <CreateAndBroadcastTxModal
      msgs={createJobAstroportDcaOrder.msgs}
      buttonText={"create DCA order"}
      disabled={
        offerTokenAmount === "0" ||
        parseInt(offerTokenAmount) > offerTokenBalance
      }
    />
  );
};

export default WarpCreateJobAstroportDcaOrder;
