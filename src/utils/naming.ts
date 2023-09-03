import BigNumber from "bignumber.js";

import { Token } from "./constants";

export const constructJobDescriptionForAstroportLimitOrder = (
  offerTokenAmount: string,
  offerToken: Token,
  returnToken: Token,
  minimumReturnTokenAmount: string,
  isYieldBearing: boolean
) =>
  `${isYieldBearing ? "yield bearing " : ""}limit order: swap ${BigNumber(
    offerTokenAmount
  ).toFixed(3)} ${offerToken.name} to ${BigNumber(
    minimumReturnTokenAmount
  ).toFixed(3)} ${returnToken.name}`;

export const constructJobDescriptionForAstroportDcaOrder = (
  offerTokenAmount: string,
  offerToken: Token,
  returnToken: Token,
  dcaCount: number,
  dcaInterval: number,
  isYieldBearing: boolean
) =>
  `${
    isYieldBearing ? "yield bearing " : ""
  }DCA order: each time swap ${BigNumber(offerTokenAmount).toFixed(3)} ${
    offerToken.name
  } to ${
    returnToken.name
  } for ${dcaCount} times, interval is ${dcaInterval} days`;
