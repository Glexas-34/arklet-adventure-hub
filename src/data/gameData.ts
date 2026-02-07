export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Legendary"
  | "Mythic"
  | "Secret"
  | "Ultra Secret"
  | "Mystical"
  | "Exotic";

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
  Exotic: { color: "#ff66b2", show: false },
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
  Exotic: "rarity-exotic",
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
  Exotic: "bg-rarity-exotic",
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
  Exotic: "glow-exotic",
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
  "Exotic",
];

// Pack data: [name, rarity, chance%]
export const packs: Record<string, [string, Rarity, number][]> = {
  "Wise School Pack": [
    ["Atias", "Common", 4.98],
    ["Aspen", "Common", 5.0],
    ["Anvar", "Common", 5.0],
    ["Azizzadeh", "Common", 5.0],
    ["Jacobs", "Common", 5.0],
    ["Koosed", "Common", 5.0],
    ["Melamed", "Common", 5.0],
    ["Michael", "Common", 5.0],
    ["Mostadim", "Common", 5.0],
    ["Omidvar", "Uncommon", 3.75],
    ["Pitson", "Uncommon", 3.75],
    ["Pouldar", "Uncommon", 3.75],
    ["Rosenthal", "Uncommon", 3.75],
    ["Siegel", "Uncommon", 3.75],
    ["Hinkle", "Uncommon", 3.75],
    ["Triphon", "Uncommon", 3.75],
    ["Tropp", "Uncommon", 3.75],
    ["Dayani", "Rare", 2.5],
    ["Forozanpour", "Rare", 2.5],
    ["Fuller", "Rare", 2.5],
    ["Hakakha", "Rare", 2.5],
    ["Kamrava", "Rare", 2.5],
    ["Kashani", "Rare", 2.5],
    ["Kramer", "Legendary", 2.105],
    ["Levinson", "Legendary", 2.105],
    ["Mahboubian", "Legendary", 2.105],
    ["Rastegar", "Legendary", 2.105],
    ["Sakhai", "Mythic", 0.5],
    ["Yamini", "Mythic", 0.5],
    ["Zarabi", "Secret", 0.5],
    ["Kann", "Ultra Secret", 0.08],
    ["Rahimzadeh", "Mystical", 0.02],
  ],
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
  "Wise School Pack": "🏫",
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

packs["Garden Pack"] = [
  ["Seedling", "Common", 45],
  ["Sunflower", "Uncommon", 30],
  ["Rose Bush", "Rare", 15],
  ["Garden Gnome", "Legendary", 8],
  ["Treant", "Mythic", 1],
  ["Thorn Wraith", "Secret", 0.5],
  ["Verdant Oracle", "Ultra Secret", 0.08],
  ["Bloom Eternal", "Mystical", 0.02],
];
packEmojis["Garden Pack"] = "🌻";

packs["Safari Pack"] = [
  ["Gazelle", "Common", 45],
  ["Zebra", "Uncommon", 30],
  ["Elephant", "Rare", 15],
  ["Lion", "Legendary", 8],
  ["Rhino Titan", "Mythic", 1],
  ["Savanna Shade", "Secret", 0.5],
  ["Wild Sovereign", "Ultra Secret", 0.08],
  ["Safari Genesis", "Mystical", 0.02],
];
packEmojis["Safari Pack"] = "🦁";

packs["Bird Pack"] = [
  ["Sparrow", "Common", 45],
  ["Robin", "Uncommon", 30],
  ["Eagle", "Rare", 15],
  ["Falcon Lord", "Legendary", 8],
  ["Thunderbird", "Mythic", 1],
  ["Feather Wraith", "Secret", 0.5],
  ["Sky Sovereign", "Ultra Secret", 0.08],
  ["Avian Prime", "Mystical", 0.02],
];
packEmojis["Bird Pack"] = "🐦";

packs["Cat Pack"] = [
  ["Kitten", "Common", 45],
  ["Tabby", "Uncommon", 30],
  ["Persian", "Rare", 15],
  ["Panther", "Legendary", 8],
  ["Sphinx Cat", "Mythic", 1],
  ["Shadow Feline", "Secret", 0.5],
  ["Neon Cat", "Ultra Secret", 0.08],
  ["Cat Overlord", "Mystical", 0.02],
];
packEmojis["Cat Pack"] = "🐱";

packs["Dog Pack"] = [
  ["Puppy", "Common", 45],
  ["Beagle", "Uncommon", 30],
  ["Husky", "Rare", 15],
  ["Great Dane", "Legendary", 8],
  ["Alpha Hound", "Mythic", 1],
  ["Ghost Hound", "Secret", 0.5],
  ["Diamond Dog", "Ultra Secret", 0.08],
  ["Canine Prime", "Mystical", 0.02],
];
packEmojis["Dog Pack"] = "🐶";

packs["Reptile Pack"] = [
  ["Gecko", "Common", 45],
  ["Chameleon", "Uncommon", 30],
  ["Iguana", "Rare", 15],
  ["Komodo Dragon", "Legendary", 8],
  ["Scale Titan", "Mythic", 1],
  ["Venom Shade", "Secret", 0.5],
  ["Reptile Lord", "Ultra Secret", 0.08],
  ["Primordial Scales", "Mystical", 0.02],
];
packEmojis["Reptile Pack"] = "🦎";

packs["Horse Pack"] = [
  ["Foal", "Common", 45],
  ["Pony", "Uncommon", 30],
  ["Stallion", "Rare", 15],
  ["War Horse", "Legendary", 8],
  ["Nightmare Steed", "Mythic", 1],
  ["Spirit Stallion", "Secret", 0.5],
  ["Obsidian Mare", "Ultra Secret", 0.08],
  ["Equine Prime", "Mystical", 0.02],
];
packEmojis["Horse Pack"] = "🐴";

packs["Bear Pack"] = [
  ["Bear Cub", "Common", 45],
  ["Brown Bear", "Uncommon", 30],
  ["Grizzly", "Rare", 15],
  ["Kodiak", "Legendary", 8],
  ["Cave Bear", "Mythic", 1],
  ["Spirit Bear", "Secret", 0.5],
  ["Ursa Lord", "Ultra Secret", 0.08],
  ["Bear Cosmos", "Mystical", 0.02],
];
packEmojis["Bear Pack"] = "🐻";

packs["Wolf Pack"] = [
  ["Wolf Pup", "Common", 45],
  ["Grey Wolf", "Uncommon", 30],
  ["Timber Wolf", "Rare", 15],
  ["Alpha Wolf", "Legendary", 8],
  ["Dire Wolf", "Mythic", 1],
  ["Spectral Wolf", "Secret", 0.5],
  ["Moon Howler", "Ultra Secret", 0.08],
  ["Fenrir Prime", "Mystical", 0.02],
];
packEmojis["Wolf Pack"] = "🐺";

packs["Rabbit Pack"] = [
  ["Bunny", "Common", 45],
  ["Lop Ear", "Uncommon", 30],
  ["Jack Rabbit", "Rare", 15],
  ["Lucky Rabbit", "Legendary", 8],
  ["Moon Bunny", "Mythic", 1],
  ["Ghost Hare", "Secret", 0.5],
  ["Jade Rabbit", "Ultra Secret", 0.08],
  ["Rabbit Singularity", "Mystical", 0.02],
];
packEmojis["Rabbit Pack"] = "🐰";

packs["Snake Pack"] = [
  ["Garden Snake", "Common", 45],
  ["Cobra", "Uncommon", 30],
  ["Python", "Rare", 15],
  ["King Cobra", "Legendary", 8],
  ["Basilisk", "Mythic", 1],
  ["Serpent Shade", "Secret", 0.5],
  ["Coil Lord", "Ultra Secret", 0.08],
  ["Ouroboros Prime", "Mystical", 0.02],
];
packEmojis["Snake Pack"] = "🐍";

packs["Frog Pack"] = [
  ["Tadpole", "Common", 45],
  ["Tree Frog", "Uncommon", 30],
  ["Bull Frog", "Rare", 15],
  ["Poison Dart", "Legendary", 8],
  ["Frog Prince", "Mythic", 1],
  ["Phantom Frog", "Secret", 0.5],
  ["Swamp King", "Ultra Secret", 0.08],
  ["Amphibian Prime", "Mystical", 0.02],
];
packEmojis["Frog Pack"] = "🐸";

packs["Bat Pack"] = [
  ["Fruit Bat", "Common", 45],
  ["Brown Bat", "Uncommon", 30],
  ["Vampire Bat", "Rare", 15],
  ["Giant Bat", "Legendary", 8],
  ["Bat Titan", "Mythic", 1],
  ["Echo Wraith", "Secret", 0.5],
  ["Night Wing", "Ultra Secret", 0.08],
  ["Chiroptera Prime", "Mystical", 0.02],
];
packEmojis["Bat Pack"] = "🦇";

packs["Whale Pack"] = [
  ["Baby Whale", "Common", 45],
  ["Dolphin", "Uncommon", 30],
  ["Orca", "Rare", 15],
  ["Blue Whale", "Legendary", 8],
  ["Whale Titan", "Mythic", 1],
  ["Deep Song", "Secret", 0.5],
  ["Ocean Sovereign", "Ultra Secret", 0.08],
  ["Cetacean Prime", "Mystical", 0.02],
];
packEmojis["Whale Pack"] = "🐋";

packs["Coral Reef Pack"] = [
  ["Sea Star", "Common", 45],
  ["Anemone", "Uncommon", 30],
  ["Coral Brain", "Rare", 15],
  ["Reef Shark", "Legendary", 8],
  ["Coral Titan", "Mythic", 1],
  ["Tide Specter", "Secret", 0.5],
  ["Reef Sovereign", "Ultra Secret", 0.08],
  ["Coral Genesis", "Mystical", 0.02],
];
packEmojis["Coral Reef Pack"] = "🪸";

packs["Dragon Pack"] = [
  ["Dragon Egg", "Common", 45],
  ["Fire Drake", "Uncommon", 30],
  ["Ice Wyvern", "Rare", 15],
  ["Storm Dragon", "Legendary", 8],
  ["Elder Wyrm", "Mythic", 1],
  ["Shadow Drake", "Secret", 0.5],
  ["Celestial Dragon", "Ultra Secret", 0.08],
  ["Dragon Eternal", "Mystical", 0.02],
];
packEmojis["Dragon Pack"] = "🐉";

packs["Unicorn Pack"] = [
  ["Baby Unicorn", "Common", 45],
  ["Pegasus", "Uncommon", 30],
  ["Alicorn", "Rare", 15],
  ["Rainbow Stallion", "Legendary", 8],
  ["Star Unicorn", "Mythic", 1],
  ["Dream Steed", "Secret", 0.5],
  ["Celestial Steed", "Ultra Secret", 0.08],
  ["Unicorn Genesis", "Mystical", 0.02],
];
packEmojis["Unicorn Pack"] = "🦄";

packs["Fairy Pack"] = [
  ["Pixie", "Common", 45],
  ["Sprite", "Uncommon", 30],
  ["Fairy", "Rare", 15],
  ["Fairy Queen", "Legendary", 8],
  ["Titania", "Mythic", 1],
  ["Glimmer Shade", "Secret", 0.5],
  ["Fey Lord", "Ultra Secret", 0.08],
  ["Fairy Cosmos", "Mystical", 0.02],
];
packEmojis["Fairy Pack"] = "🧚";

packs["Wizard School Pack"] = [
  ["Student", "Common", 45],
  ["Prefect", "Uncommon", 30],
  ["Professor", "Rare", 15],
  ["Headmaster", "Legendary", 8],
  ["Grand Sorcerer", "Mythic", 1],
  ["Spell Wraith", "Secret", 0.5],
  ["Academy Lord", "Ultra Secret", 0.08],
  ["Arcana Prime", "Mystical", 0.02],
];
packEmojis["Wizard School Pack"] = "🏫";

packs["Potion Pack"] = [
  ["Herb Sprig", "Common", 45],
  ["Bubbling Flask", "Uncommon", 30],
  ["Love Potion", "Rare", 15],
  ["Elixir of Life", "Legendary", 8],
  ["Potion Master", "Mythic", 1],
  ["Toxic Shade", "Secret", 0.5],
  ["Brew Lord", "Ultra Secret", 0.08],
  ["Alchemical Prime", "Mystical", 0.02],
];
packEmojis["Potion Pack"] = "🧪";

packs["Crystal Pack"] = [
  ["Crystal Shard", "Common", 45],
  ["Rose Quartz", "Uncommon", 30],
  ["Topaz", "Rare", 15],
  ["Emerald Crown", "Legendary", 8],
  ["Crystal Golem", "Mythic", 1],
  ["Prism Wraith", "Secret", 0.5],
  ["Crystalline Lord", "Ultra Secret", 0.08],
  ["Crystal Genesis", "Mystical", 0.02],
];
packEmojis["Crystal Pack"] = "🔮";

packs["Enchanted Pack"] = [
  ["Enchanted Ring", "Common", 45],
  ["Magic Mirror", "Uncommon", 30],
  ["Fairy Dust", "Rare", 15],
  ["Enchanted Sword", "Legendary", 8],
  ["Spell Titan", "Mythic", 1],
  ["Mystic Shade", "Secret", 0.5],
  ["Enchantment Lord", "Ultra Secret", 0.08],
  ["Enchanted Cosmos", "Mystical", 0.02],
];
packEmojis["Enchanted Pack"] = "✨";

packs["Golem Pack"] = [
  ["Clay Lump", "Common", 45],
  ["Mud Golem", "Uncommon", 30],
  ["Stone Golem", "Rare", 15],
  ["Iron Golem", "Legendary", 8],
  ["Diamond Golem", "Mythic", 1],
  ["Spirit Golem", "Secret", 0.5],
  ["Golem Lord", "Ultra Secret", 0.08],
  ["Golem Prime", "Mystical", 0.02],
];
packEmojis["Golem Pack"] = "🗿";

packs["Phoenix Pack"] = [
  ["Ash Pile", "Common", 45],
  ["Fire Chick", "Uncommon", 30],
  ["Flame Bird", "Rare", 15],
  ["Golden Phoenix", "Legendary", 8],
  ["Inferno Phoenix", "Mythic", 1],
  ["Ash Specter", "Secret", 0.5],
  ["Rebirth Lord", "Ultra Secret", 0.08],
  ["Phoenix Eternal", "Mystical", 0.02],
];
packEmojis["Phoenix Pack"] = "🔥";

packs["Mermaid Pack"] = [
  ["Sea Shell", "Common", 45],
  ["Merpup", "Uncommon", 30],
  ["Mermaid", "Rare", 15],
  ["Merman King", "Legendary", 8],
  ["Siren", "Mythic", 1],
  ["Tide Ghost", "Secret", 0.5],
  ["Ocean Empress", "Ultra Secret", 0.08],
  ["Mermaid Prime", "Mystical", 0.02],
];
packEmojis["Mermaid Pack"] = "🧜";

packs["Centaur Pack"] = [
  ["Centaur Foal", "Common", 45],
  ["Centaur Scout", "Uncommon", 30],
  ["Centaur Warrior", "Rare", 15],
  ["Centaur Captain", "Legendary", 8],
  ["Centaur Lord", "Mythic", 1],
  ["Steppe Shade", "Secret", 0.5],
  ["Gallop Sovereign", "Ultra Secret", 0.08],
  ["Centaur Prime", "Mystical", 0.02],
];
packEmojis["Centaur Pack"] = "🏹";

packs["Troll Pack"] = [
  ["Goblin", "Common", 45],
  ["Hobgoblin", "Uncommon", 30],
  ["Troll", "Rare", 15],
  ["Ogre", "Legendary", 8],
  ["Troll King", "Mythic", 1],
  ["Bridge Shade", "Secret", 0.5],
  ["Mountain Troll", "Ultra Secret", 0.08],
  ["Troll Cosmos", "Mystical", 0.02],
];
packEmojis["Troll Pack"] = "👹";

packs["Elemental Pack"] = [
  ["Spark Mote", "Common", 45],
  ["Water Sprite", "Uncommon", 30],
  ["Earth Shard", "Rare", 15],
  ["Fire Sprite", "Legendary", 8],
  ["Storm Elemental", "Mythic", 1],
  ["Void Mote", "Secret", 0.5],
  ["Elemental Lord", "Ultra Secret", 0.08],
  ["Elemental Prime", "Mystical", 0.02],
];
packEmojis["Elemental Pack"] = "🌀";

packs["Grimoire Pack"] = [
  ["Torn Page", "Common", 45],
  ["Spell Book", "Uncommon", 30],
  ["Ancient Scroll", "Rare", 15],
  ["Forbidden Tome", "Legendary", 8],
  ["Living Grimoire", "Mythic", 1],
  ["Shadow Text", "Secret", 0.5],
  ["Codex Lord", "Ultra Secret", 0.08],
  ["Grimoire Singularity", "Mystical", 0.02],
];
packEmojis["Grimoire Pack"] = "📖";

packs["Rune Pack"] = [
  ["Rune Pebble", "Common", 45],
  ["Stone Rune", "Uncommon", 30],
  ["Iron Rune", "Rare", 15],
  ["Golden Rune", "Legendary", 8],
  ["Master Rune", "Mythic", 1],
  ["Dark Rune", "Secret", 0.5],
  ["Rune Lord", "Ultra Secret", 0.08],
  ["Rune Genesis", "Mystical", 0.02],
];
packEmojis["Rune Pack"] = "🪨";

packs["Pizza Pack"] = [
  ["Pepperoni", "Common", 45],
  ["Cheese Slice", "Uncommon", 30],
  ["Pizza Chef", "Rare", 15],
  ["Golden Crust", "Legendary", 8],
  ["Pizza Dragon", "Mythic", 1],
  ["Sauce Specter", "Secret", 0.5],
  ["Oven Lord", "Ultra Secret", 0.08],
  ["Pizza Cosmos", "Mystical", 0.02],
];
packEmojis["Pizza Pack"] = "🍕";

packs["Sushi Pack"] = [
  ["Rice Ball", "Common", 45],
  ["Salmon Roll", "Uncommon", 30],
  ["Tuna Nigiri", "Rare", 15],
  ["Dragon Roll", "Legendary", 8],
  ["Sushi Master", "Mythic", 1],
  ["Wasabi Specter", "Secret", 0.5],
  ["Golden Chopstick", "Ultra Secret", 0.08],
  ["Omakase Prime", "Mystical", 0.02],
];
packEmojis["Sushi Pack"] = "🍣";

packs["Fruit Pack"] = [
  ["Apple", "Common", 45],
  ["Banana", "Uncommon", 30],
  ["Strawberry", "Rare", 15],
  ["Pineapple King", "Legendary", 8],
  ["Fruit Dragon", "Mythic", 1],
  ["Berry Specter", "Secret", 0.5],
  ["Orchard Lord", "Ultra Secret", 0.08],
  ["Fruit Cosmos", "Mystical", 0.02],
];
packEmojis["Fruit Pack"] = "🍎";

packs["Cake Pack"] = [
  ["Cupcake", "Common", 45],
  ["Layer Cake", "Uncommon", 30],
  ["Wedding Cake", "Rare", 15],
  ["Fondant Knight", "Legendary", 8],
  ["Frosting Dragon", "Mythic", 1],
  ["Sprinkle Specter", "Secret", 0.5],
  ["Patisserie Lord", "Ultra Secret", 0.08],
  ["Cake Singularity", "Mystical", 0.02],
];
packEmojis["Cake Pack"] = "🎂";

packs["Bakery Pack"] = [
  ["Bread Roll", "Common", 45],
  ["Baguette", "Uncommon", 30],
  ["Croissant", "Rare", 15],
  ["Pretzel King", "Legendary", 8],
  ["Dough Titan", "Mythic", 1],
  ["Yeast Specter", "Secret", 0.5],
  ["Baker Lord", "Ultra Secret", 0.08],
  ["Bakery Prime", "Mystical", 0.02],
];
packEmojis["Bakery Pack"] = "🥖";

packs["Cheese Pack"] = [
  ["Cheddar", "Common", 45],
  ["Swiss", "Uncommon", 30],
  ["Brie", "Rare", 15],
  ["Aged Gouda", "Legendary", 8],
  ["Cheese Titan", "Mythic", 1],
  ["Mold Specter", "Secret", 0.5],
  ["Fondue Lord", "Ultra Secret", 0.08],
  ["Cheese Cosmos", "Mystical", 0.02],
];
packEmojis["Cheese Pack"] = "🧀";

packs["Ice Cream Pack"] = [
  ["Vanilla Scoop", "Common", 45],
  ["Chocolate Swirl", "Uncommon", 30],
  ["Sundae", "Rare", 15],
  ["Neapolitan King", "Legendary", 8],
  ["Gelato Titan", "Mythic", 1],
  ["Brain Freeze", "Secret", 0.5],
  ["Soft Serve Lord", "Ultra Secret", 0.08],
  ["Ice Cream Cosmos", "Mystical", 0.02],
];
packEmojis["Ice Cream Pack"] = "🍦";

packs["BBQ Pack"] = [
  ["Hot Dog", "Common", 45],
  ["Burger", "Uncommon", 30],
  ["Ribs", "Rare", 15],
  ["Brisket King", "Legendary", 8],
  ["Grill Master", "Mythic", 1],
  ["Smoke Specter", "Secret", 0.5],
  ["BBQ Overlord", "Ultra Secret", 0.08],
  ["Flame Grill Prime", "Mystical", 0.02],
];
packEmojis["BBQ Pack"] = "🍖";

packs["Taco Pack"] = [
  ["Tortilla", "Common", 45],
  ["Soft Taco", "Uncommon", 30],
  ["Hard Taco", "Rare", 15],
  ["Burrito King", "Legendary", 8],
  ["Nacho Titan", "Mythic", 1],
  ["Salsa Specter", "Secret", 0.5],
  ["Taco Lord", "Ultra Secret", 0.08],
  ["Fiesta Prime", "Mystical", 0.02],
];
packEmojis["Taco Pack"] = "🌮";

packs["Cookie Pack"] = [
  ["Sugar Cookie", "Common", 45],
  ["Chocolate Chip", "Uncommon", 30],
  ["Macaron", "Rare", 15],
  ["Cookie Monster", "Legendary", 8],
  ["Biscuit Titan", "Mythic", 1],
  ["Crumb Specter", "Secret", 0.5],
  ["Cookie Lord", "Ultra Secret", 0.08],
  ["Cookie Cosmos", "Mystical", 0.02],
];
packEmojis["Cookie Pack"] = "🍪";

packs["Smoothie Pack"] = [
  ["Berry Blend", "Common", 45],
  ["Mango Mix", "Uncommon", 30],
  ["Acai Bowl", "Rare", 15],
  ["Protein King", "Legendary", 8],
  ["Smoothie Titan", "Mythic", 1],
  ["Juice Specter", "Secret", 0.5],
  ["Blender Lord", "Ultra Secret", 0.08],
  ["Smoothie Prime", "Mystical", 0.02],
];
packEmojis["Smoothie Pack"] = "🥤";

packs["Pasta Pack"] = [
  ["Macaroni", "Common", 45],
  ["Spaghetti", "Uncommon", 30],
  ["Ravioli", "Rare", 15],
  ["Lasagna King", "Legendary", 8],
  ["Pasta Titan", "Mythic", 1],
  ["Marinara Specter", "Secret", 0.5],
  ["Noodle Lord", "Ultra Secret", 0.08],
  ["Pasta Cosmos", "Mystical", 0.02],
];
packEmojis["Pasta Pack"] = "🍝";

packs["Ramen Pack"] = [
  ["Egg Noodle", "Common", 45],
  ["Miso Bowl", "Uncommon", 30],
  ["Tonkotsu", "Rare", 15],
  ["Ramen King", "Legendary", 8],
  ["Broth Titan", "Mythic", 1],
  ["Umami Specter", "Secret", 0.5],
  ["Ramen Lord", "Ultra Secret", 0.08],
  ["Ramen Genesis", "Mystical", 0.02],
];
packEmojis["Ramen Pack"] = "🍜";

packs["Chocolate Pack"] = [
  ["Cocoa Bean", "Common", 45],
  ["Milk Chocolate", "Uncommon", 30],
  ["Dark Chocolate", "Rare", 15],
  ["Truffle King", "Legendary", 8],
  ["Chocolate Titan", "Mythic", 1],
  ["Cocoa Specter", "Secret", 0.5],
  ["Cacao Lord", "Ultra Secret", 0.08],
  ["Chocolate Cosmos", "Mystical", 0.02],
];
packEmojis["Chocolate Pack"] = "🍫";

packs["Donut Pack"] = [
  ["Glazed Donut", "Common", 45],
  ["Sprinkle Donut", "Uncommon", 30],
  ["Jelly Donut", "Rare", 15],
  ["Cruller King", "Legendary", 8],
  ["Donut Titan", "Mythic", 1],
  ["Glaze Specter", "Secret", 0.5],
  ["Ring Lord", "Ultra Secret", 0.08],
  ["Donut Genesis", "Mystical", 0.02],
];
packEmojis["Donut Pack"] = "🍩";

packs["Robot Pack"] = [
  ["Tin Bot", "Common", 45],
  ["Servo", "Uncommon", 30],
  ["Iron Guard", "Rare", 15],
  ["Steel Sentinel", "Legendary", 8],
  ["Mecha Lord", "Mythic", 1],
  ["Chrome Specter", "Secret", 0.5],
  ["Quantum Droid", "Ultra Secret", 0.08],
  ["Omega Machine", "Mystical", 0.02],
];
packEmojis["Robot Pack"] = "🦾";

packs["Lab Pack"] = [
  ["Test Tube", "Common", 45],
  ["Beaker", "Uncommon", 30],
  ["Bunsen Burner", "Rare", 15],
  ["Lab Coat", "Legendary", 8],
  ["Mad Scientist", "Mythic", 1],
  ["Chemical Shade", "Secret", 0.5],
  ["Formula X", "Ultra Secret", 0.08],
  ["Lab Singularity", "Mystical", 0.02],
];
packEmojis["Lab Pack"] = "🔬";

packs["Quantum Pack"] = [
  ["Quark", "Common", 45],
  ["Electron", "Uncommon", 30],
  ["Photon", "Rare", 15],
  ["Neutron Star", "Legendary", 8],
  ["Quantum Titan", "Mythic", 1],
  ["Wave Specter", "Secret", 0.5],
  ["Particle Lord", "Ultra Secret", 0.08],
  ["Quantum Cosmos", "Mystical", 0.02],
];
packEmojis["Quantum Pack"] = "⚛️";

packs["AI Pack"] = [
  ["Chat Bot", "Common", 45],
  ["Data Node", "Uncommon", 30],
  ["Neural Net", "Rare", 15],
  ["Deep Mind", "Legendary", 8],
  ["AI Titan", "Mythic", 1],
  ["Glitch Specter", "Secret", 0.5],
  ["Algorithm Lord", "Ultra Secret", 0.08],
  ["AI Singularity", "Mystical", 0.02],
];
packEmojis["AI Pack"] = "💻";

packs["Neon Pack"] = [
  ["Neon Tube", "Common", 45],
  ["Glow Stick", "Uncommon", 30],
  ["Neon Sign", "Rare", 15],
  ["Neon Dragon", "Legendary", 8],
  ["Neon Titan", "Mythic", 1],
  ["Flux Specter", "Secret", 0.5],
  ["Neon Lord", "Ultra Secret", 0.08],
  ["Neon Genesis", "Mystical", 0.02],
];
packEmojis["Neon Pack"] = "💡";

packs["Pixel Pack"] = [
  ["Pixel Dot", "Common", 45],
  ["Sprite Block", "Uncommon", 30],
  ["Pixel Sword", "Rare", 15],
  ["Pixel Dragon", "Legendary", 8],
  ["Pixel Titan", "Mythic", 1],
  ["Glitch Ghost", "Secret", 0.5],
  ["Pixel Lord", "Ultra Secret", 0.08],
  ["Pixel Cosmos", "Mystical", 0.02],
];
packEmojis["Pixel Pack"] = "🎮";

packs["Hologram Pack"] = [
  ["Light Shard", "Common", 45],
  ["Holo Disc", "Uncommon", 30],
  ["Holo Shield", "Rare", 15],
  ["Holo Dragon", "Legendary", 8],
  ["Holo Titan", "Mythic", 1],
  ["Phase Specter", "Secret", 0.5],
  ["Holo Lord", "Ultra Secret", 0.08],
  ["Hologram Prime", "Mystical", 0.02],
];
packEmojis["Hologram Pack"] = "🔷";

packs["Steampunk Pack"] = [
  ["Cog", "Common", 45],
  ["Brass Mouse", "Uncommon", 30],
  ["Steam Bot", "Rare", 15],
  ["Gear Titan", "Legendary", 8],
  ["Clockwork Dragon", "Mythic", 1],
  ["Steam Specter", "Secret", 0.5],
  ["Engine Lord", "Ultra Secret", 0.08],
  ["Steampunk Nexus", "Mystical", 0.02],
];
packEmojis["Steampunk Pack"] = "⚙️";

packs["Circuit Pack"] = [
  ["Resistor", "Common", 45],
  ["Capacitor", "Uncommon", 30],
  ["Microchip", "Rare", 15],
  ["Motherboard", "Legendary", 8],
  ["Circuit Titan", "Mythic", 1],
  ["Voltage Specter", "Secret", 0.5],
  ["Circuit Lord", "Ultra Secret", 0.08],
  ["Circuit Genesis", "Mystical", 0.02],
];
packEmojis["Circuit Pack"] = "🔌";

packs["Satellite Pack"] = [
  ["Antenna", "Common", 45],
  ["Dish", "Uncommon", 30],
  ["Satellite", "Rare", 15],
  ["Space Probe", "Legendary", 8],
  ["Orbital Titan", "Mythic", 1],
  ["Signal Specter", "Secret", 0.5],
  ["Uplink Lord", "Ultra Secret", 0.08],
  ["Satellite Cosmos", "Mystical", 0.02],
];
packEmojis["Satellite Pack"] = "📡";

packs["Telescope Pack"] = [
  ["Lens", "Common", 45],
  ["Spyglass", "Uncommon", 30],
  ["Observatory", "Rare", 15],
  ["Star Map", "Legendary", 8],
  ["Cosmic Eye", "Mythic", 1],
  ["Deep Space Specter", "Secret", 0.5],
  ["Horizon Lord", "Ultra Secret", 0.08],
  ["Telescope Prime", "Mystical", 0.02],
];
packEmojis["Telescope Pack"] = "🔭";

packs["Rocket Pack"] = [
  ["Booster", "Common", 45],
  ["Capsule", "Uncommon", 30],
  ["Shuttle", "Rare", 15],
  ["Shuttle Bay", "Legendary", 8],
  ["Rocket Titan", "Mythic", 1],
  ["Orbit Specter", "Secret", 0.5],
  ["Launch Lord", "Ultra Secret", 0.08],
  ["Rocket Genesis", "Mystical", 0.02],
];
packEmojis["Rocket Pack"] = "🧑‍🚀";

packs["Biotech Pack"] = [
  ["Cell", "Common", 45],
  ["DNA Strand", "Uncommon", 30],
  ["Gene Splice", "Rare", 15],
  ["Mutant", "Legendary", 8],
  ["Bio Titan", "Mythic", 1],
  ["Genome Specter", "Secret", 0.5],
  ["Helix Lord", "Ultra Secret", 0.08],
  ["Biotech Prime", "Mystical", 0.02],
];
packEmojis["Biotech Pack"] = "🧬";

packs["Laser Pack"] = [
  ["Light Beam", "Common", 45],
  ["Laser Pointer", "Uncommon", 30],
  ["Laser Grid", "Rare", 15],
  ["Laser Cannon", "Legendary", 8],
  ["Laser Titan", "Mythic", 1],
  ["Photon Specter", "Secret", 0.5],
  ["Beam Lord", "Ultra Secret", 0.08],
  ["Laser Cosmos", "Mystical", 0.02],
];
packEmojis["Laser Pack"] = "🔴";

packs["Gravity Pack"] = [
  ["Pebble Float", "Common", 45],
  ["Gravity Well", "Uncommon", 30],
  ["Density Core", "Rare", 15],
  ["Mass Shifter", "Legendary", 8],
  ["Gravity Titan", "Mythic", 1],
  ["Warp Specter", "Secret", 0.5],
  ["Gravity Lord", "Ultra Secret", 0.08],
  ["Gravity Prime", "Mystical", 0.02],
];
packEmojis["Gravity Pack"] = "🌑";

packs["Ninja Pack"] = [
  ["Shuriken", "Common", 45],
  ["Shadow Scout", "Uncommon", 30],
  ["Blade Dancer", "Rare", 15],
  ["Silent Striker", "Legendary", 8],
  ["Grand Shinobi", "Mythic", 1],
  ["Shadow Specter", "Secret", 0.5],
  ["Void Ninja", "Ultra Secret", 0.08],
  ["Shadow Sovereign", "Mystical", 0.02],
];
packEmojis["Ninja Pack"] = "🥷";

packs["Samurai Pack"] = [
  ["Ronin", "Common", 45],
  ["Katana", "Uncommon", 30],
  ["War Banner", "Rare", 15],
  ["Daimyo", "Legendary", 8],
  ["Shogun", "Mythic", 1],
  ["Oni Mask", "Secret", 0.5],
  ["Bushido Master", "Ultra Secret", 0.08],
  ["Samurai Eternal", "Mystical", 0.02],
];
packEmojis["Samurai Pack"] = "⛩️";

packs["Cowboy Pack"] = [
  ["Tumbleweed", "Common", 45],
  ["Cattle", "Uncommon", 30],
  ["Bandit", "Rare", 15],
  ["Sheriff", "Legendary", 8],
  ["Outlaw King", "Mythic", 1],
  ["Ghost Rider", "Secret", 0.5],
  ["Frontier Legend", "Ultra Secret", 0.08],
  ["Wild West Prime", "Mystical", 0.02],
];
packEmojis["Cowboy Pack"] = "🤠";

packs["Viking Pack"] = [
  ["Shield Bearer", "Common", 45],
  ["Berserker", "Uncommon", 30],
  ["Longship", "Rare", 15],
  ["War Chief", "Legendary", 8],
  ["Viking Lord", "Mythic", 1],
  ["Valhalla Shade", "Secret", 0.5],
  ["Odin's Chosen", "Ultra Secret", 0.08],
  ["Ragnarok Prime", "Mystical", 0.02],
];
packEmojis["Viking Pack"] = "🛡️";

packs["Superhero Pack"] = [
  ["Sidekick", "Common", 45],
  ["Masked Hero", "Uncommon", 30],
  ["Caped Crusader", "Rare", 15],
  ["Super Soldier", "Legendary", 8],
  ["Mega Hero", "Mythic", 1],
  ["Phantom Hero", "Secret", 0.5],
  ["Hero Lord", "Ultra Secret", 0.08],
  ["Hero Prime", "Mystical", 0.02],
];
packEmojis["Superhero Pack"] = "🦸";

packs["Villain Pack"] = [
  ["Henchman", "Common", 45],
  ["Minion Boss", "Uncommon", 30],
  ["Mad Doctor", "Rare", 15],
  ["Evil Genius", "Legendary", 8],
  ["Arch Villain", "Mythic", 1],
  ["Shadow Villain", "Secret", 0.5],
  ["Dark Lord", "Ultra Secret", 0.08],
  ["Villain Prime", "Mystical", 0.02],
];
packEmojis["Villain Pack"] = "🦹";

packs["Spy Pack"] = [
  ["Agent", "Common", 45],
  ["Double Agent", "Uncommon", 30],
  ["Spy Master", "Rare", 15],
  ["Secret Agent", "Legendary", 8],
  ["Spy Chief", "Mythic", 1],
  ["Ghost Agent", "Secret", 0.5],
  ["Shadow Operative", "Ultra Secret", 0.08],
  ["Spy Prime", "Mystical", 0.02],
];
packEmojis["Spy Pack"] = "🕵️";

packs["Treasure Pack"] = [
  ["Copper Coin", "Common", 45],
  ["Silver Key", "Uncommon", 30],
  ["Gold Bar", "Rare", 15],
  ["Treasure Chest", "Legendary", 8],
  ["Treasure Dragon", "Mythic", 1],
  ["Vault Shade", "Secret", 0.5],
  ["Treasure King", "Ultra Secret", 0.08],
  ["Treasure Cosmos", "Mystical", 0.02],
];
packEmojis["Treasure Pack"] = "🗝️";

packs["Dungeon Pack"] = [
  ["Torch", "Common", 45],
  ["Trap", "Uncommon", 30],
  ["Mimic", "Rare", 15],
  ["Dungeon Boss", "Legendary", 8],
  ["Dungeon Dragon", "Mythic", 1],
  ["Crypt Shade", "Secret", 0.5],
  ["Dungeon Lord", "Ultra Secret", 0.08],
  ["Dungeon Genesis", "Mystical", 0.02],
];
packEmojis["Dungeon Pack"] = "🗡️";

packs["Racing Pack"] = [
  ["Go Kart", "Common", 45],
  ["Sports Car", "Uncommon", 30],
  ["Formula One", "Rare", 15],
  ["Rally King", "Legendary", 8],
  ["Speed Titan", "Mythic", 1],
  ["Turbo Shade", "Secret", 0.5],
  ["Racing Lord", "Ultra Secret", 0.08],
  ["Racing Cosmos", "Mystical", 0.02],
];
packEmojis["Racing Pack"] = "🏎️";

packs["Skateboard Pack"] = [
  ["Skater", "Common", 45],
  ["Kick Flip", "Uncommon", 30],
  ["Half Pipe", "Rare", 15],
  ["Skate King", "Legendary", 8],
  ["Air Titan", "Mythic", 1],
  ["Grind Shade", "Secret", 0.5],
  ["Board Lord", "Ultra Secret", 0.08],
  ["Skate Prime", "Mystical", 0.02],
];
packEmojis["Skateboard Pack"] = "🛹";

packs["Climbing Pack"] = [
  ["Rope", "Common", 45],
  ["Carabiner", "Uncommon", 30],
  ["Ice Axe", "Rare", 15],
  ["Summit King", "Legendary", 8],
  ["Peak Titan", "Mythic", 1],
  ["Altitude Shade", "Secret", 0.5],
  ["Climb Lord", "Ultra Secret", 0.08],
  ["Summit Prime", "Mystical", 0.02],
];
packEmojis["Climbing Pack"] = "🧗";

packs["Wrestling Pack"] = [
  ["Rookie", "Common", 45],
  ["Tag Team", "Uncommon", 30],
  ["Heel Turn", "Rare", 15],
  ["Belt Holder", "Legendary", 8],
  ["Ring Titan", "Mythic", 1],
  ["Phantom Wrestler", "Secret", 0.5],
  ["Arena Lord", "Ultra Secret", 0.08],
  ["Wrestling Prime", "Mystical", 0.02],
];
packEmojis["Wrestling Pack"] = "🤼";

packs["Archery Pack"] = [
  ["Quiver", "Common", 45],
  ["Short Bow", "Uncommon", 30],
  ["Longbow", "Rare", 15],
  ["Crossbow King", "Legendary", 8],
  ["Arrow Titan", "Mythic", 1],
  ["Bullseye Shade", "Secret", 0.5],
  ["Marksman Lord", "Ultra Secret", 0.08],
  ["Archery Prime", "Mystical", 0.02],
];
packEmojis["Archery Pack"] = "🎯";

packs["Martial Arts Pack"] = [
  ["White Belt", "Common", 45],
  ["Sparring Pad", "Uncommon", 30],
  ["Black Belt", "Rare", 15],
  ["Sensei", "Legendary", 8],
  ["Grand Master", "Mythic", 1],
  ["Chi Shade", "Secret", 0.5],
  ["Dojo Lord", "Ultra Secret", 0.08],
  ["Martial Prime", "Mystical", 0.02],
];
packEmojis["Martial Arts Pack"] = "🥋";

packs["Moon Pack"] = [
  ["Moon Rock", "Common", 45],
  ["Crater", "Uncommon", 30],
  ["Lunar Rover", "Rare", 15],
  ["Moon Rabbit", "Legendary", 8],
  ["Lunar Guardian", "Mythic", 1],
  ["Eclipse Shade", "Secret", 0.5],
  ["Moonstone King", "Ultra Secret", 0.08],
  ["Lunar Prime", "Mystical", 0.02],
];
packEmojis["Moon Pack"] = "🌙";

packs["Constellation Pack"] = [
  ["Shooting Star", "Common", 45],
  ["Comet", "Uncommon", 30],
  ["Nebula", "Rare", 15],
  ["Supernova", "Legendary", 8],
  ["Pulsar King", "Mythic", 1],
  ["Quasar Shade", "Secret", 0.5],
  ["Dark Matter", "Ultra Secret", 0.08],
  ["Constellation Prime", "Mystical", 0.02],
];
packEmojis["Constellation Pack"] = "🌌";

packs["Flame Pack"] = [
  ["Ember", "Common", 45],
  ["Matchstick", "Uncommon", 30],
  ["Fire Wisp", "Rare", 15],
  ["Blaze Titan", "Legendary", 8],
  ["Flame Phoenix", "Mythic", 1],
  ["Inferno Shade", "Secret", 0.5],
  ["Hellfire Lord", "Ultra Secret", 0.08],
  ["Flame Eternal", "Mystical", 0.02],
];
packEmojis["Flame Pack"] = "🔥";

packs["Thunder Pack"] = [
  ["Static", "Common", 45],
  ["Spark Plug", "Uncommon", 30],
  ["Thunder Cloud", "Rare", 15],
  ["Thunder King", "Legendary", 8],
  ["Lightning Titan", "Mythic", 1],
  ["Volt Shade", "Secret", 0.5],
  ["Thunder Lord", "Ultra Secret", 0.08],
  ["Thunder Genesis", "Mystical", 0.02],
];
packEmojis["Thunder Pack"] = "⚡";

packs["Mountain Pack"] = [
  ["Pebble", "Common", 45],
  ["Boulder", "Uncommon", 30],
  ["Mountain Goat", "Rare", 15],
  ["Mountain King", "Legendary", 8],
  ["Avalanche Titan", "Mythic", 1],
  ["Granite Shade", "Secret", 0.5],
  ["Peak Sovereign", "Ultra Secret", 0.08],
  ["Mountain Prime", "Mystical", 0.02],
];
packEmojis["Mountain Pack"] = "🏔️";

packs["Swamp Pack"] = [
  ["Lily Pad", "Common", 45],
  ["Toad", "Uncommon", 30],
  ["Crocodile", "Rare", 15],
  ["Swamp Thing", "Legendary", 8],
  ["Bog Titan", "Mythic", 1],
  ["Mire Shade", "Secret", 0.5],
  ["Swamp Lord", "Ultra Secret", 0.08],
  ["Swamp Genesis", "Mystical", 0.02],
];
packEmojis["Swamp Pack"] = "🐊";

packs["Tundra Pack"] = [
  ["Ice Cube", "Common", 45],
  ["Snow Hare", "Uncommon", 30],
  ["Musk Ox", "Rare", 15],
  ["Mammoth", "Legendary", 8],
  ["Tundra Titan", "Mythic", 1],
  ["Frost Shade", "Secret", 0.5],
  ["Permafrost Lord", "Ultra Secret", 0.08],
  ["Tundra Prime", "Mystical", 0.02],
];
packEmojis["Tundra Pack"] = "🥶";

packs["Mushroom Pack"] = [
  ["Toadstool", "Common", 45],
  ["Puffball", "Uncommon", 30],
  ["Morel", "Rare", 15],
  ["Truffle Crown", "Legendary", 8],
  ["Mycelium Titan", "Mythic", 1],
  ["Spore Shade", "Secret", 0.5],
  ["Fungal Lord", "Ultra Secret", 0.08],
  ["Mushroom Cosmos", "Mystical", 0.02],
];
packEmojis["Mushroom Pack"] = "🍄";

packs["Gem Pack"] = [
  ["Quartz", "Common", 45],
  ["Amethyst", "Uncommon", 30],
  ["Sapphire", "Rare", 15],
  ["Ruby Crown", "Legendary", 8],
  ["Diamond Titan", "Mythic", 1],
  ["Obsidian Shade", "Secret", 0.5],
  ["Jewel Lord", "Ultra Secret", 0.08],
  ["Gem Cosmos", "Mystical", 0.02],
];
packEmojis["Gem Pack"] = "💎";

packs["Earthquake Pack"] = [
  ["Fault Line", "Common", 45],
  ["Tremor", "Uncommon", 30],
  ["Aftershock", "Rare", 15],
  ["Seismic King", "Legendary", 8],
  ["Tectonic Titan", "Mythic", 1],
  ["Rift Shade", "Secret", 0.5],
  ["Quake Lord", "Ultra Secret", 0.08],
  ["Earthquake Prime", "Mystical", 0.02],
];
packEmojis["Earthquake Pack"] = "🌍";

packs["Aurora Pack"] = [
  ["Light Wave", "Common", 45],
  ["Color Band", "Uncommon", 30],
  ["Dawn Light", "Rare", 15],
  ["Aurora King", "Legendary", 8],
  ["Spectrum Titan", "Mythic", 1],
  ["Prism Shade", "Secret", 0.5],
  ["Aurora Lord", "Ultra Secret", 0.08],
  ["Aurora Genesis", "Mystical", 0.02],
];
packEmojis["Aurora Pack"] = "🌈";

packs["Sunset Pack"] = [
  ["Dusk", "Common", 45],
  ["Horizon", "Uncommon", 30],
  ["Golden Hour", "Rare", 15],
  ["Sunset King", "Legendary", 8],
  ["Twilight Titan", "Mythic", 1],
  ["Dusk Shade", "Secret", 0.5],
  ["Eventide Lord", "Ultra Secret", 0.08],
  ["Sunset Prime", "Mystical", 0.02],
];
packEmojis["Sunset Pack"] = "🌅";

packs["Bamboo Pack"] = [
  ["Bamboo Shoot", "Common", 45],
  ["Bamboo Stalk", "Uncommon", 30],
  ["Red Panda", "Rare", 15],
  ["Panda King", "Legendary", 8],
  ["Bamboo Titan", "Mythic", 1],
  ["Grove Shade", "Secret", 0.5],
  ["Bamboo Lord", "Ultra Secret", 0.08],
  ["Bamboo Genesis", "Mystical", 0.02],
];
packEmojis["Bamboo Pack"] = "🎋";

packs["Island Pack"] = [
  ["Palm Tree", "Common", 45],
  ["Sand Crab", "Uncommon", 30],
  ["Tiki Torch", "Rare", 15],
  ["Island King", "Legendary", 8],
  ["Volcanic Isle", "Mythic", 1],
  ["Lagoon Shade", "Secret", 0.5],
  ["Island Lord", "Ultra Secret", 0.08],
  ["Paradise Prime", "Mystical", 0.02],
];
packEmojis["Island Pack"] = "🏝️";

packs["Cavern Pack"] = [
  ["Stalagmite", "Common", 45],
  ["Bat Colony", "Uncommon", 30],
  ["Cave Spider", "Rare", 15],
  ["Crystal Cavern", "Legendary", 8],
  ["Cavern Titan", "Mythic", 1],
  ["Deep Shade", "Secret", 0.5],
  ["Underground Lord", "Ultra Secret", 0.08],
  ["Cavern Prime", "Mystical", 0.02],
];
packEmojis["Cavern Pack"] = "🕳️";

packs["Circus Pack"] = [
  ["Clown", "Common", 45],
  ["Juggler", "Uncommon", 30],
  ["Trapeze Artist", "Rare", 15],
  ["Ringmaster", "Legendary", 8],
  ["Circus Titan", "Mythic", 1],
  ["Phantom Jester", "Secret", 0.5],
  ["Circus Lord", "Ultra Secret", 0.08],
  ["Grand Spectacle", "Mystical", 0.02],
];
packEmojis["Circus Pack"] = "🎪";

packs["Carnival Pack"] = [
  ["Cotton Candy", "Common", 45],
  ["Ferris Wheel", "Uncommon", 30],
  ["Bumper Car", "Rare", 15],
  ["Carousel King", "Legendary", 8],
  ["Carnival Titan", "Mythic", 1],
  ["Funhouse Shade", "Secret", 0.5],
  ["Carnival Lord", "Ultra Secret", 0.08],
  ["Carnival Cosmos", "Mystical", 0.02],
];
packEmojis["Carnival Pack"] = "🎠";

packs["Castle Pack"] = [
  ["Castle Guard", "Common", 45],
  ["Page Boy", "Uncommon", 30],
  ["Squire", "Rare", 15],
  ["Baron", "Legendary", 8],
  ["Castle Warden", "Mythic", 1],
  ["Throne Shade", "Secret", 0.5],
  ["Fortress Lord", "Ultra Secret", 0.08],
  ["Bastion Prime", "Mystical", 0.02],
];
packEmojis["Castle Pack"] = "🏰";

packs["Library Pack"] = [
  ["Bookmark", "Common", 45],
  ["Quill Pen", "Uncommon", 30],
  ["Rare Book", "Rare", 15],
  ["Librarian", "Legendary", 8],
  ["Book Titan", "Mythic", 1],
  ["Page Shade", "Secret", 0.5],
  ["Archive Lord", "Ultra Secret", 0.08],
  ["Library Cosmos", "Mystical", 0.02],
];
packEmojis["Library Pack"] = "📚";

packs["Magic Show Pack"] = [
  ["Trick Card", "Common", 45],
  ["Magic Dove", "Uncommon", 30],
  ["Vanishing Box", "Rare", 15],
  ["Grand Illusionist", "Legendary", 8],
  ["Phantom Magician", "Mythic", 1],
  ["Mirror Shade", "Secret", 0.5],
  ["Stage Lord", "Ultra Secret", 0.08],
  ["Magic Cosmos", "Mystical", 0.02],
];
packEmojis["Magic Show Pack"] = "🎩";

packs["Museum Pack"] = [
  ["Artifact", "Common", 45],
  ["Fossil Display", "Uncommon", 30],
  ["Ancient Vase", "Rare", 15],
  ["Curator", "Legendary", 8],
  ["Museum Titan", "Mythic", 1],
  ["Relic Shade", "Secret", 0.5],
  ["Exhibit Lord", "Ultra Secret", 0.08],
  ["Museum Prime", "Mystical", 0.02],
];
packEmojis["Museum Pack"] = "🏛️";

packs["Haunted Pack"] = [
  ["Cobweb", "Common", 45],
  ["Haunted Mirror", "Uncommon", 30],
  ["Poltergeist", "Rare", 15],
  ["Banshee", "Legendary", 8],
  ["Headless Horseman", "Mythic", 1],
  ["Wraith Shade", "Secret", 0.5],
  ["Soul Lord", "Ultra Secret", 0.08],
  ["Haunted Singularity", "Mystical", 0.02],
];
packEmojis["Haunted Pack"] = "🏚️";

packs["Camping Pack"] = [
  ["Campfire", "Common", 45],
  ["Tent", "Uncommon", 30],
  ["Trail Map", "Rare", 15],
  ["Park Ranger", "Legendary", 8],
  ["Wild Guide", "Mythic", 1],
  ["Forest Phantom", "Secret", 0.5],
  ["Ranger Lord", "Ultra Secret", 0.08],
  ["Camping Prime", "Mystical", 0.02],
];
packEmojis["Camping Pack"] = "⛺";

packs["Beach Pack"] = [
  ["Sand Castle", "Common", 45],
  ["Beach Ball", "Uncommon", 30],
  ["Surfboard", "Rare", 15],
  ["Lifeguard King", "Legendary", 8],
  ["Beach Titan", "Mythic", 1],
  ["Coral Ghost", "Secret", 0.5],
  ["Tide Sovereign", "Ultra Secret", 0.08],
  ["Beach Cosmos", "Mystical", 0.02],
];
packEmojis["Beach Pack"] = "🏖️";

packs["Balloon Pack"] = [
  ["Water Balloon", "Common", 45],
  ["Helium Balloon", "Uncommon", 30],
  ["Hot Air Balloon", "Rare", 15],
  ["Balloon Master", "Legendary", 8],
  ["Float Titan", "Mythic", 1],
  ["Pop Shade", "Secret", 0.5],
  ["Sky Titan", "Ultra Secret", 0.08],
  ["Balloon Genesis", "Mystical", 0.02],
];
packEmojis["Balloon Pack"] = "🎈";

packs["Party Pack"] = [
  ["Party Hat", "Common", 45],
  ["Streamer", "Uncommon", 30],
  ["Pinata", "Rare", 15],
  ["DJ King", "Legendary", 8],
  ["Party Titan", "Mythic", 1],
  ["Confetti Shade", "Secret", 0.5],
  ["Celebration Lord", "Ultra Secret", 0.08],
  ["Party Cosmos", "Mystical", 0.02],
];
packEmojis["Party Pack"] = "🎉";

packs["Arcade Game Pack"] = [
  ["Token", "Common", 45],
  ["Claw Machine", "Uncommon", 30],
  ["Pinball", "Rare", 15],
  ["High Score King", "Legendary", 8],
  ["Arcade Titan", "Mythic", 1],
  ["Pixel Shade", "Secret", 0.5],
  ["Game Over Lord", "Ultra Secret", 0.08],
  ["Arcade Cosmos", "Mystical", 0.02],
];
packEmojis["Arcade Game Pack"] = "🕹️";

packs["Cinema Pack"] = [
  ["Movie Ticket", "Common", 45],
  ["Popcorn Bucket", "Uncommon", 30],
  ["Film Reel", "Rare", 15],
  ["Director", "Legendary", 8],
  ["Cinema Titan", "Mythic", 1],
  ["Screen Shade", "Secret", 0.5],
  ["Studio Lord", "Ultra Secret", 0.08],
  ["Cinema Prime", "Mystical", 0.02],
];
packEmojis["Cinema Pack"] = "🎬";

packs["Art Pack"] = [
  ["Pencil Sketch", "Common", 45],
  ["Watercolor", "Uncommon", 30],
  ["Oil Painting", "Rare", 15],
  ["Masterpiece King", "Legendary", 8],
  ["Art Titan", "Mythic", 1],
  ["Canvas Shade", "Secret", 0.5],
  ["Gallery Lord", "Ultra Secret", 0.08],
  ["Art Cosmos", "Mystical", 0.02],
];
packEmojis["Art Pack"] = "🎨";

packs["Photography Pack"] = [
  ["Snapshot", "Common", 45],
  ["Polaroid", "Uncommon", 30],
  ["DSLR", "Rare", 15],
  ["Golden Frame", "Legendary", 8],
  ["Photo Titan", "Mythic", 1],
  ["Flash Shade", "Secret", 0.5],
  ["Lens Lord", "Ultra Secret", 0.08],
  ["Photography Prime", "Mystical", 0.02],
];
packEmojis["Photography Pack"] = "📸";

packs["Egyptian Pack"] = [
  ["Scarab", "Common", 45],
  ["Ankh", "Uncommon", 30],
  ["Mummy", "Rare", 15],
  ["Anubis", "Legendary", 8],
  ["Ra", "Mythic", 1],
  ["Isis Shade", "Secret", 0.5],
  ["Osiris Lord", "Ultra Secret", 0.08],
  ["Egyptian Prime", "Mystical", 0.02],
];
packEmojis["Egyptian Pack"] = "🏺";

packs["Greek Pack"] = [
  ["Olive Branch", "Common", 45],
  ["Hydra", "Uncommon", 30],
  ["Minotaur", "Rare", 15],
  ["Hera", "Legendary", 8],
  ["Helios", "Mythic", 1],
  ["Hades Shade", "Secret", 0.5],
  ["Olympian Lord", "Ultra Secret", 0.08],
  ["Greek Prime", "Mystical", 0.02],
];
packEmojis["Greek Pack"] = "🫒";

packs["Norse Pack"] = [
  ["Rune Stone", "Common", 45],
  ["Mjolnir", "Uncommon", 30],
  ["Fenris Wolf", "Rare", 15],
  ["Thor", "Legendary", 8],
  ["Loki", "Mythic", 1],
  ["Freya Shade", "Secret", 0.5],
  ["Asgard Lord", "Ultra Secret", 0.08],
  ["Norse Prime", "Mystical", 0.02],
];
packEmojis["Norse Pack"] = "🪓";

packs["Roman Pack"] = [
  ["Centurion", "Common", 45],
  ["Gladius", "Uncommon", 30],
  ["War Chariot", "Rare", 15],
  ["Caesar", "Legendary", 8],
  ["Colosseum King", "Mythic", 1],
  ["Legion Shade", "Secret", 0.5],
  ["Empire Lord", "Ultra Secret", 0.08],
  ["Roman Prime", "Mystical", 0.02],
];
packEmojis["Roman Pack"] = "🏟️";

packs["Aztec Pack"] = [
  ["Obsidian Blade", "Common", 45],
  ["Jaguar Warrior", "Uncommon", 30],
  ["Feathered Serpent", "Rare", 15],
  ["Aztec King", "Legendary", 8],
  ["Sun Stone", "Mythic", 1],
  ["Eclipse Spirit", "Secret", 0.5],
  ["Temple Lord", "Ultra Secret", 0.08],
  ["Aztec Prime", "Mystical", 0.02],
];
packEmojis["Aztec Pack"] = "🌞";

packs["Celtic Pack"] = [
  ["Shamrock", "Common", 45],
  ["Druid", "Uncommon", 30],
  ["Celtic Knot", "Rare", 15],
  ["Green Man", "Legendary", 8],
  ["Cernunnos", "Mythic", 1],
  ["Banshee Shade", "Secret", 0.5],
  ["Avalon Lord", "Ultra Secret", 0.08],
  ["Celtic Prime", "Mystical", 0.02],
];
packEmojis["Celtic Pack"] = "☘️";

packs["Atlantis Pack"] = [
  ["Coral Crown", "Common", 45],
  ["Atlantean", "Uncommon", 30],
  ["Trident", "Rare", 15],
  ["Poseidon Guard", "Legendary", 8],
  ["Atlantis King", "Mythic", 1],
  ["Depth Shade", "Secret", 0.5],
  ["Sunken Lord", "Ultra Secret", 0.08],
  ["Atlantis Prime", "Mystical", 0.02],
];
packEmojis["Atlantis Pack"] = "🔱";

packs["Olympus Pack"] = [
  ["Ambrosia", "Common", 45],
  ["Demigod", "Uncommon", 30],
  ["Titan Guard", "Rare", 15],
  ["Hercules", "Legendary", 8],
  ["Athena", "Mythic", 1],
  ["Artemis Shade", "Secret", 0.5],
  ["Zeus King", "Ultra Secret", 0.08],
  ["Olympus Prime", "Mystical", 0.02],
];
packEmojis["Olympus Pack"] = "⛰️";

packs["Underworld Pack"] = [
  ["Lost Soul", "Common", 45],
  ["Skeleton", "Uncommon", 30],
  ["Death Knight", "Rare", 15],
  ["Grim Reaper", "Legendary", 8],
  ["Hel Queen", "Mythic", 1],
  ["Styx Shade", "Secret", 0.5],
  ["Netherworld Lord", "Ultra Secret", 0.08],
  ["Underworld Prime", "Mystical", 0.02],
];
packEmojis["Underworld Pack"] = "💀";

packs["Zodiac Pack"] = [
  ["Aries Ram", "Common", 45],
  ["Taurus Bull", "Uncommon", 30],
  ["Gemini Twin", "Rare", 15],
  ["Leo Star", "Legendary", 8],
  ["Zodiac Titan", "Mythic", 1],
  ["Zodiac Shade", "Secret", 0.5],
  ["Astral Lord", "Ultra Secret", 0.08],
  ["Zodiac Prime", "Mystical", 0.02],
];
packEmojis["Zodiac Pack"] = "♈";

packs["Folklore Pack"] = [
  ["Will O Wisp", "Common", 45],
  ["Leprechaun", "Uncommon", 30],
  ["Bigfoot", "Rare", 15],
  ["Yeti", "Legendary", 8],
  ["Folklore Titan", "Mythic", 1],
  ["Legend Shade", "Secret", 0.5],
  ["Myth Lord", "Ultra Secret", 0.08],
  ["Folklore Prime", "Mystical", 0.02],
];
packEmojis["Folklore Pack"] = "📜";

packs["Wuxia Pack"] = [
  ["Disciple", "Common", 45],
  ["Swordsman", "Uncommon", 30],
  ["Jade Warrior", "Rare", 15],
  ["Martial King", "Legendary", 8],
  ["Qi Master", "Mythic", 1],
  ["Phantom Warrior", "Secret", 0.5],
  ["Heaven Blade", "Ultra Secret", 0.08],
  ["Wuxia Prime", "Mystical", 0.02],
];
packEmojis["Wuxia Pack"] = "🏯";

packs["Gladiator Pack"] = [
  ["Net Fighter", "Common", 45],
  ["Spear Fighter", "Uncommon", 30],
  ["Retiarius", "Rare", 15],
  ["Champion Gladiator", "Legendary", 8],
  ["Arena King", "Mythic", 1],
  ["Blood Shade", "Secret", 0.5],
  ["Gladiator Lord", "Ultra Secret", 0.08],
  ["Gladiator Prime", "Mystical", 0.02],
];
packEmojis["Gladiator Pack"] = "⚔️";

packs["Spartan Pack"] = [
  ["Hoplite", "Common", 45],
  ["Phalanx", "Uncommon", 30],
  ["Spartan Warrior", "Rare", 15],
  ["Leonidas", "Legendary", 8],
  ["Spartan King", "Mythic", 1],
  ["Battle Shade", "Secret", 0.5],
  ["Thermopylae Lord", "Ultra Secret", 0.08],
  ["Spartan Prime", "Mystical", 0.02],
];
packEmojis["Spartan Pack"] = "🪖";

packs["Mythology Pack"] = [
  ["Griffin", "Common", 45],
  ["Chimera", "Uncommon", 30],
  ["Manticore", "Rare", 15],
  ["Cyclops", "Legendary", 8],
  ["Medusa", "Mythic", 1],
  ["Harpy Shade", "Secret", 0.5],
  ["Mythology Lord", "Ultra Secret", 0.08],
  ["Mythology Prime", "Mystical", 0.02],
];
packEmojis["Mythology Pack"] = "🐲";

packs["Alchemy Pack"] = [
  ["Lead Nugget", "Common", 45],
  ["Mercury Drop", "Uncommon", 30],
  ["Philosopher Shard", "Rare", 15],
  ["Gold Transmute", "Legendary", 8],
  ["Alchemist King", "Mythic", 1],
  ["Elixir Shade", "Secret", 0.5],
  ["Transmutation Lord", "Ultra Secret", 0.08],
  ["Alchemy Prime", "Mystical", 0.02],
];
packEmojis["Alchemy Pack"] = "⚗️";

packs["Dream Pack"] = [
  ["Sleep Cloud", "Common", 45],
  ["Dream Bubble", "Uncommon", 30],
  ["Lucid Fragment", "Rare", 15],
  ["Dream Catcher", "Legendary", 8],
  ["Sandman", "Mythic", 1],
  ["Reverie Shade", "Secret", 0.5],
  ["Dream Lord", "Ultra Secret", 0.08],
  ["Dream Genesis", "Mystical", 0.02],
];
packEmojis["Dream Pack"] = "💭";

packs["Nightmare Pack"] = [
  ["Bad Dream", "Common", 45],
  ["Night Terror", "Uncommon", 30],
  ["Sleep Paralysis", "Rare", 15],
  ["Boogeyman", "Legendary", 8],
  ["Nightmare King", "Mythic", 1],
  ["Dread Shade", "Secret", 0.5],
  ["Fear Lord", "Ultra Secret", 0.08],
  ["Nightmare Genesis", "Mystical", 0.02],
];
packEmojis["Nightmare Pack"] = "😈";

packs["Clock Pack"] = [
  ["Minute Hand", "Common", 45],
  ["Hour Glass", "Uncommon", 30],
  ["Cuckoo Clock", "Rare", 15],
  ["Grandfather Clock", "Legendary", 8],
  ["Time Titan", "Mythic", 1],
  ["Chrono Shade", "Secret", 0.5],
  ["Temporal Lord", "Ultra Secret", 0.08],
  ["Clock Cosmos", "Mystical", 0.02],
];
packEmojis["Clock Pack"] = "⏰";

packs["Origami Pack"] = [
  ["Paper Crane", "Common", 45],
  ["Paper Boat", "Uncommon", 30],
  ["Paper Dragon", "Rare", 15],
  ["Origami Master", "Legendary", 8],
  ["Fold Titan", "Mythic", 1],
  ["Crease Shade", "Secret", 0.5],
  ["Paper Lord", "Ultra Secret", 0.08],
  ["Origami Prime", "Mystical", 0.02],
];
packEmojis["Origami Pack"] = "🦢";

packs["Manga Pack"] = [
  ["Panel", "Common", 45],
  ["Speech Bubble", "Uncommon", 30],
  ["Side Character", "Rare", 15],
  ["Rival", "Legendary", 8],
  ["Manga Hero", "Mythic", 1],
  ["Manga Shade", "Secret", 0.5],
  ["Manga Lord", "Ultra Secret", 0.08],
  ["Manga Prime", "Mystical", 0.02],
];
packEmojis["Manga Pack"] = "📕";

packs["Space Station Pack"] = [
  ["Airlock", "Common", 45],
  ["Solar Panel", "Uncommon", 30],
  ["Comm Array", "Rare", 15],
  ["Station Commander", "Legendary", 8],
  ["Zero Gravity Titan", "Mythic", 1],
  ["Vacuum Shade", "Secret", 0.5],
  ["Station Lord", "Ultra Secret", 0.08],
  ["Station Prime", "Mystical", 0.02],
];
packEmojis["Space Station Pack"] = "🛸";

packs["Sailing Pack"] = [
  ["Anchor", "Common", 45],
  ["Sail", "Uncommon", 30],
  ["Compass", "Rare", 15],
  ["Fleet Captain", "Legendary", 8],
  ["Sail Titan", "Mythic", 1],
  ["Sea Fog", "Secret", 0.5],
  ["Naval Lord", "Ultra Secret", 0.08],
  ["Sailing Prime", "Mystical", 0.02],
];
packEmojis["Sailing Pack"] = "⛵";

packs["Pottery Pack"] = [
  ["Clay Pot", "Common", 45],
  ["Vase", "Uncommon", 30],
  ["Ceramic Tile", "Rare", 15],
  ["Porcelain King", "Legendary", 8],
  ["Kiln Titan", "Mythic", 1],
  ["Glaze Ghost", "Secret", 0.5],
  ["Potter Lord", "Ultra Secret", 0.08],
  ["Pottery Prime", "Mystical", 0.02],
];
packEmojis["Pottery Pack"] = "🫖";

packs["Robotics Pack"] = [
  ["Servo Motor", "Common", 45],
  ["Sensor Array", "Uncommon", 30],
  ["Actuator", "Rare", 15],
  ["Mecha Warrior", "Legendary", 8],
  ["Robotics Titan", "Mythic", 1],
  ["Static Ghost", "Secret", 0.5],
  ["Automation Lord", "Ultra Secret", 0.08],
  ["Robotics Prime", "Mystical", 0.02],
];
packEmojis["Robotics Pack"] = "🤖";

packs["Forest Pack"] = [
  ["Acorn", "Common", 45],
  ["Deer", "Uncommon", 30],
  ["Fox", "Rare", 15],
  ["Owl Guardian", "Legendary", 8],
  ["Forest Spirit", "Mythic", 1],
  ["Ancient Oak", "Secret", 0.5],
  ["Woodland Phantom", "Ultra Secret", 0.08],
  ["Sylvan Core", "Mystical", 0.02],
];
packEmojis["Forest Pack"] = "🌲";

packs["Train Pack"] = [
  ["Caboose", "Common", 45],
  ["Freight Car", "Uncommon", 30],
  ["Steam Engine", "Rare", 15],
  ["Express King", "Legendary", 8],
  ["Locomotive Titan", "Mythic", 1],
  ["Rail Shade", "Secret", 0.5],
  ["Conductor Lord", "Ultra Secret", 0.08],
  ["Train Cosmos", "Mystical", 0.02],
];
packEmojis["Train Pack"] = "🚂";

packs["Garden Gnome Pack"] = [
  ["Tiny Gnome", "Common", 45],
  ["Fishing Gnome", "Uncommon", 30],
  ["Warrior Gnome", "Rare", 15],
  ["Gnome King", "Legendary", 8],
  ["Elder Gnome", "Mythic", 1],
  ["Shadow Gnome", "Secret", 0.5],
  ["Gnome Lord", "Ultra Secret", 0.08],
  ["Gnome Prime", "Mystical", 0.02],
];
packEmojis["Garden Gnome Pack"] = "🧙‍♂️";

packs["Deep Ocean Pack"] = [
  ["Angler Fish", "Common", 45],
  ["Vampire Squid", "Uncommon", 30],
  ["Gulper Eel", "Rare", 15],
  ["Abyssal King", "Legendary", 8],
  ["Trench Titan", "Mythic", 1],
  ["Pressure Shade", "Secret", 0.5],
  ["Deep One Lord", "Ultra Secret", 0.08],
  ["Marianas Prime", "Mystical", 0.02],
];
packEmojis["Deep Ocean Pack"] = "🦑";

packs["Demon Pack"] = [
  ["Imp", "Common", 45],
  ["Fiend", "Uncommon", 30],
  ["Succubus", "Rare", 15],
  ["Demon Lord", "Legendary", 8],
  ["Archdemon", "Mythic", 1],
  ["Hellspawn Shade", "Secret", 0.5],
  ["Infernal King", "Ultra Secret", 0.08],
  ["Demon Prime", "Mystical", 0.02],
];
packEmojis["Demon Pack"] = "👿";

packs["Angel Pack"] = [
  ["Cherub", "Common", 45],
  ["Guardian Angel", "Uncommon", 30],
  ["Seraph", "Rare", 15],
  ["Archangel", "Legendary", 8],
  ["Divine Titan", "Mythic", 1],
  ["Halo Shade", "Secret", 0.5],
  ["Celestial Lord", "Ultra Secret", 0.08],
  ["Angel Prime", "Mystical", 0.02],
];
packEmojis["Angel Pack"] = "😇";

packs["Titan Pack"] = [
  ["Young Titan", "Common", 45],
  ["Stone Titan", "Uncommon", 30],
  ["Frost Colossus", "Rare", 15],
  ["War Titan", "Legendary", 8],
  ["Elder Titan", "Mythic", 1],
  ["Void Titan", "Secret", 0.5],
  ["Titan Sovereign", "Ultra Secret", 0.08],
  ["Titan Genesis", "Mystical", 0.02],
];
packEmojis["Titan Pack"] = "🗻";

packs["Ethereal Pack"] = [
  ["Mist", "Common", 45],
  ["Wisp", "Uncommon", 30],
  ["Phantom", "Rare", 15],
  ["Ethereal Knight", "Legendary", 8],
  ["Ethereal Titan", "Mythic", 1],
  ["Ethereal Shade", "Secret", 0.5],
  ["Ethereal Lord", "Ultra Secret", 0.08],
  ["Ethereal Prime", "Mystical", 0.02],
];
packEmojis["Ethereal Pack"] = "👻";

packs["Pirate Cove Pack"] = [
  ["Treasure Map", "Common", 45],
  ["Rum Barrel", "Uncommon", 30],
  ["Pirate Flag", "Rare", 15],
  ["Pirate Queen", "Legendary", 8],
  ["Sea Serpent", "Mythic", 1],
  ["Corsair Shade", "Secret", 0.5],
  ["Buccaneer Lord", "Ultra Secret", 0.08],
  ["Pirate Cosmos", "Mystical", 0.02],
];
packEmojis["Pirate Cove Pack"] = "🏴‍☠️";

packs["Wasteland Pack"] = [
  ["Scrap Metal", "Common", 45],
  ["Gas Mask", "Uncommon", 30],
  ["Raider", "Rare", 15],
  ["Wasteland King", "Legendary", 8],
  ["Mutant Titan", "Mythic", 1],
  ["Radiation Shade", "Secret", 0.5],
  ["Wasteland Lord", "Ultra Secret", 0.08],
  ["Wasteland Prime", "Mystical", 0.02],
];
packEmojis["Wasteland Pack"] = "☢️";

packs["Carnival Food Pack"] = [
  ["Funnel Cake", "Common", 45],
  ["Corn Dog", "Uncommon", 30],
  ["Candy Apple", "Rare", 15],
  ["Deep Fried King", "Legendary", 8],
  ["Carnival Chef", "Mythic", 1],
  ["Sugar Shade", "Secret", 0.5],
  ["Fairground Lord", "Ultra Secret", 0.08],
  ["Carnival Food Prime", "Mystical", 0.02],
];
packEmojis["Carnival Food Pack"] = "🍭";

packs["Plague Pack"] = [
  ["Rat", "Common", 45],
  ["Crow", "Uncommon", 30],
  ["Plague Doctor", "Rare", 15],
  ["Pestilence King", "Legendary", 8],
  ["Plague Titan", "Mythic", 1],
  ["Contagion Shade", "Secret", 0.5],
  ["Pandemic Lord", "Ultra Secret", 0.08],
  ["Plague Prime", "Mystical", 0.02],
];
packEmojis["Plague Pack"] = "🦠";

packs["Stealth Pack"] = [
  ["Smoke Bomb", "Common", 45],
  ["Camo Suit", "Uncommon", 30],
  ["Night Vision", "Rare", 15],
  ["Stealth King", "Legendary", 8],
  ["Invisible Titan", "Mythic", 1],
  ["Cloak Shade", "Secret", 0.5],
  ["Stealth Lord", "Ultra Secret", 0.08],
  ["Stealth Prime", "Mystical", 0.02],
];
packEmojis["Stealth Pack"] = "🫥";

packs["Dimension Pack"] = [
  ["Portal Shard", "Common", 45],
  ["Rift Walker", "Uncommon", 30],
  ["Dimension Gate", "Rare", 15],
  ["Reality King", "Legendary", 8],
  ["Multiverse Titan", "Mythic", 1],
  ["Dimension Shade", "Secret", 0.5],
  ["Dimension Lord", "Ultra Secret", 0.08],
  ["Dimension Prime", "Mystical", 0.02],
];
packEmojis["Dimension Pack"] = "🌀";

packs["Harvest Pack"] = [
  ["Wheat Sheaf", "Common", 45],
  ["Corn Stalk", "Uncommon", 30],
  ["Pumpkin Patch", "Rare", 15],
  ["Harvest Moon", "Legendary", 8],
  ["Harvest Titan", "Mythic", 1],
  ["Autumn Shade", "Secret", 0.5],
  ["Harvest Lord", "Ultra Secret", 0.08],
  ["Harvest Prime", "Mystical", 0.02],
];
packEmojis["Harvest Pack"] = "🌽";

// Draw a random item with equal chance for each rarity (~12.5% each)
const packRarities = rarityOrder.filter((r) => r !== "Exotic");

export function drawRandomItem(): { name: string; rarity: Rarity } {
  // Pick a random pack, then roll it using the same weighted chances as opening packs
  const packNames = Object.keys(packs);
  const packName = packNames[Math.floor(Math.random() * packNames.length)];
  const [name, rarity] = rollPack(packName);
  return { name, rarity };
}

// Draw for Steal & Get: 2% steal, 98% random item
export function drawStealOrItem(): { type: "steal" } | { type: "item"; name: string; rarity: Rarity } {
  if (Math.random() < 0.02) {
    return { type: "steal" };
  }
  const item = drawRandomItem();
  return { type: "item", ...item };
}

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
