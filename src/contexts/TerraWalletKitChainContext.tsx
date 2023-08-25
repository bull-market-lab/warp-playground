import { LCDClient } from "@terra-money/feather.js";
import { createContext } from "react";

import {
  CHAIN_ID_PISCO_ONE,
  Chain,
  ChainConfig,
  TERRA_TESTNET_CHAIN_CONFIG,
} from "@/utils/constants";
import { ChainID } from "@/utils/constants";
import { CHAIN_TERRA } from "@/utils/constants";

type ChainContextType = {
  currentChain: Chain;
  currentChainId: ChainID;
  currentChainConfig: ChainConfig;
  lcd?: LCDClient;
  myAddress?: string;
};

const ChainContext = createContext<ChainContextType>({
  currentChain: CHAIN_TERRA,
  currentChainId: CHAIN_ID_PISCO_ONE,
  currentChainConfig: TERRA_TESTNET_CHAIN_CONFIG,
  lcd: undefined,
  myAddress: undefined,
});

export default ChainContext;
