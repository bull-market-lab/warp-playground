import { useChain } from "@cosmos-kit/react";
import { useSearchParams } from "next/navigation";
import { LCDClient } from "@terra-money/feather.js";
import React, { useEffect, useState } from "react";

import {
  CHAIN_ID_PISCO_ONE,
  CHAIN_ID_UNSUPPORTED,
  ChainConfig,
  NEUTRON_TESTNET_CHAIN_CONFIG,
  TERRA_TESTNET_CHAIN_CONFIG,
  CHAIN_NEUTRON,
  CHAIN_ID_PION_ONE,
  Chain,
  ChainID,
  CHAIN_TERRA,
} from "@/utils/constants";
import ChainContext from "@/contexts/CosmosKitChainContext";
import { DEFAULT_LCD_CONFIG } from "@/utils/network";
import { getCosmosKitChainNameByChainId } from "@/utils/cosmosKitNetwork";

const ChainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const selectedChain = params.get("chain")?.toLowerCase() ?? CHAIN_TERRA;

  const [currentChain, setCurrentChain] = useState<Chain>(
    selectedChain === CHAIN_TERRA ? CHAIN_TERRA : CHAIN_NEUTRON
  );
  const [currentChainId, setCurrentChainId] = useState<ChainID>(
    selectedChain === CHAIN_TERRA ? CHAIN_ID_PISCO_ONE : CHAIN_ID_PION_ONE
  );
  const [currentChainConfig, setCurrentChainConfig] = useState<ChainConfig>(
    TERRA_TESTNET_CHAIN_CONFIG
  );
  const [lcd, setLCD] = useState<LCDClient>();

  let cosmosKitChainName = getCosmosKitChainNameByChainId(currentChainId);
  const { status: connectionStatus, address: myAddress } =
    useChain(cosmosKitChainName);

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
    if (connectionStatus === "Connected") {
      if (currentChain === CHAIN_TERRA) {
        setLCD(new LCDClient(DEFAULT_LCD_CONFIG));
      }
    } else {
      setLCD(undefined);
    }
  }, [connectionStatus]);

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
        updatedChainId = CHAIN_ID_PISCO_ONE;
        break;
      case CHAIN_NEUTRON:
        updatedChainId = CHAIN_ID_PION_ONE;
        break;
      // case CHAIN_OSMOSIS:
      //   updatedChainId =
      //     connectedWallet?.network === NETWORK_TESTNET
      //       ? CHAIN_ID_OSMO_TEST_FIVE
      //       : CHAIN_ID_UNSUPPORTED;
      //   break;
      default:
        updatedChainId = CHAIN_ID_UNSUPPORTED;
        break;
    }
    setCurrentChainId(updatedChainId);
  }, [currentChain]);

  // update chain config when current chain changes
  useEffect(() => {
    let updatedChainConfig: ChainConfig = currentChainConfig;
    if (currentChain === CHAIN_TERRA) {
      updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
    } else if (currentChain === CHAIN_NEUTRON) {
      updatedChainConfig = NEUTRON_TESTNET_CHAIN_CONFIG;
      // } else if (currentChain == CHAIN_OSMOSIS) {
      //   updatedChainConfig = OSMOSIS_TESTNET_CHAIN_CONFIG;
    } else {
      // default to terra testnet config
      updatedChainConfig = TERRA_TESTNET_CHAIN_CONFIG;
    }
    setCurrentChainConfig(updatedChainConfig);
    console.log(
      `current chain changed to ${currentChain}, update chain config to ${JSON.stringify(
        updatedChainConfig,
        null,
        2
      )}`
    );
  }, [currentChain]);

  return (
    <ChainContext.Provider
      value={{
        currentChain,
        currentChainId,
        currentChainConfig,
        lcd,
        myAddress,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export default ChainContextProvider;
