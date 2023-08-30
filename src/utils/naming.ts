import BigNumber from "bignumber.js";

import { Token } from "./constants";

export const constructJobDescriptionForAstroportLimitOrder = (
  offerTokenAmount: string,
  offerToken: Token,
  returnToken: Token,
  minimumReturnTokenAmount: string
) =>
  `swap ${BigNumber(offerTokenAmount).toFixed(3)} ${
    offerToken.name
  } to ${BigNumber(minimumReturnTokenAmount).toFixed(3)} ${returnToken.name}`;

export const constructJobDescriptionForAstroportDcaOrder = (
  offerTokenAmount: string,
  offerToken: Token,
  returnToken: Token,
  dcaCount: number,
  dcaInterval: number
) =>
  `DCA swap ${BigNumber(offerTokenAmount).toFixed(3)}${offerToken.name} to ${
    returnToken.name
  } for ${dcaCount} times every ${dcaInterval} days`;
