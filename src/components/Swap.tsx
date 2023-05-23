import { DENOM_TO_TOKEN_NAME } from "@/config/tokens";
import { Flex, Box, NumberInput, NumberInputField } from "@chakra-ui/react";

type SwapProps = {
  offerAssetAddress: string;
  returnAssetAddress: string;
  returnAmount: string;
  offerTokenBalance: number;
  onChangeTokenOfferAmount: (
    valueAsString: string,
    valueAsNumber: number
  ) => void;
};

export const Swap = ({
  offerAssetAddress,
  returnAssetAddress,
  returnAmount,
  offerTokenBalance,
  onChangeTokenOfferAmount,
}: SwapProps) => {
  return (
    <Flex>
      <Box>swap</Box>
      <NumberInput
        defaultValue={offerTokenBalance}
        min={0}
        // max={tokenOfferBalance.data}
        onChange={onChangeTokenOfferAmount}
      >
        <NumberInputField />
      </NumberInput>
      <Box>{DENOM_TO_TOKEN_NAME[offerAssetAddress]} to</Box>
      <NumberInput value={returnAmount}>
        <NumberInputField disabled={true} />
      </NumberInput>
      <Box>{DENOM_TO_TOKEN_NAME[returnAssetAddress]}</Box>
    </Flex>
  );
};
