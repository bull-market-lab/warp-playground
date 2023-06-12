import { CHAIN_ID_LOCALTERRA, CHAIN_ID_PHOENIX_1, CHAIN_ID_PISCO_1 } from "@/utils/network";

export const POOLS = {
  [CHAIN_ID_PHOENIX_1]: {
    astroNative:
      "terra13rj43lsucnel7z8hakvskr7dkfj27hd9aa06pcw4nh7t66fgt7qshrpmaw",
    axlusdcNative:
      "terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr",
    axlusdcAstro:
      "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
  },
  [CHAIN_ID_PISCO_1]: {
    astroNative:
      "terra1udsua9w6jljwxwgwsegvt6v657rg3ayfvemupnes7lrggd28s0wq7g8azm",
  },
  [CHAIN_ID_LOCALTERRA]: {
    astroNative:
      "terra1uvu9epct9enjqytsxq8546zggyqhf5pj9q6k8ve73hq93ts98w3swwljr6",
  },
};
