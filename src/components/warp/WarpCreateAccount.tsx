import { Flex, Box } from "@chakra-ui/react";
import { useWarpCreateAccount } from "@/hooks/useWarpCreateAccount";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCreateAccountProps = {
  senderAddress?: string;
  warpControllerAddress?: string;
};

export const WarpCreateAccount = ({
  senderAddress,
  warpControllerAddress,
}: WarpCreateAccountProps) => {
  const createWarpAccount = useWarpCreateAccount({
    senderAddress,
    warpControllerAddress,
  });

  return (
    <Flex align="center" justify="center">
      <Box>
        warp account not exist
        <CreateAndBroadcastTxModal
          msgs={createWarpAccount.msgs}
          buttonText={"create warp account"}
          disabled={false}
        />
      </Box>
    </Flex>
  );
};
