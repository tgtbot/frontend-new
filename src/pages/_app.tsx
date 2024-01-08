import "@/styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon } from "wagmi/chains";
import Head from "next/head";
import merge from "lodash.merge";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/queries";
import login from "@/utils/login";
import { useEffect } from "react";
import type SDK from "@twa-dev/sdk";
import { useAtom } from "jotai";
import { sdkAtom } from "@/store";
import { TgtProvider } from "@/components/TgtProvider";
import Layout from "@/components/Layout/Layout";
import { Toaster } from "react-hot-toast";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  projectId: "53b01558af751506ffc6c5ada0907547",
  appName: "TGT",
  chains,
});

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
const customDarkTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#333",
    accentColorForeground: "#fff",
  },
  shadows: {
    connectButton: "none",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [, setSDK] = useAtom(sdkAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) return;

    if (typeof window !== "undefined") {
      const sdk = require("@twa-dev/sdk").default as typeof SDK;
      setSDK(sdk);

      if (sdk.initData) {
        login(sdk.initData, "telegramMiniApp").then((token) => {
          if (token) {
            localStorage.setItem("token", token);
          }
        });
      }
    }
  }, [setSDK]);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={customDarkTheme}
        modalSize="compact"
      >
        <Head>
          {/* Viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Favicon */}
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>

        <QueryClientProvider client={queryClient}>
          <TgtProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ReactQueryDevtools />
          </TgtProvider>
        </QueryClientProvider>

        <Toaster position="top-center" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
