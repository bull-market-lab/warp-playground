"use client";

import { useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import {
  NumberInput,
  NumberInputField,
  Flex,
  Box,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import useBalance from "@/hooks/useBalance";
import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
import { SelectPool } from "@/components/warp/SelectPool";
import { WarpJobs } from "@/components/warp/WarpJobs";
import { getTokenDecimals } from "@/utils/token";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpCreateJobAstroportDcaOrder } from "@/components/warp/WarpCreateJobAstroportDcaOrder";
import {
  DAY_IN_SECONDS,
  DEFAULT_JOB_REWARD_AMOUNT,
  EVICTION_FEE,
  LABEL_ASTROPORT_DCA_ORDER,
  Token,
} from "@/utils/constants";
import { WarpProtocolFeeBreakdown } from "../warp/WarpProtocolFeeBreakdown";
import ChainContext from "@/contexts/ChainContext";

export const DcaOrderPage = () => {
  const { chainConfig, myAddress } = useContext(ChainContext);

  const warpControllerAddress = chainConfig.warp.controllerAddress;
  const warpFeeToken = chainConfig.warp.feeToken;

  const [warpJobCreationFeePercentage, setWarpJobCreationFeePercentage] =
    useState("5");

  const [warpJobCreationFee, setWarpJobCreationFee] = useState("0");
  const [warpJobEvictionFee, setWarpJobEvictionFee] = useState("0");
  const [warpJobRewardFee, setWarpJobRewardFee] = useState("0");
  const [warpTotalJobFee, setWarpTotalJobFee] = useState("0");

  const [poolAddress, setPoolAddress] = useState(chainConfig.pools[0].address);
  const [offerToken, setOfferToken] = useState<Token>(
    chainConfig.pools[0].token1
  );
  const [returnToken, setReturnToken] = useState<Token>(
    chainConfig.pools[0].token2
  );

  const [offerTokenAmount, setOfferTokenAmount] = useState("1");
  const [totalOfferTokenAmount, setTotalOfferTokenAmount] = useState("2");
  const [returnTokenAmount, setReturnTokenAmount] = useState("0");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");

  const [dcaCount, setDcaCount] = useState(2); // default 2 times
  const [dcaInterval, setDcaInterval] = useState(1); // default 1 day
  // default start DCA order immediately
  const [dcaStartTimestamp, setDcaStartTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );
  const [daysUntilStart, setDaysUntilStart] = useState(0);

  const [maxSpread, setMaxSpread] = useState(1); // default 1%

  const offerTokenBalance = useBalance({
    ownerAddress: myAddress,
    tokenAddress: offerToken.address,
  });
  const returnTokenBalance = useBalance({
    ownerAddress: myAddress,
    tokenAddress: returnToken.address,
  });

  const getWarpConfigResult = useWarpGetConfig({
    warpControllerAddress,
  }).configResult.data;

  useEffect(() => {
    if (!getWarpConfigResult) {
      return;
    }
    setWarpJobCreationFeePercentage(
      getWarpConfigResult.config.creation_fee_percentage
    );
  }, [getWarpConfigResult]);

  const simulateResult = useSimulateSwap({
    amount: offerTokenAmount,
    offerTokenAddress: offerToken.address,
    returnTokenAddress: returnToken.address,
    poolAddress,
  }).simulateResult.data;

  useEffect(() => {
    if (!simulateResult) {
      return;
    }
    setMarketExchangeRate(simulateResult.beliefPrice);
    // only set desired exchange rate if it's not set by user
    setReturnTokenAmount(
      BigNumber(simulateResult.amount)
        .div(getTokenDecimals(returnToken.address))
        .toString()
    );
  }, [simulateResult, returnToken]);

  useEffect(() => {
    setTotalOfferTokenAmount(
      BigNumber(offerTokenAmount).multipliedBy(dcaCount).toString()
    );
  }, [offerTokenAmount, dcaCount]);

  useEffect(() => {
    setDaysUntilStart(
      Math.ceil((dcaStartTimestamp - Date.now() / 1000) / DAY_IN_SECONDS)
    );
  }, [dcaStartTimestamp]);

  useEffect(() => {
    setWarpJobRewardFee(
      BigNumber(DEFAULT_JOB_REWARD_AMOUNT).times(dcaCount).toString()
    );
  }, [dcaCount]);

  useEffect(() => {
    setWarpJobCreationFee(
      BigNumber(warpJobRewardFee)
        .times(BigNumber(warpJobCreationFeePercentage).div(100))
        .toString()
    );
  }, [warpJobRewardFee, warpJobCreationFeePercentage]);

  useEffect(() => {
    setWarpJobEvictionFee(
      BigNumber(EVICTION_FEE)
        .times(BigNumber(dcaInterval).times(dcaCount).plus(daysUntilStart))
        .toString()
    );
  }, [daysUntilStart, dcaInterval, dcaCount]);

  useEffect(() => {
    setWarpTotalJobFee(
      BigNumber(warpJobCreationFee)
        .plus(BigNumber(warpJobEvictionFee))
        .plus(BigNumber(warpJobRewardFee))
        .toString()
    );
  }, [warpJobCreationFee, warpJobEvictionFee, warpJobRewardFee]);

  const onChangeOfferToken = (updatedOfferToken: Token) => {
    setOfferToken(updatedOfferToken);
  };

  const onChangeReturnToken = (updatedReturnToken: Token) => {
    setReturnToken(updatedReturnToken);
  };

  const onChangePoolAddress = (updatedPoolAddress: string) => {
    setPoolAddress(updatedPoolAddress);
  };

  const onChangeDcaCount = (updatedDcaCount: string) => {
    setDcaCount(Number(updatedDcaCount));
  };

  const onChangeDcaInterval = (updatedDcaInterval: string) => {
    setDcaInterval(Number(updatedDcaInterval));
  };

  const onChangeMaxSpread = (updatedMaxSpread: string) => {
    setMaxSpread(Number(updatedMaxSpread));
  };

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      style={{ marginTop: "10px" }}
    >
      <Flex
        align="center"
        justify="center"
        direction="column"
        style={{ marginTop: "10px" }}
      >
        <SelectPool
          onChangeOfferToken={onChangeOfferToken}
          onChangeReturnToken={onChangeReturnToken}
          onChangePoolAddress={onChangePoolAddress}
        />
        <Flex align="center" justify="center" direction="row">
          <Box style={{ marginRight: "20px" }}>
            {offerToken.name} balance: {offerTokenBalance.data}
          </Box>
          <Box>
            {returnToken.name} balance: {returnTokenBalance.data}
          </Box>
        </Flex>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        each time swap
        <NumberInput
          defaultValue={offerTokenBalance.data}
          min={0}
          step={1}
          precision={3}
          onChange={setOfferTokenAmount}
          width={150}
        >
          <NumberInputField style={{ textAlign: "center" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {offerToken.name} to {returnToken.name}
      </Flex>
      <Flex style={{ marginTop: "10px" }}>
        <Box>
          current market rate 1 {returnToken.name} = {marketExchangeRate}{" "}
          {offerToken.name}
        </Box>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>total swap </Box>
        <NumberInput
          defaultValue={dcaCount}
          min={2}
          onChange={onChangeDcaCount}
          step={1}
          precision={0}
          width={150}
        >
          <NumberInputField style={{ textAlign: "center" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>times</Box>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>swap every</Box>
        <NumberInput
          defaultValue={dcaInterval}
          min={1}
          onChange={onChangeDcaInterval}
          step={1}
          precision={0}
          width={150}
        >
          <NumberInputField style={{ textAlign: "center" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>{dcaInterval > 1 ? "days" : "day"}</Box>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>max spread</Box>
        <NumberInput
          defaultValue={maxSpread}
          min={0.01}
          max={100}
          onChange={onChangeMaxSpread}
          step={0.01}
          precision={2}
          width={150}
        >
          <NumberInputField style={{ textAlign: "center" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>{"%"}</Box>
      </Flex>
      {/* <Flex>
        <DatePicker selected={selectedDate} onChange={handleDateChange} />
        <Flex justifyContent="space-between" mt={2}>
          <Text>
            {selectedDate
              ? `Selected Date: ${selectedDate.toLocaleDateString()}`
              : "No date selected"}
          </Text>
          {selectedDate && (
            <Button variant="link" color="blue.500" onClick={handleClearDate}>
              Clear
            </Button>
          )}
        </Flex>
      </Flex> */}
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        In total you will swap {totalOfferTokenAmount} {offerToken.name} to{" "}
        {returnToken.name}
        <WarpCreateJobAstroportDcaOrder
          senderAddress={myAddress}
          warpFeeTokenAddress={warpFeeToken.address}
          warpControllerAddress={warpControllerAddress}
          warpTotalJobFee={warpTotalJobFee}
          poolAddress={poolAddress}
          offerToken={offerToken}
          offerTokenAmount={offerTokenAmount}
          returnToken={returnToken}
          offerTokenBalance={offerTokenBalance.data}
          dcaCount={dcaCount}
          dcaInterval={dcaInterval}
          dcaStartTimestamp={dcaStartTimestamp}
          maxSpread={(maxSpread / 100).toString()}
        />
      </Flex>
      <WarpProtocolFeeBreakdown
        warpJobCreationFee={warpJobCreationFee}
        warpJobEvictionFee={warpJobEvictionFee}
        warpJobRewardFee={warpJobRewardFee}
        warpTotalJobFee={warpTotalJobFee}
        warpFeeToken={warpFeeToken}
      />
      <WarpJobs
        myAddress={myAddress}
        warpControllerAddress={warpControllerAddress}
        warpJobLabel={LABEL_ASTROPORT_DCA_ORDER}
      />
    </Flex>
  );
};
