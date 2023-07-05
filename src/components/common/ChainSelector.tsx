import { useContext } from "react";
import { Select } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

import ChainContext from "@/contexts/ChainContext";
import { CHAIN_NEUTRON, CHAIN_TERRA } from "@/utils/constants";

export const ChainSelector = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { currentChain } = useContext(ChainContext);

  const handleSelectChange = (event: any) => {
    const selectedOption = event.target.value;
    router.push(`${pathname}/?chain=${selectedOption}`);
  };

  return (
    <Select defaultValue={currentChain} onChange={handleSelectChange}>
      <option value={CHAIN_TERRA}>Terra</option>
      <option value={CHAIN_NEUTRON}>Neutron</option>
    </Select>
  );
};
