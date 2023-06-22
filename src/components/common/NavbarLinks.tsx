import { Flex, HStack } from "@chakra-ui/react";
import React, { FC } from "react";

import NavbarLink from "@/components/common/NavbarLink";
import NavbarReturn from "@/components/common/NavbarReturn";

type Props = {
  isBack: boolean;
  onClick?: React.MouseEventHandler;
};

export const NavbarLinks: FC<Props> = ({ isBack = false }) => {
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
        {/* {isBack ? null : <NavbarLink text="Staking+" href="/staking" />} */}
        {isBack ? null : <NavbarLink text="About" href="/about" />}
      </Flex>
    </HStack>
  );
};
