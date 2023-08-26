import {
  useDisclosure,
  Button,
  HStack,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { useChain } from "@cosmos-kit/react";

import ModalWrapper from "@/components/common/ModalWrapper";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { getCosmosKitChainNameByChainId } from "@/utils/cosmosKitNetwork";

const WalletConnectButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentChainId } = useCurrentChainId();
  const { connect } = useChain(getCosmosKitChainNameByChainId(currentChainId));

  const buttons = [
    <Button
      key={0}
      w="100%"
      minH="4rem"
      bg="brand.darkBrown"
      p="6"
      mb="4"
      borderRadius="xl"
      transition="0.2s all"
      _hover={{
        bg: "brand.darkerBrown",
        color: "white",
      }}
      onClick={(e) => {
        onClose();
        // connect();
        // e.preventDefault();
        connect();
      }}
    >
      <Flex w="100%" align="center">
        <Text>{"Keplr"}</Text>
        <Spacer />
        {/* <Image src={extensionProvider.icon} htmlWidth="24" alt="" /> */}
      </Flex>
    </Button>,
  ];

  return (
    <Button
      type="button"
      bg="brand.darkBrown"
      color="white"
      py="2"
      px="4"
      borderRadius="full"
      _focus={{
        outline: "none",
        boxShadow: "none",
      }}
      _hover={{
        bg: "brand.darkerBrown",
      }}
      onClick={onOpen}
    >
      <HStack spacing="3">
        <Text fontSize="md">Connect your wallet</Text>
      </HStack>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title="Connect to a wallet"
      >
        {buttons}
      </ModalWrapper>
    </Button>
  );
};

export default WalletConnectButton;
