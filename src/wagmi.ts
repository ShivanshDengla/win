import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, base } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import { createConfig } from 'wagmi';
import { ADDRESS } from './constants/address'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT environment variable')
}

export const PROVIDER = createPublicClient({
  chain: base,
  transport: http(ADDRESS.RPCURL),
});

// Create a custom config that includes the farcasterFrame connector
export const config = createConfig({
  chains: [optimism], // You had base commented out in the original
  transports: {
    [optimism.id]: http(optimism.rpcUrls.default.http[0]),
  },
  connectors: [
    farcasterFrame()
  ],
});

// If you still need RainbowKit functionality, you can use this alongside the custom config
export const rainbowConfig = getDefaultConfig({
  appName: 'WinWin',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT,
  chains: [
    optimism,
    // base
  ],
  ssr: true, // Since you're using Next.js
});