// export const NETWORKS = {
//   mainnet: {
//     name: "mainnet",
//     chainID: "phoenix-1",
//     lcd: "https://phoenix-lcd.terra.dev",
//     isClassic: false,
//     walletconnectID: 1,
//     api: "https://phoenix-api.terra.dev",
//   },
//   testnet: {
//     name: "testnet",
//     chainID: "pisco-1",
//     lcd: "https://pisco-lcd.terra.dev",
//     isClassic: false,
//     walletconnectID: 0,
//     api: "https://pisco-api.terra.dev",
//   },
// };

export const GAS_OPTIONS = {
  gas: undefined, // leave undefined so it is estimated when signing
  gasPrices: "0.15uluna",
  gasAdjustment: 1.2,
};

export const NETWORKS = {
  "phoenix-1": {
    chainID: "phoenix-1",
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
  "pisco-1": {
    chainID: "pisco-1",
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
  "localterra": {
    chainID: "localterra",
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