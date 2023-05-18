import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { MsgExecuteContract, useShuttle } from "@delphi-labs/shuttle";

import { useShuttlePortStore } from "@/config/store";
import {
  DEFAULT_TOKEN_DECIMALS,
  DENOM_TO_TOKEN_NAME,
  TOKENS,
} from "@/config/tokens";
import {
  TERRA_MAINNET,
  TERRA_TESTNET,
} from "@/config/networks";
import { POOLS } from "@/config/pools";
import { isMobile } from "@/utils/device";
import useBalance from "@/hooks/useBalance";
import { useSimulateSwap, useSwap } from "@/hooks/useSwap";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import useWallet from "@/hooks/useWallet";
import { Swap } from "@/components/swap";
import {
  Select,
  NumberInput,
  NumberInputField,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";

export default function Home() {
  const { broadcast } = useShuttle();
  const wallet = useWallet();
  const currentNetworkId = useShuttlePortStore(
    (state) => state.currentNetworkId
  );
  const [poolAddress, setPoolAddress] = useState(
    POOLS[currentNetworkId]?.axlusdcNative!
  );
  const [tokenFrom, setTokenFrom] = useState(
    TOKENS[currentNetworkId]?.axlusdc!
  );
  const [tokenTo, setTokenTo] = useState(TOKENS[currentNetworkId]?.native);
  const [tokenFromAmount, setTokenFromAmount] = useState("0");
  const [marketExchangeRate, setMarketExchangeRate] = useState("1");
  const [desiredExchangeRate, setDesiredExchangeRate] = useState("1");
  const [tokenToAmount, setTokenToAmount] = useState("0");
  const [isSwapping, setIsSwapping] = useState(false);

  const tokenFromBalance = useBalance(tokenFrom);
  const tokenToBalance = useBalance(tokenTo);

  const swap = useSwap({
    amount: tokenFromAmount,
    exchangeRate: marketExchangeRate,
    offerAssetAddress: tokenFrom,
    returnAssetAddress: tokenTo,
    poolAddress,
  });

  const { data: swapFeeEstimate } = useFeeEstimate({
    messages: swap.msgs,
  });

  const simulateResult = useSimulateSwap({
    amount: tokenFromAmount,
    offerAssetAddress: tokenFrom,
    returnAssetAddress: tokenTo,
    poolAddress,
  }).simulate.data;

  useEffect(() => {
    if (!simulateResult) {
      return;
    }
    console.log("simulateResult", simulateResult);
    setMarketExchangeRate(simulateResult.beliefPrice);
    // only set desired exchange rate if it's not set by user
    if (desiredExchangeRate === "1") {
      setDesiredExchangeRate(simulateResult.beliefPrice);
    }
    setTokenToAmount(simulateResult.amount);
  }, [simulateResult]);

  useEffect(() => {
    if (currentNetworkId === TERRA_MAINNET.chainId) {
      setTokenFrom(TOKENS[currentNetworkId]?.axlusdc!);
      setTokenTo(TOKENS[currentNetworkId]?.native);
      setPoolAddress(POOLS[currentNetworkId]?.axlusdcNative!);
    } else if (currentNetworkId === TERRA_TESTNET.chainId) {
      setTokenFrom(TOKENS[currentNetworkId]?.astro);
      setTokenTo(TOKENS[currentNetworkId]?.native);
      setPoolAddress(POOLS[currentNetworkId].astroNative);
    }
  }, [currentNetworkId]);

  const onSubmit = () => {
    setIsSwapping(true);
    broadcast({
      wallet,
      messages: swap.msgs,
      feeAmount: swapFeeEstimate?.fee?.amount,
      gasLimit: swapFeeEstimate?.gasLimit,
      mobile: isMobile(),
    })
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => {
        console.error("Broadcast error", error);
      })
      .finally(() => {
        setIsSwapping(false);
        setTokenFromAmount("0");
        tokenFromBalance.refetch();
        tokenToBalance.refetch();
      });
  };

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    console.log("selectedOption", selectedOption);

    if (currentNetworkId === TERRA_MAINNET.chainId) {
      if (selectedOption === "option1") {
        setTokenFrom(TOKENS[currentNetworkId]?.axlusdc!);
        setTokenTo(TOKENS[currentNetworkId]?.native);
        setPoolAddress(POOLS[currentNetworkId]?.axlusdcNative!);
      } else if (selectedOption === "option2") {
        setTokenFrom(TOKENS[currentNetworkId]?.native);
        setTokenTo(TOKENS[currentNetworkId]?.axlusdc!);
        setPoolAddress(POOLS[currentNetworkId].axlusdcNative!);
      } else if (selectedOption === "option3") {
        setTokenFrom(TOKENS[currentNetworkId]?.axlusdc!);
        setTokenTo(TOKENS[currentNetworkId]?.astro);
        setPoolAddress(POOLS[currentNetworkId].axlusdcAstro!);
      } else if (selectedOption === "option4") {
        setTokenFrom(TOKENS[currentNetworkId]?.astro);
        setTokenTo(TOKENS[currentNetworkId]?.axlusdc!);
        setPoolAddress(POOLS[currentNetworkId].axlusdcAstro!);
      }
    } else if (currentNetworkId === TERRA_TESTNET.chainId) {
      if (selectedOption === "option1") {
        setTokenFrom(TOKENS[currentNetworkId]?.astro);
        setTokenTo(TOKENS[currentNetworkId]?.native);
        setPoolAddress(POOLS[currentNetworkId].astroNative);
      } else if (selectedOption === "option2") {
        setTokenFrom(TOKENS[currentNetworkId]?.native);
        setTokenTo(TOKENS[currentNetworkId]?.astro);
        setPoolAddress(POOLS[currentNetworkId].astroNative);
      }
    }
  };

  const handleChangeDesiredExchangeRate = (newRate: string) => {
    setDesiredExchangeRate(newRate);
    setTokenToAmount(BigNumber(tokenFromAmount).dividedBy(newRate).toString());
  };

  const setDesiredExchangeRateWithMarketRate = () => {
    setDesiredExchangeRate(marketExchangeRate);
    setTokenToAmount(simulateResult!.amount);
  };

  if (!wallet) {
    return <main>Please connect wallet</main>;
  }

  return (
    <main>
      {/* <Swap/> */}
      {currentNetworkId === TERRA_MAINNET.chainId && (
        <Select
          placeholder=""
          onChange={handleSelectChange}
          defaultValue="option1"
        >
          <option value="option1">buy LUNA with axlUSDC</option>
          <option value="option2">sell LUNA to axlUSDC</option>
          <option value="option3">buy ASTRO with axlUSDC</option>
          <option value="option4">sell ASTRO to axlUSDC</option>
        </Select>
      )}
      {currentNetworkId === TERRA_TESTNET.chainId && (
        <Select
          placeholder=""
          onChange={handleSelectChange}
          defaultValue="option1"
        >
          <option value="option1">buy LUNA with ASTRO</option>
          <option value="option2">sell LUNA to ASTRO</option>
        </Select>
      )}
      {poolAddress && (
        <>
          {/* <Box>Pool address: {poolAddress}</Box> */}
          <Box>
            {DENOM_TO_TOKEN_NAME[tokenFrom]} balance: {tokenFromBalance.data}
          </Box>
          <Box>
            {DENOM_TO_TOKEN_NAME[tokenTo]} balance: {tokenToBalance.data}
          </Box>
          <Flex>
            <Box>Swap</Box>
            <NumberInput
              defaultValue={tokenFromBalance.data}
              min={0}
              // max={tokenFromBalance.data}
              onChange={setTokenFromAmount}
            >
              <NumberInputField />
            </NumberInput>
            <Box>{DENOM_TO_TOKEN_NAME[tokenFrom]} to</Box>
            <NumberInput value={tokenToAmount}>
              <NumberInputField disabled={true} />
            </NumberInput>
            <Box>{DENOM_TO_TOKEN_NAME[tokenTo]}</Box>
          </Flex>
          <Flex>
            <Box>at desired rate 1 {DENOM_TO_TOKEN_NAME[tokenTo]} =</Box>
            <NumberInput
              value={desiredExchangeRate}
              onChange={handleChangeDesiredExchangeRate}
            >
              <NumberInputField />
            </NumberInput>
            <Box>{DENOM_TO_TOKEN_NAME[tokenFrom]}</Box>
          </Flex>
          <Flex>
            <Box>
              market rate 1 {DENOM_TO_TOKEN_NAME[tokenTo]} ={" "}
              {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenFrom]}
            </Box>
          </Flex>
          <Flex>
            <Button
              colorScheme="yellow"
              onClick={setDesiredExchangeRateWithMarketRate}
            >
              use market rate
            </Button>
            <Button
              colorScheme="blue"
              onClick={onSubmit}
              isDisabled={
                !(swapFeeEstimate && swapFeeEstimate.fee) ||
                isSwapping ||
                tokenFromAmount === "0" ||
                parseInt(tokenFromAmount) > tokenFromBalance.data
              }
            >
              {isSwapping ? "Processing..." : "Swap"}
            </Button>
          </Flex>
          {swapFeeEstimate && swapFeeEstimate.fee && (
            <p>
              Fee:{" "}
              {BigNumber(swapFeeEstimate.fee.amount)
                .div(DEFAULT_TOKEN_DECIMALS || 1)
                .toString()}{" "}
              {swapFeeEstimate.fee.denom}
            </p>
          )}
        </>
      )}
    </main>
  );
}
