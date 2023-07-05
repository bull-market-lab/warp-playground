import {
  Box,
  Button,
  Center,
  Link,
  Flex,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@terra-money/wallet-kit";
import copy from "copy-to-clipboard";
import { useContext } from "react";

import PopoverWrapper from "@/components/common/PopoverWrapper";
import WalletNetwork from "@/components/terra-wallet-kit/WalletNetwork";
import WalletIcon from "@/components/terra-wallet-kit/WalletIcon";
import CopyIcon from "@/components/common/CopyIcon";
import ExternalLinkIcon from "@/components/common/ExternalLinkIcon";
import { truncateString } from "@/utils/formatHelpers";
import useBalance from "@/hooks/useBalance";
import ChainContext from "@/contexts/ChainContext";
import { CHAIN_TERRA } from "@/utils/constants";
import BigNumber from "bignumber.js";

const WalletInfo = () => {
  const { disconnect } = useWallet();
  const { currentChainId, myAddress, currentChain } = useContext(ChainContext);

  const balance = useBalance({
    ownerAddress: myAddress,
    tokenAddress: currentChain === CHAIN_TERRA ? "uluna" : "untrn",
  });

  return (
    <PopoverWrapper
      title="My wallet"
      triggerElement={() => (
        <Button type="button" bg="none" p="0" _hover={{ bg: "none" }}>
          <WalletNetwork chainID={currentChainId} />
          <Flex color="white" justify="center">
            <Box
              color="white"
              bg="brand.darkBrown"
              py="2"
              px="3"
              borderTopLeftRadius="full"
              borderBottomLeftRadius="full"
              mr="0.5"
            >
              <HStack spacing="3">
                <WalletIcon w="1.25rem" h="1.25rem" />
                <Text fontSize="md" color="white">
                  {truncateString(myAddress)}
                </Text>
              </HStack>
            </Box>
            <Center
              color="white"
              bg="brand.darkBrown"
              py="2"
              px="3"
              borderTopRightRadius="full"
              borderBottomRightRadius="full"
            >
              <HStack spacing="2">
                <Text fontSize="md" color="white">
                  {currentChain === CHAIN_TERRA ? "LUNA" : "NTRN"}
                </Text>
                <Text fontSize="md" color="white">
                  {BigNumber(balance.data).toFixed(3).toString()}
                </Text>
              </HStack>
            </Center>
          </Flex>
        </Button>
      )}
    >
      <Flex direction="column" justify="center">
        <VStack mt={6} align="flex-start">
          <Text textStyle="minibutton">My Address</Text>
          <Text fontSize="xs" variant="dimmed">
            {myAddress}
          </Text>
        </VStack>
        <Flex mt={3} justify="left" verticalAlign="middle">
          <Button onClick={() => copy(myAddress || "")} variant="simple">
            <HStack>
              <CopyIcon width="1.5rem" height="1.5rem" />
              <Text
                textStyle="small"
                variant="dimmed"
                _hover={{
                  textDecoration: "underline",
                  textUnderlineOffset: "0.3rem",
                }}
              >
                Copy
              </Text>
            </HStack>
          </Button>
          <Link
            isExternal
            href={
              currentChain === CHAIN_TERRA
                ? `https://finder.terra.money/${currentChainId}/address/${myAddress}`
                : `https://neutron.celat.one/${currentChainId}/accounts/${myAddress}`
            }
            ml="6"
            my="auto"
            textUnderlineOffset="0.3rem"
          >
            <HStack>
              <ExternalLinkIcon width="1.5rem" height="1.5rem" />
              <Text textStyle="small" variant="dimmed">
                View on explorer
              </Text>
            </HStack>
          </Link>
        </Flex>
        <Box mt="6">
          <Button type="button" variant="primary" w="100%" onClick={disconnect}>
            Disconnect
          </Button>
        </Box>
      </Flex>
    </PopoverWrapper>
  );
};

export default WalletInfo;
