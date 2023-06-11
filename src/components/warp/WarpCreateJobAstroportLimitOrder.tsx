import { WalletConnection } from "@delphi-labs/shuttle";
import { Flex } from "@chakra-ui/react";
import { useWarpCreateJobAstroportLimitOrder } from "@/hooks/useWarpCreateJobAstroportLimitOrder";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCreateJobAstroportLimitOrderProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  poolAddress: string;
  offerAssetAddress: string;
  offerAmount: string;
  returnAssetAddress: string;
  minimumReturnAmount: string;
  offerTokenBalance: number;
  expiredAfterDays: number;
};

export const WarpCreateJobAstroportLimitOrder = ({
  wallet,
  warpControllerAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  poolAddress,
  offerAssetAddress,
  offerAmount,
  returnAssetAddress,
  minimumReturnAmount,
  offerTokenBalance,
  expiredAfterDays,
}: WarpCreateJobAstroportLimitOrderProps) => {
  const createWarpJobAstroportLimitOrder = useWarpCreateJobAstroportLimitOrder({
    warpControllerAddress,
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount,
    minimumReturnAmount,
    offerAssetAddress,
    returnAssetAddress,
    expiredAfterDays
  });

  return (
    <Flex>
      <CreateAndBroadcastTxModal
        wallet={wallet}
        msgs={createWarpJobAstroportLimitOrder.msgs}
        buttonText={"create limit order"}
        disabled={
          offerAmount === "0" || parseInt(offerAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
