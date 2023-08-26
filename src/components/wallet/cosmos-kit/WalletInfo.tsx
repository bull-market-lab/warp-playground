import { useChain } from "@cosmos-kit/react";

import WalletInfoBase from "@/components/wallet/WalletInfoBase";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import useCurrentChain from "@/hooks/useCurrentChain";
import useMyAddress from "@/hooks/useMyAddress";
import { getCosmosKitChainNameByChainId } from "@/utils/cosmosKitNetwork";

const WalletInfo = () => {
  const { currentChainId } = useCurrentChainId();
  const { currentChain } = useCurrentChain();
  const { myAddress } = useMyAddress();
  const { disconnect } = useChain(
    getCosmosKitChainNameByChainId(currentChainId)
  );

  return WalletInfoBase({
    currentChain,
    currentChainId,
    myAddress,
    disconnect,
  });
};

export default WalletInfo;
