// import { Network } from "@delphi-labs/shuttle-react";
// import { bech32 } from "bech32";
// import { Address } from "ethereumjs-util";

// export const TERRA_TESTNET: Network = {
//   name: "Terra 2 Testnet",
//   chainId: "pisco-1",
//   chainPrefix: "terra",
//   rpc: "https://multichain-nodes.astroport.fi/pisco-1/rpc/",
//   rest: "https://multichain-nodes.astroport.fi/pisco-1/lcd/",
//   bip44: {
//     coinType: 330,
//   },
//   defaultCurrency: {
//     coinDenom: "LUNA",
//     coinMinimalDenom: "uluna",
//     coinDecimals: 6,
//     coinGeckoId: "terra-luna-2",
//   },
//   gasPrice: "0.015uluna",
// };

// // export const OSMOSIS_TESTNET: Network = {
// //   name: "Osmosis Testnet",
// //   chainId: "osmo-test-5",
// //   chainPrefix: "osmosis",
// //   rpc: "https://rpc.osmotest5.osmosis.zone",
// //   rest: "https://lcd.osmotest5.osmosis.zone",
// //   defaultCurrency: {
// //     coinDenom: "OSMO",
// //     coinMinimalDenom: "uosmo",
// //     coinDecimals: 6,
// //     coinGeckoId: "osmosis",
// //   },
// //   gasPrice: "0.015uosmo",
// // };

// export const NEUTRON_TESTNET: Network = {
//   name: "Neutron Testnet",
//   chainId: "pion-1",
//   chainPrefix: "neutron",
//   rpc: "https://rpc-palvus.pion-1.ntrn.tech/",
//   rest: "https://rest-palvus.pion-1.ntrn.tech/",
//   defaultCurrency: {
//     coinDenom: "NTRN",
//     coinMinimalDenom: "untrn",
//     coinDecimals: 6,
//   },
//   gasPrice: "0.025untrn",
// };

// export const DEFAULT_MAINNET = TERRA_TESTNET;

// // export const networks = [TERRA_TESTNET, OSMOSIS_TESTNET, NEUTRON_TESTNET];
// export const networks = [TERRA_TESTNET, NEUTRON_TESTNET];

// export function getNetworkByChainId(chainId: string): Network {
//   const network = networks.find((network) => network.chainId === chainId);
//   if (!network) {
//     throw new Error(`Network with chainId ${chainId} not found`);
//   }
//   return network;
// }

// export function fromNetworkToNativeDenom(chainId: string): string {
//   switch (chainId) {
//     case "phoenix-1":
//       return "uluna";
//     case "pisco-1":
//       return "uluna";
//       return "inj";
//     case "osmosis-1":
//       return "uosmo";
//     case "osmo-test-5":
//       return "uosmo";
//       return "umars";
//     case "neutron-1":
//       return "untrn";
//     case "pion-1":
//       return "untrn";
//     default:
//       throw new Error(`Network with chainId ${chainId} not found`);
//   }
// }

// export function fromNetworkToNativeSymbol(chainId: string): string {
//   const denom = fromNetworkToNativeDenom(chainId);

//   switch (denom) {
//     case "uluna":
//       return "LUNA";
//       return "INJ";
//     case "uosmo":
//       return "OSMO";
//       return "MARS";
//     case "untrn":
//       return "NTRN";
//     default:
//       throw new Error(`Network with chainId ${chainId} not found`);
//   }
// }
