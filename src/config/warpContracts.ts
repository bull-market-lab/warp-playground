import { CHAIN_ID_LOCALTERRA, CHAIN_ID_PHOENIX_1, CHAIN_ID_PISCO_1 } from "@/utils/network";

export const WARP_CONSTANTS = {
  [CHAIN_ID_PHOENIX_1]: {
    controller:
      "terra12w6h8u5wsurkgntam3xjc7n0ypjpp5ugeq5jhn52d2j8d3rq0ulqs02427",
    feeTokenAddress: "uluna",
  },
  [CHAIN_ID_PISCO_1]: {
    controller:
      "terra1f7lz4gp04lqku97exrmpcvrqr5xvz0mc94lfy7a67clg6sur9tcq80pgk8",
    feeTokenAddress: "uluna",
  },
  [CHAIN_ID_LOCALTERRA]: {
    controller:
      "terra156fwsk56dgldh4l6dpvm2p3mheugm408lac9au4pc8gn4gqn0kfsy44rqr",
    feeTokenAddress: "uluna",
  },
};
