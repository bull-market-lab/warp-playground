import { TOKENS } from "@/utils/token";
import { POOLS } from "@/utils/pools";
import { Select, Flex } from "@chakra-ui/react";
import { CHAIN_ID_PHOENIX_1, CHAIN_ID_PISCO_1 } from "@/utils/network";

type SelectPoolProps = {
  chainID: string;
  onChangeTokenOffer: (updatedTokenOfferAddress: string) => void;
  onChangeTokenReturn: (updatedTokenReturnAddress: string) => void;
  onChangePoolAddress: (updatedPoolAddress: string) => void;
};

export const SelectPool = ({
  chainID,
  onChangeTokenOffer,
  onChangeTokenReturn,
  onChangePoolAddress,
}: SelectPoolProps) => {
  const handleSelectChange = (event: any) => {
    const selectedOption = event.target.value;
    if (chainID === CHAIN_ID_PHOENIX_1) {
      if (selectedOption === "option1") {
        onChangeTokenOffer(TOKENS[chainID]?.axlusdc!);
        onChangeTokenReturn(TOKENS[chainID]?.native);
        onChangePoolAddress(POOLS[chainID]?.axlusdcNative!);
      } else if (selectedOption === "option2") {
        onChangeTokenOffer(TOKENS[chainID]?.native);
        onChangeTokenReturn(TOKENS[chainID]?.axlusdc!);
        onChangePoolAddress(POOLS[chainID].axlusdcNative!);
      } else if (selectedOption === "option3") {
        onChangeTokenOffer(TOKENS[chainID]?.axlusdc!);
        onChangeTokenReturn(TOKENS[chainID]?.astro);
        onChangePoolAddress(POOLS[chainID].axlusdcAstro!);
      } else if (selectedOption === "option4") {
        onChangeTokenOffer(TOKENS[chainID]?.astro);
        onChangeTokenReturn(TOKENS[chainID]?.axlusdc!);
        onChangePoolAddress(POOLS[chainID].axlusdcAstro!);
      }
    } else if (chainID === CHAIN_ID_PISCO_1) {
      if (selectedOption === "option1") {
        onChangeTokenOffer(TOKENS[chainID]?.astro);
        onChangeTokenReturn(TOKENS[chainID]?.native);
        onChangePoolAddress(POOLS[chainID].astroNative);
      } else if (selectedOption === "option2") {
        onChangeTokenOffer(TOKENS[chainID]?.native);
        onChangeTokenReturn(TOKENS[chainID]?.astro);
        onChangePoolAddress(POOLS[chainID].astroNative);
      }
    }
  };

  return (
    <Flex align="center" justify="center" direction="column">
      {chainID === CHAIN_ID_PHOENIX_1 ? (
        <Select
          width="250px"
          placeholder=""
          onChange={handleSelectChange}
          defaultValue="option1"
        >
          <option value="option1">swap axlUSDC to LUNA</option>
          <option value="option2">swap LUNA to axlUSDC</option>
          <option value="option3">swap axlUSDC to ASTRO</option>
          <option value="option4">swap ASTRO to axlUSDC</option>
        </Select>
      ) : (
        <Select
          width="250px"
          placeholder=""
          onChange={handleSelectChange}
          defaultValue="option1"
        >
          <option value="option1">swap ASTRO to LUNA </option>
          <option value="option2">swap LUNA to ASTRO</option>
        </Select>
      )}
    </Flex>
  );
};
