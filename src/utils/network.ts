export const GAS_OPTIONS = {
  gas: undefined, // leave undefined so it is estimated when signing
  gasPrices: "0.15uluna",
  gasAdjustment: 1.75,
};

export const CHAIN_ID_PHOENIX_1 = "phoenix-1";
export const CHAIN_ID_PISCO_1 = "pisco-1";
export const CHAIN_ID_LOCALTERRA = "localterra";

export const NETWORK_MAINNET = "mainnet";
export const NETWORK_TESTNET = "testnet";
// TODO: this might be changed to localnet after terrain supports other chains
export const NETWORK_LOCALNET = "localterra";

export const AVAILABLE_NETWORKS = [
  NETWORK_MAINNET,
  NETWORK_TESTNET,
  NETWORK_LOCALNET,
];

export const AVAILABLE_CHAIN_IDS = [
  CHAIN_ID_PHOENIX_1,
  CHAIN_ID_PISCO_1,
  CHAIN_ID_LOCALTERRA,
];

export const NETWORK_TO_CHAIN_ID = {
  mainnet: CHAIN_ID_PHOENIX_1,
  testnet: CHAIN_ID_PISCO_1,
  localterra: CHAIN_ID_LOCALTERRA,
};

export const NETWORKS = {
  CHAIN_ID_PHOENIX_1: {
    chainID: CHAIN_ID_PHOENIX_1,
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
  CHAIN_ID_PISCO_1: {
    chainID: CHAIN_ID_PISCO_1,
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
    return CHAIN_ID_PHOENIX_1;
  }
  return NETWORK_TO_CHAIN_ID[network as keyof typeof NETWORK_TO_CHAIN_ID];
};
