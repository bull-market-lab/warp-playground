import { Flex } from "@chakra-ui/react";

import { useWarpCreateJobAstroportLimitOrder } from "@/hooks/useWarpCreateJobAstroportLimitOrder";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";
import { Token } from "@/utils/constants";

type WarpCreateJobAstroportLimitOrderProps = {
  senderAddress?: string;
  warpFeeTokenAddress: string;
  warpControllerAddress: string;
  warpTotalJobFee: string;
  poolAddress: string;
  offerToken: Token;
  offerTokenAmount: string;
  returnToken: Token;
  minimumReturnTokenAmount: string;
  offerTokenBalance: number;
  expiredAfterDays: number;
};

export const WarpCreateJobAstroportLimitOrder = ({
  senderAddress,
  warpFeeTokenAddress,
  warpControllerAddress,
  warpTotalJobFee,
  poolAddress,
  offerToken,
  offerTokenAmount,
  returnToken,
  minimumReturnTokenAmount,
  offerTokenBalance,
  expiredAfterDays,
}: WarpCreateJobAstroportLimitOrderProps) => {
  const createWarpJobAstroportLimitOrder = useWarpCreateJobAstroportLimitOrder({
    senderAddress,
    warpFeeTokenAddress,
    warpControllerAddress,
    warpTotalJobFee,
    poolAddress,
    offerTokenAmount,
    minimumReturnTokenAmount,
    offerToken,
    returnToken,
    expiredAfterDays,
  });

  return (
    <Flex>
      <CreateAndBroadcastTxModal
        msgs={createWarpJobAstroportLimitOrder.msgs}
        buttonText={"create limit order"}
        disabled={
          offerTokenAmount === "0" ||
          parseInt(offerTokenAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
