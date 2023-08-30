import useWarpGetDefaultAccount from "@/hooks/query/useWarpGetDefaultAccount";
import useWarpGetFirstFreeSubAccount from "@/hooks/query/useWarpGetFirstFreeSubAccount";
import { Box, Flex } from "@chakra-ui/react";
import WarpCreateDefaultAccountAndSubAccount from "./WarpCreateDefaultAccountAndSubAccount";
import WarpCreateSubAccount from "./WarpCreateSubAccount";

const WarpAccount = () => {
  const warpDefaultAccountResult =
    useWarpGetDefaultAccount().accountResult.data;
  const warpFirstFreeSubAccountResult =
    useWarpGetFirstFreeSubAccount().accountResult.data;

  return (
    <Flex align="center" justify="center" direction="column">
      {!warpDefaultAccountResult ? (
        <Flex align="center" justify="center" direction="column">
          <Box>please create a warp default account and a sub account</Box>
          <WarpCreateDefaultAccountAndSubAccount />
        </Flex>
      ) : (
        !warpFirstFreeSubAccountResult && (
          <Flex align="center" justify="center" direction="column">
            <Box>no available warp sub account, please create one</Box>
            <WarpCreateSubAccount />
          </Flex>
        )
      )}
    </Flex>
  );
};

export default WarpAccount;
