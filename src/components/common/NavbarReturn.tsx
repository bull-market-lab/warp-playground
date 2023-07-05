import { HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ArrowLeftIcon from "@/components/common/ArrowLeftIcon";
import { CHAIN_TERRA } from "@/utils/constants";

const NavbarReturn = ({ onClick }: { onClick?: React.MouseEventHandler }) => {
  const params = useSearchParams();
  const selectedChain = params.get("chain")?.toLowerCase() ?? CHAIN_TERRA;

  return (
    <Link href={`/?chain=${selectedChain}`} onClick={onClick}>
      <Text
        color="brand.darkerBrown"
        fill="brand.darkerBrown"
        _hover={{
          color: "brand.red",
          fill: "brand.red",
        }}
        transition="0.2s all"
        whiteSpace="nowrap"
      >
        <HStack>
          <ArrowLeftIcon w="3rem" h="3rem" />
          <Text fontSize="1.5rem" fontWeight="800">
            Back
          </Text>
        </HStack>
      </Text>
    </Link>
  );
};

export default NavbarReturn;
