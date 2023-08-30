import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { Token } from "@/utils/constants";

type SwapProps = {
  offerToken: Token;
  returnToken: Token;
  returnTokenAmount: string;
  offerTokenBalance: number;
  onChangeOfferTokenAmount: (
    valueAsString: string,
    valueAsNumber: number
  ) => void;
};

const Swap = ({
  offerToken,
  returnToken,
  returnTokenAmount,
  offerTokenBalance,
  onChangeOfferTokenAmount,
}: SwapProps) => {
  return (
    <Flex align="center" justify="center" style={{ marginTop: "10px" }}>
      swap
      <NumberInput
        defaultValue={offerTokenBalance}
        min={0}
        step={1}
        precision={3}
        onChange={onChangeOfferTokenAmount}
        width={150}
      >
        <NumberInputField style={{ textAlign: "center" }} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {offerToken.name}
      {" to "}
      <NumberInput value={returnTokenAmount} precision={3} width={150}>
        <NumberInputField disabled={true} style={{ textAlign: "center" }} />
      </NumberInput>
      {returnToken.name}
    </Flex>
  );
};

export default Swap;
