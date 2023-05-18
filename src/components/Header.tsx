import { useState } from "react";
import QRCode from "react-qr-code";
import Head from "next/head";
import { useShuttle } from "@delphi-labs/shuttle";

import { getNetworkByChainId, networks } from "@/config/networks";
import { isAndroid, isIOS, isMobile } from "@/utils/device";
import useWallet from "@/hooks/useWallet";
import { useShuttlePortStore } from "@/config/store";

export default function Header() {
  const [currentNetworkId, switchNetwork] = useShuttlePortStore((state) => [
    state.currentNetworkId,
    state.switchNetwork,
  ]);
  const {
    connect,
    mobileConnect,
    disconnectWallet,
    providers,
    mobileProviders,
  } = useShuttle();
  const [walletconnectUrl, setWalletconnectUrl] = useState("");
  const wallet = useWallet();

  return (
    <>
      <Head>
        <title>WarpWorld</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <hr />
        <div>
          <label htmlFor="currentNetwork">Current network:</label>
          <select
            id="currentNetwork"
            onChange={(e) => switchNetwork(e.target.value)}
            value={currentNetworkId}
          >
            {networks.map((network) => (
              <option key={network.chainId} value={network.chainId}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        <hr />

        {!wallet && (
          <div>
            {providers.map((provider) => {
              if (!provider.networks.has(currentNetworkId)) return;

              return (
                <button
                  key={provider.id}
                  onClick={() =>
                    connect({
                      providerId: provider.id,
                      chainId: currentNetworkId,
                    })
                  }
                  disabled={!provider.initialized}
                >
                  {provider.name}
                </button>
              );
            })}
            {mobileProviders.map((mobileProvider) => {
              if (!mobileProvider.networks.has(currentNetworkId)) return;

              return (
                <button
                  key={mobileProvider.id}
                  onClick={async () => {
                    const urls = await mobileConnect({
                      mobileProviderId: mobileProvider.id,
                      chainId: currentNetworkId,
                      callback: () => {
                        setWalletconnectUrl("");
                      },
                    });

                    if (isMobile()) {
                      if (isAndroid()) {
                        window.location.href = urls.androidUrl;
                      } else if (isIOS()) {
                        window.location.href = urls.iosUrl;
                      } else {
                        window.location.href = urls.androidUrl;
                      }
                    } else {
                      setWalletconnectUrl(urls.walletconnectUrl);
                    }
                  }}
                  disabled={!mobileProvider.initialized}
                >
                  {mobileProvider.name}
                </button>
              );
            })}
          </div>
        )}

        {wallet && (
          <div>
            <p>Address: {wallet.account.address}</p>
            <button onClick={() => disconnectWallet(wallet)}>Disconnect</button>
          </div>
        )}

        <hr />
      </header>

      {walletconnectUrl && (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
          <div
            className="absolute inset-0 z-0 bg-black opacity-20"
            onClick={() => setWalletconnectUrl("")}
          ></div>
          <div className="relative flex min-h-[408px] min-w-[384px] flex-col items-center rounded-lg bg-white py-10 px-14 shadow-md">
            <button
              className="absolute top-3 right-3 rounded bg-black p-1.5 text-white"
              onClick={() => setWalletconnectUrl("")}
            >
              Close
            </button>

            <h2 className="mb-2 text-xl">Wallet Connect</h2>

            <div className="flex flex-col items-center">
              <p className="mb-4 text-center text-sm text-gray-600">
                Scan this QR code with your mobile wallet
              </p>
              <QRCode value={walletconnectUrl} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
