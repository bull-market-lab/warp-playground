import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useShuttle } from "@delphi-labs/shuttle";
import { useShuttlePortStore } from "@/config/store";
import {
  DEFAULT_TOKEN_DECIMALS,
  DENOM_TO_TOKEN_NAME,
  TOKENS,
} from "@/config/tokens";
import { TERRA_MAINNET, TERRA_TESTNET } from "@/config/networks";
import { POOLS } from "@/config/pools";
import { isMobile } from "@/utils/device";
import useBalance from "@/hooks/useBalance";
import { useSimulateSwap, useSwap } from "@/hooks/useSwap";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import useWallet from "@/hooks/useWallet";
import {
  Select,
  NumberInput,
  NumberInputField,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import { WARP_CONTRACTS } from "@/config/warpContracts";
import {
  useWarpCreateAccount,
  useWarpCreateAstroportLimitOrder,
  useWarpGetAccount,
} from "@/hooks/useWarp";

export default function Home() {
  const { broadcast } = useShuttle();
  const wallet = useWallet();
  const currentNetworkId = useShuttlePortStore(
    (state) => state.currentNetworkId
  );
  const [warpControllerAddress, setWarpControllerAddress] = useState(
    WARP_CONTRACTS[currentNetworkId].warpController
  );
  const [warpAccountAddress, setWarpAccountAddress] = useState("");
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
  const [isCreatingWarpAccount, setIsCreatingWarpAccount] = useState(false);
  const [
    isCreatingWarpJobAstroportLimitSwap,
    setIsCreatingWarpJobAstroportLimitSwap,
  ] = useState(false);

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
    setWarpControllerAddress(WARP_CONTRACTS[currentNetworkId].warpController);
  }, [currentNetworkId]);

  const tokenFromBalance = useBalance(tokenFrom);
  const tokenToBalance = useBalance(tokenTo);

  const simulateResult = useSimulateSwap({
    amount: tokenFromAmount,
    offerAssetAddress: tokenFrom,
    returnAssetAddress: tokenTo,
    poolAddress,
  }).simulateResult.data;

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

  const getWarpAccountAddressResult = useWarpGetAccount({
    warpControllerAddress,
  }).accountResult.data;

  useEffect(() => {
    if (!getWarpAccountAddressResult) {
      return;
    }
    console.log("warpAccountResult", getWarpAccountAddressResult);
    setWarpAccountAddress(getWarpAccountAddressResult.account);
  }, [getWarpAccountAddressResult]);

  const createWarpAccount = useWarpCreateAccount({
    warpControllerAddress,
  });

  const { data: createWarpAccountFeeEstimate } = useFeeEstimate({
    messages: createWarpAccount.msgs,
  });

  const createWarpJobAstroportLimitSwap = useWarpCreateAstroportLimitOrder({
    warpControllerAddress,
  });

  const { data: createWarpJobAstroportLimitSwapFeeEstimate } = useFeeEstimate({
    messages: createWarpJobAstroportLimitSwap.msgs,
  });

  const onCreateWarpAccount = () => {
    setIsCreatingWarpAccount(true);
    broadcast({
      wallet,
      messages: createWarpAccount.msgs,
      feeAmount: createWarpAccountFeeEstimate?.fee?.amount,
      gasLimit: createWarpAccountFeeEstimate?.gasLimit,
      mobile: isMobile(),
    })
      .then((result) => {
        console.log("result", result);
        // setWarpAccountAddress(result.logs[0].events[0].attributes[1].value);
      })
      .catch((error) => {
        console.error("Broadcast error", error);
      })
      .finally(() => {
        setIsCreatingWarpAccount(false);
        // refetch since creating warp account will cost LUNA so change balance
        tokenFromBalance.refetch();
        tokenToBalance.refetch();
      });
  };

  const onLimitSwap = () => {
    setIsCreatingWarpJobAstroportLimitSwap(true);
    broadcast({
      wallet,
      messages: createWarpJobAstroportLimitSwap.msgs,
      feeAmount: createWarpJobAstroportLimitSwapFeeEstimate?.fee?.amount,
      gasLimit: createWarpJobAstroportLimitSwapFeeEstimate?.gasLimit,
      mobile: isMobile(),
    })
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => {
        console.error("Broadcast error", error);
      })
      .finally(() => {
        setIsCreatingWarpJobAstroportLimitSwap(false);
        setTokenFromAmount("0");
        tokenFromBalance.refetch();
        tokenToBalance.refetch();
      });
  };

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
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
    return (
      <main>
        <Flex align="center" justify="center">
          <Box>Please connect wallet</Box>
        </Flex>
      </main>
    );
  }

  if (!warpAccountAddress) {
    return (
      <main>
        <Flex align="center" justify="center">
          <Box>
            <Button
              colorScheme="blue"
              onClick={onCreateWarpAccount}
              isDisabled={
                isCreatingWarpAccount ||
                !(
                  createWarpAccountFeeEstimate &&
                  createWarpAccountFeeEstimate.fee
                )
              }
            >
              {isCreatingWarpAccount ? "processing..." : "create warp account"}
            </Button>
          </Box>
        </Flex>
      </main>
    );
  }

  return (
    <main>
      <Flex align="center" justify="center" direction="column">
        <Box>warp account address {warpAccountAddress}</Box>
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
              <Box>swap</Box>
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
                onClick={onLimitSwap}
                isDisabled={
                  !(
                    createWarpJobAstroportLimitSwapFeeEstimate &&
                    createWarpJobAstroportLimitSwapFeeEstimate.fee
                  ) ||
                  isCreatingWarpJobAstroportLimitSwap ||
                  tokenFromAmount === "0" ||
                  parseInt(tokenFromAmount) > tokenFromBalance.data
                }
              >
                {isCreatingWarpJobAstroportLimitSwap
                  ? "processing..."
                  : "limit swap"}
              </Button>
            </Flex>
            {createWarpJobAstroportLimitSwapFeeEstimate &&
              createWarpJobAstroportLimitSwapFeeEstimate.fee && (
                <Box>
                  estimate tx fee:{" "}
                  {BigNumber(
                    createWarpJobAstroportLimitSwapFeeEstimate.fee.amount
                  )
                    .div(DEFAULT_TOKEN_DECIMALS || 1)
                    .toString()}{" "}
                  {createWarpJobAstroportLimitSwapFeeEstimate.fee.denom}
                </Box>
              )}
          </>
        )}
      </Flex>
    </main>
  );
}
