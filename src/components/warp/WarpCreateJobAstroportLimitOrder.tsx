import { Flex } from "@chakra-ui/react";

import useWarpCreateJobAstroportLimitOrder from "@/hooks/static/useWarpCreateJobAstroportLimitOrder";
import { Token } from "@/utils/constants";
import CreateAndBroadcastTxModal from "./CreateAndBroadcastTxModal";

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

const WarpCreateJobAstroportLimitOrder = ({
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

export default WarpCreateJobAstroportLimitOrder;
