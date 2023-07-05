import {
  useDisclosure,
  Flex,
  Box,
  Button,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import React, { FC, useContext } from "react";

import BurgerIcon from "@/components/common/BurgerIcon";
import CloseIcon from "@/components/common/CloseIcon";
import { Wallet as TerraWallet } from "@/components/terra-wallet-kit/Wallet";
import NavbarLinks from "@/components/common/NavbarLinks";
import SidebarLinks from "@/components/common/SidebarLinks";
import { ChainSelector } from "@/components/common/ChainSelector";
import ChainContext from "@/contexts/ChainContext";
import { CHAIN_NEUTRON } from "@/utils/constants";

const Navbar: FC = () => {
  const { currentChain } = useContext(ChainContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572#issuecomment-493942129
  const btnRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <Box w="100%" py="6">
      {currentChain === CHAIN_NEUTRON && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Warp is not live on Neutron yet!</AlertTitle>
          <AlertDescription>
            You are viewing mocked data now. Please switch to Terra for real
            data.
          </AlertDescription>
        </Alert>
      )}
      <Flex w="100%" justify="space-between" align="center">
        <NavbarLinks isBack={false} />
        <ChainSelector />
        <HStack justify="flex-end">
          <TerraWallet />
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
