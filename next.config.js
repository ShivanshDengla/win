/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.coingecko.com'], // Add the external domain here
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/walletconnect.txt',
        destination: '/api/walletconnect',
      },
    ]
  },
  transpilePackages: ['@farcaster/frame-sdk', '@farcaster/frame-wagmi-connector'],
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig;
