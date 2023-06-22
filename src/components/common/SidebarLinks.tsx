import { VStack } from "@chakra-ui/react";
import React, { FC } from "react";

import NavbarLink from "@/components/common/NavbarLink";
import NavbarReturn from "@/components/common/NavbarReturn";

type Props = {
  isBack: boolean;
  onClick?: React.MouseEventHandler;
};
export const SidebarLinks: FC<Props> = ({ isBack = false, onClick }) => {
  return (
    <VStack align="flex-start" mt="20">
      {isBack ? <NavbarReturn onClick={onClick} /> : null}
      {isBack ? null : <NavbarLink onClick={onClick} text="DCA" href="/" />}
      {isBack ? null : (
        <NavbarLink onClick={onClick} text="Limit Order" href="/limit_order" />
      )}
      {/* {isBack ? null : (
          <NavbarLink onClick={onClick} text="Staking+" href="/staking" />
        )} */}
      {isBack ? null : (
        <NavbarLink onClick={onClick} text="About" href="/about" />
      )}
    </VStack>
  );
};
