import { ChainContext } from "@/contexts/ChainContext";
import { CHAIN_NEUTRON, CHAIN_TERRA } from "@/utils/constants";
import { Select } from "@chakra-ui/react";
import { useContext } from "react";

export const ChainSelector = () => {
  const { currentChain, setCurrentChain } = useContext(ChainContext);

  const handleSelectChange = (event: any) => {
    const selectedOption = event.target.value;
    setCurrentChain(selectedOption);
  };

  return (
    <Select defaultValue={currentChain} onChange={handleSelectChange}>
      <option value={CHAIN_TERRA}>{CHAIN_TERRA}</option>
      <option value={CHAIN_NEUTRON}>{CHAIN_NEUTRON}</option>
    </Select>
  );
};
