import { Flex } from "@chakra-ui/react";
import { useWarpCreateJobAstroportLimitOrder } from "@/hooks/useWarpCreateJobAstroportLimitOrder";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCreateJobAstroportLimitOrderProps = {
  senderAddress?: string;
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpTotalJobFee: string;
  poolAddress: string;
  offerAssetAddress: string;
  offerAmount: string;
  returnAssetAddress: string;
  minimumReturnAmount: string;
  offerTokenBalance: number;
  expiredAfterDays: number;
};

export const WarpCreateJobAstroportLimitOrder = ({
  senderAddress,
  warpFeeTokenAddress,
  warpControllerAddress,
  warpAccountAddress,
  warpTotalJobFee,
  poolAddress,
  offerAssetAddress,
  offerAmount,
  returnAssetAddress,
  minimumReturnAmount,
  offerTokenBalance,
  expiredAfterDays,
}: WarpCreateJobAstroportLimitOrderProps) => {
  const createWarpJobAstroportLimitOrder = useWarpCreateJobAstroportLimitOrder({
    senderAddress,
    warpFeeTokenAddress,
    warpControllerAddress,
    warpAccountAddress,
    warpTotalJobFee,
    poolAddress,
    offerAmount,
    minimumReturnAmount,
    offerAssetAddress,
    returnAssetAddress,
    expiredAfterDays,
  });

  return (
    <Flex>
      <CreateAndBroadcastTxModal
        msgs={createWarpJobAstroportLimitOrder.msgs}
        buttonText={"create limit order"}
        disabled={
          offerAmount === "0" || parseInt(offerAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
