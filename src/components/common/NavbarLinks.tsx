import { Flex, HStack } from "@chakra-ui/react";

import NavbarLink from "@/components/common/NavbarLink";
import NavbarReturn from "@/components/common/NavbarReturn";

const NavbarLinks = ({ isBack = false }: { isBack: boolean }) => {
  return (
    <HStack
      display={["none", null, "block", null]}
      flex="1"
      px="12"
      spacing="6"
    >
      {isBack ? <NavbarReturn /> : null}
      <Flex direction="row">
        {isBack ? null : <NavbarLink text="Home" href="/" />}
        {isBack ? null : <NavbarLink text="Limit Order" href="/limit_order" />}
        {isBack ? null : <NavbarLink text="DCA Order" href="/dca_order" />}
        {isBack ? null : (
          <NavbarLink text="Stream Order" href="/stream_order" />
        )}
        {/* {isBack ? null : (
          <NavbarLink text="Vesting" href="/vesting" underConstruction={true} />
        )} */}
      </Flex>
    </HStack>
  );
};

export default NavbarLinks;
