export const constructJobVarNameForAstroportLimitSwap = (
  offerAmount: string,
  offerAssetAddress: string,
  returnAssetAddress: string
) => `swap-${offerAmount}-${offerAssetAddress}-to-${returnAssetAddress}`;

export const constructJobNameForAstroportLimitSwap = () =>
  "warp-world-astroport-limit-swap";
