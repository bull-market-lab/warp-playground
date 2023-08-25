import ChainContext from "@/contexts/ShuttleWalletChainContext";
import { useContext, useMemo } from "react";

const useCurrentChain = () => {
  const { currentChain } = useContext(ChainContext);

  return useMemo(() => {
    return { currentChain };
  }, [currentChain]);
};

export default useCurrentChain;
