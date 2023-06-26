import { LCDClient } from "@terra-money/feather.js";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";
import { useContext, useEffect } from "react";

import WalletInfo from "./WalletInfo";
import WalletConnect from "./WalletConnect";
import { ChainContext } from "@/contexts/ChainContext";
import { getChainIDByNetwork, isValidNetwork } from "@/utils/network";
import {
  CHAIN_ID_PISCO_ONE,
  CHAIN_TERRA,
  NETWORK_MAINNET,
  NETWORK_TESTNET,
  Network,
} from "@/utils/constants";
import { CHAIN_ID_LOCALTERRA } from "@/utils/constants";
import { CHAIN_NEUTRON } from "@/utils/constants";
import { CHAIN_ID_PHOENIX_ONE } from "@/utils/constants";
import { CHAIN_ID_NEUTRON_ONE } from "@/utils/constants";
import { CHAIN_ID_PION_ONE } from "@/utils/constants";

export const Wallet = () => {
  const {
    currentChain,
    setCurrentChainId,
    setLCD,
    setMyAddress,
    setCurrentNetwork,
  } = useContext(ChainContext);
  const connectedWallet = useConnectedWallet();
  const { status, network } = useWallet();

  useEffect(() => {
    console.log("wallet connection status", status);
    switch (status) {
      case "CONNECTED":
        setLCD(new LCDClient(network));
        break;
      case "NOT_CONNECTED":
        setLCD(undefined);
        break;
      default:
        break;
    }
  }, [status]);

  useEffect(() => {
    console.log("wallet network", connectedWallet?.network);

    if (!connectedWallet || !connectedWallet?.network) {
      setCurrentNetwork(undefined);
    } else {
      if (!isValidNetwork(connectedWallet?.network)) {
        alert(
          `Invalid network ${connectedWallet?.network} selected. Please check your wallet settings.`
        );
      } else {
        setCurrentNetwork(connectedWallet?.network as Network);
      }
    }
  }, [connectedWallet?.network]);

  useEffect(() => {
    if (!connectedWallet || !connectedWallet?.network) {
      return;
    }
    if (currentChain === CHAIN_TERRA) {
      if (connectedWallet?.network === NETWORK_MAINNET) {
        setCurrentChainId(CHAIN_ID_PHOENIX_ONE);
        setMyAddress(connectedWallet?.addresses[CHAIN_ID_PHOENIX_ONE]);
      } else if (connectedWallet?.network === NETWORK_TESTNET) {
        setCurrentChainId(CHAIN_ID_PISCO_ONE);
        setMyAddress(connectedWallet?.addresses[CHAIN_ID_PISCO_ONE]);
      } else {
        setCurrentChainId(CHAIN_ID_LOCALTERRA);
        setMyAddress(connectedWallet?.addresses[CHAIN_ID_LOCALTERRA]);
      }
    } else if (currentChain === CHAIN_NEUTRON) {
      if (connectedWallet?.network === NETWORK_MAINNET) {
        setCurrentChainId(CHAIN_ID_NEUTRON_ONE);
        setMyAddress(connectedWallet?.addresses[CHAIN_ID_NEUTRON_ONE]);
      } else if (connectedWallet?.network === NETWORK_TESTNET) {
        setCurrentChainId(CHAIN_ID_PION_ONE);
        setMyAddress(connectedWallet?.addresses[CHAIN_ID_PION_ONE]);
      }
    }
  }, [connectedWallet?.network, currentChain]);

  return connectedWallet ? (
    <WalletInfo wallet={connectedWallet} />
  ) : (
    <WalletConnect />
  );
};
