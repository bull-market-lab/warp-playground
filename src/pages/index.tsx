import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useShuttlePortStore } from "@/config/store";
import { DENOM_TO_TOKEN_NAME, TOKENS, getTokenDecimals } from "@/config/tokens";
import { TERRA_MAINNET, TERRA_TESTNET } from "@/config/networks";
import { POOLS } from "@/config/pools";
import useBalance from "@/hooks/useBalance";
import useWallet from "@/hooks/useWallet";
import {
  NumberInput,
  NumberInputField,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import { WARP_CONTRACTS } from "@/config/warpContracts";
import { useWarpGetAccount } from "@/hooks/useWarpGetAccount";
import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
import { useSimulateSwap } from "@/hooks/useAstroportSimulateSwapFromPool";
import { WarpAccount } from "@/components/WarpAccount";
import { WarpCreateJobAstroportLimitSwap } from "@/components/WarpCreateJobAstroportLimitSwap";
import { WarpAccountCreation } from "@/components/WarpAccountCreation";
import { Swap } from "@/components/Swap";
import { SelectPool } from "@/components/SelectPool";
import { WarpJobs } from "@/components/WarpJobs";

export default function Home() {
  const wallet = useWallet();
  const currentNetworkId = useShuttlePortStore(
    (state) => state.currentNetworkId
  );
  const [warpAccountAddress, setWarpAccountAddress] = useState("");
  const [warpControllerAddress, setWarpControllerAddress] = useState(
    WARP_CONTRACTS[currentNetworkId].warpController
  );
  const [warpJobCreationFeePercentage, setWarpJobCreationFeePercentage] =
    useState("");

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
    setWarpAccountAddress(getWarpAccountAddressResult.account);
  }, [getWarpAccountAddressResult]);

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

  const handleChangeDesiredExchangeRate = (newRate: string) => {
    setDesiredExchangeRate(newRate);
  };

  const setDesiredExchangeRateWithMarketRate = () => {
    setDesiredExchangeRate(marketExchangeRate);
  };

  const refetchTokenBalance = () => {
    tokenOfferBalance.refetch();
    tokenReturnBalance.refetch();
  };

  const resetOfferAmount = () => {
    setTokenOfferAmount("0");
  };

  const onChangeTokenOffer = (updatedTokenOfferAddress: string) => {
    setTokenOffer(updatedTokenOfferAddress);
  };

  const onChangeTokenReturn = (updatedTokenReturnAddress: string) => {
    setTokenReturn(updatedTokenReturnAddress);
  };

  const onChangePoolAddress = (updatedPoolAddress: string) => {
    setPoolAddress(updatedPoolAddress);
  };

  return (
    <main>
      {!wallet && (
        <Flex align="center" justify="center">
          <Box>Please connect wallet</Box>
        </Flex>
      )}
      {warpAccountAddress ? (
        <WarpAccount warpAccountAddress={warpAccountAddress} />
      ) : (
        <WarpAccountCreation
          wallet={wallet}
          warpControllerAddress={warpControllerAddress}
          refetchTokenBalance={refetchTokenBalance}
        />
      )}
      <Flex align="center" justify="center" direction="column">
        <SelectPool
          currentNetworkId={currentNetworkId}
          onChangeTokenOffer={onChangeTokenOffer}
          onChangeTokenReturn={onChangeTokenReturn}
          onChangePoolAddress={onChangePoolAddress}
        />
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
                market rate 1 {DENOM_TO_TOKEN_NAME[tokenReturn]} ={" "}
                {marketExchangeRate} {DENOM_TO_TOKEN_NAME[tokenOffer]}
              </Box>
              <Button
                colorScheme="yellow"
                onClick={setDesiredExchangeRateWithMarketRate}
              >
                use market rate
              </Button>
            </Flex>
            <WarpCreateJobAstroportLimitSwap
              wallet={wallet}
              warpControllerAddress={warpControllerAddress}
              warpAccountAddress={warpAccountAddress}
              warpJobCreationFeePercentage={warpJobCreationFeePercentage}
              poolAddress={poolAddress}
              offerAssetAddress={tokenOffer}
              offerAmount={tokenOfferAmount}
              returnAssetAddress={tokenReturn}
              minimumReturnAmount={tokenReturnAmount}
              offerTokenBalance={tokenOfferBalance.data}
              resetOfferAmount={resetOfferAmount}
              refetchTokenBalance={refetchTokenBalance}
            />
          </>
        )}
      </Flex>
      {warpAccountAddress && (
        <WarpJobs warpControllerAddress={warpControllerAddress} />
      )}
    </main>
  );
}
