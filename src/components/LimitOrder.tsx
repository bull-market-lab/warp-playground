import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { DENOM_TO_TOKEN_NAME, getTokenDecimals } from "@/config/tokens";
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
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpCreateJobAstroportLimitOrder } from "@/components/WarpCreateJobAstroportLimitOrder";
import { Swap } from "@/components/Swap";
import { WalletConnection } from "@delphi-labs/shuttle";

type LimitOrderProps = {
    wallet: WalletConnection;
    poolAddress: string;
    tokenOffer: string;
    tokenReturn: string;
    tokenOfferBalance: number
    warpAccountAddress: string;
    warpControllerAddress: string;
    warpJobCreationFeePercentage: string;
};

export const LimitOrder = ({
    wallet,
    poolAddress,
    tokenOffer,
    tokenReturn,
    tokenOfferBalance,
    warpAccountAddress,
    warpControllerAddress,
    warpJobCreationFeePercentage
}: LimitOrderProps) => {
  const [tokenOfferAmount, setTokenOfferAmount] = useState("0");
  const [tokenReturnAmount, setTokenReturnAmount] = useState("0");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");
  const [desiredExchangeRate, setDesiredExchangeRate] = useState("1");

  const [expiredAfterDays, setExpiredAfterDays] = useState(1);

  const simulateResult = useSimulateSwap({
    amount: tokenOfferAmount,
    offerAssetAddress: tokenOffer,
    returnAssetAddress: tokenReturn,
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
    setTokenReturnAmount(
      BigNumber(simulateResult.amount)
        .div(getTokenDecimals(wallet.network.defaultCurrency!.coinMinimalDenom))
        .toString()
    );
  }, [simulateResult]);

  useEffect(() => {
    if (!desiredExchangeRate) {
      return;
    }
    setTokenReturnAmount(
      BigNumber(tokenOfferAmount).div(desiredExchangeRate).toString()
    );
  }, [desiredExchangeRate]);

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
      <Swap
        offerAssetAddress={tokenOffer}
        returnAssetAddress={tokenReturn}
        returnAmount={tokenReturnAmount}
        offerTokenBalance={tokenOfferBalance}
        onChangeTokenOfferAmount={setTokenOfferAmount}
      />
      <Flex>
        <Box>at desired rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} =</Box>
        <NumberInput
          value={desiredExchangeRate}
          onChange={handleChangeDesiredExchangeRate}
        >
          <NumberInputField />
        </NumberInput>
        <Box>{DENOM_TO_TOKEN_NAME[tokenOffer]}</Box>
      </Flex>
      <Flex>
        <Box>
          current market rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} ={" "}
          {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenOffer]}
        </Box>
        <Button
          colorScheme="yellow"
          onClick={setDesiredExchangeRateWithMarketRate}
        >
          use market rate
        </Button>
      </Flex>
      <Flex>
        <Box>expire after</Box>
        <NumberInput
          defaultValue={expiredAfterDays}
          min={1}
          onChange={onChangeExpiredAfterDays}
          step={1}
          precision={0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>{expiredAfterDays > 1 ? "days" : "day"}</Box>
      </Flex>
      <WarpCreateJobAstroportLimitOrder
        wallet={wallet}
        warpControllerAddress={warpControllerAddress}
        warpAccountAddress={warpAccountAddress}
        warpJobCreationFeePercentage={warpJobCreationFeePercentage}
        poolAddress={poolAddress}
        offerAssetAddress={tokenOffer}
        offerAmount={tokenOfferAmount}
        returnAssetAddress={tokenReturn}
        minimumReturnAmount={tokenReturnAmount}
        offerTokenBalance={tokenOfferBalance}
        expiredAfterDays={expiredAfterDays}
      />
    </Flex>
  );
};
