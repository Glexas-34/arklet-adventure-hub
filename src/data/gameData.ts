export type Rarity = 
  | "Common" 
  | "Uncommon" 
  | "Rare" 
  | "Legendary" 
  | "Mythic" 
  | "Secret" 
  | "Ultra Secret" 
  | "Mystical";

export interface BlookItem {
  name: string;
  rarity: Rarity;
  chance: number;
}

export interface InventoryItem {
  name: string;
  rarity: Rarity;
  count: number;
}

export const rarityInfo: Record<Rarity, { color: string; show: boolean }> = {
  Common: { color: "#cfd8dc", show: true },
  Uncommon: { color: "#4caf50", show: true },
  Rare: { color: "#2196f3", show: true },
  Legendary: { color: "#ff9800", show: true },
  Mythic: { color: "#e91e63", show: true },
  Secret: { color: "#9c27b0", show: true },
  "Ultra Secret": { color: "#ff1744", show: false },
  Mystical: { color: "#00e5ff", show: false },
};

export const rarityColors: Record<Rarity, string> = {
  Common: "rarity-common",
  Uncommon: "rarity-uncommon",
  Rare: "rarity-rare",
  Legendary: "rarity-legendary",
  Mythic: "rarity-mythic",
  Secret: "rarity-secret",
  "Ultra Secret": "rarity-ultra-secret",
  Mystical: "rarity-mystical",
};

export const rarityBgColors: Record<Rarity, string> = {
  Common: "bg-rarity-common",
  Uncommon: "bg-rarity-uncommon",
  Rare: "bg-rarity-rare",
  Legendary: "bg-rarity-legendary",
  Mythic: "bg-rarity-mythic",
  Secret: "bg-rarity-secret",
  "Ultra Secret": "bg-rarity-ultra-secret",
  Mystical: "bg-rarity-mystical",
};

export const rarityGlowColors: Record<Rarity, string> = {
  Common: "glow-common",
  Uncommon: "glow-uncommon",
  Rare: "glow-rare",
  Legendary: "glow-legendary",
  Mythic: "glow-mythic",
  Secret: "glow-secret",
  "Ultra Secret": "glow-ultra-secret",
  Mystical: "glow-mystical",
};

export const rarityOrder: Rarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Legendary",
  "Mythic",
  "Secret",
  "Ultra Secret",
  "Mystical",
];

// Pack data: [name, rarity, chance%]
export const packs: Record<string, [string, Rarity, number][]> = {
  "Spooky Pack": [
    ["Ghost", "Common", 44.98],
    ["Zombie", "Uncommon", 30],
    ["Vampire", "Rare", 15],
    ["Pumpkin King", "Legendary", 8.42],
    ["Night Lord", "Mythic", 1],
    ["Shadow Reaper", "Secret", 0.5],
    ["Void Phantom", "Ultra Secret", 0.08],
    ["Apex Nightmare", "Mystical", 0.02],
  ],
  "Ocean Pack": [
    ["Clownfish", "Common", 44.98],
    ["Shark", "Uncommon", 30],
    ["Octopus", "Rare", 15],
    ["Kraken", "Legendary", 8.42],
    ["Leviathan", "Mythic", 1],
    ["Abyss Horror", "Secret", 0.5],
    ["Tidebreaker", "Ultra Secret", 0.08],
    ["Poseidon Prime", "Mystical", 0.02],
  ],
  "Space Pack": [
    ["Alien", "Common", 44.98],
    ["Astronaut", "Uncommon", 30],
    ["UFO", "Rare", 15],
    ["Galaxy Beast", "Legendary", 8.42],
    ["Cosmic Titan", "Mythic", 1],
    ["Star Eater", "Secret", 0.5],
    ["Black Hole God", "Ultra Secret", 0.08],
    ["Singularity Prime", "Mystical", 0.02],
  ],
  "Fantasy Pack": [
    ["Elf", "Common", 44.98],
    ["Dwarf", "Uncommon", 30],
    ["Wizard", "Rare", 15],
    ["Archmage", "Legendary", 8.42],
    ["Ancient Dragon", "Mythic", 1],
    ["Realm Breaker", "Secret", 0.5],
    ["Voidwyrm", "Ultra Secret", 0.08],
    ["World Genesis", "Mystical", 0.02],
  ],
  "Cyber Pack": [
    ["Drone", "Common", 44.98],
    ["Android", "Uncommon", 30],
    ["Mecha Wolf", "Rare", 15],
    ["AI Overlord", "Legendary", 8.42],
    ["Neural Core", "Mythic", 1],
    ["System Zero", "Secret", 0.5],
    ["Codebreaker", "Ultra Secret", 0.08],
    ["The Source", "Mystical", 0.02],
  ],
  "Jungle Pack": [
    ["Monkey", "Common", 44.98],
    ["Parrot", "Uncommon", 30],
    ["Tiger", "Rare", 15],
    ["Ancient Gorilla", "Legendary", 8.42],
    ["Verdant Titan", "Mythic", 1],
    ["Jungle Deity", "Secret", 0.5],
    ["Heart of Wild", "Ultra Secret", 0.08],
    ["Primal Core", "Mystical", 0.02],
  ],
  "Winter Pack": [
    ["Snowman", "Common", 44.98],
    ["Penguin", "Uncommon", 30],
    ["Polar Bear", "Rare", 15],
    ["Frost Giant", "Legendary", 8.42],
    ["Glacier Titan", "Mythic", 1],
    ["Blizzard Warden", "Secret", 0.5],
    ["Absolute Zero", "Ultra Secret", 0.08],
    ["Frozen Singularity", "Mystical", 0.02],
  ],
  "Desert Pack": [
    ["Camel", "Common", 45],
    ["Scorpion", "Uncommon", 30],
    ["Sand Golem", "Rare", 15],
    ["Pharaoh", "Legendary", 8],
    ["Sphinx", "Mythic", 1],
    ["Dune Wraith", "Secret", 0.5],
    ["Sun God", "Ultra Secret", 0.08],
    ["Oasis Spirit", "Mystical", 0.02],
  ],
  "Volcano Pack": [
    ["Lava Lizard", "Common", 45],
    ["Firebird", "Uncommon", 30],
    ["Magma Beast", "Rare", 15],
    ["Volcanic Titan", "Legendary", 8],
    ["Inferno Dragon", "Mythic", 1],
    ["Ash Demon", "Secret", 0.5],
    ["Eruption Lord", "Ultra Secret", 0.08],
    ["Magma Core", "Mystical", 0.02],
  ],
  "Candy Pack": [
    ["Candy Cane", "Common", 45],
    ["Chocolate Bunny", "Uncommon", 30],
    ["Gingerbread Man", "Rare", 15],
    ["Sugar Wizard", "Legendary", 8],
    ["Sweet Dragon", "Mythic", 1],
    ["Marshmallow Giant", "Secret", 0.5],
    ["Lollipop King", "Ultra Secret", 0.08],
    ["Candy Cosmos", "Mystical", 0.02],
  ],
  "Toy Pack": [
    ["Toy Car", "Common", 45],
    ["Rubber Duck", "Uncommon", 30],
    ["Action Figure", "Rare", 15],
    ["Mechanical Robot", "Legendary", 8],
    ["Giant Teddy", "Mythic", 1],
    ["Windup Beast", "Secret", 0.5],
    ["Toy Overlord", "Ultra Secret", 0.08],
    ["Infinite Toybox", "Mystical", 0.02],
  ],
  "Music Pack": [
    ["Tambourine", "Common", 45],
    ["Flute", "Uncommon", 30],
    ["Drum", "Rare", 15],
    ["Guitar", "Legendary", 8],
    ["Grand Piano", "Mythic", 1],
    ["Harp Spirit", "Secret", 0.5],
    ["Conductor", "Ultra Secret", 0.08],
    ["Symphony Prime", "Mystical", 0.02],
  ],
};

export const packEmojis: Record<string, string> = {
  "Spooky Pack": "👻",
  "Ocean Pack": "🌊",
  "Space Pack": "🚀",
  "Fantasy Pack": "🧙",
  "Cyber Pack": "🤖",
  "Jungle Pack": "🌴",
  "Winter Pack": "❄️",
  "Desert Pack": "🏜️",
  "Volcano Pack": "🌋",
  "Candy Pack": "🍬",
  "Toy Pack": "🧸",
  "Music Pack": "🎵",
 };
 
// Add more packs
packs["Pirate Pack"] = [
  ["Parrot Pete", "Common", 44.98],
  ["Deck Swabber", "Uncommon", 30],
  ["First Mate", "Rare", 15],
  ["Captain Hook", "Legendary", 8.42],
  ["Blackbeard", "Mythic", 1],
  ["Ghost Ship", "Secret", 0.5],
  ["Davy Jones", "Ultra Secret", 0.08],
  ["Kraken King", "Mystical", 0.02],
];
packEmojis["Pirate Pack"] = "🏴‍☠️";

packs["Dino Pack"] = [
  ["Raptor", "Common", 44.98],
  ["Triceratops", "Uncommon", 30],
  ["Stegosaurus", "Rare", 15],
  ["T-Rex", "Legendary", 8.42],
  ["Spinosaurus", "Mythic", 1],
  ["Fossil King", "Secret", 0.5],
  ["Meteor Rider", "Ultra Secret", 0.08],
  ["Time Devourer", "Mystical", 0.02],
];
packEmojis["Dino Pack"] = "🦖";

packs["Farm Pack"] = [
  ["Chicken", "Common", 44.98],
  ["Pig", "Uncommon", 30],
  ["Cow", "Rare", 15],
  ["Golden Goose", "Legendary", 8.42],
  ["Harvest King", "Mythic", 1],
  ["Scarecrow Spirit", "Secret", 0.5],
  ["Cornfield Phantom", "Ultra Secret", 0.08],
  ["Nature's Heart", "Mystical", 0.02],
];
packEmojis["Farm Pack"] = "🌾";

packs["Sports Pack"] = [
  ["Baseball", "Common", 44.98],
  ["Basketball", "Uncommon", 30],
  ["Soccer Ball", "Rare", 15],
  ["Golden Trophy", "Legendary", 8.42],
  ["Champion", "Mythic", 1],
  ["MVP Ghost", "Secret", 0.5],
  ["Stadium Legend", "Ultra Secret", 0.08],
  ["Eternal Champion", "Mystical", 0.02],
];
packEmojis["Sports Pack"] = "⚽";

packs["Medieval Pack"] = [
  ["Peasant", "Common", 44.98],
  ["Knight", "Uncommon", 30],
  ["Archer", "Rare", 15],
  ["King", "Legendary", 8.42],
  ["Dragon Slayer", "Mythic", 1],
  ["Excalibur", "Secret", 0.5],
  ["Round Table", "Ultra Secret", 0.08],
  ["Camelot Core", "Mystical", 0.02],
];
packEmojis["Medieval Pack"] = "⚔️";

packs["Aquarium Pack"] = [
  ["Goldfish", "Common", 44.98],
  ["Jellyfish", "Uncommon", 30],
  ["Seahorse", "Rare", 15],
  ["Manta Ray", "Legendary", 8.42],
  ["Giant Squid", "Mythic", 1],
  ["Bioluminescent", "Secret", 0.5],
  ["Deep Dweller", "Ultra Secret", 0.08],
  ["Abyss Lord", "Mystical", 0.02],
];
packEmojis["Aquarium Pack"] = "🐠";

packs["Weather Pack"] = [
  ["Cloud", "Common", 44.98],
  ["Rainbow", "Uncommon", 30],
  ["Lightning", "Rare", 15],
  ["Tornado", "Legendary", 8.42],
  ["Hurricane", "Mythic", 1],
  ["Storm Warden", "Secret", 0.5],
  ["Climate Lord", "Ultra Secret", 0.08],
  ["Atmosphere Prime", "Mystical", 0.02],
];
packEmojis["Weather Pack"] = "⛈️";

packs["Breakfast Pack"] = [
  ["Toast", "Common", 44.98],
  ["Pancake", "Uncommon", 30],
  ["Waffle", "Rare", 15],
  ["Golden Egg", "Legendary", 8.42],
  ["Breakfast King", "Mythic", 1],
  ["Maple Spirit", "Secret", 0.5],
  ["Morning Glory", "Ultra Secret", 0.08],
  ["Dawn Feast", "Mystical", 0.02],
];
packEmojis["Breakfast Pack"] = "🥞";

// Roll function with explicit chances
export function rollPack(packName: string): [string, Rarity, number] {
  const pack = packs[packName];
  if (!pack) return pack[0];
  
  const rand = Math.random() * 100;
  let sum = 0;
  
  for (const item of pack) {
    sum += item[2];
    if (rand <= sum) return item;
  }
  
  return pack[pack.length - 1];
}
