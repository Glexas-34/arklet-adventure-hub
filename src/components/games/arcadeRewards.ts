import { Rarity, packs } from "@/data/gameData";
import type { ArcadeReward } from "./types";

const SCORE_TIERS: { threshold: number; weights: Record<Rarity, number> }[] = [
  {
    threshold: 0.9,
    weights: {
      Common: 5, Uncommon: 15, Rare: 30, Legendary: 25,
      Mythic: 15, Secret: 7, "Ultra Secret": 2.5, Mystical: 0.5,
    },
  },
  {
    threshold: 0.7,
    weights: {
      Common: 15, Uncommon: 25, Rare: 30, Legendary: 20,
      Mythic: 7, Secret: 2.5, "Ultra Secret": 0.4, Mystical: 0.1,
    },
  },
  {
    threshold: 0.5,
    weights: {
      Common: 30, Uncommon: 30, Rare: 25, Legendary: 10,
      Mythic: 4, Secret: 0.8, "Ultra Secret": 0.15, Mystical: 0.05,
    },
  },
  {
    threshold: 0.3,
    weights: {
      Common: 45, Uncommon: 30, Rare: 18, Legendary: 5,
      Mythic: 1.5, Secret: 0.4, "Ultra Secret": 0.08, Mystical: 0.02,
    },
  },
  {
    threshold: 0,
    weights: {
      Common: 60, Uncommon: 25, Rare: 12, Legendary: 2.5,
      Mythic: 0.4, Secret: 0.08, "Ultra Secret": 0.015, Mystical: 0.005,
    },
  },
];

function pickRarity(normalizedScore: number): Rarity {
  const tier = SCORE_TIERS.find((t) => normalizedScore >= t.threshold) || SCORE_TIERS[SCORE_TIERS.length - 1];
  const weights = tier.weights;
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  for (const [rarity, weight] of Object.entries(weights)) {
    rand -= weight;
    if (rand <= 0) return rarity as Rarity;
  }
  return "Common";
}

export function rollArcadeReward(normalizedScore: number): ArcadeReward {
  const rarity = pickRarity(normalizedScore);
  const packNames = Object.keys(packs);
  const packName = packNames[Math.floor(Math.random() * packNames.length)];
  const pack = packs[packName];

  const matchingItem = pack.find((item) => item[1] === rarity);
  if (matchingItem) {
    return { itemName: matchingItem[0], rarity: matchingItem[1], packName };
  }

  // Fallback: pick closest rarity
  return { itemName: pack[0][0], rarity: pack[0][1], packName };
}
