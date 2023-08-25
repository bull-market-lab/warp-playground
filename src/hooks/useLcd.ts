import ChainContext from "@/contexts/ShuttleWalletChainContext";
import { useContext, useMemo } from "react";

const useLcd = () => {
  const { lcd } = useContext(ChainContext);

  return useMemo(() => {
    return { lcd };
  }, [lcd]);
};

export default useLcd;
