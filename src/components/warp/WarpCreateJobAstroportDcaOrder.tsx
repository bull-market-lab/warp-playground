import { Flex } from "@chakra-ui/react";
import { useWarpCreateJobAstroportDcaOrder } from "@/hooks/useWarpCreateJobAstroportDcaOrder";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCreateJobAstroportDcaOrderProps = {
  senderAddress?: string;
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  poolAddress: string;
  offerAssetAddress: string;
  offerAmount: string;
  returnAssetAddress: string;
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
  warpAccountAddress,
  warpJobCreationFeePercentage,
  poolAddress,
  offerAssetAddress,
  offerAmount,
  returnAssetAddress,
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
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount,
    offerAssetAddress,
    returnAssetAddress,
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
          offerAmount === "0" || parseInt(offerAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
