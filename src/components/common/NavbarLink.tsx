import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MouseEventHandler } from "react";
import * as csstype from "csstype";
import { CHAIN_TERRA } from "@/utils/constants";

const NavbarLink = ({
  text,
  href,
  underConstruction = false,
  onClick,
}: {
  text: string;
  href: string;
  underConstruction?: boolean;
  onClick?: MouseEventHandler;
}) => {
  const params = useSearchParams();
  const selectedChain = params.get("chain")?.toLowerCase() ?? CHAIN_TERRA;
  const pathname = usePathname();

  const defaultStyle = {
    fontSize: "24px",
    fontWeight: 800,
  };

  const wrapperStyle = underConstruction
    ? {
        color: "rgba(210, 187, 166, 0.8)",
        pointerEvents: "none" as csstype.Property.PointerEvents, // need this or type error
      }
    : pathname === href
    ? {
        color: "brand.red",
        textDecoration: "underline",
        textUnderlineOffset: "8px",
        textDecorationThickness: "3.5px",
      }
    : {
        color: "brand.darkerBrown",
        _hover: {
          color: "brand.red",
        },
      };

  return (
    <Link
      href={
        underConstruction
          ? `/?chain=${selectedChain}`
          : `${href}/?chain=${selectedChain}`
      }
      onClick={onClick}
    >
      <Text
        transition="0.2s all"
        p="2"
        whiteSpace="nowrap"
        {...defaultStyle}
        {...wrapperStyle}
      >
        {text}
        {underConstruction ? <sup>(soon)</sup> : null}
      </Text>
    </Link>
  );
};

export default NavbarLink;
