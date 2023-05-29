import { DENOM_TO_TOKEN_NAME } from "@/config/tokens";
import BigNumber from "bignumber.js";

export const constructJobVarNameForAstroportLimitSwap = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string
) =>
  `swap-${BigNumber(offerAmount).toFixed(3)}-${
    DENOM_TO_TOKEN_NAME[offerAssetAddress]
  }-to-how-many-${DENOM_TO_TOKEN_NAME[returnAssetAddress]}`;

export const constructJobNameForAstroportLimitSwap = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string,
  minimumReturnAmount: string
) =>
  `swap-${BigNumber(offerAmount).toFixed(3)}-${
    DENOM_TO_TOKEN_NAME[offerAssetAddress]
  }-to-${BigNumber(minimumReturnAmount).toFixed(3)}-${
    DENOM_TO_TOKEN_NAME[returnAssetAddress]
  }`;
