import { LCDClient } from "@terra-money/feather.js";
import { createContext } from "react";

import {
  CHAIN_ID_PHOENIX_ONE,
  Chain,
  ChainConfig,
  TERRA_MAINNET_CHAIN_CONFIG,
} from "@/utils/constants";
import { ChainID } from "@/utils/constants";
import { CHAIN_TERRA } from "@/utils/constants";

type ChainContextType = {
  currentChain: Chain;
  currentChainId: ChainID;
  lcd?: LCDClient;
  myAddress?: string;
  chainConfig: ChainConfig;
};

const ChainContext = createContext<ChainContextType>({
  currentChain: CHAIN_TERRA,
  currentChainId: CHAIN_ID_PHOENIX_ONE,
  lcd: undefined,
  myAddress: undefined,
  chainConfig: TERRA_MAINNET_CHAIN_CONFIG,
});

export default ChainContext;
