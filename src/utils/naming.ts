import { DENOM_TO_TOKEN_NAME } from "@/utils/token";
import BigNumber from "bignumber.js";

export const constructJobVarNameForAstroportLimitOrder = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string
) =>
  `swap-${BigNumber(offerAmount).toFixed(3)}-${
    DENOM_TO_TOKEN_NAME[offerAssetAddress]
  }-to-how-many-${DENOM_TO_TOKEN_NAME[returnAssetAddress]}`;

export const constructJobDescriptionForAstroportLimitOrder = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string,
  minimumReturnAmount: string
) =>
  `swap ${BigNumber(offerAmount).toFixed(3)} ${
    DENOM_TO_TOKEN_NAME[offerAssetAddress]
  } to ${BigNumber(minimumReturnAmount).toFixed(3)} ${
    DENOM_TO_TOKEN_NAME[returnAssetAddress]
  }`;

export const constructJobDescriptionForAstroportDcaOrder = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string,
  dcaCount: number,
  dcaInterval: number
) =>
  `DCA swap ${BigNumber(offerAmount).toFixed(3)}${
    DENOM_TO_TOKEN_NAME[offerAssetAddress]
  } to ${
    DENOM_TO_TOKEN_NAME[returnAssetAddress]
  } for ${dcaCount} times every ${dcaInterval} days`;
