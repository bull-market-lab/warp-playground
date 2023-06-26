import {
  useDisclosure,
  Button,
  HStack,
  Flex,
  Spacer,
  Image,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@terra-money/wallet-kit";
import { FC } from "react";

import ModalWrapper from "./ModalWrapper";
import TerraIcon from "./TerraIcon";

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
  const { connect, availableWallets } = useWallet();

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

  const buttons = wallets.map((wallet, index) => (
    <Button
      key={index}
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
        wallet.walletAction();
      }}
    >
      <Flex w="100%" align="center">
        <Text>{wallet.name}</Text>
        <Spacer />
        <Image src={wallet.icon} htmlWidth="24" alt="" />
      </Flex>
    </Button>
  ));

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
        <TerraIcon width="1.25rem" height="1.25rem" />
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
