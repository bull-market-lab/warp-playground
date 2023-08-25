import ChainContext from "@/contexts/ShuttleWalletChainContext";
import { useContext, useMemo } from "react";

const useMyAddress = () => {
  const { myAddress } = useContext(ChainContext);

  return useMemo(() => {
    return { myAddress };
  }, [myAddress]);
};

export default useMyAddress;
