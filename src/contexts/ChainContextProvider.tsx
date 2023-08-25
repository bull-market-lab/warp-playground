import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";
import { useSearchParams } from "next/navigation";
import { LCDClient } from "@terra-money/feather.js";
import React, { useEffect, useState } from "react";

import {
  CHAIN_ID_PISCO_ONE,
  CHAIN_ID_UNSUPPORTED,
  ChainConfig,
  NETWORK_TESTNET,
  NEUTRON_TESTNET_CHAIN_CONFIG,
  TERRA_TESTNET_CHAIN_CONFIG,
  CHAIN_NEUTRON,
  CHAIN_ID_PION_ONE,
  Chain,
  ChainID,
  CHAIN_TERRA,
  CHAIN_OSMOSIS,
  CHAIN_ID_OSMO_TEST_FIVE,
} from "@/utils/constants";
import ChainContext from "@/contexts/ChainContext";

const ChainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const selectedChain = params.get("chain")?.toLowerCase() ?? CHAIN_TERRA;

  const [currentChain, setCurrentChain] = useState<Chain>(
    selectedChain === CHAIN_TERRA ? CHAIN_TERRA : CHAIN_NEUTRON
  );
  const [currentChainId, setCurrentChainId] = useState<ChainID>(
    selectedChain === CHAIN_TERRA ? CHAIN_ID_PISCO_ONE : CHAIN_ID_PION_ONE
  );
  const [chainConfig, setChainConfig] = useState<ChainConfig>(
    TERRA_TESTNET_CHAIN_CONFIG
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
          connectedWallet?.network === NETWORK_TESTNET
            ? CHAIN_ID_PISCO_ONE
            : CHAIN_ID_UNSUPPORTED;
        break;
      case CHAIN_NEUTRON:
        updatedChainId =
          connectedWallet?.network === NETWORK_TESTNET
            ? CHAIN_ID_PION_ONE
            : CHAIN_ID_UNSUPPORTED;
        break;
      case CHAIN_OSMOSIS:
        updatedChainId =
          connectedWallet?.network === NETWORK_TESTNET
            ? CHAIN_ID_OSMO_TEST_FIVE
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
      if (connectedWallet?.network === NETWORK_TESTNET) {
        updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
      } else {
        // default to testnet config
        updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
      }
    } else if (currentChain === CHAIN_NEUTRON) {
      if (connectedWallet?.network === NETWORK_TESTNET) {
        updatedChainConfig = NEUTRON_TESTNET_CHAIN_CONFIG;
      } else {
        // default to testnet config
        updatedChainConfig = NEUTRON_TESTNET_CHAIN_CONFIG;
      }
    } else {
      // default to terra testnet config
      updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
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
