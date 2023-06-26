import { LCDClient } from "@terra-money/feather.js";
import React, { createContext, useState } from "react";

import { Chain } from "@/utils/constants";
import { ChainID } from "@/utils/constants";
import { CHAIN_TERRA, Network } from "@/utils/constants";

type ChainContextType = {
  currentChain: Chain;
  currentChainId?: ChainID;
  currentNetwork?: Network;
  lcd?: LCDClient;
  myAddress?: string;
  setCurrentChain: (chain: Chain) => void;
  setCurrentChainId: (chainId?: ChainID) => void;
  setCurrentNetwork: (network?: Network) => void;
  setLCD: (lcd?: LCDClient) => void;
  setMyAddress: (address?: string) => void;
};

export const ChainContext = createContext<ChainContextType>({
  currentChain: CHAIN_TERRA,
  currentChainId: undefined,
  currentNetwork: undefined,
  lcd: undefined,
  myAddress: undefined,
  setCurrentChain: () => {},
  setCurrentChainId: () => {},
  setCurrentNetwork: () => {},
  setLCD: () => {},
  setMyAddress: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ChainContextProvider = ({ children }: Props) => {
  const [currentChain, setCurrentChain] = useState<Chain>(CHAIN_TERRA);
  const [currentChainId, setCurrentChainId] = useState<ChainID>();
  const [currentNetwork, setCurrentNetwork] = useState<Network>();
  const [lcd, setLCD] = useState<LCDClient>();
  const [myAddress, setMyAddress] = useState<string>();

  return (
    <ChainContext.Provider
      value={{
        currentChain,
        currentChainId,
        currentNetwork,
        lcd,
        myAddress,
        setCurrentChain,
        setCurrentChainId,
        setCurrentNetwork,
        setLCD,
        setMyAddress,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
