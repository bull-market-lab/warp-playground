import ChainContext from "@/contexts/ShuttleWalletChainContext";
import { useContext, useMemo } from "react";

const useCurrentChainId = () => {
  const { currentChainId } = useContext(ChainContext);

  return useMemo(() => {
    return { currentChainId };
  }, [currentChainId]);
};

export default useCurrentChainId;
