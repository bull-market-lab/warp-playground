import { useEffect, useState } from "react";
import { WalletConnection, useShuttle } from "@delphi-labs/shuttle";
import { isMobile } from "@/utils/device";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import { Flex, Box, Button } from "@chakra-ui/react";
import { useWarpCreateAccount } from "@/hooks/useWarpCreateAccount";
import { Coin } from "@cosmjs/amino";

type WarpCreateAccountProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
};

export const WarpCreateAccount = ({
  wallet,
  warpControllerAddress,
}: WarpCreateAccountProps) => {
  const { broadcast } = useShuttle();
  const [isBroadcastingTx, setIsBroadcastingTx] = useState(false);
  const [isEstimatingFee, setIsEstimatingFee] = useState(true);
  const [fee, setFee] = useState<Coin>();
  const [gasLimit, setGasLimit] = useState<string>();

  const createWarpAccount = useWarpCreateAccount({
    warpControllerAddress,
  });

  const { data: feeEstimateResult } = useFeeEstimate({
    messages: createWarpAccount.msgs,
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

  const onCreateWarpAccount = () => {
    setIsBroadcastingTx(true);
    broadcast({
      wallet,
      messages: createWarpAccount.msgs,
      feeAmount: fee!.amount,
      gasLimit: gasLimit!,
      mobile: isMobile(),
    })
      .then((result) => {
        // TODO: maybe we should set the warp account address here instead of refetching
      })
      .catch((error) => {
        // TODO: think about how to handle error
        alert(error.message);
        throw error;
      })
      .finally(() => {
        setIsBroadcastingTx(false);
        window.location.reload()
      });
  };

  return (
    <Flex align="center" justify="center">
      <Box>
        warp account not exist
        <Button
          colorScheme="blue"
          onClick={onCreateWarpAccount}
          isDisabled={isBroadcastingTx || isEstimatingFee}
        >
          {isBroadcastingTx ? "processing..." : "create warp account"}
        </Button>
      </Box>
    </Flex>
  );
};
