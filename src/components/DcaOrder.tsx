import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { DENOM_TO_TOKEN_NAME, getTokenDecimals } from "@/config/tokens";
import {
  NumberInput,
  NumberInputField,
  Flex,
  Box,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpCreateJobAstroportDcaOrder } from "@/components/WarpCreateJobAstroportDcaOrder";
import { Swap } from "@/components/Swap";
import { WalletConnection } from "@delphi-labs/shuttle";

type DcaOrderProps = {
  wallet: WalletConnection;
  poolAddress: string;
  tokenOffer: string;
  tokenReturn: string;
  tokenOfferBalance: number;
  warpAccountAddress: string;
  warpControllerAddress: string;
  warpJobCreationFeePercentage: string;
};

export const DcaOrder = ({
  wallet,
  poolAddress,
  tokenOffer,
  tokenReturn,
  tokenOfferBalance,
  warpAccountAddress,
  warpControllerAddress,
  warpJobCreationFeePercentage,
}: DcaOrderProps) => {
  const [tokenOfferAmount, setTokenOfferAmount] = useState("0");
  const [tokenReturnAmount, setTokenReturnAmount] = useState("0");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");

  const [dcaCount, setDcaCount] = useState(2); // default 2 times
  const [dcaInterval, setDcaInterval] = useState(1); // default 1 day
  // default start DCA order immediately
  const [dcaStartTimestamp, setDcaStartTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );
  const [maxSpread, setMaxSpread] = useState(1); // default 1%

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
    setTokenReturnAmount(
      BigNumber(simulateResult.amount)
        .div(getTokenDecimals(wallet.network.defaultCurrency!.coinMinimalDenom))
        .toString()
    );
  }, [simulateResult]);

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
    <Flex align="center" justify="center" direction="column">
      <Swap
        offerAssetAddress={tokenOffer}
        returnAssetAddress={tokenReturn}
        returnAmount={tokenReturnAmount}
        offerTokenBalance={tokenOfferBalance}
        onChangeTokenOfferAmount={setTokenOfferAmount}
        isDcaOrder={true}
      />
      <Flex>
        <Box>
          current market rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} ={" "}
          {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenOffer]}
        </Box>
      </Flex>
      <Flex>
        <Box>run </Box>
        <NumberInput
          defaultValue={dcaCount}
          min={2}
          onChange={onChangeDcaCount}
          step={1}
          precision={0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>times</Box>
      </Flex>
      <Flex>
        <Box>run every</Box>
        <NumberInput
          defaultValue={dcaInterval}
          min={1}
          onChange={onChangeDcaInterval}
          step={1}
          precision={0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>{dcaInterval > 1 ? "days" : "day"}</Box>
      </Flex>
      <Flex>
        <Box>max spread</Box>
        <NumberInput
          defaultValue={maxSpread}
          min={0.01}
          max={100}
          onChange={onChangeMaxSpread}
          step={0.01}
          precision={2}
        >
          <NumberInputField />
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
      <WarpCreateJobAstroportDcaOrder
        wallet={wallet}
        warpControllerAddress={warpControllerAddress}
        warpAccountAddress={warpAccountAddress}
        warpJobCreationFeePercentage={warpJobCreationFeePercentage}
        poolAddress={poolAddress}
        offerAssetAddress={tokenOffer}
        offerAmount={tokenOfferAmount}
        returnAssetAddress={tokenReturn}
        offerTokenBalance={tokenOfferBalance}
        dcaCount={dcaCount}
        dcaInterval={dcaInterval}
        dcaStartTimestamp={dcaStartTimestamp}
        maxSpread={(maxSpread / 100).toString()}
      />
    </Flex>
  );
};
