import React from "react";
import { Select, Flex } from "@chakra-ui/react";

import { Token } from "@/utils/constants";
import useMyWallet from "@/hooks/useMyWallet";

const SelectPool = ({
  onChangeOfferToken,
  onChangeReturnToken,
  onChangePoolAddress,
}: {
  onChangeOfferToken: (updatedOfferToken: Token) => void;
  onChangeReturnToken: (updatedReturnToken: Token) => void;
  onChangePoolAddress: (updatedPoolAddress: string) => void;
}) => {
  const { currentChainConfig } = useMyWallet();
  const pools = currentChainConfig.pools;

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
            <React.Fragment key={idx}>
              <option
                value={JSON.stringify({
                  poolAddress: pool.address,
                  offerToken: pool.token1,
                  returnToken: pool.token2,
                })}
              >
                swap {pool.token1.name} to {pool.token2.name}
              </option>
              <option
                value={JSON.stringify({
                  poolAddress: pool.address,
                  offerToken: pool.token2,
                  returnToken: pool.token1,
                })}
              >
                swap {pool.token2.name} to {pool.token1.name}
              </option>
            </React.Fragment>
          );
        })}
      </Select>
    </Flex>
  );
};

export default SelectPool;
