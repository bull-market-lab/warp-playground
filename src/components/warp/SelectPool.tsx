import { TOKENS } from "@/config/tokens";
import { TERRA_MAINNET, TERRA_TESTNET } from "@/config/networks";
import { POOLS } from "@/config/pools";
import { Select, Flex } from "@chakra-ui/react";

type SelectPoolProps = {
  currentNetworkId: string;
  onChangeTokenOffer: (updatedTokenOfferAddress: string) => void;
  onChangeTokenReturn: (updatedTokenReturnAddress: string) => void;
  onChangePoolAddress: (updatedPoolAddress: string) => void;
};

export const SelectPool = ({
  currentNetworkId,
  onChangeTokenOffer,
  onChangeTokenReturn,
  onChangePoolAddress,
}: SelectPoolProps) => {
  const handleSelectChange = (event: any) => {
    const selectedOption = event.target.value;
    if (currentNetworkId === TERRA_MAINNET.chainId) {
      if (selectedOption === "option1") {
        onChangeTokenOffer(TOKENS[currentNetworkId]?.axlusdc!);
        onChangeTokenReturn(TOKENS[currentNetworkId]?.native);
        onChangePoolAddress(POOLS[currentNetworkId]?.axlusdcNative!);
      } else if (selectedOption === "option2") {
        onChangeTokenOffer(TOKENS[currentNetworkId]?.native);
        onChangeTokenReturn(TOKENS[currentNetworkId]?.axlusdc!);
        onChangePoolAddress(POOLS[currentNetworkId].axlusdcNative!);
      } else if (selectedOption === "option3") {
        onChangeTokenOffer(TOKENS[currentNetworkId]?.axlusdc!);
        onChangeTokenReturn(TOKENS[currentNetworkId]?.astro);
        onChangePoolAddress(POOLS[currentNetworkId].axlusdcAstro!);
      } else if (selectedOption === "option4") {
        onChangeTokenOffer(TOKENS[currentNetworkId]?.astro);
        onChangeTokenReturn(TOKENS[currentNetworkId]?.axlusdc!);
        onChangePoolAddress(POOLS[currentNetworkId].axlusdcAstro!);
      }
    } else if (currentNetworkId === TERRA_TESTNET.chainId) {
      if (selectedOption === "option1") {
        onChangeTokenOffer(TOKENS[currentNetworkId]?.astro);
        onChangeTokenReturn(TOKENS[currentNetworkId]?.native);
        onChangePoolAddress(POOLS[currentNetworkId].astroNative);
      } else if (selectedOption === "option2") {
        onChangeTokenOffer(TOKENS[currentNetworkId]?.native);
        onChangeTokenReturn(TOKENS[currentNetworkId]?.astro);
        onChangePoolAddress(POOLS[currentNetworkId].astroNative);
      }
    }
  };

  return (
    <Flex align="center" justify="center" direction="column">
      {currentNetworkId === TERRA_MAINNET.chainId && (
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
      )}
      {currentNetworkId === TERRA_TESTNET.chainId && (
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
