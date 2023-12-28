import "@/styles/globals.css";
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

        {/* <QueryClientProvider client={queryClient}> */}
        <Component {...pageProps} />
        {/* <ReactQueryDevtools /> */}
        {/* </QueryClientProvider> */}

        {/* <Toaster position="top-center" /> */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
