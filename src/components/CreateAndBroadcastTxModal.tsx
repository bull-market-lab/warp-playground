import { useEffect, useState } from "react";
import {
  MsgExecuteContract,
  MsgSend,
  WalletConnection,
  useShuttle,
} from "@delphi-labs/shuttle";
import { isMobile } from "@/utils/device";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import { Button } from "@chakra-ui/react";
import { Coin } from "@cosmjs/amino";

type CreateAndBroadcastTxModalProps = {
  wallet: WalletConnection;
  msgs: (MsgExecuteContract | MsgSend)[];
  buttonText: string;
  disabled: boolean;
};

export const CreateAndBroadcastTxModal = ({
  wallet,
  msgs,
  buttonText,
  disabled,
}: CreateAndBroadcastTxModalProps) => {
  const { broadcast } = useShuttle();
  const [isBroadcastingTx, setIsBroadcastingTx] = useState(false);
  const [isEstimatingFee, setIsEstimatingFee] = useState(true);
  const [fee, setFee] = useState<Coin>();
  const [gasLimit, setGasLimit] = useState<string>();

  const { data: feeEstimateResult } = useFeeEstimate({
    messages: msgs,
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

  const onBroadcastTx = () => {
    setIsBroadcastingTx(true);
    broadcast({
      wallet,
      messages: msgs,
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
        window.location.reload();
      });
  };

  return (
    <Button
      colorScheme="blue"
      onClick={onBroadcastTx}
      isDisabled={disabled || isBroadcastingTx || isEstimatingFee}
    >
      {isBroadcastingTx ? "broadcasting tx..." : buttonText}
    </Button>
  );
};
