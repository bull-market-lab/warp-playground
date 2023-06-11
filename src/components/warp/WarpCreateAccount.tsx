import { WalletConnection } from "@delphi-labs/shuttle";
import { Flex, Box } from "@chakra-ui/react";
import { useWarpCreateAccount } from "@/hooks/useWarpCreateAccount";
import { CreateAndBroadcastTxModal } from "@/components/warp/CreateAndBroadcastTxModal";

type WarpCreateAccountProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
};

export const WarpCreateAccount = ({
  wallet,
  warpControllerAddress,
}: WarpCreateAccountProps) => {
  const createWarpAccount = useWarpCreateAccount({
    warpControllerAddress,
  });

  return (
    <Flex align="center" justify="center">
      <Box>
        warp account not exist
        <CreateAndBroadcastTxModal
          wallet={wallet}
          msgs={createWarpAccount.msgs}
          buttonText={"create warp account"}
          disabled={false}
        />
      </Box>
    </Flex>
  );
};
