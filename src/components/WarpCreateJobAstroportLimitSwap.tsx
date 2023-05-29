import { WalletConnection } from "@delphi-labs/shuttle";
import { Flex } from "@chakra-ui/react";
import { useWarpCreateJobAstroportLimitSwap } from "@/hooks/useWarpCreateJobAstroportLimitSwap";
import { CreateAndBroadcastTxModal } from "./CreateAndBroadcastTxModal";

type WarpCreateJobAstroportLimitSwapProps = {
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
};

export const WarpCreateJobAstroportLimitSwap = ({
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
}: WarpCreateJobAstroportLimitSwapProps) => {
  const createWarpJobAstroportLimitSwap = useWarpCreateJobAstroportLimitSwap({
    warpControllerAddress,
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount,
    minimumReturnAmount,
    offerAssetAddress,
    returnAssetAddress,
  });

  return (
    <Flex>
      <CreateAndBroadcastTxModal
        wallet={wallet}
        msgs={createWarpJobAstroportLimitSwap.msgs}
        buttonText={"limit swap"}
        disabled={
          offerAmount === "0" || parseInt(offerAmount) > offerTokenBalance
        }
      />
    </Flex>
  );
};
