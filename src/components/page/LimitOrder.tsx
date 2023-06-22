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
import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";

import { POOLS } from "@/utils/pools";
import useBalance from "@/hooks/useBalance";
import { WARP_CONSTANTS } from "@/utils/warpHelpers";
import { useWarpGetAccount } from "@/hooks/useWarpGetAccount";
import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
import { SelectPool } from "@/components/warp/SelectPool";
import { WarpJobs } from "@/components/warp/WarpJobs";
import { CHAIN_ID_PHOENIX_1, getChainIDByNetwork } from "@/utils/network";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpCreateJobAstroportLimitOrder } from "@/components/warp/WarpCreateJobAstroportLimitOrder";
import { Swap } from "@/components/warp/Swap";
import { DENOM_TO_TOKEN_NAME, TOKENS, getTokenDecimals } from "@/utils/token";
import { LCDClient } from "@terra-money/feather.js";
import { DEFAULT_JOB_REWARD_AMOUNT, EVICTION_FEE, LABEL_ASTROPORT_LIMIT_ORDER } from "@/utils/constants";
import { WarpProtocolFeeBreakdown } from "../warp/WarpProtocolFeeBreakdown";

export const LimitOrderPage = () => {
  const wallet = useWallet();
  const connectedWallet = useConnectedWallet();
  const chainID = getChainIDByNetwork(connectedWallet?.network);
  const myAddress = connectedWallet?.addresses[chainID] || "";

  const [lcd, setLcd] = useState<LCDClient>();

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
    useState("5");

  const [warpJobCreationFee, setWarpJobCreationFee] = useState("0");
  const [warpJobEvictionFee, setWarpJobEvictionFee] = useState("0");
  const [warpJobRewardFee, setWarpJobRewardFee] = useState(
    BigNumber(DEFAULT_JOB_REWARD_AMOUNT).toString()
  );
  const [warpTotalJobFee, setWarpTotalJobFee] = useState("0");

  const [poolAddress, setPoolAddress] = useState(
    // @ts-ignore
    POOLS[chainID]?.axlusdcNative!
  );
  // @ts-ignore
  const [tokenOffer, setTokenOffer] = useState(TOKENS[chainID]?.axlusdc!);
  // @ts-ignore
  const [tokenReturn, setTokenReturn] = useState(TOKENS[chainID]?.native);

  const [tokenOfferAmount, setTokenOfferAmount] = useState("1");
  const [tokenReturnAmount, setTokenReturnAmount] = useState("1");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");
  const [desiredExchangeRate, setDesiredExchangeRate] = useState("1");

  const [expiredAfterDays, setExpiredAfterDays] = useState(1);

  useEffect(() => {
    if (wallet.status === "CONNECTED") {
      setLcd(new LCDClient(wallet.network));
    } else {
      setLcd(undefined);
    }
  }, [wallet.status]);

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
      <Flex
        align="center"
        justify="center"
        direction="column"
        style={{ marginTop: "10px" }}
      >
        <SelectPool
          chainID={chainID}
          onChangeTokenOffer={onChangeTokenOffer}
          onChangeTokenReturn={onChangeTokenReturn}
          onChangePoolAddress={onChangePoolAddress}
        />
        <Flex
          align="center"
          justify="center"
          direction="row"
          style={{ marginTop: "10px" }}
        >
          {/* <Box>Pool address: {poolAddress}</Box> */}
          <Box style={{ marginRight: "20px" }}>
            {DENOM_TO_TOKEN_NAME[tokenOffer]} balance: {tokenOfferBalance.data}
          </Box>
          <Box>
            {DENOM_TO_TOKEN_NAME[tokenReturn]} balance:{" "}
            {tokenReturnBalance.data}
          </Box>
        </Flex>
      </Flex>
      <Swap
        offerAssetAddress={tokenOffer}
        returnAssetAddress={tokenReturn}
        returnAmount={tokenReturnAmount}
        offerTokenBalance={tokenOfferBalance.data}
        onChangeTokenOfferAmount={setTokenOfferAmount}
      />
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>at desired rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} =</Box>
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
        <Box>{DENOM_TO_TOKEN_NAME[tokenOffer]}</Box>
      </Flex>
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        <Box>
          current market rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} ={" "}
          {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenOffer]}{" "}
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
        <WarpCreateJobAstroportLimitOrder
          senderAddress={myAddress}
          warpFeeTokenAddress={warpFeeTokenAddress}
          warpControllerAddress={warpControllerAddress}
          warpAccountAddress={warpAccountAddress}
          warpTotalJobFee={warpTotalJobFee}
          poolAddress={poolAddress}
          offerAssetAddress={tokenOffer}
          offerAmount={tokenOfferAmount}
          returnAssetAddress={tokenReturn}
          minimumReturnAmount={tokenReturnAmount}
          offerTokenBalance={tokenOfferBalance.data}
          expiredAfterDays={expiredAfterDays}
        />
      </Flex>
      <WarpProtocolFeeBreakdown
        warpJobCreationFee={warpJobCreationFee}
        warpJobEvictionFee={warpJobEvictionFee}
        warpJobRewardFee={warpJobRewardFee}
        warpTotalJobFee={warpTotalJobFee}
        warpFeeTokenAddress={warpFeeTokenAddress}
      />
      <WarpJobs
        lcd={lcd}
        chainID={chainID}
        myAddress={myAddress}
        warpControllerAddress={warpControllerAddress}
        warpJobLabel={LABEL_ASTROPORT_LIMIT_ORDER}
      />
    </Flex>
  );
};
