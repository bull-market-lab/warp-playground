import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { WalletConnection, useShuttle } from "@delphi-labs/shuttle";
import { getTokenDecimals } from "@/config/tokens";
import { isMobile } from "@/utils/device";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import { Flex, Box, Button } from "@chakra-ui/react";
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
  resetOfferAmount: () => void;
  refetchTokenBalance: () => void;
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
  resetOfferAmount,
  refetchTokenBalance,
}: WarpCreateJobAstroportLimitSwapProps) => {
  const { broadcast } = useShuttle();
  const [
    isCreatingWarpJobAstroportLimitSwap,
    setIsCreatingWarpJobAstroportLimitSwap,
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
    setIsCreatingWarpJobAstroportLimitSwap(true);
    broadcast({
      wallet,
      messages: createWarpJobAstroportLimitSwap.msgs,
      feeAmount: fee!.amount,
      gasLimit: gasLimit!,
      mobile: isMobile(),
    })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        setIsCreatingWarpJobAstroportLimitSwap(false);
        resetOfferAmount();
        refetchTokenBalance();
      });
  };

  return (
    <Flex>
      <Button
        colorScheme="blue"
        onClick={onLimitSwap}
        isDisabled={
          isEstimatingFee ||
          isCreatingWarpJobAstroportLimitSwap ||
          offerAmount === "0" ||
          parseInt(offerAmount) > offerTokenBalance
        }
      >
        {isCreatingWarpJobAstroportLimitSwap ? "processing..." : "limit swap"}
      </Button>
      {!isEstimatingFee && (
        <Box>
          estimate tx fee to create limit swap:{" "}
          {BigNumber(fee!.amount)
            .div(
              getTokenDecimals(wallet.network.defaultCurrency!.coinMinimalDenom)
            )
            .toString()}{" "}
          {fee!.denom.substring(1).toUpperCase()}
        </Box>
      )}
    </Flex>
  );
};
