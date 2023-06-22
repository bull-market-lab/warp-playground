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

export const constructJobNameForAstroportLimitOrder = (
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

export const constructJobNameForAstroportDcaOrder = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string
) =>
  `DCA-order-swap-${BigNumber(offerAmount).toFixed(3)}-${
    DENOM_TO_TOKEN_NAME[offerAssetAddress]
  }-to-${DENOM_TO_TOKEN_NAME[returnAssetAddress]}`;
