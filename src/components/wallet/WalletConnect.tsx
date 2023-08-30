import {
  useDisclosure,
  Button,
  HStack,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";

import ModalWrapper from "@/components/common/ModalWrapper";
import useMyWallet from "@/hooks/useMyWallet";

type WalletOptions = {
  id: string;
  isInstalled?: boolean;
  name: string;
  icon: string;
  website?: string;
  walletAction: () => void;
};

const WalletConnectButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connect, availableWallets } = useMyWallet();

  const wallets: WalletOptions[] = [
    ...availableWallets
      .filter(({ isInstalled }) => isInstalled === true)
      .map(({ id, isInstalled, name, icon, website }) => ({
        id,
        isInstalled,
        name,
        icon,
        website,
        walletAction: () => {
          connect(id);
        },
      })),
    // ...availableInstallations
    //   .filter(({ type }) => type !== ConnectType.READONLY)
    //   .map(({ type, icon, name, url, identifier }) => ({
    //     type,
    //     identifier,
    //     name: "Install " + name,
    //     icon,
    //     isInstalled: false,
    //     walletAction: () => {
    //       window.open(url, "_blank");
    //     },
    //   })),
  ];

  //   const { connect, extensionProviders } = useShuttle();
  //   const { currentChainId } = useMyWallet();

  /// For shuttle wallet
  //   const buttons = extensionProviders.map((extensionProvider, index) => (

  /// For terra wallet kit
  //   const buttons = wallets.map((wallet, index) => (
  //     <Button
  //       key={index}
  //       w="100%"
  //       minH="4rem"
  //       bg="brand.darkBrown"
  //       p="6"
  //       mb="4"
  //       borderRadius="xl"
  //       transition="0.2s all"
  //       _hover={{
  //         bg: "brand.darkerBrown",
  //         color: "white",
  //       }}
  //       onClick={() => {
  //         onClose();
  //         wallet.walletAction();
  //       }}
  //     >
  //       <Flex w="100%" align="center">
  //         <Text>{wallet.name}</Text>
  //         <Spacer />
  //         <Image src={wallet.icon} htmlWidth="24" alt="" />
  //       </Flex>
  //     </Button>
  //   ));

  /// for cosmos kit
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
      onClick={() => {
        onClose();
        connect();
      }}
    >
      <Flex w="100%" align="center">
        <Text>{"Station"}</Text>
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
