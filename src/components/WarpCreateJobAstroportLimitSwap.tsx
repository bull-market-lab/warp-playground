import { useEffect, useState } from "react";
import { WalletConnection, useShuttle } from "@delphi-labs/shuttle";
import { isMobile } from "@/utils/device";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import { Flex, Button } from "@chakra-ui/react";
import { useWarpCreateJobAstroportLimitSwap } from "@/hooks/useWarpCreateJobAstroportLimitSwap";
import { Coin } from "@cosmjs/amino";

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
  const { broadcast } = useShuttle();
  const [
    isBroadcastingTx,
    setIsBroadcastingTx,
  ] = useState(false);
  const [isEstimatingFee, setIsEstimatingFee] = useState(true);
  const [fee, setFee] = useState<Coin>();
  const [gasLimit, setGasLimit] = useState<string>();

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

  const { data: feeEstimateResult } = useFeeEstimate({
    messages: createWarpJobAstroportLimitSwap.msgs,
  });

  useEffect(() => {
    if (
      !feeEstimateResult ||
      !feeEstimateResult.fee ||
      !feeEstimateResult.gasLimit
    ) {
      return;
    }
    setFee(feeEstimateResult.fee);
    setGasLimit(feeEstimateResult.gasLimit);
    setIsEstimatingFee(false);
  }, [feeEstimateResult]);

  const onLimitSwap = () => {
    setIsBroadcastingTx(true);
    broadcast({
      wallet,
      messages: createWarpJobAstroportLimitSwap.msgs,
      feeAmount: fee!.amount,
      gasLimit: gasLimit!,
      mobile: isMobile(),
    })
      .catch((error) => {
        alert(error.message);
        throw error;
      })
      .finally(() => {
        setIsBroadcastingTx(false);
        window.location.reload()
      });
  };

  return (
    <Flex>
      <Button
        colorScheme="blue"
        onClick={onLimitSwap}
        isDisabled={
          isEstimatingFee ||
          isBroadcastingTx ||
          offerAmount === "0" ||
          parseInt(offerAmount) > offerTokenBalance
        }
      >
        {isBroadcastingTx ? "processing..." : "limit swap"}
      </Button>
    </Flex>
  );
};
