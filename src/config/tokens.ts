import BigNumber from "bignumber.js";
import { CHAIN_ID_LOCALTERRA, CHAIN_ID_PHOENIX_1, CHAIN_ID_PISCO_1 } from "@/utils/network";

const DEFAULT_TOKEN_DECIMALS = 10 ** 6;

const TOKEN_DECIMALS = {
  [CHAIN_ID_PHOENIX_1]: 10 ** 6,
  [CHAIN_ID_PISCO_1]: 10 ** 6,
  [CHAIN_ID_LOCALTERRA]: 10 ** 6,
};

export const TOKENS = {
  [CHAIN_ID_PHOENIX_1]: {
    native: "uluna",
    astro: "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
    axlusdc:
      "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
  },
  [CHAIN_ID_PISCO_1]: {
    native: "uluna",
    astro: "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
  },
  [CHAIN_ID_LOCALTERRA]: {
    native: "uluna",
    astro: "terra1da5u07nj3pz5ncwgpa94y0yqlpv8s6w6vxwymnxe4gpxm9q5zjpqdreyv6",
  },
};

export const DENOM_TO_TOKEN_NAME = {
  [TOKENS[CHAIN_ID_PHOENIX_1].native]: "LUNA",
  [TOKENS[CHAIN_ID_PHOENIX_1].astro]: "ASTRO",
  [TOKENS[CHAIN_ID_PHOENIX_1].axlusdc!]: "axlUSDC",
  [TOKENS[CHAIN_ID_PISCO_1].native]: "LUNA",
  [TOKENS[CHAIN_ID_PISCO_1].astro]: "ASTRO",
  [TOKENS[CHAIN_ID_LOCALTERRA].native]: "LUNA",
  [TOKENS[CHAIN_ID_LOCALTERRA].astro]: "ASTRO",
};

export function getTokenDecimals(denom: string): number {
  switch (denom) {
    case "inj":
      return 10 ** 18;
    default:
      return DEFAULT_TOKEN_DECIMALS;
  }
}

export const isNativeAsset = (assetAddress: string): boolean => {
  return (
    assetAddress.startsWith("u") ||
    assetAddress === "inj" ||
    assetAddress.startsWith("ibc/")
  );
};

export const convertTokenDecimals = (
  amount: string,
  assetAddress: string
): string => {
  return BigNumber(amount).times(getTokenDecimals(assetAddress)).toString();
};
