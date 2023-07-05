import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";
import { useSearchParams } from "next/navigation";
import { LCDClient } from "@terra-money/feather.js";
import React, { useEffect, useState } from "react";

import {
  CHAIN_ID_PISCO_ONE,
  CHAIN_ID_UNSUPPORTED,
  ChainConfig,
  NETWORK_MAINNET,
  NETWORK_TESTNET,
  NEUTRON_MAINNET_CHAIN_CONFIG,
  NEUTRON_TESTNET_CHAIN_CONFIG,
  TERRA_MAINNET_CHAIN_CONFIG,
  TERRA_TESTNET_CHAIN_CONFIG,
} from "@/utils/constants";
import { CHAIN_NEUTRON } from "@/utils/constants";
import { CHAIN_ID_PHOENIX_ONE } from "@/utils/constants";
import { CHAIN_ID_NEUTRON_ONE } from "@/utils/constants";
import { CHAIN_ID_PION_ONE } from "@/utils/constants";
import { Chain } from "@/utils/constants";
import { ChainID } from "@/utils/constants";
import { CHAIN_TERRA } from "@/utils/constants";
import ChainContext from "@/contexts/ChainContext";

const ChainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const selectedChain = params.get("chain")?.toLowerCase() ?? CHAIN_TERRA;

  const [currentChain, setCurrentChain] = useState<Chain>(
    selectedChain === CHAIN_TERRA ? CHAIN_TERRA : CHAIN_NEUTRON
  );
  //   const [currentNetwork, setCurrentNetwork] =
  //     useState<Network>(NETWORK_MAINNET);
  const [currentChainId, setCurrentChainId] = useState<ChainID>(
    selectedChain === CHAIN_TERRA ? CHAIN_ID_PHOENIX_ONE : CHAIN_ID_NEUTRON_ONE
  );
  const [chainConfig, setChainConfig] = useState<ChainConfig>(
    TERRA_MAINNET_CHAIN_CONFIG
  );
  const [lcd, setLCD] = useState<LCDClient>();
  const [myAddress, setMyAddress] = useState<string>();

  const connectedWallet = useConnectedWallet();
  // network actually means LCDConfig instead of testnet or mainnet
  const { status, network: lcdConfig } = useWallet();

  // update current chain when selected chain in router parameter changes
  useEffect(() => {
    setCurrentChain(selectedChain as Chain);
    console.log(
      `selected chain changed to ${selectedChain}, update current chain to ${selectedChain}`
    );
  }, [selectedChain]);

  // update lcd when wallet connection status or lcd config changed
  // e.g. when user first connect wallet, or switch network
  useEffect(() => {
    switch (status) {
      case "CONNECTED":
        setLCD(new LCDClient(lcdConfig));
        break;
      case "NOT_CONNECTED":
        setLCD(undefined);
        break;
      default:
        setLCD(undefined);
        break;
    }
    console.log(
      `wallet connection status changed to ${status} lcd config changed to ${JSON.stringify(
        lcdConfig,
        null,
        2
      )}, update lcd`
    );
  }, [status, lcdConfig, connectedWallet]);

  // update my address when current chain or connected wallet changed
  useEffect(() => {
    let updatedWalletAddress = myAddress;
    if (connectedWallet?.addresses) {
      updatedWalletAddress = connectedWallet?.addresses[currentChainId];
    }
    setMyAddress(updatedWalletAddress);
    console.log(
      `current chain changed to ${currentChain}, current chain id changed to ${currentChainId}, connected wallet changed to ${JSON.stringify(
        connectedWallet?.addresses,
        null,
        2
      )}, update my address to ${updatedWalletAddress}`
    );
  }, [currentChain, currentChainId, connectedWallet]);

  //   // update current network when connected wallet's network changed
  //   useEffect(() => {
  //     let updatedNetwork: Network = currentNetwork;
  //     if (connectedWallet && connectedWallet?.network) {
  //       if (!isValidNetwork(connectedWallet?.network)) {
  //         alert(
  //           `Invalid network ${connectedWallet?.network} selected. Please check your wallet settings.`
  //         );
  //       } else {
  //         updatedNetwork = connectedWallet?.network as Network;
  //       }
  //     }
  //     setCurrentNetwork(updatedNetwork);
  //     console.log(
  //       `wallet connected network changed to ${updatedNetwork}, update current network to ${updatedNetwork}`
  //     );
  //   }, [connectedWallet]);

  /* 
  update current chain id when current chain or current network changes
  rule:
    if chain is terra
        if network is mainnet -> chain id is phoenix one
        else if network is testnet -> chain id is pisco one
        else chain id is unsupported
    else if chain is neutron
        if network is mainnet -> chain id is neutron one
        else if network is testnet -> chain id is pion one
        else chain id is unsupported
    else chain id is unsupported
  */
  useEffect(() => {
    let updatedChainId: ChainID = currentChainId;
    switch (currentChain) {
      case CHAIN_TERRA:
        updatedChainId =
          connectedWallet?.network === NETWORK_MAINNET
            ? CHAIN_ID_PHOENIX_ONE
            : connectedWallet?.network === NETWORK_TESTNET
            ? CHAIN_ID_PISCO_ONE
            : CHAIN_ID_UNSUPPORTED;
        break;
      case CHAIN_NEUTRON:
        updatedChainId =
          connectedWallet?.network === NETWORK_MAINNET
            ? CHAIN_ID_NEUTRON_ONE
            : connectedWallet?.network === NETWORK_TESTNET
            ? CHAIN_ID_PION_ONE
            : CHAIN_ID_UNSUPPORTED;
        break;
      default:
        updatedChainId = CHAIN_ID_UNSUPPORTED;
        break;
    }
    setCurrentChainId(updatedChainId);
    console.log(
      `current chain changed to ${currentChain}, current network changed to ${connectedWallet?.network}, update current chain id to ${updatedChainId}`
    );
  }, [currentChain, connectedWallet]);

  // update chain config when connected wallet's network changes or current chain id changes
  useEffect(() => {
    let updatedChainConfig: ChainConfig = chainConfig;
    if (currentChain === CHAIN_TERRA) {
      if (connectedWallet?.network === NETWORK_MAINNET) {
        updatedChainConfig = TERRA_MAINNET_CHAIN_CONFIG;
      } else if (connectedWallet?.network === NETWORK_TESTNET) {
        updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
      } else {
        // default to mainnet config
        updatedChainConfig = TERRA_MAINNET_CHAIN_CONFIG;
      }
    } else if (currentChain === CHAIN_NEUTRON) {
      if (connectedWallet?.network === NETWORK_MAINNET) {
        updatedChainConfig = NEUTRON_MAINNET_CHAIN_CONFIG;
      } else if (connectedWallet?.network === NETWORK_TESTNET) {
        updatedChainConfig = NEUTRON_TESTNET_CHAIN_CONFIG;
      } else {
        // default to mainnet config
        updatedChainConfig = NEUTRON_MAINNET_CHAIN_CONFIG;
      }
    } else {
      // default to terra mainnet config
      updatedChainConfig = TERRA_MAINNET_CHAIN_CONFIG;
    }
    setChainConfig(updatedChainConfig);
    console.log(
      `current chain changed to ${currentChain}, update chain config to ${JSON.stringify(
        updatedChainConfig,
        null,
        2
      )}`
    );
  }, [currentChain, connectedWallet]);

  return (
    <ChainContext.Provider
      value={{
        currentChain,
        currentChainId,
        // currentNetwork,
        chainConfig,
        lcd,
        myAddress,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export default ChainContextProvider;
