import { Flex, Box } from "@chakra-ui/react";
import { WarpCreateAccount } from "./WarpCreateAccount";

type WarpAccountProps = {
  myAddress: string;
  warpAccountAddress: string;
  warpControllerAddress: string;
};

export const WarpAccount = ({
  myAddress,
  warpAccountAddress,
  warpControllerAddress,
}: WarpAccountProps) => {
  return (
    <Flex align="center" justify="center">
      {/* {warpAccountAddress ? (
        <Box>warp account address: {warpAccountAddress}</Box>
      ) : (
        <WarpCreateAccount
          senderAddress={myAddress}
          warpControllerAddress={warpControllerAddress}
        />
      )} */}
      {!warpAccountAddress && (
        <WarpCreateAccount
          senderAddress={myAddress}
          warpControllerAddress={warpControllerAddress}
        />
      )}
    </Flex>
  );
};
