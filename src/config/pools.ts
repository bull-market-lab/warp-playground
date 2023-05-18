import {
  INJECTIVE_MAINNET,
  TERRA_LOCALTERRA,
  TERRA_MAINNET,
  TERRA_TESTNET,
} from "./networks";

export const POOLS = {
  [TERRA_MAINNET.chainId]: {
    astroNative:
      "terra13rj43lsucnel7z8hakvskr7dkfj27hd9aa06pcw4nh7t66fgt7qshrpmaw",
    axlusdcNative:
      "terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr",
    axlusdcAstro:
      "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
  },
  [TERRA_TESTNET.chainId]: {
    astroNative:
      "terra1udsua9w6jljwxwgwsegvt6v657rg3ayfvemupnes7lrggd28s0wq7g8azm",
  },
  [TERRA_LOCALTERRA.chainId]: {
    astroNative:
      "terra1uvu9epct9enjqytsxq8546zggyqhf5pj9q6k8ve73hq93ts98w3swwljr6",
  },
  [INJECTIVE_MAINNET.chainId]: {
    astroNative: "inj1h5tz3pvy6e4ujndfdyjxy84hlmq28lnajjkl4z",
  },
};
