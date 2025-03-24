import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import FrameSDK from '@farcaster/frame-sdk';
import farcasterFrame from '@farcaster/frame-wagmi-connector';
import { connect } from 'wagmi/actions';

import { config } from '../wagmi';

const client = new QueryClient();

function FarcasterFrameProvider({ children }: React.PropsWithChildren<{}>) {
  useEffect(() => {
    const init = async () => {
      const context = await FrameSDK.context;

      // Autoconnect if running in a frame.
      if (context?.client.clientFid) {
        connect(config, { connector: farcasterFrame() });
      }

      // Hide splash screen after UI renders.
      setTimeout(() => {
        FrameSDK.actions.ready();
      }, 500);
    };
    init();
  }, []);

  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <FarcasterFrameProvider>
            <Component {...pageProps} />
          </FarcasterFrameProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
