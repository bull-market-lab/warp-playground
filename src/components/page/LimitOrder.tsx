"use client";

import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import {
  NumberInput,
  NumberInputField,
  Flex,
  Box,
  Button,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import useBalance from "@/hooks/query/useBalance";
import useWarpGetConfig from "@/hooks/query/useWarpGetConfig";
import SelectPool from "@/components/swap/SelectPool";
import WarpJobs from "@/components/warp/WarpJobs";
import useSimulateSwap from "@/hooks/query/useAstroportSimulateSwapFromPool";
import WarpCreateJobAstroportLimitOrder from "@/components/warp/WarpCreateJobAstroportLimitOrder";
import Swap from "@/components/swap/Swap";
import { getTokenDecimals } from "@/utils/token";
import {
  DEFAULT_JOB_REWARD_AMOUNT,
  EVICTION_FEE,
  LABEL_LIMIT_ORDER,
  LABEL_YIELD_BEARING_LIMIT_ORDER,
  Token,
} from "@/utils/constants";
import { WarpProtocolFeeBreakdown } from "../warp/WarpProtocolFeeBreakdown";
import useMyWallet from "@/hooks/useMyWallet";
import WarpAccount from "../warp/WarpAccount";

export const LimitOrderPage = () => {
  const { currentChainConfig } = useMyWallet();

  const [warpJobCreationFeePercentage, setWarpJobCreationFeePercentage] =
    useState("5");

  const [warpJobCreationFee, setWarpJobCreationFee] = useState("0");
  const [warpJobEvictionFee, setWarpJobEvictionFee] = useState("0");
  const [warpJobRewardFee, setWarpJobRewardFee] = useState(
    BigNumber(DEFAULT_JOB_REWARD_AMOUNT).toString()
  );
  const [warpTotalJobFee, setWarpTotalJobFee] = useState("0");

  const [poolAddress, setPoolAddress] = useState(
    currentChainConfig.pools[0].address
  );
  const [offerToken, setOfferToken] = useState<Token>(
    currentChainConfig.pools[0].token1
  );
  const [returnToken, setReturnToken] = useState<Token>(
    currentChainConfig.pools[0].token2
  );

  const [offerTokenAmount, setOfferTokenAmount] = useState("1");
  const [returnTokenAmount, setReturnTokenAmount] = useState("1");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");
  const [desiredExchangeRate, setDesiredExchangeRate] = useState("1");

  const [expiredAfterDays, setExpiredAfterDays] = useState(1);

  useEffect(() => {
    setOfferTokenAmount("1");
    setReturnTokenAmount("1");
    setMarketExchangeRate("1");
    setDesiredExchangeRate("1");
    setExpiredAfterDays(1);
    setPoolAddress(currentChainConfig.pools[0].address);
    setOfferToken(currentChainConfig.pools[0].token1);
    setReturnToken(currentChainConfig.pools[0].token2);
  }, [currentChainConfig]);

  const offerTokenBalance = useBalance({
    tokenAddress: offerToken.address,
  });
  const returnTokenBalance = useBalance({
    tokenAddress: returnToken.address,
  });

  const getWarpConfigResult = useWarpGetConfig().configResult.data;

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
    if (desiredExchangeRate === "1") {
      setDesiredExchangeRate(simulateResult.beliefPrice);
    }
    setReturnTokenAmount(
      BigNumber(simulateResult.amount)
        .div(getTokenDecimals(returnToken.address))
        .toString()
    );
  }, [simulateResult, returnToken, desiredExchangeRate]);

  useEffect(() => {
    if (!desiredExchangeRate) {
      return;
    }
    setReturnTokenAmount(
      BigNumber(offerTokenAmount).div(desiredExchangeRate).toString()
    );
  }, [desiredExchangeRate, offerTokenAmount]);

  useEffect(() => {
    setWarpJobCreationFee(
      BigNumber(warpJobRewardFee)
        .times(BigNumber(warpJobCreationFeePercentage).div(100))
        .toString()
    );
  }, [warpJobRewardFee, warpJobCreationFeePercentage]);

  useEffect(() => {
    setWarpJobEvictionFee(
      BigNumber(EVICTION_FEE).times(expiredAfterDays).toString()
    );
  }, [expiredAfterDays]);

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

  const handleChangeDesiredExchangeRate = (newRate: string) => {
    setDesiredExchangeRate(newRate);
  };

  const setDesiredExchangeRateWithMarketRate = () => {
    setDesiredExchangeRate(marketExchangeRate);
  };

  const onChangeExpiredAfterDays = (updatedExpiredAfterDays: string) => {
    setExpiredAfterDays(Number(updatedExpiredAfterDays));
  };

  return (
    <Flex align="center" justify="center" direction="column">
      <WarpAccount />
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
        <Flex
          align="center"
          justify="center"
          direction="row"
          style={{ marginTop: "10px" }}
        >
          <Box style={{ marginRight: "20px" }}>
            {offerToken.name} balance: {offerTokenBalance.data}
          </Box>
          <Box>
            {returnToken.name} balance: {returnTokenBalance.data}
          </Box>
        </Flex>
      </Flex>
      <Swap
        offerToken={offerToken}
        returnToken={returnToken}
        returnTokenAmount={returnTokenAmount}
        offerTokenBalance={offerTokenBalance.data}
        onChangeOfferTokenAmount={setOfferTokenAmount}
      />
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>at desired rate 1 {returnToken.name} =</Box>
        <NumberInput
          width={150}
          value={desiredExchangeRate}
          onChange={handleChangeDesiredExchangeRate}
        >
          <NumberInputField style={{ textAlign: "center" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>{offerToken.name}</Box>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>
          current market rate 1 {returnToken.name} = {marketExchangeRate}{" "}
          {offerToken.name}{" "}
        </Box>
        <Button
          colorScheme="yellow"
          onClick={setDesiredExchangeRateWithMarketRate}
        >
          use market rate
        </Button>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>expire after</Box>
        <NumberInput
          defaultValue={expiredAfterDays}
          min={1}
          onChange={onChangeExpiredAfterDays}
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
        <Box>{expiredAfterDays > 1 ? "days " : "day "}</Box>
      </Flex>
      <WarpCreateJobAstroportLimitOrder
        warpTotalJobFee={warpTotalJobFee}
        poolAddress={poolAddress}
        offerToken={offerToken}
        offerTokenAmount={offerTokenAmount}
        returnToken={returnToken}
        minimumReturnTokenAmount={returnTokenAmount}
        offerTokenBalance={offerTokenBalance.data}
        expiredAfterDays={expiredAfterDays}
      />
      <WarpProtocolFeeBreakdown
        warpJobCreationFee={warpJobCreationFee}
        warpJobEvictionFee={warpJobEvictionFee}
        warpJobRewardFee={warpJobRewardFee}
        warpTotalJobFee={warpTotalJobFee}
      />
      <WarpJobs
        warpJobLabels={[LABEL_LIMIT_ORDER, LABEL_YIELD_BEARING_LIMIT_ORDER]}
      />
    </Flex>
  );
};
