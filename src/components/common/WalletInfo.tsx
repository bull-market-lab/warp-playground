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
import {
  useWallet,
  ConnectResponse,
  useLcdClient,
} from "@terra-money/wallet-kit";
import copy from "copy-to-clipboard";
import { FC } from "react";

import PopoverWrapper from "@/components/common/PopoverWrapper";
import WalletNetwork from "@/components/common/WalletNetwork";
import WalletIcon from "@/components/common/WalletIcon";
import CopyIcon from "@/components/common/CopyIcon";
import ExternalLinkIcon from "@/components/common/ExternalLinkIcon";
import { truncateString } from "@/utils/formatHelpers";
import useBalance from "@/hooks/useBalance";
import { getChainIDByNetwork } from "@/utils/network";

type WalletInfoProps = {
  wallet: ConnectResponse;
};

const WalletInfo: FC<WalletInfoProps> = ({ wallet }: WalletInfoProps) => {
  const { disconnect } = useWallet();
  const lcd = useLcdClient();
  const chainID = getChainIDByNetwork(wallet.network);
  const myAddress = wallet.addresses[chainID];

  const balance = useBalance({
    lcd,
    chainID,
    ownerAddress: myAddress,
    tokenAddress: "uluna",
  });

  return (
    <PopoverWrapper
      title="My wallet"
      triggerElement={() => (
        <Button type="button" bg="none" p="0" _hover={{ bg: "none" }}>
          <WalletNetwork chainID={chainID} />
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
                  Luna
                </Text>
                <Text fontSize="md" color="white">
                  {balance.data}
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
          <Button onClick={() => copy(myAddress)} variant="simple">
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
            href={`https://finder.terra.money/${chainID}/address/${myAddress}`}
            ml="6"
            my="auto"
            textUnderlineOffset="0.3rem"
          >
            <HStack>
              <ExternalLinkIcon width="1.5rem" height="1.5rem" />
              <Text textStyle="small" variant="dimmed">
                View on Finder
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
