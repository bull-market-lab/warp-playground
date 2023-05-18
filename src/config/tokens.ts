import { INJECTIVE_MAINNET, INJECTIVE_TESTNET, OSMOSIS_MAINNET, TERRA_LOCALTERRA, TERRA_MAINNET, TERRA_TESTNET } from "./networks";

export const DEFAULT_TOKEN_DECIMALS = 10 ** 6;

export const TOKEN_DECIMALS = {
  [OSMOSIS_MAINNET.chainId]: 10 ** 6,
  [TERRA_MAINNET.chainId]: 10 ** 6,
  [TERRA_TESTNET.chainId]: 10 ** 6,
  [TERRA_LOCALTERRA.chainId]: 10 ** 6,
  [INJECTIVE_MAINNET.chainId]: 10 ** 18,
  [INJECTIVE_TESTNET.chainId]: 10 ** 18,
};

export const TOKENS = {
  [TERRA_MAINNET.chainId]: {
    native: "uluna",
    astro: "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
    axlusdc: "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4"
  },
  [TERRA_TESTNET.chainId]: {
    native: "uluna",
    astro: "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv"
  },
  [TERRA_LOCALTERRA.chainId]: {
    native: "uluna",
    astro: "terra1da5u07nj3pz5ncwgpa94y0yqlpv8s6w6vxwymnxe4gpxm9q5zjpqdreyv6"
  },
  [INJECTIVE_MAINNET.chainId]: {
    native: "inj",
    astro: "ibc/EBD5A24C554198EBAF44979C5B4D2C2D312E6EBAB71962C92F735499C7575839"
  },
}

export function getTokenDecimals(denom: string): number {
  switch(denom) {
    case "inj":
      return 10 ** 18;
    default:
      return DEFAULT_TOKEN_DECIMALS;
  }
}

export const DENOM_TO_TOKEN_NAME = {
  [TOKENS[TERRA_MAINNET.chainId].native]: "LUNA",
  [TOKENS[TERRA_MAINNET.chainId].astro]: "ASTRO",
  [TOKENS[TERRA_MAINNET.chainId].axlusdc!]: "axlUSDC",
  [TOKENS[TERRA_TESTNET.chainId].native]: "LUNA",
  [TOKENS[TERRA_TESTNET.chainId].astro]: "ASTRO",
}