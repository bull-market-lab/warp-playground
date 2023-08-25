import ChainContext from "@/contexts/ShuttleWalletChainContext";
import { useContext, useMemo } from "react";

const useCurrentChainConfig = () => {
  const { currentChainConfig } = useContext(ChainContext);
  return useMemo(() => {
    return { currentChainConfig };
  }, [currentChainConfig]);
};

export default useCurrentChainConfig;
