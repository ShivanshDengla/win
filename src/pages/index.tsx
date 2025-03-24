// pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
// import Tvl from '../components/Tvl';
import Prizes from '../components/Prizes';
import UserBalancesAndChance from '../components/UserInfo';
import Rewards from '../components/Rewards';
import PrizesWon from '../components/PrizesWon';
import Chance from '../components/Chance'
import Image from 'next/image';
import { MyConnect} from '../components/ConnectButton';
import BigWinners from '../components/BigWinners';
import MainPage from '../components/MainPage';
import PoweredBy from '../components/PoweredBy';
import CharityAmount from '../components/CharityAmount';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto">
      <Head>
        <title>winEth | PoolTogether Charity Vault</title>
        <meta content="Contribute to a good cause while saving and winning with PoolTogether" name="description" />
        <link href="/images/favicon.ico" rel="icon" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="winEth | PoolTogether Charity Vault" />
        <meta property="og:description" content="Contribute to a good cause while saving and winning with PoolTogether" />
        <meta property="og:image" content="https://wineth.org/images/embed.png" />
        <meta property="og:url" content="https://wineth.org" />
        <meta property="og:type" content="website" />


        {/* Twitter Card Images */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="winEth | PoolTogether Charity Vault" />
        <meta name="twitter:description" content="Contribute to a good cause while saving and winning with PoolTogether." />
        <meta name="twitter:image" content="https://wineth.org/images/embed.png" />

        {/* Farcaster Frame Meta Tag */}
        <meta name="fc:frame" content='{
          "version": "next",
          "imageUrl": "https://win-seven-theta.vercel.app/images/embed.png",
          "button":{
            "title": "Launch",
            "action": {
              "type": "launch_frame",
              "name": "WinEth",
              "url": "https://win-seven-theta.vercel.app",
              "splashImageUrl": "https://win-seven-theta.vercel.app/images/favicon.ico",
              "splashBackgroundColor": "#131313"
            }
          }
        }' data-rh="true" />

      </Head>

      <main className="flex flex-col min-h-screen pt-2">
        {/* Header section */}
        <div className="w-full flex justify-between items-center p-2 mb-8">
          <div>
            <Image
              src="/images/wineth.png"
              height={0}
              width={125}
              alt="WinEth Logo"
              className="h-auto sm:w-[150px]"
            />
          </div>
          <div className="hidden md:block">
            <CharityAmount />
          </div>
          <div>
            <MyConnect connectText="CONNECT" />
          </div>
        </div>
      
        {/* Main content section */}
        <div className="flex flex-col items-center">
          <div className="md:hidden flex justify-center mb-4">
            <CharityAmount />
          </div>
          <MainPage />
          <PoweredBy />
          <BigWinners />
        </div>
      </main>
    </div>
  );
};

export default Home;
