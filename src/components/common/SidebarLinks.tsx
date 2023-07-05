import { VStack } from "@chakra-ui/react";
import React from "react";

import NavbarLink from "@/components/common/NavbarLink";
import NavbarReturn from "@/components/common/NavbarReturn";

const SidebarLinks = ({
  isBack = false,
  onClick,
}: {
  isBack: boolean;
  onClick?: React.MouseEventHandler;
}) => {
  return (
    <VStack align="flex-start" mt="20">
      {isBack ? <NavbarReturn /> : null}
      {isBack ? null : <NavbarLink text="About" href="/" onClick={onClick} />}
      {isBack ? null : <NavbarLink text="DCA" href="/dca" onClick={onClick} />}
      {isBack ? null : (
        <NavbarLink text="Limit Order" href="/limit_order" onClick={onClick} />
      )}
      {isBack ? null : (
        <NavbarLink
          text="Vesting"
          href="/vesting"
          underConstruction={true}
          onClick={onClick}
        />
      )}
    </VStack>
  );
};

export default SidebarLinks;
