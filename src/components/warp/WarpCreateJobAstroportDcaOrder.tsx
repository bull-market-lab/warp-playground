import { Flex } from "@chakra-ui/react";
import { useWarpCreateJobAstroportDcaOrder } from "@/hooks/useWarpCreateJobAstroportDcaOrder";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";
import { Token } from "@/utils/constants";

type WarpCreateJobAstroportDcaOrderProps = {
  senderAddress?: string;
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
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

export const WarpCreateJobAstroportDcaOrder = ({
  senderAddress,
  warpFeeTokenAddress,
  warpControllerAddress,
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
  const createWarpJobAstroportDcaOrder = useWarpCreateJobAstroportDcaOrder({
    senderAddress,
    warpFeeTokenAddress,
    warpControllerAddress,
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
    <Flex>
      <CreateAndBroadcastTxModal
        msgs={createWarpJobAstroportDcaOrder.msgs}
        buttonText={"create DCA order"}
        disabled={
          offerTokenAmount === "0" ||
          parseInt(offerTokenAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
