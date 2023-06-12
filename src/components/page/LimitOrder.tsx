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
import { useConnectedWallet, useLcdClient } from "@terra-money/wallet-kit";

import { POOLS } from "@/config/pools";
import useBalance from "@/hooks/useBalance";
import { WARP_CONSTANTS } from "@/config/warpContracts";
import { useWarpGetAccount } from "@/hooks/useWarpGetAccount";
import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
import { WarpAccount } from "@/components/warp/WarpAccount";
import { WarpCreateAccount } from "@/components/warp/WarpCreateAccount";
import { SelectPool } from "@/components/warp/SelectPool";
import { WarpJobs } from "@/components/warp/WarpJobs";
import { CHAIN_ID_PHOENIX_1, getChainIDByNetwork } from "@/utils/network";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpCreateJobAstroportLimitOrder } from "@/components/warp/WarpCreateJobAstroportLimitOrder";
import { Swap } from "@/components/warp/Swap";
import { DENOM_TO_TOKEN_NAME, TOKENS, getTokenDecimals } from "@/config/tokens";

export const LimitOrderPage = () => {
  const connectedWallet = useConnectedWallet();
  const lcd = useLcdClient();
  const chainID = getChainIDByNetwork(connectedWallet?.network);
  const myAddress = connectedWallet?.addresses[chainID];

  const [warpAccountAddress, setWarpAccountAddress] = useState("");
  const [warpControllerAddress, setWarpControllerAddress] = useState(
    // @ts-ignore
    WARP_CONSTANTS[chainID].controller
  );
  const [warpFeeTokenAddress, setWarpFeeTokenAddress] = useState(
    // @ts-ignore
    WARP_CONSTANTS[chainID].feeTokenAddress
  );
  const [warpJobCreationFeePercentage, setWarpJobCreationFeePercentage] =
    useState("");

  const [poolAddress, setPoolAddress] = useState(
    // @ts-ignore
    POOLS[chainID]?.axlusdcNative!
  );
  // @ts-ignore
  const [tokenOffer, setTokenOffer] = useState(TOKENS[chainID]?.axlusdc!);
  // @ts-ignore
  const [tokenReturn, setTokenReturn] = useState(TOKENS[chainID]?.native);

  useEffect(() => {
    if (chainID === CHAIN_ID_PHOENIX_1) {
      setTokenOffer(TOKENS[chainID]?.axlusdc!);
      setTokenReturn(TOKENS[chainID]?.native);
      setPoolAddress(POOLS[chainID]?.axlusdcNative!);
    } else {
      // @ts-ignore
      setTokenOffer(TOKENS[chainID]?.astro);
      // @ts-ignore
      setTokenReturn(TOKENS[chainID]?.native);
      // @ts-ignore
      setPoolAddress(POOLS[chainID].astroNative);
    }
    // @ts-ignore
    setWarpControllerAddress(WARP_CONSTANTS[chainID].controller);
    // @ts-ignore
    setWarpFeeTokenAddress(WARP_CONSTANTS[chainID].feeTokenAddress);
  }, [chainID]);

  const tokenOfferBalance = useBalance({
    lcd,
    chainID,
    ownerAddress: myAddress,
    tokenAddress: tokenOffer,
  });
  const tokenReturnBalance = useBalance({
    lcd,
    chainID,
    ownerAddress: myAddress,
    tokenAddress: tokenReturn,
  });

  const getWarpAccountAddressResult = useWarpGetAccount({
    lcd,
    chainID,
    ownerAddress: myAddress,
    warpControllerAddress,
  }).accountResult.data;

  useEffect(() => {
    if (!getWarpAccountAddressResult) {
      return;
    }
    setWarpAccountAddress(getWarpAccountAddressResult.account);
  }, [getWarpAccountAddressResult]);

  const getWarpConfigResult = useWarpGetConfig({
    lcd,
    chainID,
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

  const [tokenOfferAmount, setTokenOfferAmount] = useState("0");
  const [tokenReturnAmount, setTokenReturnAmount] = useState("0");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");
  const [desiredExchangeRate, setDesiredExchangeRate] = useState("1");

  const [expiredAfterDays, setExpiredAfterDays] = useState(1);

  const simulateResult = useSimulateSwap({
    lcd,
    chainID,
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
        .div(getTokenDecimals(tokenReturn))
        .toString()
    );
  }, [simulateResult, tokenReturn, desiredExchangeRate]);

  useEffect(() => {
    if (!desiredExchangeRate) {
      return;
    }
    setTokenReturnAmount(
      BigNumber(tokenOfferAmount).div(desiredExchangeRate).toString()
    );
  }, [desiredExchangeRate, tokenOfferAmount]);

  const onChangeTokenOffer = (updatedTokenOfferAddress: string) => {
    setTokenOffer(updatedTokenOfferAddress);
  };

  const onChangeTokenReturn = (updatedTokenReturnAddress: string) => {
    setTokenReturn(updatedTokenReturnAddress);
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
      {warpAccountAddress ? (
        <WarpAccount warpAccountAddress={warpAccountAddress} />
      ) : (
        <WarpCreateAccount
          senderAddress={myAddress}
          warpControllerAddress={warpControllerAddress}
        />
      )}
      <Flex align="center" justify="center" direction="column">
        <SelectPool
          chainID={chainID}
          onChangeTokenOffer={onChangeTokenOffer}
          onChangeTokenReturn={onChangeTokenReturn}
          onChangePoolAddress={onChangePoolAddress}
        />
        {poolAddress && (
          <Flex align="center" justify="center" direction="column">
            {/* <Box>Pool address: {poolAddress}</Box> */}
            <Box>
              {DENOM_TO_TOKEN_NAME[tokenOffer]} balance:{" "}
              {tokenOfferBalance.data}
            </Box>
            <Box>
              {DENOM_TO_TOKEN_NAME[tokenReturn]} balance:{" "}
              {tokenReturnBalance.data}
            </Box>
          </Flex>
        )}
      </Flex>
      <Swap
        offerAssetAddress={tokenOffer}
        returnAssetAddress={tokenReturn}
        returnAmount={tokenReturnAmount}
        offerTokenBalance={tokenOfferBalance.data}
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
        senderAddress={myAddress}
        warpFeeTokenAddress={warpFeeTokenAddress}
        warpControllerAddress={warpControllerAddress}
        warpAccountAddress={warpAccountAddress}
        warpJobCreationFeePercentage={warpJobCreationFeePercentage}
        poolAddress={poolAddress}
        offerAssetAddress={tokenOffer}
        offerAmount={tokenOfferAmount}
        returnAssetAddress={tokenReturn}
        minimumReturnAmount={tokenReturnAmount}
        offerTokenBalance={tokenOfferBalance.data}
        expiredAfterDays={expiredAfterDays}
      />
      {warpAccountAddress && (
        <WarpJobs
          lcd={lcd}
          chainID={chainID}
          myAddress={myAddress}
          warpControllerAddress={warpControllerAddress}
        />
      )}
    </Flex>
  );
};
