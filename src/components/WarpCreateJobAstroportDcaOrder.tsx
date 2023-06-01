import { WalletConnection } from "@delphi-labs/shuttle";
import { Flex } from "@chakra-ui/react";
import { useWarpCreateJobAstroportDcaOrder } from "@/hooks/useWarpCreateJobAstroportDcaOrder";
import { CreateAndBroadcastTxModal } from "./CreateAndBroadcastTxModal";

type WarpCreateJobAstroportDcaOrderProps = {
  wallet: WalletConnection;
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
  dcaStartTime: number;
  // max spread for astroport swap
  maxSpread: string;
};

export const WarpCreateJobAstroportDcaOrder = ({
  wallet,
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
  dcaStartTime,
  maxSpread,
}: WarpCreateJobAstroportDcaOrderProps) => {
  const createWarpJobAstroportDcaOrder = useWarpCreateJobAstroportDcaOrder({
    warpControllerAddress,
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount,
    offerAssetAddress,
    returnAssetAddress,
    dcaCount,
    dcaInterval,
    dcaStartTime,
    maxSpread,
  });

  return (
    <Flex>
      <CreateAndBroadcastTxModal
        wallet={wallet}
        msgs={createWarpJobAstroportDcaOrder.msgs}
        buttonText={"create DCA order"}
        disabled={
          offerAmount === "0" || parseInt(offerAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
