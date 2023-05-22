import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useShuttle } from "@delphi-labs/shuttle";
import { useShuttlePortStore } from "@/config/store";
import { DENOM_TO_TOKEN_NAME, TOKENS, getTokenDecimals } from "@/config/tokens";
import { TERRA_MAINNET, TERRA_TESTNET } from "@/config/networks";
import { POOLS } from "@/config/pools";
import { isMobile } from "@/utils/device";
import useBalance from "@/hooks/useBalance";
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
import { useWarpGetAccount } from "@/hooks/useWarpGetAccount";
import { useWarpCreateAccount } from "@/hooks/useWarpCreateAccount";
import { useWarpCreateJobAstroportLimitSwap } from "@/hooks/useWarpCreateJobAstroportLimitSwap";
import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { useWarpGetJobs } from "@/hooks/useWarpGetJobs";

export default function Home() {
  const { broadcast } = useShuttle();
  const wallet = useWallet();
  const currentNetworkId = useShuttlePortStore(
    (state) => state.currentNetworkId
  );

  const [warpControllerAddress, setWarpControllerAddress] = useState(
    WARP_CONTRACTS[currentNetworkId].warpController
  );
  const [warpJobCreationFeePercentage, setWarpJobCreationFeePercentage] =
    useState("");

  const [warpPendingJobs, setWarpPendingJobs] = useState([]);
  const [warpPendingJobCount, setWarpPendingJobCount] = useState(0);

  const [warpFinishedJobs, setWarpFinishedJobs] = useState([]);
  const [warpFinishedJobCount, setWarpFinishedJobCount] = useState(0);

  const [warpAccountAddress, setWarpAccountAddress] = useState("");

  const [poolAddress, setPoolAddress] = useState(
    POOLS[currentNetworkId]?.axlusdcNative!
  );

  const [tokenOffer, setTokenOffer] = useState(
    TOKENS[currentNetworkId]?.axlusdc!
  );
  const [tokenReturn, setTokenReturn] = useState(
    TOKENS[currentNetworkId]?.native
  );
  const [tokenOfferAmount, setTokenOfferAmount] = useState("0");
  const [tokenReturnAmount, setTokenReturnAmount] = useState("0");

  const [marketExchangeRate, setMarketExchangeRate] = useState("1");
  const [desiredExchangeRate, setDesiredExchangeRate] = useState("1");

  const [isCreatingWarpAccount, setIsCreatingWarpAccount] = useState(false);
  const [
    isCreatingWarpJobAstroportLimitSwap,
    setIsCreatingWarpJobAstroportLimitSwap,
  ] = useState(false);

  useEffect(() => {
    if (currentNetworkId === TERRA_MAINNET.chainId) {
      setTokenOffer(TOKENS[currentNetworkId]?.axlusdc!);
      setTokenReturn(TOKENS[currentNetworkId]?.native);
      setPoolAddress(POOLS[currentNetworkId]?.axlusdcNative!);
    } else if (currentNetworkId === TERRA_TESTNET.chainId) {
      setTokenOffer(TOKENS[currentNetworkId]?.astro);
      setTokenReturn(TOKENS[currentNetworkId]?.native);
      setPoolAddress(POOLS[currentNetworkId].astroNative);
    }
    setWarpControllerAddress(WARP_CONTRACTS[currentNetworkId].warpController);
  }, [currentNetworkId]);

  const tokenOfferBalance = useBalance(tokenOffer);
  const tokenReturnBalance = useBalance(tokenReturn);

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
    console.log("simulateResult", simulateResult);
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

  const getWarpConfigResult = useWarpGetConfig({
    warpControllerAddress,
  }).configResult.data;

  useEffect(() => {
    if (!getWarpConfigResult) {
      return;
    }
    console.log("warpConfigResult", getWarpConfigResult);
    setWarpJobCreationFeePercentage(
      getWarpConfigResult.config.creation_fee_percentage
    );
  }, [getWarpConfigResult]);

  const getWarpPendingJobsResult = useWarpGetJobs({
    warpControllerAddress,
    isPending: true,
  }).jobsResult.data;

  useEffect(() => {
    if (!getWarpPendingJobsResult) {
      return;
    }
    console.log("warpPendingJobsResult", getWarpPendingJobsResult);
    setWarpPendingJobCount(getWarpPendingJobsResult.totalCount);
    setWarpPendingJobs(getWarpPendingJobsResult.jobs);
  }, [getWarpPendingJobsResult]);

  const getWarpFinishedJobsResult = useWarpGetJobs({
    warpControllerAddress,
    isPending: true,
  }).jobsResult.data;

  useEffect(() => {
    if (!getWarpFinishedJobsResult) {
      return;
    }
    console.log("warpFinishedJobsResult", getWarpFinishedJobsResult);
    setWarpFinishedJobCount(getWarpFinishedJobsResult.totalCount);
    setWarpFinishedJobs(getWarpFinishedJobsResult.jobs);
  }, [getWarpFinishedJobsResult]);

  const createWarpAccount = useWarpCreateAccount({
    warpControllerAddress,
  });

  const { data: createWarpAccountFeeEstimate } = useFeeEstimate({
    messages: createWarpAccount.msgs,
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
        tokenOfferBalance.refetch();
        tokenReturnBalance.refetch();
      });
  };

  const createWarpJobAstroportLimitSwap = useWarpCreateJobAstroportLimitSwap({
    warpControllerAddress,
    warpAccountAddress,
    warpJobCreationFeePercentage,
    poolAddress,
    offerAmount: tokenOfferAmount,
    minimumReturnAmount: tokenReturnAmount,
    offerAssetAddress: tokenOffer,
    returnAssetAddress: tokenReturn,
  });

  const { data: createWarpJobAstroportLimitSwapFeeEstimate } = useFeeEstimate({
    messages: createWarpJobAstroportLimitSwap.msgs,
  });

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
        setTokenOfferAmount("0");
        tokenOfferBalance.refetch();
        tokenReturnBalance.refetch();
      });
  };

  const handleSelectChange = (event: any) => {
    const selectedOption = event.target.value;
    if (currentNetworkId === TERRA_MAINNET.chainId) {
      if (selectedOption === "option1") {
        setTokenOffer(TOKENS[currentNetworkId]?.axlusdc!);
        setTokenReturn(TOKENS[currentNetworkId]?.native);
        setPoolAddress(POOLS[currentNetworkId]?.axlusdcNative!);
      } else if (selectedOption === "option2") {
        setTokenOffer(TOKENS[currentNetworkId]?.native);
        setTokenReturn(TOKENS[currentNetworkId]?.axlusdc!);
        setPoolAddress(POOLS[currentNetworkId].axlusdcNative!);
      } else if (selectedOption === "option3") {
        setTokenOffer(TOKENS[currentNetworkId]?.axlusdc!);
        setTokenReturn(TOKENS[currentNetworkId]?.astro);
        setPoolAddress(POOLS[currentNetworkId].axlusdcAstro!);
      } else if (selectedOption === "option4") {
        setTokenOffer(TOKENS[currentNetworkId]?.astro);
        setTokenReturn(TOKENS[currentNetworkId]?.axlusdc!);
        setPoolAddress(POOLS[currentNetworkId].axlusdcAstro!);
      }
    } else if (currentNetworkId === TERRA_TESTNET.chainId) {
      if (selectedOption === "option1") {
        setTokenOffer(TOKENS[currentNetworkId]?.astro);
        setTokenReturn(TOKENS[currentNetworkId]?.native);
        setPoolAddress(POOLS[currentNetworkId].astroNative);
      } else if (selectedOption === "option2") {
        setTokenOffer(TOKENS[currentNetworkId]?.native);
        setTokenReturn(TOKENS[currentNetworkId]?.astro);
        setPoolAddress(POOLS[currentNetworkId].astroNative);
      }
    }
  };

  const handleChangeDesiredExchangeRate = (newRate: string) => {
    setDesiredExchangeRate(newRate);
  };

  const setDesiredExchangeRateWithMarketRate = () => {
    setDesiredExchangeRate(marketExchangeRate);
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

  return (
    <main>
      <Flex align="center" justify="center" direction="column">
        <Box>
          warp account address:{" "}
          {warpAccountAddress ||
            "not exist, please create a warp account first"}
        </Box>
        {currentNetworkId === TERRA_MAINNET.chainId && (
          <Select
            width="250px"
            placeholder=""
            onChange={handleSelectChange}
            defaultValue="option1"
          >
            <option value="option1">swap axlUSDC to LUNA</option>
            <option value="option2">swap LUNA to axlUSDC</option>
            <option value="option3">swap axlUSDC to ASTRO</option>
            <option value="option4">swap ASTRO to axlUSDC</option>
          </Select>
        )}
        {currentNetworkId === TERRA_TESTNET.chainId && (
          <Select
            width="250px"
            placeholder=""
            onChange={handleSelectChange}
            defaultValue="option1"
          >
            <option value="option1">swap ASTRO to LUNA </option>
            <option value="option2">swap LUNA to ASTRO</option>
          </Select>
        )}
        {poolAddress && (
          <>
            {/* <Box>Pool address: {poolAddress}</Box> */}
            <Box>
              {DENOM_TO_TOKEN_NAME[tokenOffer]} balance:{" "}
              {tokenOfferBalance.data}
            </Box>
            <Box>
              {DENOM_TO_TOKEN_NAME[tokenReturn]} balance:{" "}
              {tokenReturnBalance.data}
            </Box>
            <Flex>
              <Box>
                Note: limit swap will expire after a day, im working on making
                it live longer
              </Box>
            </Flex>
            <Flex>
              <Box>swap</Box>
              <NumberInput
                defaultValue={tokenOfferBalance.data}
                min={0}
                // max={tokenOfferBalance.data}
                onChange={setTokenOfferAmount}
              >
                <NumberInputField />
              </NumberInput>
              <Box>{DENOM_TO_TOKEN_NAME[tokenOffer]} to</Box>
              <NumberInput value={tokenReturnAmount}>
                <NumberInputField disabled={true} />
              </NumberInput>
              <Box>{DENOM_TO_TOKEN_NAME[tokenReturn]}</Box>
            </Flex>
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
                market rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} ={" "}
                {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenOffer]}
              </Box>
            </Flex>
            <Flex>
              {!warpAccountAddress && (
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
                  {isCreatingWarpAccount
                    ? "processing..."
                    : "create warp account"}
                </Button>
              )}
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
                  tokenOfferAmount === "0" ||
                  parseInt(tokenOfferAmount) > tokenOfferBalance.data
                }
              >
                {isCreatingWarpJobAstroportLimitSwap
                  ? "processing..."
                  : "limit swap"}
              </Button>
            </Flex>
            <Flex>
              {createWarpAccountFeeEstimate &&
                createWarpAccountFeeEstimate.fee && (
                  <Box>
                    estimate tx fee to create warp account:{" "}
                    {BigNumber(createWarpAccountFeeEstimate.fee.amount)
                      .div(
                        getTokenDecimals(
                          wallet.network.defaultCurrency!.coinMinimalDenom
                        )
                      )
                      .toString()}{" "}
                    {createWarpAccountFeeEstimate.fee.denom
                      .substring(1)
                      .toUpperCase()}
                  </Box>
                )}
              {createWarpJobAstroportLimitSwapFeeEstimate &&
                createWarpJobAstroportLimitSwapFeeEstimate.fee && (
                  <Box>
                    estimate tx fee to create limit swap:{" "}
                    {BigNumber(
                      createWarpJobAstroportLimitSwapFeeEstimate.fee.amount
                    )
                      .div(
                        getTokenDecimals(
                          wallet.network.defaultCurrency!.coinMinimalDenom
                        )
                      )
                      .toString()}{" "}
                    {createWarpJobAstroportLimitSwapFeeEstimate.fee.denom
                      .substring(1)
                      .toUpperCase()}
                  </Box>
                )}
            </Flex>
          </>
        )}
      </Flex>
    </main>
  );
}
