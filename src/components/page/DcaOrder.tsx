import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";
import { useEffect, useState } from "react";
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

import { POOLS } from "@/utils/pools";
import useBalance from "@/hooks/useBalance";
import { WARP_CONSTANTS } from "@/utils/warpHelpers";
import { useWarpGetAccount } from "@/hooks/useWarpGetAccount";
import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
import { SelectPool } from "@/components/warp/SelectPool";
import { WarpJobs } from "@/components/warp/WarpJobs";
import { CHAIN_ID_PHOENIX_1, getChainIDByNetwork } from "@/utils/network";
import { DENOM_TO_TOKEN_NAME, TOKENS, getTokenDecimals } from "@/utils/token";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpCreateJobAstroportDcaOrder } from "@/components/warp/WarpCreateJobAstroportDcaOrder";
import { LCDClient } from "@terra-money/feather.js";
import {
  DAY_IN_SECONDS,
  DEFAULT_JOB_REWARD_AMOUNT,
  EVICTION_FEE,
  LABEL_ASTROPORT_DCA_ORDER,
} from "@/utils/constants";
import { WarpProtocolFeeBreakdown } from "../warp/WarpProtocolFeeBreakdown";

export const DcaOrderPage = () => {
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
  const [warpJobRewardFee, setWarpJobRewardFee] = useState("0");
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
  const [totalTokenOfferAmount, setTotalTokenOfferAmount] = useState("2");
  const [tokenReturnAmount, setTokenReturnAmount] = useState("0");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");

  const [dcaCount, setDcaCount] = useState(2); // default 2 times
  const [dcaInterval, setDcaInterval] = useState(1); // default 1 day
  // default start DCA order immediately
  const [dcaStartTimestamp, setDcaStartTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );
  const [daysUntilStart, setDaysUntilStart] = useState(0);

  const [maxSpread, setMaxSpread] = useState(1); // default 1%

  useEffect(() => {
    if (wallet.status === "CONNECTED") {
      setLcd(new LCDClient(wallet.network));
    } else {
      setLcd(undefined);
    }
  }, [wallet.status]);

  useEffect(() => {
    if (chainID === CHAIN_ID_PHOENIX_1) {
      // @ts-ignore
      setTokenOffer(TOKENS[chainID]?.axlusdc!);
      // @ts-ignore
      setTokenReturn(TOKENS[chainID]?.native);
      // @ts-ignore
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
    setTokenReturnAmount(
      BigNumber(simulateResult.amount)
        .div(getTokenDecimals(tokenReturn))
        .toString()
    );
  }, [simulateResult, tokenReturn]);

  useEffect(() => {
    setTotalTokenOfferAmount(
      BigNumber(tokenOfferAmount).multipliedBy(dcaCount).toString()
    );
  }, [tokenOfferAmount, dcaCount]);

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

  const onChangeTokenOffer = (updatedTokenOfferAddress: string) => {
    setTokenOffer(updatedTokenOfferAddress);
  };

  const onChangeTokenReturn = (updatedTokenReturnAddress: string) => {
    setTokenReturn(updatedTokenReturnAddress);
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
          chainID={chainID}
          onChangeTokenOffer={onChangeTokenOffer}
          onChangeTokenReturn={onChangeTokenReturn}
          onChangePoolAddress={onChangePoolAddress}
        />
        <Flex align="center" justify="center" direction="row">
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
      <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
        each time swap
        <NumberInput
          defaultValue={tokenOfferBalance.data}
          min={0}
          step={1}
          precision={3}
          onChange={setTokenOfferAmount}
          width={150}
        >
          <NumberInputField style={{ textAlign: "center" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {DENOM_TO_TOKEN_NAME[tokenOffer]} {" to "}
        {DENOM_TO_TOKEN_NAME[tokenReturn]}
      </Flex>
      <Flex style={{ marginTop: "10px" }}>
        <Box>
          current market rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} ={" "}
          {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenOffer]}
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
        In total you will swap {totalTokenOfferAmount}{" "}
        {DENOM_TO_TOKEN_NAME[tokenOffer]} {" to "}
        {DENOM_TO_TOKEN_NAME[tokenReturn]}
        <WarpCreateJobAstroportDcaOrder
          senderAddress={myAddress}
          warpFeeTokenAddress={warpFeeTokenAddress}
          warpControllerAddress={warpControllerAddress}
          warpAccountAddress={warpAccountAddress}
          warpTotalJobFee={warpTotalJobFee}
          poolAddress={poolAddress}
          offerAssetAddress={tokenOffer}
          offerAmount={tokenOfferAmount}
          returnAssetAddress={tokenReturn}
          offerTokenBalance={tokenOfferBalance.data}
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
        warpFeeTokenAddress={warpFeeTokenAddress}
      />
      <WarpJobs
        lcd={lcd}
        chainID={chainID}
        myAddress={myAddress}
        warpControllerAddress={warpControllerAddress}
        warpJobLabel={LABEL_ASTROPORT_DCA_ORDER}
      />
    </Flex>
  );
};
