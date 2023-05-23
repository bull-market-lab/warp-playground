import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { WalletConnection, useShuttle } from "@delphi-labs/shuttle";
import { getTokenDecimals } from "@/config/tokens";
import { isMobile } from "@/utils/device";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import { Flex, Box, Button } from "@chakra-ui/react";
import { useWarpCreateAccount } from "@/hooks/useWarpCreateAccount";
import { Coin } from "@cosmjs/amino";

type WarpAccountCreationProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
  refetchTokenBalance: () => void;
};

export const WarpAccountCreation = ({
  wallet,
  warpControllerAddress,
  refetchTokenBalance,
}: WarpAccountCreationProps) => {
  const { broadcast } = useShuttle();
  const [isCreatingWarpAccount, setIsCreatingWarpAccount] = useState(false);
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
    setIsCreatingWarpAccount(true);
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
        setIsCreatingWarpAccount(false);
        // refetch since creating warp account will cost LUNA so change balance
        refetchTokenBalance();
      });
  };

  return (
    <Flex align="center" justify="center">
      <Box>
        warp account not exist
        <Button
          colorScheme="blue"
          onClick={onCreateWarpAccount}
          isDisabled={isCreatingWarpAccount || isEstimatingFee}
        >
          {isCreatingWarpAccount ? "processing..." : "create warp account"}
        </Button>
      </Box>
      {!isEstimatingFee && (
        <Box>
          estimate tx fee to create warp account:{" "}
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
