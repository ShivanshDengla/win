// fetch/getRewards.tsx
import { CONTRACTS } from '../constants/contracts';
import { REWARDS } from '../constants/rewards';
import { getTokenPrice } from "./getTokenPrice";
import { getTvl } from "./getTvl";
import { formatUnits } from "viem";
import { ADDRESS } from "../constants/address";

interface Promotion {
  startTimestamp: string;
  numberOfEpochs: string;
  epochDuration: string;
  tokensPerEpoch: string;
}

export interface PromotionData {
  PROMOTION: number;
  SYMBOL: string;
  startTimestamp: number;
  promoEnd: number;
  completedEpochs: number[];
  tokensPerYear?: number;
  tokenPrice?: number;
  tvl?: string;
  aprValue?: number;
}

export interface RewardsData {
  promotion: number;
  epochs: number[];
  amounts: bigint[];
}

export async function getRewards(address: string | undefined): Promise<{ promotionData: PromotionData[], userRewards: RewardsData[] }> {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const promotionDetails: PromotionData[] = [];
  const userRewards: RewardsData[] = [];

  const fetchPromotionData = async (reward: typeof REWARDS[0]): Promise<PromotionData | null> => {
    const { PROMOTION, SYMBOL, GECKO } = reward;

    try {
      const [promotion, tokenPrice, tvl] = await Promise.all([
        CONTRACTS.TWABREWARDS.read.getPromotion([PROMOTION]) as Promise<Promotion>,
        getTokenPrice(GECKO),
        getTvl()
      ]);

      const startTimestamp = parseInt(promotion.startTimestamp);
      const numberOfEpochs = parseInt(promotion.numberOfEpochs);
      const epochDuration = parseInt(promotion.epochDuration);
      const tokensPerEpoch = parseFloat(promotion.tokensPerEpoch);
      const promoEnd = startTimestamp + numberOfEpochs * epochDuration;

      if (currentTimestamp < startTimestamp || currentTimestamp > promoEnd) {
        console.warn(`Promotion ${PROMOTION} for ${SYMBOL} is not currently active.`);
        return null;
      }

      const decimals = 18; // Assuming DECIMALS is 18 for standard tokens
      const tokensPerEpochAdjusted = tokensPerEpoch / Math.pow(10, decimals); // Adjust for decimals
      const tokensPerSecond = tokensPerEpochAdjusted / epochDuration;

      const tokensPerYear = tokensPerSecond * (365 * 24 * 60 * 60);

      const adjustedTvl = formatUnits(tvl, ADDRESS.VAULT.DECIMALS);

      const aprValue = (tokensPerYear * tokenPrice) / parseFloat(adjustedTvl);

      const completedEpochs = getCompletedEpochs(startTimestamp, epochDuration, numberOfEpochs, currentTimestamp);
console.log(PROMOTION,
        SYMBOL,
        startTimestamp,
        promoEnd,
        completedEpochs,
        tokensPerYear,
        tokenPrice,
        adjustedTvl, aprValue)
      return {
        PROMOTION,
        SYMBOL,
        startTimestamp,
        promoEnd,
        completedEpochs,
        tokensPerYear,
        tokenPrice,
        tvl: adjustedTvl,
        aprValue,
      };
    } catch (err) {
      console.error(`Error fetching promotion data for ${PROMOTION}:`, err);
      return null;
    }
  };

  const fetchUserRewards = async (address: string, promotion: number, completedEpochs: number[]): Promise<RewardsData | null> => {
    try {
      const rewardArray = await CONTRACTS.TWABREWARDS.read.getRewardsAmount([
        address,
        promotion,
        completedEpochs
      ]) as bigint[];

      return {
        promotion,
        epochs: completedEpochs,
        amounts: rewardArray
      };
    } catch (err) {
      console.error(`Error fetching user rewards for promotion ${promotion}:`, err);
      return null;
    }
  };

  const promotionResults = await Promise.all(REWARDS.map(fetchPromotionData));
  promotionDetails.push(...promotionResults.filter((result): result is PromotionData => result !== null));

  if (address) {
    const userRewardPromises = promotionDetails.map(promo => 
      fetchUserRewards(address, promo.PROMOTION, promo.completedEpochs)
    );
    const userRewardResults = await Promise.all(userRewardPromises);
    userRewards.push(...userRewardResults.filter((result): result is RewardsData => result !== null));
  }

  return { promotionData: promotionDetails, userRewards };
}

function getCompletedEpochs(
  startTimestamp: number,
  epochDuration: number,
  numberOfEpochs: number,
  currentTimestamp: number
): number[] {
  const completedEpochs = [];

  for (let epoch = 0; epoch < numberOfEpochs; epoch++) {
    const epochEndTime = startTimestamp + (epoch + 1) * epochDuration;
    if (epochEndTime <= currentTimestamp) {
      completedEpochs.push(epoch);
    } else {
      break;
    }
  }

  return completedEpochs;
}
