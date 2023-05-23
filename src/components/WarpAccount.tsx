import { Flex, Box } from "@chakra-ui/react";

type WarpAccountProps = {
  warpAccountAddress: string;
};
export const WarpAccount = ({ warpAccountAddress }: WarpAccountProps) => {
  return (
    <Flex align="center" justify="center">
      <Box>warp account address: {warpAccountAddress}</Box>
    </Flex>
  );
};
