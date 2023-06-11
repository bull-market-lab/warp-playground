// import { useEffect, useState } from "react";
// import { useShuttlePortStore } from "@/config/store";
// import { DENOM_TO_TOKEN_NAME, TOKENS } from "@/config/tokens";
// import { TERRA_MAINNET, TERRA_TESTNET } from "@/config/networks";
// import { POOLS } from "@/config/pools";
// import useBalance from "@/hooks/useBalance";
// import useWallet from "@/hooks/useWallet";
// import { Flex, Box } from "@chakra-ui/react";
// import { WARP_CONTRACTS } from "@/config/warpContracts";
// import { useWarpGetAccount } from "@/hooks/useWarpGetAccount";
// import { useWarpGetConfig } from "@/hooks/useWarpGetConfig";
// import { WarpAccount } from "@/components/warp/WarpAccount";
// import { WarpCreateAccount } from "@/components/warp/WarpCreateAccount";
// import { SelectPool } from "@/components/warp/SelectPool";
// import { WarpJobs } from "@/components/warp/WarpJobs";
// import { UsageWarning } from "@/components/warp/UsageWarning";
// import { LimitOrder } from "@/components/warp/LimitOrder";
// import { DcaOrder } from "@/components/warp/DcaOrder";
import Head from "next/head";
import MySteak from "@/components/common/MySteak";

export default function Home() {
  // const wallet = useWallet();
  // const currentNetworkId = useShuttlePortStore(
  //   (state) => state.currentNetworkId
  // );
  // const [warpAccountAddress, setWarpAccountAddress] = useState("");
  // const [warpControllerAddress, setWarpControllerAddress] = useState(
  //   WARP_CONTRACTS[currentNetworkId].warpController
  // );
  // const [warpJobCreationFeePercentage, setWarpJobCreationFeePercentage] =
  //   useState("");

  // const [poolAddress, setPoolAddress] = useState(
  //   POOLS[currentNetworkId]?.axlusdcNative!
  // );

  // const [tokenOffer, setTokenOffer] = useState(
  //   TOKENS[currentNetworkId]?.axlusdc!
  // );
  // const [tokenReturn, setTokenReturn] = useState(
  //   TOKENS[currentNetworkId]?.native
  // );

  // useEffect(() => {
  //   if (currentNetworkId === TERRA_MAINNET.chainId) {
  //     setTokenOffer(TOKENS[currentNetworkId]?.axlusdc!);
  //     setTokenReturn(TOKENS[currentNetworkId]?.native);
  //     setPoolAddress(POOLS[currentNetworkId]?.axlusdcNative!);
  //   } else if (currentNetworkId === TERRA_TESTNET.chainId) {
  //     setTokenOffer(TOKENS[currentNetworkId]?.astro);
  //     setTokenReturn(TOKENS[currentNetworkId]?.native);
  //     setPoolAddress(POOLS[currentNetworkId].astroNative);
  //   }
  //   setWarpControllerAddress(WARP_CONTRACTS[currentNetworkId].warpController);
  // }, [currentNetworkId]);

  // const tokenOfferBalance = useBalance(tokenOffer);
  // const tokenReturnBalance = useBalance(tokenReturn);

  // const getWarpAccountAddressResult = useWarpGetAccount({
  //   warpControllerAddress,
  // }).accountResult.data;

  // useEffect(() => {
  //   if (!getWarpAccountAddressResult) {
  //     return;
  //   }
  //   setWarpAccountAddress(getWarpAccountAddressResult.account);
  // }, [getWarpAccountAddressResult]);

  // const getWarpConfigResult = useWarpGetConfig({
  //   warpControllerAddress,
  // }).configResult.data;

  // useEffect(() => {
  //   if (!getWarpConfigResult) {
  //     return;
  //   }
  //   setWarpJobCreationFeePercentage(
  //     getWarpConfigResult.config.creation_fee_percentage
  //   );
  // }, [getWarpConfigResult]);

  // const onChangeTokenOffer = (updatedTokenOfferAddress: string) => {
  //   setTokenOffer(updatedTokenOfferAddress);
  // };

  // const onChangeTokenReturn = (updatedTokenReturnAddress: string) => {
  //   setTokenReturn(updatedTokenReturnAddress);
  // };

  // const onChangePoolAddress = (updatedPoolAddress: string) => {
  //   setPoolAddress(updatedPoolAddress);
  // };

  return (
    // <main>
    //   <Flex>
    //     <UsageWarning />
    //   </Flex>
    //   {!wallet && (
    //     <Flex align="center" justify="center">
    //       <Box>Please connect wallet</Box>
    //     </Flex>
    //   )}
    //   {warpAccountAddress ? (
    //     <WarpAccount warpAccountAddress={warpAccountAddress} />
    //   ) : (
    //     <WarpCreateAccount
    //       wallet={wallet}
    //       warpControllerAddress={warpControllerAddress}
    //     />
    //   )}
    //   <Flex align="center" justify="center" direction="column">
    //     <SelectPool
    //       currentNetworkId={currentNetworkId}
    //       onChangeTokenOffer={onChangeTokenOffer}
    //       onChangeTokenReturn={onChangeTokenReturn}
    //       onChangePoolAddress={onChangePoolAddress}
    //     />
    //     {poolAddress && (
    //       <Flex align="center" justify="center" direction="column">
    //         {/* <Box>Pool address: {poolAddress}</Box> */}
    //         <Box>
    //           {DENOM_TO_TOKEN_NAME[tokenOffer]} balance:{" "}
    //           {tokenOfferBalance.data}
    //         </Box>
    //         <Box>
    //           {DENOM_TO_TOKEN_NAME[tokenReturn]} balance:{" "}
    //           {tokenReturnBalance.data}
    //         </Box>
    //         <LimitOrder
    //           wallet={wallet}
    //           poolAddress={poolAddress}
    //           tokenOffer={tokenOffer}
    //           tokenReturn={tokenReturn}
    //           tokenOfferBalance={tokenOfferBalance.data}
    //           warpAccountAddress={warpAccountAddress}
    //           warpControllerAddress={warpControllerAddress}
    //           warpJobCreationFeePercentage={warpJobCreationFeePercentage}
    //         />
    //         <DcaOrder
    //           wallet={wallet}
    //           poolAddress={poolAddress}
    //           tokenOffer={tokenOffer}
    //           tokenReturn={tokenReturn}
    //           tokenOfferBalance={tokenOfferBalance.data}
    //           warpAccountAddress={warpAccountAddress}
    //           warpControllerAddress={warpControllerAddress}
    //           warpJobCreationFeePercentage={warpJobCreationFeePercentage}
    //         />
    //       </Flex>
    //     )}
    //   </Flex>
    //   {warpAccountAddress && (
    //     <WarpJobs
    //       wallet={wallet}
    //       warpControllerAddress={warpControllerAddress}
    //     />
    //   )}
    // </main>
    <>
    <Head>
      <title>Steak | My Steak</title>
    </Head>
    <MySteak />
    {/* <UnbondQueue /> */}
  </>
  );
}
