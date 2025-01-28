import { useState, useEffect, useRef } from "react";
import { ADDRESS } from "../constants/address";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import { RewardsData } from "../fetch/getRewards";
import RewardsClaim from "./RewardsClaim"
import {
  ParseDepositTokenAmount,
  ParseVaultAmount,
} from "../utilities/ParseAmounts";
import { ChanceResult } from "../fetch/getChance";
import {REWARDS} from "../constants/rewards";
import Image from "next/image";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
interface UserData {
  UserDepositTokens: bigint;
  UserAllowance: bigint;
  UserVaultTokens: bigint;
}
import { CropDecimals } from "../utilities/ParseAmounts";
import { MyConnect } from "./ConnectButton";
interface UserBalancesAndChanceProps {
  rewardsData: RewardsData[] | null;
  userData: UserData | null;
  userChance: ChanceResult | null;
  onDataUpdate: () => void;
}

// Custom hook to check if element touches screen edges
function useElementTouchesEdges() {
  const ref = useRef<HTMLDivElement>(null);
  const [touchesEdges, setTouchesEdges] = useState(false);

  useEffect(() => {
    const checkTouchesEdges = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const touchesLeft = rect.left <= 1; // Allow 1px tolerance
        const touchesRight = rect.right >= window.innerWidth - 1;
        setTouchesEdges(touchesLeft && touchesRight);
      }
    };

    checkTouchesEdges();
    window.addEventListener('resize', checkTouchesEdges);
    return () => window.removeEventListener('resize', checkTouchesEdges);
  }, []);

  return [ref, touchesEdges] as const;
}

const UserInfo: React.FC<UserBalancesAndChanceProps> = ({
  rewardsData,
  userData,
  userChance,
  onDataUpdate
}) => {
  const { address } = useAccount();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [ref, touchesEdges] = useElementTouchesEdges();

  // console.log("user chance",userChance?.grandPrize.vaultPortion)
  if (!address) return (
    <div className="flex flex-col items-center justify-center py-8 px-6 mt-6 mb-20 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 md:border-l-[#C0ECFF] md:border-r-[#C0ECFF] border-l-transparent border-r-transparent rounded-lg shadow-md overflow-auto">

      {/* <p className="font-semibold mb-4">Everyone wins</p> */}
        <p className="text-xl text-[#d3effb]">Deposit {ADDRESS.DEPOSITTOKEN.SYMBOL} to win prizes, rewards, and contribute to a good cause</p>
      <br></br><div><MyConnect connectText={"CONNECT TO WIN"}/></div>
    </div>
  );
  
  if (!userData || !userChance) return (
    <div className="flex items-center justify-center py-8 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 md:border-l-[#C0ECFF] md:border-r-[#C0ECFF] border-l-transparent border-r-transparent rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
      <p>Loading User Data...</p>
    </div>
  );

  const hasDepositTokens = userData.UserDepositTokens > BigInt(0);
  const hasVaultTokens = userData.UserVaultTokens > BigInt(0);
// console.log("rewards",rewardsData)
  return (
    <div 
      ref={ref}
      className={`flex flex-col items-start py-2 md:py-4 px-3 md:px-6 mt-4 md:mt-6 mb-16 md:mb-20 text-white text-base md:text-lg w-[90%] md:w-auto mx-auto bg-[#28447A] border-l-4 border-r-4 space-y-4 sm:space-y-2 ${
        touchesEdges ? 'border-l-transparent border-r-transparent' : 'border-l-[#C0ECFF] border-r-[#C0ECFF]'
      }`}
    >
      {!hasDepositTokens && !hasVaultTokens ? (<>
        <p className="text-sm md:text-base">Welcome winner! For a chance to win, you need {ADDRESS.DEPOSITTOKEN.SYMBOL} tokens.</p>
        <p className="text-sm md:text-base">This winning experience contributes 1/3 of the yield generated to the Protocol Guild.</p>
      </>
      ) : (
        <>
          {hasDepositTokens && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <div className="flex justify-between items-center w-full sm:w-auto mb-2 sm:mb-0 text-sm md:text-base">
                <div className="flex items-center sm:hidden">
                  <Image
                    src={ADDRESS.DEPOSITTOKEN.ICON}
                    alt={`${ADDRESS.DEPOSITTOKEN.SYMBOL} Icon`}
                    width={20}
                    height={20}
                    className="mr-1"
                  />
                  <span>{ParseDepositTokenAmount(userData?.UserDepositTokens, true)}</span>
                  <span className="ml-1">{ADDRESS.DEPOSITTOKEN.SYMBOL}</span>
                </div>
                <p className="hidden sm:flex sm:items-center">
                  <span className="mr-2">You have</span>
                  <Image
                    src={ADDRESS.DEPOSITTOKEN.ICON}
                    alt={`${ADDRESS.DEPOSITTOKEN.SYMBOL} Icon`}
                    width={20}
                    height={20}
                    className="inline-block mr-1"
                  />
                  <span className="mr-2">
                    {ParseDepositTokenAmount(userData?.UserDepositTokens, true)} {ADDRESS.DEPOSITTOKEN.SYMBOL}
                  </span>
                  <span>you can deposit</span>
                </p>
                <div className="sm:hidden">
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="text-sm md:text-base py-[2px] px-[8px] md:px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
                  >
                    Deposit
                  </button>
                </div>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="text-sm md:text-base py-[2px] px-[8px] md:px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all sm:ml-4"
                >
                  Deposit
                </button>
              </div>
              <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => {setIsDepositModalOpen(false); onDataUpdate();}}
              />
            </div>
          )}
          {hasVaultTokens && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <div className="flex justify-between items-center w-full sm:w-auto mb-2 sm:mb-0 text-sm md:text-base">
                <div className="flex items-center sm:hidden">
                  <Image
                    src={ADDRESS.VAULT.ICON}
                    alt={`${ADDRESS.VAULT.SYMBOL} Icon`}
                    width={20}
                    height={20}
                    className="mr-1"
                  />
                  <span>{ParseVaultAmount(userData?.UserVaultTokens, true)}</span>
                  <span className="ml-1">{ADDRESS.VAULT.SYMBOL}</span>
                </div>
                <p className="hidden sm:flex sm:items-center">
                  <span className="mr-2">You have</span>
                  <Image
                    src={ADDRESS.VAULT.ICON}
                    alt={`${ADDRESS.VAULT.SYMBOL} Icon`}
                    width={20}
                    height={20}
                    className="inline-block mr-1"
                  />
                  <span className="mr-2">
                    {ParseVaultAmount(userData?.UserVaultTokens, true)} {ADDRESS.VAULT.SYMBOL}
                  </span>
                  <span>tickets to win</span>
                </p>
                <div className="sm:hidden">
                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="text-sm md:text-base py-[2px] px-[8px] md:px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="text-sm md:text-base py-[2px] px-[8px] md:px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all sm:ml-4"
                >
                  Withdraw
                </button>
              </div>
              <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => {setIsWithdrawModalOpen(false); onDataUpdate();}}
              />
            </div>
          )}
          
          {rewardsData && rewardsData[0]?.amounts?.length > 0 && sumBigInts(rewardsData[0].amounts) > BigInt(0) && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <div className="flex justify-between items-center w-full sm:w-auto mb-2 sm:mb-0 text-sm md:text-base">
                <div className="flex items-center sm:hidden">
                  <Image 
                    src={REWARDS[0].IMAGE} 
                    alt={REWARDS[0].SYMBOL}
                    width={20} 
                    height={20}
                    className="mr-1"
                  />
                  <span>{CropDecimals(formatBigIntWithDecimals(sumBigInts(rewardsData[0].amounts), REWARDS[0].DECIMALS))}</span>
                  <span className="ml-1">claimable</span>
                </div>
                <p className="hidden sm:flex sm:items-center">
                  <span className="mr-2">You have</span>
                  <Image 
                    src={REWARDS[0].IMAGE} 
                    alt={REWARDS[0].SYMBOL}
                    width={20} 
                    height={20}
                    className="inline-block mr-1"
                  />
                  <span className="mr-2">
                    {CropDecimals(formatBigIntWithDecimals(sumBigInts(rewardsData[0].amounts), REWARDS[0].DECIMALS))} {REWARDS[0].SYMBOL}
                  </span>
                  <span>rewards to claim</span>
                </p>
                <div className="sm:hidden">
                  <RewardsClaim data={rewardsData}/>
                </div>
              </div>
              <div className="hidden sm:block">
                <RewardsClaim data={rewardsData}/>
              </div>
            </div>
          )}

          {userChance && userChance.grandPrize.userTwab > BigInt(0) && (
            <div className="mt-4">
              {(() => {
                const chancePercentage = Number(userChance.grandPrize.userTwab) / Number(userChance.grandPrize.totalTwab) *( Number(userChance.grandPrize.vaultPortion)/1e18) * 100;
                const oddsOfWinning = Math.round(100 / chancePercentage);
                return (
                  <p className="text-xs md:text-sm text-[#C0ECFF]">Your odds of winning the jackpot are 1 in {oddsOfWinning.toLocaleString()}</p>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

function sumBigInts(bigints: bigint[]): bigint {
  return bigints.reduce((sum, amount) => sum + amount, BigInt(0));
}

function formatBigIntWithDecimals(value: bigint, decimals: number): string {
  console.log("value", value.toString(), "decimals", decimals);
  if (decimals === 1e18) {
    console.warn("Correcting unexpected decimals value from 1e18 to 18");
    decimals = 18;
  }
  // Check for valid decimal range
  if (decimals < 0 || decimals > 100) {
    console.warn("Unexpected decimals value:", decimals);
    decimals = Math.min(Math.max(decimals, 0), 100); // clamp to a reasonable range
  }

  const valueString = value.toString().padStart(decimals + 1, '0');
  const integerPart = valueString.slice(0, -decimals);
  const fractionalPart = valueString.slice(-decimals);
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, '');

  return trimmedFractionalPart ? `${integerPart}.${trimmedFractionalPart}` : integerPart;
}

export default UserInfo;
