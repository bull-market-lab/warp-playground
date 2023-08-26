import ChainContext from "@/contexts/ShuttleWalletChainContext";
import { useContext } from "react";

const useWallet = () => {
  const { myAddress } = useContext(ChainContext);

  //   return useMemo(() => {
  //     return { myAddress };
  //   }, [myAddress]);
  return { myAddress };
};

export default useWallet;
