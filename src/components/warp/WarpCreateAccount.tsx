import { Box } from "@chakra-ui/react";
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
    <Box>
      you need to have a warp account to use this app{" "}
      <CreateAndBroadcastTxModal
        msgs={createWarpAccount.msgs}
        buttonText={"create"}
        disabled={false}
      />
    </Box>
  );
};
