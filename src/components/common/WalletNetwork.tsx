import { AVAILABLE_CHAIN_IDS } from "@/utils/network";
import { Box } from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  chainID: string;
};

const WalletNetwork: FC<Props> = ({ chainID }) => {
  if (AVAILABLE_CHAIN_IDS.includes(chainID)) {
    return null;
  } else {
    return (
      <Box
        color="white"
        bg="brand.red"
        px="10px"
        py="4px"
        borderRadius="full"
        fontSize="sm"
        fontWeight="800"
        textTransform="uppercase"
        minW="0"
        position="absolute"
        top="-1rem"
        right="-0.5rem"
        zIndex="1"
      >
        {chainID ? chainID : "network unknown"}
      </Box>
    );
  }
};

export default WalletNetwork;
