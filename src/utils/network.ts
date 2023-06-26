import { useContext } from "react";
import {
  CHAIN_ID_LOCALTERRA,
  CHAIN_ID_NEUTRON_ONE,
  CHAIN_ID_PHOENIX_ONE,
  CHAIN_ID_PION_ONE,
  CHAIN_ID_PISCO_ONE,
  CHAIN_NEUTRON,
  CHAIN_TERRA,
  Chain,
  ChainConfig,
  ChainID,
  NETWORK_CONSTANTS,
  NETWORK_LOCALNET,
  NETWORK_MAINNET,
  NETWORK_TESTNET,
  NEUTRON_MAINNET_CHAIN_CONFIG,
  Network,
  TERRA_MAINNET_CHAIN_CONFIG,
} from "./constants";
import { ChainContext } from "@/contexts/ChainContext";

export const GAS_OPTIONS = {
  gas: undefined, // leave undefined so it is estimated when signing
  gasPrices: "0.15uluna",
  gasAdjustment: 1.75,
};

export const AVAILABLE_CHAIN_IDS = [
  CHAIN_ID_PHOENIX_ONE,
  CHAIN_ID_PISCO_ONE,
  CHAIN_ID_LOCALTERRA,
  CHAIN_ID_NEUTRON_ONE,
  CHAIN_ID_PION_ONE,
];

export const NETWORK_TO_CHAIN_ID = {
  mainnet: CHAIN_ID_PHOENIX_ONE,
  testnet: CHAIN_ID_PISCO_ONE,
  localterra: CHAIN_ID_LOCALTERRA,
};

export const NETWORKS = {
  CHAIN_ID_PHOENIX_ONE: {
    chainID: CHAIN_ID_PHOENIX_ONE,
    lcd: "https://phoenix-lcd.terra.dev",
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.015 },
    prefix: "terra",
    coinType: "330",
    baseAsset: "uluna",
    name: "Terra Mainnet",
    icon: "https://c1a906d1.station-assets.pages.dev/img/chains/Terra.svg",
    alliance: true,
    explorer: {
      address: "https://terrasco.pe/mainnet/address/{}",
      tx: "https://terrasco.pe/mainnet/tx/{}",
      validator: "https://terrasco.pe/mainnet/validator/{}",
      block: "https://terrasco.pe/mainnet/block/{}",
    },
  },
  CHAIN_ID_PISCO_ONE: {
    chainID: CHAIN_ID_PISCO_ONE,
    lcd: "https://pisco-lcd.terra.dev",
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.015 },
    prefix: "terra",
    coinType: "330",
    baseAsset: "uluna",
    name: "Terra Testnet",
    icon: "https://c1a906d1.station-assets.pages.dev/img/chains/Terra.svg",
    alliance: true,
    explorer: {
      address: "https://terrasco.pe/testnet/address/{}",
      tx: "https://terrasco.pe/testnet/tx/{}",
      validator: "https://terrasco.pe/testnet/validator/{}",
      block: "https://terrasco.pe/testnet/block/{}",
    },
  },
  CHAIN_ID_LOCALTERRA: {
    chainID: CHAIN_ID_LOCALTERRA,
    lcd: "http://localhost:1317",
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.015 },
    prefix: "terra",
    coinType: "330",
    baseAsset: "uluna",
    name: "Terra Localnet",
    icon: "https://c1a906d1.station-assets.pages.dev/img/chains/Terra.svg",
    alliance: true,
    explorer: {
      address: "https://finder.terra.money/localterra/address/{}",
      tx: "https://finder.terra.money/localterra/tx/{}",
      validator: "https://finder.terra.money/localterra/validator/{}",
      block: "https://finder.terra.money/localterra/blocks/{}",
    },
  },
};

export const getChainIDByNetwork = (network?: string): string => {
  // default to mainnet
  if (!network) {
    return CHAIN_ID_PHOENIX_ONE;
  }
  return NETWORK_TO_CHAIN_ID[network as keyof typeof NETWORK_TO_CHAIN_ID];
};

export const isValidNetwork = (network?: string): boolean => {
  return (
    network === NETWORK_MAINNET ||
    network === NETWORK_TESTNET ||
    network === NETWORK_LOCALNET
  );
};

// get chain config from context, if unset, use mainnet
export const getChainConfig = (
  currentChain: Chain,
  currentChainId?: ChainID,
  currentNetwork?: Network
): ChainConfig => {
  if (!currentChainId || !currentNetwork) {
    if (currentChain == CHAIN_TERRA) {
      return TERRA_MAINNET_CHAIN_CONFIG;
    } else {
      return NEUTRON_MAINNET_CHAIN_CONFIG;
    }
  }

  return NETWORK_CONSTANTS[currentNetwork]![currentChainId]!;
};
