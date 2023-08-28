import { Select } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

import { CHAIN_NEUTRON, CHAIN_TERRA } from "@/utils/constants";
import useMyWallet from "@/hooks/useMyWallet";

const ChainSelector = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { currentChain } = useMyWallet();

  const handleSelectChange = (event: any) => {
    const selectedOption = event.target.value;
    router.push(`${pathname}/?chain=${selectedOption}`);
  };

  return (
    <Select defaultValue={currentChain} onChange={handleSelectChange}>
      <option value={CHAIN_TERRA}>Terra Testnet</option>
      <option value={CHAIN_NEUTRON}>Neutron Testnet</option>
      {/* <option value={CHAIN_OSMOSIS}>Osmosis</option> */}
    </Select>
  );
};

export default ChainSelector;
