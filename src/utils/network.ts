import {
  CHAIN_ID_OSMO_TEST_FIVE,
  CHAIN_ID_PION_ONE,
  CHAIN_ID_PISCO_ONE,
  CHAIN_NEUTRON,
  CHAIN_OSMOSIS,
  CHAIN_TERRA,
  Chain,
  NETWORK_TESTNET,
} from "./constants";

export const GAS_OPTIONS = {
  gas: undefined, // leave undefined so it is estimated when signing
  gasPrices: "0.15uluna",
  gasAdjustment: 1.75,
};

export const AVAILABLE_CHAIN_IDS = [
  // CHAIN_ID_PHOENIX_ONE,
  CHAIN_ID_PISCO_ONE,
  // CHAIN_ID_LOCALTERRA,
  // CHAIN_ID_NEUTRON_ONE,
  CHAIN_ID_PION_ONE,
  // CHAIN_ID_OSMOSIS_ONE,
  CHAIN_ID_OSMO_TEST_FIVE,
];

export const TERRA_NETWORK_TO_CHAIN_ID = {
  // mainnet: CHAIN_ID_PHOENIX_ONE,
  testnet: CHAIN_ID_PISCO_ONE,
  // localterra: CHAIN_ID_LOCALTERRA,
};

export const NEUTRON_NETWORK_TO_CHAIN_ID = {
  testnet: CHAIN_ID_PION_ONE,
};

export const OSMOSIS_NETWORK_TO_CHAIN_ID = {
  testnet: CHAIN_ID_OSMO_TEST_FIVE,
};

export const DEFAULT_LCD_CONFIG = {
  // CHAIN_ID_PHOENIX_ONE: {
  //   chainID: CHAIN_ID_PHOENIX_ONE,
  //   lcd: "https://phoenix-lcd.terra.dev",
  //   gasAdjustment: 1.75,
  //   gasPrices: { uluna: 0.015 },
  //   prefix: "terra",
  //   coinType: "330",
  //   baseAsset: "uluna",
  //   name: "Terra Mainnet",
  //   icon: "https://c1a906d1.station-assets.pages.dev/img/chains/Terra.svg",
  //   alliance: true,
  //   explorer: {
  //     address: "https://terrasco.pe/mainnet/address/{}",
  //     tx: "https://terrasco.pe/mainnet/tx/{}",
  //     validator: "https://terrasco.pe/mainnet/validator/{}",
  //     block: "https://terrasco.pe/mainnet/block/{}",
  //   },
  // },
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
  // CHAIN_ID_LOCALTERRA: {
  //   chainID: CHAIN_ID_LOCALTERRA,
  //   lcd: "http://localhost:1317",
  //   gasAdjustment: 1.75,
  //   gasPrices: { uluna: 0.015 },
  //   prefix: "terra",
  //   coinType: "330",
  //   baseAsset: "uluna",
  //   name: "Terra Localnet",
  //   icon: "https://c1a906d1.station-assets.pages.dev/img/chains/Terra.svg",
  //   alliance: true,
  //   explorer: {
  //     address: "https://finder.terra.money/localterra/address/{}",
  //     tx: "https://finder.terra.money/localterra/tx/{}",
  //     validator: "https://finder.terra.money/localterra/validator/{}",
  //     block: "https://finder.terra.money/localterra/blocks/{}",
  //   },
  // },
  CHAIN_ID_PION_ONE: {
    chainID: CHAIN_ID_PION_ONE,
    lcd: "https://rest-palvus.pion-1.ntrn.tech/",
    gasAdjustment: 1.75,
    gasPrices: { untrn: 0.015 },
    prefix: "neutron",
    coinType: "118",
    baseAsset: "untrn",
    name: "Neutron Testnet",
    alliance: false,
  },
  CHAIN_ID_OSMO_TEST_FIVE: {
    chainID: CHAIN_ID_OSMO_TEST_FIVE,
    lcd: "https://lcd.osmotest5.osmosis.zone",
    gasAdjustment: 1.75,
    gasPrices: { uosmo: 0.015 },
    prefix: "osmo",
    coinType: "118",
    baseAsset: "uosmo",
    name: "Osmosis Testnet",
    alliance: false,
  },
};

const getTerraChainIDByNetwork = (network?: string): string => {
  if (!network) {
    return CHAIN_ID_PISCO_ONE;
  }
  return TERRA_NETWORK_TO_CHAIN_ID[
    network as keyof typeof TERRA_NETWORK_TO_CHAIN_ID
  ];
};

const getNeutronChainIDByNetwork = (network?: string): string => {
  if (!network) {
    return CHAIN_ID_PION_ONE;
  }
  return NEUTRON_NETWORK_TO_CHAIN_ID[
    network as keyof typeof NEUTRON_NETWORK_TO_CHAIN_ID
  ];
};

const getOsmosisChainIDByNetwork = (network?: string): string => {
  if (!network) {
    return CHAIN_ID_OSMO_TEST_FIVE;
  }
  return OSMOSIS_NETWORK_TO_CHAIN_ID[
    network as keyof typeof OSMOSIS_NETWORK_TO_CHAIN_ID
  ];
};

export const getChainIDByChainAndNetwork = (
  chain: Chain,
  network?: string
): string => {
  if (chain === CHAIN_TERRA) {
    return getTerraChainIDByNetwork(network);
  } else if (chain === CHAIN_NEUTRON) {
    return getNeutronChainIDByNetwork(network);
  } else if (chain === CHAIN_OSMOSIS) {
    return getOsmosisChainIDByNetwork(network);
  } else {
    // default to terra testnet
    return CHAIN_ID_PISCO_ONE;
  }
};

export const isValidNetwork = (network?: string): boolean => {
  return (
    network == NETWORK_TESTNET
    // network === NETWORK_MAINNET || network === NETWORK_TESTNET
    // ||
    // network === NETWORK_LOCALNET
  );
};
