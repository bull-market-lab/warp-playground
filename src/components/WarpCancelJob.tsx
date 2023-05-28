import { useEffect, useState } from "react";
import { WalletConnection, useShuttle } from "@delphi-labs/shuttle";
import { isMobile } from "@/utils/device";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Coin } from "@cosmjs/amino";
import { useWarpCancelJob } from "@/hooks/useWarpCancelJob";

type WarpCancelJobProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
  jobId: string;
};

export const WarpCancelJob = ({
  wallet,
  warpControllerAddress,
  jobId,
}: WarpCancelJobProps) => {
  const { broadcast } = useShuttle();
  const [isBroadcastingTx, setIsBroadcastingTx] = useState(false);
  const [isEstimatingFee, setIsEstimatingFee] = useState(true);
  const [fee, setFee] = useState<Coin>();
  const [gasLimit, setGasLimit] = useState<string>();

  const cancelJob = useWarpCancelJob({
    warpControllerAddress,
    jobId,
  });

  const { data: feeEstimateResult } = useFeeEstimate({
    messages: cancelJob.msgs,
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

  const onCancelJob = () => {
    setIsBroadcastingTx(true);
    broadcast({
      wallet,
      messages: cancelJob.msgs,
      feeAmount: fee!.amount,
      gasLimit: gasLimit!,
      mobile: isMobile(),
    })
      .catch((error) => {
        // TODO: think about how to handle error
        alert(error.message);
        throw error;
      })
      .finally(() => {
        setIsBroadcastingTx(false);
        window.location.reload();
      });
  };
  return (
    <Flex align="center" justify="center">
      <Box>
        <Button
          colorScheme="blue"
          onClick={onCancelJob}
          isDisabled={isBroadcastingTx || isEstimatingFee}
        >
          {isBroadcastingTx ? "processing..." : "cancel job"}
        </Button>
      </Box>
    </Flex>
  );
};
