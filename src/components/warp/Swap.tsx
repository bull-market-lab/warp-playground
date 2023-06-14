import { DENOM_TO_TOKEN_NAME } from "@/config/tokens";
import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

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
    <Flex align="center" justify="center" style={{ marginTop: '10px' }}>
      swap
      <NumberInput
        defaultValue={offerTokenBalance}
        min={0}
        step={1}
        precision={3}
        onChange={onChangeTokenOfferAmount}
        width={150}
      >
        <NumberInputField style={{ textAlign: "center" }} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {DENOM_TO_TOKEN_NAME[offerAssetAddress]}
      {" to "}
      <NumberInput value={returnAmount} precision={3} width={150}>
        <NumberInputField disabled={true} style={{ textAlign: "center" }} />
      </NumberInput>
      {DENOM_TO_TOKEN_NAME[returnAssetAddress]}
    </Flex>
  );
};
