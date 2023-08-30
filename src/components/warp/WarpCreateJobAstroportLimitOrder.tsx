import useWarpCreateJobAstroportLimitOrder from "@/hooks/static/useWarpCreateJobAstroportLimitOrder";
import { CHAIN_NEUTRON, Token } from "@/utils/constants";
import CreateAndBroadcastTxModal from "../tx/CreateAndBroadcastTxModal";
import useWarpCreateJobAstroportYieldBearingLimitOrderNativeTokenOnly from "@/hooks/static/useWarpCreateJobAstroportYieldBearingLimitOrderNativeTokenOnly";
import { Checkbox, Flex } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import useMyWallet from "@/hooks/useMyWallet";
import { Msg } from "@terra-money/feather.js";

type WarpCreateJobAstroportLimitOrderProps = {
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
  warpTotalJobFee,
  poolAddress,
  offerToken,
  offerTokenAmount,
  returnToken,
  minimumReturnTokenAmount,
  offerTokenBalance,
  expiredAfterDays,
}: WarpCreateJobAstroportLimitOrderProps) => {
  const { currentChain } = useMyWallet();
  const yieldBearingLimitOrderMsgs =
    useWarpCreateJobAstroportYieldBearingLimitOrderNativeTokenOnly({
      warpTotalJobFee,
      poolAddress,
      offerTokenAmount,
      minimumReturnTokenAmount,
      offerToken,
      returnToken,
      expiredAfterDays,
    }).msgs;
  const limitOrderMsgs = useWarpCreateJobAstroportLimitOrder({
    warpTotalJobFee,
    poolAddress,
    offerTokenAmount,
    minimumReturnTokenAmount,
    offerToken,
    returnToken,
    expiredAfterDays,
  }).msgs;
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const [enableYieldBearing, setEnableYieldBearing] = useState(
    currentChain === CHAIN_NEUTRON
  );

  const onChangeCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    setEnableYieldBearing(e.target.checked);
  };

  useEffect(() => {
    if (enableYieldBearing) {
      setMsgs(yieldBearingLimitOrderMsgs);
    } else {
      setMsgs(limitOrderMsgs);
    }
  }, [enableYieldBearing, yieldBearingLimitOrderMsgs, limitOrderMsgs]);

  return (
    <Flex>
      {currentChain === CHAIN_NEUTRON && (
        <Checkbox
          defaultChecked={enableYieldBearing}
          onChange={onChangeCheckBox}
        >
          enable yield bearing limit order (only support native token)
        </Checkbox>
      )}
      <CreateAndBroadcastTxModal
        // msgs={msgs}
        msgs={limitOrderMsgs}
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
