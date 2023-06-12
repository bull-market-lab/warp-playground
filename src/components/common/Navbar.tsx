import {
  useDisclosure,
  Flex,
  Box,
  Button,
  HStack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { useConnectedWallet } from "@terra-money/wallet-kit";
import React, { FC } from "react";

import BurgerIcon from "@/components/common/BurgerIcon";
import CloseIcon from "@/components/common/CloseIcon";
import NavbarLink from "@/components/common/NavbarLink";
import NavbarReturn from "@/components/common/NavbarReturn";
import WalletInfo from "@/components/common/WalletInfo";
import WalletConnect from "@/components/common/WalletConnect";

type Props = {
  isBack: boolean;
  onClick?: React.MouseEventHandler;
};

const NavbarLinks: FC<Props> = ({ isBack = false }) => {
  return (
    <HStack
      display={["none", null, "block", null]}
      flex="1"
      px="12"
      spacing="6"
    >
      {isBack ? <NavbarReturn /> : null}
      <Flex direction="row">
        {isBack ? null : <NavbarLink text="DCA" href="/" />}
        {isBack ? null : <NavbarLink text="Limit Order" href="/limit_order" />}
        {isBack ? null : <NavbarLink text="About" href="/about" />}
      </Flex>
    </HStack>
  );
};

const SidebarLinks: FC<Props> = ({ isBack = false, onClick }) => {
  return (
    <VStack align="flex-start" mt="20">
      {isBack ? <NavbarReturn onClick={onClick} /> : null}
      {isBack ? null : <NavbarLink onClick={onClick} text="DCA" href="/" />}
      {isBack ? null : (
        <NavbarLink onClick={onClick} text="Limit Order" href="/limit_order" />
      )}
      {isBack ? null : (
        <NavbarLink onClick={onClick} text="About" href="/about" />
      )}
    </VStack>
  );
};

const Navbar: FC = () => {
  const wallet = useConnectedWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572#issuecomment-493942129
  const btnRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <Box w="100%" py="6">
      <Flex w="100%" justify="space-between" align="center">
        <NavbarLinks isBack={false} />
        <HStack justify="flex-end">
          {wallet ? <WalletInfo wallet={wallet} /> : <WalletConnect />}
          <Button
            display={[null, null, "none", null]}
            variant="simple"
            minW="1.5rem"
            pl="1"
            ref={btnRef}
            onClick={onOpen}
          >
            <BurgerIcon color="brand.black" width="1.5rem" height="1.5rem" />
          </Button>
        </HStack>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size="sm"
        onClose={onClose}
        finalFocusRef={btnRef}
        preserveScrollBarGap={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Flex
            height="100%"
            bg="brand.lighterBrown"
            zIndex="100"
            px={["6", null, "12"]}
            py="8"
            direction="column"
          >
            <Flex justify="space-between" width="100%" align="center">
              <Button variant="simple" mr="-2" onClick={onClose}>
                <CloseIcon color="white" width="1.5rem" height="1.5rem" />
              </Button>
            </Flex>
            <SidebarLinks isBack={false} onClick={onClose} />
          </Flex>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
