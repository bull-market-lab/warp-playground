import { useState, useEffect } from 'react';
import { ChainSelectorDropdown } from './ChainSelectorDropdown';
import {
  ChooseChainInfo,
  ChainOption,
  handleSelectChainDropdown
} from '@/components/cosmos-kit/Types';

export function ChainSelector({
  chainName,
  chainInfos,
  onChange
}: {
  chainName?: string;
  chainInfos: ChooseChainInfo[];
  onChange: handleSelectChainDropdown;
}) {
  const [selectedItem, setSelectedItem] = useState<ChainOption | undefined>();
  useEffect(() => {
    if (chainName && chainInfos.length > 0)
      setSelectedItem(
        chainInfos.filter((options) => options.chainName === chainName)[0]
      );
    if (!chainName) setSelectedItem(undefined);
  }, [chainInfos, chainName]);
  return (
    <ChainSelectorDropdown
      data={chainInfos}
      selectedItem={selectedItem}
      onChange={onChange}
    />
  );
}
