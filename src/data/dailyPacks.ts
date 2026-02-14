import type { Rarity } from "./gameData";

// Monthly themes for daily packs
const monthlyThemes: {
  month: number;
  name: string;
  emoji: string;
  items: [string, Rarity, number][];
}[] = [
  {
    month: 0, // January
    name: "Jan",
    emoji: "❄️",
    items: [
      ["Snowflake", "Common", 25],
      ["Icicle", "Common", 20.365],
      ["Frost Crystal", "Uncommon", 20],
      ["Snow Globe", "Uncommon", 15],
      ["Blizzard Orb", "Rare", 10],
      ["Arctic Crown", "Legendary", 6],
      ["Frozen Heart", "Mythic", 2.5],
      ["Winter's End", "Secret", 1],
      ["Permafrost", "Ultra Secret", 0.08],
      ["Eternal Ice", "Mystical", 0.045],
    ],
  },
  {
    month: 1, // February
    name: "Feb",
    emoji: "❤️",
    items: [
      ["Love Note", "Common", 25],
      ["Rose Petal", "Common", 20.365],
      ["Heart Gem", "Uncommon", 20],
      ["Cupid Arrow", "Uncommon", 15],
      ["Valentine Orb", "Rare", 10],
      ["Passion Crown", "Legendary", 6],
      ["Soulmate Heart", "Mythic", 2.5],
      ["Eternal Bond", "Secret", 1],
      ["True Love", "Ultra Secret", 0.08],
      ["Amour Divine", "Mystical", 0.045],
    ],
  },
  {
    month: 2, // March
    name: "Mar",
    emoji: "🌱",
    items: [
      ["Sprout", "Common", 25],
      ["Seedling", "Common", 20.365],
      ["Vine Tendril", "Uncommon", 20],
      ["Blossom Bud", "Uncommon", 15],
      ["Spring Orb", "Rare", 10],
      ["Nature Crown", "Legendary", 6],
      ["Life Bloom", "Mythic", 2.5],
      ["Verdant Soul", "Secret", 1],
      ["Genesis Root", "Ultra Secret", 0.08],
      ["Primordial Seed", "Mystical", 0.045],
    ],
  },
  {
    month: 3, // April
    name: "Apr",
    emoji: "🌧️",
    items: [
      ["Raindrop", "Common", 25],
      ["Puddle Splash", "Common", 20.365],
      ["Storm Cloud", "Uncommon", 20],
      ["Thunder Pearl", "Uncommon", 15],
      ["Lightning Orb", "Rare", 10],
      ["Tempest Crown", "Legendary", 6],
      ["Monsoon Heart", "Mythic", 2.5],
      ["Eye of Storm", "Secret", 1],
      ["Cataclysm", "Ultra Secret", 0.08],
      ["Storm Eternal", "Mystical", 0.045],
    ],
  },
  {
    month: 4, // May
    name: "May",
    emoji: "🌸",
    items: [
      ["Cherry Petal", "Common", 25],
      ["Daisy Chain", "Common", 20.365],
      ["Orchid Gem", "Uncommon", 20],
      ["Lily Crown", "Uncommon", 15],
      ["Floral Orb", "Rare", 10],
      ["Blossom Crown", "Legendary", 6],
      ["Sakura Spirit", "Mythic", 2.5],
      ["Petal Storm", "Secret", 1],
      ["Bloom Eternal", "Ultra Secret", 0.08],
      ["Flora Divine", "Mystical", 0.045],
    ],
  },
  {
    month: 5, // June
    name: "Jun",
    emoji: "☀️",
    items: [
      ["Sunbeam", "Common", 25],
      ["Solar Flare", "Common", 20.365],
      ["Heat Wave", "Uncommon", 20],
      ["Sun Stone", "Uncommon", 15],
      ["Solstice Orb", "Rare", 10],
      ["Radiant Crown", "Legendary", 6],
      ["Solar Heart", "Mythic", 2.5],
      ["Noon Zenith", "Secret", 1],
      ["Helios Core", "Ultra Secret", 0.08],
      ["Sun Eternal", "Mystical", 0.045],
    ],
  },
  {
    month: 6, // July
    name: "Jul",
    emoji: "🎆",
    items: [
      ["Sparkler", "Common", 25],
      ["Firecracker", "Common", 20.365],
      ["Roman Candle", "Uncommon", 20],
      ["Rocket Burst", "Uncommon", 15],
      ["Firework Orb", "Rare", 10],
      ["Starburst Crown", "Legendary", 6],
      ["Grand Finale", "Mythic", 2.5],
      ["Sky Blaze", "Secret", 1],
      ["Supernova Spark", "Ultra Secret", 0.08],
      ["Pyro Eternal", "Mystical", 0.045],
    ],
  },
  {
    month: 7, // August
    name: "Aug",
    emoji: "🏖️",
    items: [
      ["Seashell", "Common", 25],
      ["Sand Dollar", "Common", 20.365],
      ["Tide Pool", "Uncommon", 20],
      ["Beach Glass", "Uncommon", 15],
      ["Coastal Orb", "Rare", 10],
      ["Tidal Crown", "Legendary", 6],
      ["Ocean Breeze", "Mythic", 2.5],
      ["Horizon Line", "Secret", 1],
      ["Deep Current", "Ultra Secret", 0.08],
      ["Aqua Eternal", "Mystical", 0.045],
    ],
  },
  {
    month: 8, // September
    name: "Sep",
    emoji: "📚",
    items: [
      ["Pencil Stub", "Common", 25],
      ["Notebook Page", "Common", 20.365],
      ["Ink Bottle", "Uncommon", 20],
      ["Quill Pen", "Uncommon", 15],
      ["Scholar Orb", "Rare", 10],
      ["Wisdom Crown", "Legendary", 6],
      ["Ancient Tome", "Mythic", 2.5],
      ["Lost Chapter", "Secret", 1],
      ["Forbidden Text", "Ultra Secret", 0.08],
      ["Omniscience", "Mystical", 0.045],
    ],
  },
  {
    month: 9, // October
    name: "Oct",
    emoji: "🎃",
    items: [
      ["Candy Corn", "Common", 25],
      ["Cobweb", "Common", 20.365],
      ["Jack-o-Lantern", "Uncommon", 20],
      ["Witch Hat", "Uncommon", 15],
      ["Spooky Orb", "Rare", 10],
      ["Phantom Crown", "Legendary", 6],
      ["Shadow Wraith", "Mythic", 2.5],
      ["Pumpkin King", "Secret", 1],
      ["Nightmare Veil", "Ultra Secret", 0.08],
      ["Hallowed Night", "Mystical", 0.045],
    ],
  },
  {
    month: 10, // November
    name: "Nov",
    emoji: "🍂",
    items: [
      ["Fallen Leaf", "Common", 25],
      ["Acorn", "Common", 20.365],
      ["Amber Gem", "Uncommon", 20],
      ["Harvest Moon", "Uncommon", 15],
      ["Autumn Orb", "Rare", 10],
      ["Cornucopia Crown", "Legendary", 6],
      ["Twilight Ember", "Mythic", 2.5],
      ["Last Harvest", "Secret", 1],
      ["Golden Decay", "Ultra Secret", 0.08],
      ["Autumn Eternal", "Mystical", 0.045],
    ],
  },
  {
    month: 11, // December
    name: "Dec",
    emoji: "🎄",
    items: [
      ["Ornament", "Common", 25],
      ["Tinsel", "Common", 20.365],
      ["Gift Bow", "Uncommon", 20],
      ["Snow Angel", "Uncommon", 15],
      ["Holiday Orb", "Rare", 10],
      ["Yule Crown", "Legendary", 6],
      ["Noel Spirit", "Mythic", 2.5],
      ["Silent Night", "Secret", 1],
      ["Miracle Eve", "Ultra Secret", 0.08],
      ["Yuletide Eternal", "Mystical", 0.045],
    ],
  },
];

const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** All 366 daily packs keyed by name like "Jan 1 Pack" */
export const dailyPacks: Record<string, [string, Rarity, number][]> = {};

/** Emoji for each daily pack */
export const dailyPackEmojis: Record<string, string> = {};

for (const theme of monthlyThemes) {
  const days = monthDays[theme.month];
  for (let day = 1; day <= days; day++) {
    const packName = `${theme.name} ${day} Pack`;
    const items: [string, Rarity, number][] = theme.items.map(([baseName, rarity, chance]) => [
      `${baseName} #${day}`,
      rarity,
      chance,
    ]);
    // Celestial item unique per day
    items.push([`${theme.name} ${day} Celestial`, "Celestial" as Rarity, 0.01]);
    // Divine item unique per day (add inline so the existing Divine loop in gameData.ts doesn't need to handle it)
    const divineChance = 0.005;
    items[0] = [items[0][0], items[0][1], +(items[0][2] - divineChance).toFixed(3)];
    items.push([`${theme.name} ${day} Godform`, "Divine" as Rarity, divineChance]);
    // Transcendent item unique per day
    const transcendentChance = 0.001;
    items[0] = [items[0][0], items[0][1], +(items[0][2] - transcendentChance).toFixed(4)];
    items.push([`${theme.name} ${day} Transcendent`, "Transcendent" as Rarity, transcendentChance]);
    // Ascendent item unique per day
    const ascendentChance = 0.0005;
    items[0] = [items[0][0], items[0][1], +(items[0][2] - ascendentChance).toFixed(4)];
    items.push([`${theme.name} ${day} Ascendent`, "Ascendent" as Rarity, ascendentChance]);
    // Godly item unique per day
    const godlyChance = 0.0001;
    items[0] = [items[0][0], items[0][1], +(items[0][2] - godlyChance).toFixed(5)];
    items.push([`${theme.name} ${day} Godly`, "Godly" as Rarity, godlyChance]);
    // Galactic item unique per day (1 in a billion)
    const galacticChance = 0.0000001;
    items[0] = [items[0][0], items[0][1], +(items[0][2] - galacticChance).toFixed(8)];
    items.push([`${theme.name} ${day} Galactic`, "Galactic" as Rarity, galacticChance]);
    // Primordial item unique per day (1 in a trillion)
    const primordialChance = 0.0000000001;
    items[0] = [items[0][0], items[0][1], +(items[0][2] - primordialChance).toFixed(11)];
    items.push([`${theme.name} ${day} Primordial`, "Primordial" as Rarity, primordialChance]);

    dailyPacks[packName] = items;
    dailyPackEmojis[packName] = theme.emoji;
  }
}

/** Get today's pack name, e.g. "Feb 8 Pack" */
export function getDailyPackName(date: Date = new Date()): string {
  const month = date.getMonth();
  const day = date.getDate();
  return `${monthAbbreviations[month]} ${day} Pack`;
}

/** Get all 366 daily pack names */
export function getAllDailyPackNames(): string[] {
  return Object.keys(dailyPacks);
}

/**
 * Fuzzy-match a query to a daily pack name.
 * Accepts: "Jan 15", "01-15", "1/15", "Jan 15 Pack", "january 15", etc.
 */
export function findDailyPackByQuery(query: string): string | null {
  const q = query.trim();

  // Try direct match first (case-insensitive)
  const allNames = getAllDailyPackNames();
  const directMatch = allNames.find((n) => n.toLowerCase() === q.toLowerCase());
  if (directMatch) return directMatch;

  // Try partial match (e.g. "Jan 15" matches "Jan 15 Pack")
  const partialMatch = allNames.find((n) => n.toLowerCase().startsWith(q.toLowerCase()));
  if (partialMatch) return partialMatch;

  // Try "MM-DD" or "MM/DD" format
  const slashMatch = q.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (slashMatch) {
    const monthIdx = parseInt(slashMatch[1], 10) - 1;
    const day = parseInt(slashMatch[2], 10);
    if (monthIdx >= 0 && monthIdx < 12 && day >= 1 && day <= monthDays[monthIdx]) {
      return `${monthAbbreviations[monthIdx]} ${day} Pack`;
    }
  }

  // Try full month name (e.g. "January 15", "february 14")
  const fullMonthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const fullMonthMatch = q.match(/^(\w+)\s+(\d{1,2})$/i);
  if (fullMonthMatch) {
    const monthStr = fullMonthMatch[1].toLowerCase();
    const day = parseInt(fullMonthMatch[2], 10);
    const monthIdx = fullMonthNames.indexOf(monthStr);
    if (monthIdx >= 0 && day >= 1 && day <= monthDays[monthIdx]) {
      return `${monthAbbreviations[monthIdx]} ${day} Pack`;
    }
    // Also try abbreviated month names
    const abbrIdx = monthAbbreviations.findIndex((a) => a.toLowerCase() === monthStr);
    if (abbrIdx >= 0 && day >= 1 && day <= monthDays[abbrIdx]) {
      return `${monthAbbreviations[abbrIdx]} ${day} Pack`;
    }
  }

  return null;
}
