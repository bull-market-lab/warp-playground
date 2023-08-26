// this is in LUNA instead of uluna
export const DEFAULT_JOB_REWARD_AMOUNT = "1";

// currently eviction fee is 0,05
// i.e. job creator needs to pay 0.05 LUNA everyday to keep the pending job live
// TODO: this may change in the future, please consult with warp team
export const EVICTION_FEE = "0.05";

export const DAY_IN_SECONDS = 86400;

export const NAME_WARP_PLAYGROUND_ASTROPORT_LIMIT_ORDER =
  "Warp Playground Astroport Limit Order";
export const NAME_WARP_PLAYGROUND_ASTROPORT_DCA_ORDER =
  "Warp Playground Astroport DCA Order";

export const LABEL_WARP_PLAYGROUND = "Warp Playground";

export const LABEL_ASTROPORT_LIMIT_ORDER = "Limit Order";
export const LABEL_ASTROPORT_DCA_ORDER = "DCA Order";

export const CHAIN_TERRA = "terra";
export const CHAIN_NEUTRON = "neutron";
// export const CHAIN_OSMOSIS = "osmosis";

// export const CHAIN_ID_PHOENIX_ONE = "phoenix-1";
export const CHAIN_ID_PISCO_ONE = "pisco-1";
// export const CHAIN_ID_LOCALTERRA = "localterra";
// export const CHAIN_ID_NEUTRON_ONE = "neutron-1";
export const CHAIN_ID_PION_ONE = "pion-1";
// export const CHAIN_ID_OSMOSIS_ONE = "osmosis-1";
// export const CHAIN_ID_OSMO_TEST_FIVE = "osmo-test-5";
export const CHAIN_ID_UNSUPPORTED = "unsupported";

// export const NETWORK_MAINNET = "mainnet";
export const NETWORK_TESTNET = "testnet";
// export const NETWORK_LOCALNET = "localterra";

export type Chain = typeof CHAIN_TERRA | typeof CHAIN_NEUTRON;
// | typeof CHAIN_OSMOSIS;

export type Network =
  // | typeof NETWORK_MAINNET
  typeof NETWORK_TESTNET;
// | typeof NETWORK_LOCALNET;

export type ChainID =
  // | typeof CHAIN_ID_PHOENIX_ONE
  | typeof CHAIN_ID_PISCO_ONE
  // | typeof CHAIN_ID_LOCALTERRA
  // | typeof CHAIN_ID_NEUTRON_ONE
  | typeof CHAIN_ID_PION_ONE
  // | typeof CHAIN_ID_OSMO_TEST_FIVE
  | typeof CHAIN_ID_UNSUPPORTED;

export type Token = {
  name: string;
  address: string;
};

export type Pool = {
  name: string;
  address: string;
  token1: Token;
  token2: Token;
};

export type ChainConfig = {
  nativeToken: Token;
  warp: {
    controllerAddress: string;
    feeToken: Token;
  };
  pools: Pool[];
};

export type ChainConstants = Partial<Record<ChainID, ChainConfig>>;
export type NetworkConstants = Partial<Record<Network, ChainConstants>>;

// export const TERRA_MAINNET_CHAIN_CONFIG = {
//   nativeToken: {
//     name: "LUNA",
//     address: "uluna",
//   },
//   warp: {
//     controllerAddress:
//       "terra1mg93d4g69tsf3x6sa9nkmkzc9wl38gdrygu0sewwcwj6l2a4089sdd7fgj",
//     feeToken: {
//       name: "LUNA",
//       address: "uluna",
//     },
//   },
//   pools: [
//     {
//       name: "axlUSDC-LUNA",
//       address:
//         "terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr",
//       token1: {
//         name: "axlUSDC",
//         address:
//           "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
//       },
//       token2: {
//         name: "LUNA",
//         address: "uluna",
//       },
//     },
//     {
//       name: "axlUSDC-ASTRO",
//       address:
//         "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
//       token1: {
//         name: "axlUSDC",
//         address:
//           "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
//       },
//       token2: {
//         name: "ASTRO",
//         address:
//           "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
//       },
//     },
//   ],
// };

export const TERRA_TESTNET_CHAIN_CONFIG = {
  nativeToken: {
    name: "LUNA",
    address: "uluna",
  },
  warp: {
    controllerAddress:
      "terra1hhvfpkrdwtesznpd6kudqzcdudvr9edl78ktkcucz6q5vj0k2vwqeqj59h",
    feeToken: {
      name: "LUNA",
      address: "uluna",
    },
  },
  pools: [
    {
      name: "LUNA-ASTRO",
      address:
        "terra1udsua9w6jljwxwgwsegvt6v657rg3ayfvemupnes7lrggd28s0wq7g8azm",
      token1: {
        name: "LUNA",
        address: "uluna",
      },
      token2: {
        name: "ASTRO",
        address:
          "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
      },
    },
    // cannot get axlUSDC on terra testnet :(
    // {
    //   name: "LUNA-axlUSDC",
    //   address:
    //     "terra1udsua9w6jljwxwgwsegvt6v657rg3ayfvemupnes7lrggd28s0wq7g8azm",
    //   token1: {
    //     name: "LUNA",
    //     address: "uluna",
    //   },
    //   token2: {
    //     name: "axlUSDC",
    //     address:
    //       "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
    //   },
    // },
  ],
};

// export const TERRA_LOCALNET_CHAIN_CONFIG = {
//   nativeToken: {
//     name: "LUNA",
//     address: "uluna",
//   },
//   warp: {
//     controllerAddress:
//       "terra156fwsk56dgldh4l6dpvm2p3mheugm408lac9au4pc8gn4gqn0kfsy44rqr",
//     feeToken: {
//       name: "LUNA",
//       address: "uluna",
//     },
//   },
//   pools: [
//     {
//       name: "LUNA-ASTRO",
//       address:
//         "terra1uvu9epct9enjqytsxq8546zggyqhf5pj9q6k8ve73hq93ts98w3swwljr6",
//       token1: {
//         name: "LUNA",
//         address: "uluna",
//       },
//       token2: {
//         name: "ASTRO",
//         address:
//           "terra1da5u07nj3pz5ncwgpa94y0yqlpv8s6w6vxwymnxe4gpxm9q5zjpqdreyv6",
//       },
//     },
//   ],
// };

// export const NEUTRON_MAINNET_CHAIN_CONFIG = {
//   nativeToken: {
//     name: "NTRN",
//     address: "untrn",
//   },
//   warp: {
//     controllerAddress:
//       "terra1mg93d4g69tsf3x6sa9nkmkzc9wl38gdrygu0sewwcwj6l2a4089sdd7fgj",
//     feeToken: {
//       name: "NTRN",
//       address: "untrn",
//     },
//   },
//   pools: [
//     {
//       name: "axlUSDC-NTRN",
//       address:
//         "terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr",
//       token1: {
//         name: "axlUSDC",
//         address:
//           "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
//       },
//       token2: {
//         name: "NTRN",
//         address: "untrn",
//       },
//     },
//     {
//       name: "ATOM-NTRN",
//       address:
//         "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
//       token1: {
//         name: "ATOM",
//         address:
//           "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
//       },
//       token2: {
//         name: "NTRN",
//         address: "untrn",
//       },
//     },
//   ],
// };

export const NEUTRON_TESTNET_CHAIN_CONFIG = {
  nativeToken: {
    name: "NTRN",
    address: "untrn",
  },
  warp: {
    controllerAddress:
      "neutron1ccgyxc0l5z8hgmvcwcfsvuvzx2rnhmptt8gaqzvjwtlsyeq4nr6s4h7w3s",
    feeToken: {
      name: "NTRN",
      address: "untrn",
    },
  },
  pools: [
    {
      name: "axlUSDC-NTRN",
      address:
        "neutron1udz38ekgxfhgpdnlhjv0h4533rdk5r43a7kcxfunk9nrgwnsc2hqjllny5",
      token1: {
        name: "axlUSDC",
        address:
          "ibc/F91EA2C0A23697A1048E08C2F787E3A58AC6F706A1CD2257A504925158CFC0F3",
      },
      token2: {
        name: "NTRN",
        address: "untrn",
      },
    },
    // {
    //   name: "ATOM-NTRN",
    //   address:
    //     "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
    //   token1: {
    //     name: "ATOM",
    //     address:
    //       "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
    //   },
    //   token2: {
    //     name: "NTRN",
    //     address: "untrn",
    //   },
    // },
  ],
};

// export const OSMOSIS_TESTNET_CHAIN_CONFIG = {
//   nativeToken: {
//     name: "OSMO",
//     address: "uosmo",
//   },
//   warp: {
//     controllerAddress:
//       "osmo1sj7qw3ujg47l2a4wwu2plag2nsa3a3kaupy4qlv9yxlrxk57papqgf5vd8",
//     feeToken: {
//       name: "OSMO",
//       address: "uosmo",
//     },
//   },
//   pools: [
//     {
//       name: "axlUSDC-OSMO",
//       address:
//         "osmo183uu809nq80xuh0r86dkadq9djza6ln5cf5hmszt6zcfdy454chq3dcgm4",
//       token1: {
//         name: "axlUSDC",
//         address:
//           "ibc/6F34E1BD664C36CE49ACC28E60D62559A5F96C4F9A6CCE4FC5A67B2852E24CFE",
//       },
//       token2: {
//         name: "OSMO",
//         address: "uosmo",
//       },
//     },
//     // {
//     //   name: "ATOM-NTRN",
//     //   address:
//     //     "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
//     //   token1: {
//     //     name: "ATOM",
//     //     address:
//     //       "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
//     //   },
//     //   token2: {
//     //     name: "NTRN",
//     //     address: "untrn",
//     //   },
//     // },
//   ],
// };

export const NETWORK_CONSTANTS: NetworkConstants = {
  // [NETWORK_MAINNET]: {
  //   [CHAIN_ID_PHOENIX_ONE]: TERRA_MAINNET_CHAIN_CONFIG,
  //   [CHAIN_ID_NEUTRON_ONE]: NEUTRON_MAINNET_CHAIN_CONFIG,
  // },
  [NETWORK_TESTNET]: {
    [CHAIN_ID_PISCO_ONE]: TERRA_TESTNET_CHAIN_CONFIG,
    [CHAIN_ID_PION_ONE]: NEUTRON_TESTNET_CHAIN_CONFIG,
    // [CHAIN_ID_OSMO_TEST_FIVE]: OSMOSIS_TESTNET_CHAIN_CONFIG,
  },
  // [NETWORK_LOCALNET]: {
  //   [CHAIN_ID_LOCALTERRA]: TERRA_LOCALNET_CHAIN_CONFIG,
  // },
};
