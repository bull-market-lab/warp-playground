// import { useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useShuttle } from "@delphi-labs/shuttle-react";

// import {
//   CHAIN_ID_PISCO_ONE,
//   CHAIN_ID_UNSUPPORTED,
//   CHAIN_NEUTRON,
//   CHAIN_ID_PION_ONE,
//   Chain,
//   ChainID,
//   CHAIN_TERRA,
//   ChainConfig,
//   TERRA_TESTNET_CHAIN_CONFIG,
//   NEUTRON_TESTNET_CHAIN_CONFIG,
// } from "@/utils/constants";
// import ChainContext from "@/contexts/ShuttleWalletChainContext";
// import { LCDClient } from "@terra-money/feather.js";
// import { DEFAULT_LCD_CONFIG } from "@/utils/network";

// const ChainContextProvider = ({ children }: { children: React.ReactNode }) => {
//   const params = useSearchParams();
//   const selectedChain = params.get("chain")?.toLowerCase() ?? CHAIN_TERRA;

//   const [currentChain, setCurrentChain] = useState<Chain>(
//     selectedChain === CHAIN_TERRA ? CHAIN_TERRA : CHAIN_NEUTRON
//     // : selectedChain === CHAIN_NEUTRON
//     // ? CHAIN_NEUTRON
//     // : CHAIN_OSMOSIS
//   );
//   const [currentChainId, setCurrentChainId] = useState<ChainID>(
//     selectedChain === CHAIN_TERRA ? CHAIN_ID_PISCO_ONE : CHAIN_ID_PION_ONE
//     // : selectedChain === CHAIN_NEUTRON
//     // ? CHAIN_ID_PION_ONE
//     // : CHAIN_ID_OSMO_TEST_FIVE
//   );
//   const [currentChainConfig, setCurrentChainConfig] = useState<ChainConfig>(
//     TERRA_TESTNET_CHAIN_CONFIG
//   );
//   const [myAddress, setMyAddress] = useState<string>();

//   const { getWallets } = useShuttle();
//   const connectedWallets = getWallets({ chainId: currentChainId });

//   // update current chain when selected chain in router parameter changes
//   useEffect(() => {
//     setCurrentChain(selectedChain as Chain);
//   }, [selectedChain]);

//   // update my address when current chain or connected wallet changed
//   useEffect(() => {
//     let updatedWalletAddress = myAddress;
//     if (connectedWallets.length > 0) {
//       updatedWalletAddress = connectedWallets[0].account.address;
//     }
//     setMyAddress(updatedWalletAddress);
//   }, [currentChain, currentChainId, connectedWallets]);

//   /*
//   update current chain id when current chain or current network changes
//   rule:
//     if chain is terra
//         if network is mainnet -> chain id is phoenix one
//         else if network is testnet -> chain id is pisco one
//         else chain id is unsupported
//     else if chain is neutron
//         if network is mainnet -> chain id is neutron one
//         else if network is testnet -> chain id is pion one
//         else chain id is unsupported
//     else chain id is unsupported
//   */
//   useEffect(() => {
//     let updatedChainId: ChainID = currentChainId;
//     switch (currentChain) {
//       case CHAIN_TERRA:
//         updatedChainId = CHAIN_ID_PISCO_ONE;
//         break;
//       case CHAIN_NEUTRON:
//         updatedChainId = CHAIN_ID_PION_ONE;
//         break;
//       // case CHAIN_OSMOSIS:
//       //   updatedChainId = CHAIN_ID_OSMO_TEST_FIVE;
//       //   break;
//       default:
//         updatedChainId = CHAIN_ID_UNSUPPORTED;
//         break;
//     }
//     setCurrentChainId(updatedChainId);
//   }, [currentChain, connectedWallets]);

//   // update chain config when current chain changes
//   useEffect(() => {
//     let updatedChainConfig: ChainConfig = currentChainConfig;
//     if (currentChain === CHAIN_TERRA) {
//       updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
//     } else if (currentChain === CHAIN_NEUTRON) {
//       updatedChainConfig = NEUTRON_TESTNET_CHAIN_CONFIG;
//       // } else if (currentChain == CHAIN_OSMOSIS) {
//       //   updatedChainConfig = OSMOSIS_TESTNET_CHAIN_CONFIG;
//     } else {
//       // default to terra testnet config
//       updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
//     }
//     setCurrentChainConfig(updatedChainConfig);
//     console.log(
//       `current chain changed to ${currentChain}, update chain config to ${JSON.stringify(
//         updatedChainConfig,
//         null,
//         2
//       )}`
//     );
//   }, [currentChain]);

//   return (
//     <ChainContext.Provider
//       value={{
//         currentChain,
//         currentChainId,
//         currentChainConfig,
//         lcd: new LCDClient(DEFAULT_LCD_CONFIG),
//         myAddress,
//       }}
//     >
//       {children}
//     </ChainContext.Provider>
//   );
// };

// export default ChainContextProvider;
