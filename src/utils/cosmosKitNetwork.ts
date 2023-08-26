import { CHAIN_ID_PION_ONE, CHAIN_ID_PISCO_ONE } from "./constants";

export const getCosmosKitChainNameByChainId = (chainId: string): string => {
  let cosmosKitChainName = "terra2testnet";
  if (chainId === CHAIN_ID_PISCO_ONE) {
    cosmosKitChainName = "terra2testnet";
  } else if (chainId === CHAIN_ID_PION_ONE) {
    cosmosKitChainName = "neutrontestnet";
    // } else if (chainId === CHAIN_ID_OSMO_TEST_FIVE) {
    //   cosmosKitChainName = "osmosistestnet";
  }
  return cosmosKitChainName;
};
