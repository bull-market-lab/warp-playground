import { Select, Flex } from "@chakra-ui/react";

import { Token } from "@/utils/constants";
import { getChainConfig } from "@/utils/network";

type SelectPoolProps = {
  onChangeOfferToken: (updatedOfferToken: Token) => void;
  onChangeReturnToken: (updatedReturnToken: Token) => void;
  onChangePoolAddress: (updatedPoolAddress: string) => void;
};

export const SelectPool = ({
  onChangeOfferToken,
  onChangeReturnToken,
  onChangePoolAddress,
}: SelectPoolProps) => {
  const pools = getChainConfig().pools;

  type SelectedValue = {
    poolAddress: string;
    offerToken: Token;
    returnToken: Token;
  };

  const handleSelectChange = (event: any) => {
    const selectedOption: SelectedValue = JSON.parse(event.target.value);
    onChangePoolAddress(selectedOption.poolAddress);
    onChangeOfferToken(selectedOption.offerToken);
    onChangeReturnToken(selectedOption.returnToken);
  };

  const defaultSelectedValue: SelectedValue = {
    poolAddress: pools[0].address,
    offerToken: pools[0].token1,
    returnToken: pools[0].token2,
  };

  return (
    <Flex align="center" justify="center" direction="column">
      <Select
        width="250px"
        placeholder=""
        onChange={handleSelectChange}
        defaultValue={JSON.stringify(defaultSelectedValue)}
      >
        {pools.map((pool, idx) => {
          return (
            <>
              <option
                key={idx * 2}
                value={JSON.stringify({
                  poolAddress: pool.address,
                  offerToken: pool.token1,
                  ReturnToken: pool.token2,
                })}
              >
                swap {pool.token1.name} to {pool.token2.name}
              </option>
              <option
                key={idx * 2 + 1}
                value={JSON.stringify({
                  poolAddress: pool.address,
                  offerToken: pool.token2,
                  ReturnToken: pool.token1,
                })}
              >
                swap {pool.token2.name} to {pool.token1.name}
              </option>
            </>
          );
        })}
      </Select>
    </Flex>
  );
};
