export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Legendary"
  | "Mythic"
  | "Secret"
  | "Ultra Secret"
  | "Mystical"
  | "Exotic"
  | "Celestial"
  | "Divine";

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
  Celestial: { color: "#ffd700", show: false },
  Divine: { color: "#c8a2ff", show: false },
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
  Celestial: "rarity-celestial",
  Divine: "rarity-divine",
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
  Celestial: "bg-rarity-celestial",
  Divine: "bg-rarity-divine",
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
  Celestial: "glow-celestial",
  Divine: "glow-divine",
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
  "Celestial",
  "Divine",
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


// === Add Celestial rarity (0.01%) to all existing packs ===
const celestialNames: Record<string, string> = {
  "Wise School Pack": "The Enlightened One",
  "Spooky Pack": "Eternal Phantom",
  "Ocean Pack": "Abyssal Divinity",
  "Space Pack": "Universe Architect",
  "Fantasy Pack": "Eternal Mythos",
  "Cyber Pack": "Omega Protocol",
  "Jungle Pack": "Primordial Heart",
  "Winter Pack": "Eternal Frost",
  "Desert Pack": "Mirage Divinity",
  "Volcano Pack": "Core of Creation",
  "Candy Pack": "Sugar Divinity",
  "Toy Pack": "Toy Singularity",
  "Music Pack": "Eternal Symphony",
  "Pirate Pack": "Pirate Divinity",
  "Dino Pack": "Epoch Sovereign",
  "Farm Pack": "Harvest Divinity",
  "Sports Pack": "Immortal Champion",
  "Medieval Pack": "Holy Grail",
  "Aquarium Pack": "Aqua Divinity",
  "Weather Pack": "Climate Divinity",
  "Breakfast Pack": "Eternal Brunch",
  "Garden Pack": "Eden's Heart",
  "Safari Pack": "Serengeti Divinity",
  "Bird Pack": "Sky Divinity",
  "Cat Pack": "Eternal Feline",
  "Dog Pack": "Eternal Hound",
  "Reptile Pack": "Ancient Scales",
  "Horse Pack": "Pegasus Divinity",
  "Bear Pack": "Ursa Divinity",
  "Wolf Pack": "Fenrir Ascended",
  "Rabbit Pack": "Lunar Divinity",
  "Snake Pack": "Ouroboros Ascended",
  "Frog Pack": "Toad Divinity",
  "Bat Pack": "Nocturnal Divinity",
  "Whale Pack": "Leviathan Divinity",
  "Coral Reef Pack": "Reef Divinity",
  "Dragon Pack": "Dragon Divinity",
  "Unicorn Pack": "Prismatic Divinity",
  "Fairy Pack": "Fey Divinity",
  "Wizard School Pack": "Arcane Divinity",
  "Potion Pack": "Elixir Divinity",
  "Crystal Pack": "Prismatic Core",
  "Enchanted Pack": "Enchantment Eternal",
  "Golem Pack": "Golem Divinity",
  "Phoenix Pack": "Phoenix Ascended",
  "Mermaid Pack": "Siren Divinity",
  "Centaur Pack": "Centaur Divinity",
  "Troll Pack": "Troll Ascended",
  "Elemental Pack": "Elemental Divinity",
  "Grimoire Pack": "Tome of Eternity",
  "Rune Pack": "Rune Divinity",
  "Pizza Pack": "Pizza Divinity",
  "Sushi Pack": "Sushi Divinity",
  "Fruit Pack": "Fruit Divinity",
  "Cake Pack": "Cake Divinity",
  "Bakery Pack": "Bakery Divinity",
  "Cheese Pack": "Cheese Divinity",
  "Ice Cream Pack": "Frozen Divinity",
  "BBQ Pack": "BBQ Divinity",
  "Taco Pack": "Taco Divinity",
  "Cookie Pack": "Cookie Divinity",
  "Smoothie Pack": "Smoothie Divinity",
  "Pasta Pack": "Pasta Divinity",
  "Ramen Pack": "Ramen Divinity",
  "Chocolate Pack": "Chocolate Divinity",
  "Donut Pack": "Donut Divinity",
  "Robot Pack": "Robot Divinity",
  "Lab Pack": "Eureka Divinity",
  "Quantum Pack": "Quantum Divinity",
  "AI Pack": "Sentient Divinity",
  "Neon Pack": "Neon Divinity",
  "Pixel Pack": "Pixel Divinity",
  "Hologram Pack": "Hologram Divinity",
  "Steampunk Pack": "Steampunk Divinity",
  "Circuit Pack": "Circuit Divinity",
  "Satellite Pack": "Orbital Divinity",
  "Telescope Pack": "Cosmic Sight",
  "Rocket Pack": "Launch Divinity",
  "Biotech Pack": "Genesis Code",
  "Laser Pack": "Laser Divinity",
  "Gravity Pack": "Gravity Divinity",
  "Ninja Pack": "Shadow Divinity",
  "Samurai Pack": "Bushido Divinity",
  "Cowboy Pack": "Frontier Divinity",
  "Viking Pack": "Valhalla Divinity",
  "Superhero Pack": "Hero Divinity",
  "Villain Pack": "Villain Divinity",
  "Spy Pack": "Espionage Divinity",
  "Treasure Pack": "Infinite Fortune",
  "Dungeon Pack": "Dungeon Divinity",
  "Racing Pack": "Speed Divinity",
  "Skateboard Pack": "Skate Divinity",
  "Climbing Pack": "Summit Divinity",
  "Wrestling Pack": "Wrestling Divinity",
  "Archery Pack": "Arrow Divinity",
  "Martial Arts Pack": "Martial Divinity",
  "Moon Pack": "Lunar Ascended",
  "Constellation Pack": "Starborn Divinity",
  "Flame Pack": "Flame Divinity",
  "Thunder Pack": "Thunder Divinity",
  "Mountain Pack": "Mountain Divinity",
  "Swamp Pack": "Swamp Divinity",
  "Tundra Pack": "Tundra Divinity",
  "Mushroom Pack": "Mycelium Divinity",
  "Gem Pack": "Gem Divinity",
  "Earthquake Pack": "Seismic Divinity",
  "Aurora Pack": "Aurora Divinity",
  "Sunset Pack": "Sunset Divinity",
  "Bamboo Pack": "Bamboo Divinity",
  "Island Pack": "Island Divinity",
  "Cavern Pack": "Cavern Divinity",
  "Circus Pack": "Circus Divinity",
  "Carnival Pack": "Carnival Divinity",
  "Castle Pack": "Castle Divinity",
  "Library Pack": "Infinite Tome",
  "Magic Show Pack": "Illusion Divinity",
  "Museum Pack": "Relic Divinity",
  "Haunted Pack": "Haunted Divinity",
  "Camping Pack": "Wilderness Divinity",
  "Beach Pack": "Beach Divinity",
  "Balloon Pack": "Balloon Divinity",
  "Party Pack": "Party Divinity",
  "Arcade Game Pack": "Arcade Divinity",
  "Cinema Pack": "Cinema Divinity",
  "Art Pack": "Art Divinity",
  "Photography Pack": "Photo Divinity",
  "Egyptian Pack": "Pharaoh Divinity",
  "Greek Pack": "Greek Divinity",
  "Norse Pack": "Norse Divinity",
  "Roman Pack": "Roman Divinity",
  "Aztec Pack": "Aztec Divinity",
  "Celtic Pack": "Celtic Divinity",
  "Atlantis Pack": "Atlantis Divinity",
  "Olympus Pack": "Olympus Divinity",
  "Underworld Pack": "Death Divinity",
  "Zodiac Pack": "Zodiac Divinity",
  "Folklore Pack": "Folklore Divinity",
  "Wuxia Pack": "Wuxia Divinity",
  "Gladiator Pack": "Gladiator Divinity",
  "Spartan Pack": "Spartan Divinity",
  "Mythology Pack": "Mythology Divinity",
  "Alchemy Pack": "Philosopher Stone",
  "Dream Pack": "Dream Divinity",
  "Nightmare Pack": "Nightmare Divinity",
  "Clock Pack": "Temporal Divinity",
  "Origami Pack": "Origami Divinity",
  "Manga Pack": "Manga Divinity",
  "Space Station Pack": "Station Divinity",
  "Sailing Pack": "Sailing Divinity",
  "Pottery Pack": "Pottery Divinity",
  "Robotics Pack": "Mecha Divinity",
  "Forest Pack": "Forest Divinity",
  "Train Pack": "Train Divinity",
  "Garden Gnome Pack": "Gnome Divinity",
  "Deep Ocean Pack": "Abyss Divinity",
  "Demon Pack": "Demon Ascended",
  "Angel Pack": "Seraph Divinity",
  "Titan Pack": "Titan Ascended",
  "Ethereal Pack": "Ethereal Divinity",
  "Pirate Cove Pack": "Cove Divinity",
  "Wasteland Pack": "Wasteland Divinity",
  "Carnival Food Pack": "Fair Divinity",
  "Plague Pack": "Plague Divinity",
  "Stealth Pack": "Phantom Divinity",
  "Dimension Pack": "Dimension Divinity",
  "Harvest Pack": "Harvest Divinity",
};

Object.keys(packs).forEach((packName) => {
  const items = packs[packName];
  const cName = celestialNames[packName] || packName.replace(" Pack", "") + " Celestial";
  // Reduce Common chance by 0.01 to make room for Celestial
  items[0] = [items[0][0], items[0][1], +(items[0][2] - 0.01).toFixed(2)];
  items.push([cName, "Celestial" as Rarity, 0.01]);
});

// === 210 New Packs ===
packs["Penguin Pack"] = [
  ["Baby Penguin", "Common", 45.39],
  ["Rockhopper", "Uncommon", 30],
  ["Emperor Penguin", "Rare", 15],
  ["Penguin King", "Legendary", 8],
  ["Ice Emperor", "Mythic", 1],
  ["Frost Shade", "Secret", 0.5],
  ["Penguin Sovereign", "Ultra Secret", 0.08],
  ["Penguin Prime", "Mystical", 0.02],
  ["Penguin Divinity", "Celestial", 0.01],
];
packEmojis["Penguin Pack"] = "🐧";

packs["Owl Pack"] = [
  ["Owlet", "Common", 45.39],
  ["Barn Owl", "Uncommon", 30],
  ["Snowy Owl", "Rare", 15],
  ["Great Horned", "Legendary", 8],
  ["Owl Titan", "Mythic", 1],
  ["Night Watcher", "Secret", 0.5],
  ["Wisdom Lord", "Ultra Secret", 0.08],
  ["Owl Prime", "Mystical", 0.02],
  ["Owl Divinity", "Celestial", 0.01],
];
packEmojis["Owl Pack"] = "🦉";

packs["Butterfly Pack"] = [
  ["Caterpillar", "Common", 45.39],
  ["Monarch", "Uncommon", 30],
  ["Swallowtail", "Rare", 15],
  ["Blue Morpho", "Legendary", 8],
  ["Chrysalis Titan", "Mythic", 1],
  ["Wing Shade", "Secret", 0.5],
  ["Flutter Lord", "Ultra Secret", 0.08],
  ["Butterfly Prime", "Mystical", 0.02],
  ["Butterfly Divinity", "Celestial", 0.01],
];
packEmojis["Butterfly Pack"] = "🦋";

packs["Bee Pack"] = [
  ["Worker Bee", "Common", 45.39],
  ["Drone Bee", "Uncommon", 30],
  ["Honey Guard", "Rare", 15],
  ["Queen Bee", "Legendary", 8],
  ["Hive Titan", "Mythic", 1],
  ["Stinger Shade", "Secret", 0.5],
  ["Apiary Lord", "Ultra Secret", 0.08],
  ["Bee Prime", "Mystical", 0.02],
  ["Bee Divinity", "Celestial", 0.01],
];
packEmojis["Bee Pack"] = "🐝";

packs["Ant Pack"] = [
  ["Worker Ant", "Common", 45.39],
  ["Soldier Ant", "Uncommon", 30],
  ["Fire Ant", "Rare", 15],
  ["Ant Queen", "Legendary", 8],
  ["Colony Titan", "Mythic", 1],
  ["Swarm Shade", "Secret", 0.5],
  ["Anthill Lord", "Ultra Secret", 0.08],
  ["Ant Prime", "Mystical", 0.02],
  ["Ant Divinity", "Celestial", 0.01],
];
packEmojis["Ant Pack"] = "🐜";

packs["Spider Pack"] = [
  ["Garden Spider", "Common", 45.39],
  ["Tarantula", "Uncommon", 30],
  ["Black Widow", "Rare", 15],
  ["Spider Queen", "Legendary", 8],
  ["Web Titan", "Mythic", 1],
  ["Silk Shade", "Secret", 0.5],
  ["Arachnid Lord", "Ultra Secret", 0.08],
  ["Spider Prime", "Mystical", 0.02],
  ["Spider Divinity", "Celestial", 0.01],
];
packEmojis["Spider Pack"] = "🕷️";

packs["Beetle Pack"] = [
  ["Ladybug", "Common", 45.39],
  ["Stag Beetle", "Uncommon", 30],
  ["Scarab", "Rare", 15],
  ["Golden Beetle", "Legendary", 8],
  ["Beetle Titan", "Mythic", 1],
  ["Shell Shade", "Secret", 0.5],
  ["Beetle Lord", "Ultra Secret", 0.08],
  ["Beetle Prime", "Mystical", 0.02],
  ["Beetle Divinity", "Celestial", 0.01],
];
packEmojis["Beetle Pack"] = "🪲";

packs["Firefly Pack"] = [
  ["Spark Bug", "Common", 45.39],
  ["Glow Worm", "Uncommon", 30],
  ["Lightning Bug", "Rare", 15],
  ["Lantern Fly", "Legendary", 8],
  ["Firefly Titan", "Mythic", 1],
  ["Luminous Shade", "Secret", 0.5],
  ["Firefly Lord", "Ultra Secret", 0.08],
  ["Firefly Prime", "Mystical", 0.02],
  ["Firefly Divinity", "Celestial", 0.01],
];
packEmojis["Firefly Pack"] = "💫";

packs["Mantis Pack"] = [
  ["Baby Mantis", "Common", 45.39],
  ["Green Mantis", "Uncommon", 30],
  ["Orchid Mantis", "Rare", 15],
  ["Mantis King", "Legendary", 8],
  ["Mantis Titan", "Mythic", 1],
  ["Stealth Shade", "Secret", 0.5],
  ["Mantis Lord", "Ultra Secret", 0.08],
  ["Mantis Prime", "Mystical", 0.02],
  ["Mantis Divinity", "Celestial", 0.01],
];
packEmojis["Mantis Pack"] = "🦗";

packs["Panda Pack"] = [
  ["Panda Cub", "Common", 45.39],
  ["Red Panda", "Uncommon", 30],
  ["Giant Panda", "Rare", 15],
  ["Panda King", "Legendary", 8],
  ["Bamboo Titan", "Mythic", 1],
  ["Panda Shade", "Secret", 0.5],
  ["Panda Lord", "Ultra Secret", 0.08],
  ["Panda Prime", "Mystical", 0.02],
  ["Panda Divinity", "Celestial", 0.01],
];
packEmojis["Panda Pack"] = "🐼";

packs["Koala Pack"] = [
  ["Joey", "Common", 45.39],
  ["Grey Koala", "Uncommon", 30],
  ["Drop Bear", "Rare", 15],
  ["Eucalyptus King", "Legendary", 8],
  ["Koala Titan", "Mythic", 1],
  ["Koala Shade", "Secret", 0.5],
  ["Koala Lord", "Ultra Secret", 0.08],
  ["Koala Prime", "Mystical", 0.02],
  ["Koala Divinity", "Celestial", 0.01],
];
packEmojis["Koala Pack"] = "🐨";

packs["Hamster Pack"] = [
  ["Tiny Hamster", "Common", 45.39],
  ["Syrian Hamster", "Uncommon", 30],
  ["Hamster Wheel", "Rare", 15],
  ["Hamster King", "Legendary", 8],
  ["Hamster Titan", "Mythic", 1],
  ["Hamster Shade", "Secret", 0.5],
  ["Hamster Lord", "Ultra Secret", 0.08],
  ["Hamster Prime", "Mystical", 0.02],
  ["Hamster Divinity", "Celestial", 0.01],
];
packEmojis["Hamster Pack"] = "🐹";

packs["Hedgehog Pack"] = [
  ["Baby Hedgehog", "Common", 45.39],
  ["Spiny Friend", "Uncommon", 30],
  ["Desert Hedgehog", "Rare", 15],
  ["Hedgehog King", "Legendary", 8],
  ["Quill Titan", "Mythic", 1],
  ["Spike Shade", "Secret", 0.5],
  ["Hedgehog Lord", "Ultra Secret", 0.08],
  ["Hedgehog Prime", "Mystical", 0.02],
  ["Hedgehog Divinity", "Celestial", 0.01],
];
packEmojis["Hedgehog Pack"] = "🦔";

packs["Otter Pack"] = [
  ["Pup Otter", "Common", 45.39],
  ["Sea Otter", "Uncommon", 30],
  ["River Otter", "Rare", 15],
  ["Otter King", "Legendary", 8],
  ["Otter Titan", "Mythic", 1],
  ["Current Shade", "Secret", 0.5],
  ["Otter Lord", "Ultra Secret", 0.08],
  ["Otter Prime", "Mystical", 0.02],
  ["Otter Divinity", "Celestial", 0.01],
];
packEmojis["Otter Pack"] = "🦦";

packs["Seal Pack"] = [
  ["Seal Pup", "Common", 45.39],
  ["Harbor Seal", "Uncommon", 30],
  ["Leopard Seal", "Rare", 15],
  ["Elephant Seal", "Legendary", 8],
  ["Seal Titan", "Mythic", 1],
  ["Arctic Shade", "Secret", 0.5],
  ["Seal Lord", "Ultra Secret", 0.08],
  ["Seal Prime", "Mystical", 0.02],
  ["Seal Divinity", "Celestial", 0.01],
];
packEmojis["Seal Pack"] = "🦭";

packs["Parrot Pack"] = [
  ["Budgie", "Common", 45.39],
  ["Cockatiel", "Uncommon", 30],
  ["Macaw", "Rare", 15],
  ["Parrot King", "Legendary", 8],
  ["Parrot Titan", "Mythic", 1],
  ["Feather Shade", "Secret", 0.5],
  ["Parrot Lord", "Ultra Secret", 0.08],
  ["Parrot Prime", "Mystical", 0.02],
  ["Parrot Divinity", "Celestial", 0.01],
];
packEmojis["Parrot Pack"] = "🦜";

packs["Flamingo Pack"] = [
  ["Pink Chick", "Common", 45.39],
  ["Flamingo", "Uncommon", 30],
  ["Scarlet Flamingo", "Rare", 15],
  ["Flamingo King", "Legendary", 8],
  ["Flamingo Titan", "Mythic", 1],
  ["Wading Shade", "Secret", 0.5],
  ["Flamingo Lord", "Ultra Secret", 0.08],
  ["Flamingo Prime", "Mystical", 0.02],
  ["Flamingo Divinity", "Celestial", 0.01],
];
packEmojis["Flamingo Pack"] = "🦩";

packs["Peacock Pack"] = [
  ["Peachick", "Common", 45.39],
  ["Peacock", "Uncommon", 30],
  ["White Peacock", "Rare", 15],
  ["Peacock King", "Legendary", 8],
  ["Plume Titan", "Mythic", 1],
  ["Display Shade", "Secret", 0.5],
  ["Peacock Lord", "Ultra Secret", 0.08],
  ["Peacock Prime", "Mystical", 0.02],
  ["Peacock Divinity", "Celestial", 0.01],
];
packEmojis["Peacock Pack"] = "🦚";

packs["Sloth Pack"] = [
  ["Baby Sloth", "Common", 45.39],
  ["Two-Toed Sloth", "Uncommon", 30],
  ["Three-Toed Sloth", "Rare", 15],
  ["Sloth King", "Legendary", 8],
  ["Sloth Titan", "Mythic", 1],
  ["Lazy Shade", "Secret", 0.5],
  ["Sloth Lord", "Ultra Secret", 0.08],
  ["Sloth Prime", "Mystical", 0.02],
  ["Sloth Divinity", "Celestial", 0.01],
];
packEmojis["Sloth Pack"] = "🦥";

packs["Raccoon Pack"] = [
  ["Baby Raccoon", "Common", 45.39],
  ["Bandit", "Uncommon", 30],
  ["Night Raccoon", "Rare", 15],
  ["Raccoon King", "Legendary", 8],
  ["Raccoon Titan", "Mythic", 1],
  ["Mask Shade", "Secret", 0.5],
  ["Raccoon Lord", "Ultra Secret", 0.08],
  ["Raccoon Prime", "Mystical", 0.02],
  ["Raccoon Divinity", "Celestial", 0.01],
];
packEmojis["Raccoon Pack"] = "🦝";

packs["Gorilla Pack"] = [
  ["Baby Gorilla", "Common", 45.39],
  ["Mountain Gorilla", "Uncommon", 30],
  ["Silverback", "Rare", 15],
  ["Gorilla King", "Legendary", 8],
  ["Gorilla Titan", "Mythic", 1],
  ["Jungle Shade", "Secret", 0.5],
  ["Gorilla Lord", "Ultra Secret", 0.08],
  ["Gorilla Prime", "Mystical", 0.02],
  ["Gorilla Divinity", "Celestial", 0.01],
];
packEmojis["Gorilla Pack"] = "🦍";

packs["Kangaroo Pack"] = [
  ["Joey Roo", "Common", 45.39],
  ["Wallaby", "Uncommon", 30],
  ["Red Kangaroo", "Rare", 15],
  ["Kangaroo King", "Legendary", 8],
  ["Outback Titan", "Mythic", 1],
  ["Pouch Shade", "Secret", 0.5],
  ["Kangaroo Lord", "Ultra Secret", 0.08],
  ["Kangaroo Prime", "Mystical", 0.02],
  ["Kangaroo Divinity", "Celestial", 0.01],
];
packEmojis["Kangaroo Pack"] = "🦘";

packs["Camel Pack"] = [
  ["Baby Camel", "Common", 45.39],
  ["Dromedary", "Uncommon", 30],
  ["Bactrian Camel", "Rare", 15],
  ["Camel King", "Legendary", 8],
  ["Desert Titan", "Mythic", 1],
  ["Oasis Shade", "Secret", 0.5],
  ["Camel Lord", "Ultra Secret", 0.08],
  ["Camel Prime", "Mystical", 0.02],
  ["Camel Divinity", "Celestial", 0.01],
];
packEmojis["Camel Pack"] = "🐪";

packs["Octopus Pack"] = [
  ["Baby Octopus", "Common", 45.39],
  ["Blue Ring", "Uncommon", 30],
  ["Giant Pacific", "Rare", 15],
  ["Kraken Jr", "Legendary", 8],
  ["Tentacle Titan", "Mythic", 1],
  ["Ink Shade", "Secret", 0.5],
  ["Octopus Lord", "Ultra Secret", 0.08],
  ["Octopus Prime", "Mystical", 0.02],
  ["Octopus Divinity", "Celestial", 0.01],
];
packEmojis["Octopus Pack"] = "🐙";

packs["Pufferfish Pack"] = [
  ["Baby Puffer", "Common", 45.39],
  ["Porcupine Fish", "Uncommon", 30],
  ["Box Fish", "Rare", 15],
  ["Puffer King", "Legendary", 8],
  ["Toxin Titan", "Mythic", 1],
  ["Balloon Shade", "Secret", 0.5],
  ["Puffer Lord", "Ultra Secret", 0.08],
  ["Puffer Prime", "Mystical", 0.02],
  ["Puffer Divinity", "Celestial", 0.01],
];
packEmojis["Pufferfish Pack"] = "🐡";

packs["Narwhal Pack"] = [
  ["Baby Narwhal", "Common", 45.39],
  ["Arctic Narwhal", "Uncommon", 30],
  ["Tusk Fighter", "Rare", 15],
  ["Narwhal King", "Legendary", 8],
  ["Horn Titan", "Mythic", 1],
  ["Ice Shade", "Secret", 0.5],
  ["Narwhal Lord", "Ultra Secret", 0.08],
  ["Narwhal Prime", "Mystical", 0.02],
  ["Narwhal Divinity", "Celestial", 0.01],
];
packEmojis["Narwhal Pack"] = "🐳";

packs["Chameleon Pack"] = [
  ["Baby Chameleon", "Common", 45.39],
  ["Veiled Chameleon", "Uncommon", 30],
  ["Panther Chameleon", "Rare", 15],
  ["Chameleon King", "Legendary", 8],
  ["Color Titan", "Mythic", 1],
  ["Camo Shade", "Secret", 0.5],
  ["Chameleon Lord", "Ultra Secret", 0.08],
  ["Chameleon Prime", "Mystical", 0.02],
  ["Chameleon Divinity", "Celestial", 0.01],
];
packEmojis["Chameleon Pack"] = "🦎";

packs["Crow Pack"] = [
  ["Fledgling", "Common", 45.39],
  ["Jackdaw", "Uncommon", 30],
  ["Raven", "Rare", 15],
  ["Crow King", "Legendary", 8],
  ["Murder Titan", "Mythic", 1],
  ["Dark Wing Shade", "Secret", 0.5],
  ["Corvid Lord", "Ultra Secret", 0.08],
  ["Crow Prime", "Mystical", 0.02],
  ["Crow Divinity", "Celestial", 0.01],
];
packEmojis["Crow Pack"] = "🐦‍⬛";

packs["Jellyfish Pack"] = [
  ["Moon Jelly", "Common", 45.39],
  ["Lion's Mane", "Uncommon", 30],
  ["Box Jelly", "Rare", 15],
  ["Jellyfish King", "Legendary", 8],
  ["Bloom Titan", "Mythic", 1],
  ["Drift Shade", "Secret", 0.5],
  ["Jellyfish Lord", "Ultra Secret", 0.08],
  ["Jellyfish Prime", "Mystical", 0.02],
  ["Jellyfish Divinity", "Celestial", 0.01],
];
packEmojis["Jellyfish Pack"] = "🪼";

packs["Moose Pack"] = [
  ["Moose Calf", "Common", 45.39],
  ["Bull Moose", "Uncommon", 30],
  ["Giant Moose", "Rare", 15],
  ["Moose King", "Legendary", 8],
  ["Antler Titan", "Mythic", 1],
  ["Forest Shade", "Secret", 0.5],
  ["Moose Lord", "Ultra Secret", 0.08],
  ["Moose Prime", "Mystical", 0.02],
  ["Moose Divinity", "Celestial", 0.01],
];
packEmojis["Moose Pack"] = "🫎";

packs["Coffee Pack"] = [
  ["Espresso Shot", "Common", 45.39],
  ["Latte", "Uncommon", 30],
  ["Cappuccino", "Rare", 15],
  ["Barista King", "Legendary", 8],
  ["Coffee Titan", "Mythic", 1],
  ["Roast Shade", "Secret", 0.5],
  ["Brew Lord", "Ultra Secret", 0.08],
  ["Coffee Prime", "Mystical", 0.02],
  ["Coffee Divinity", "Celestial", 0.01],
];
packEmojis["Coffee Pack"] = "☕";

packs["Tea Pack"] = [
  ["Green Tea", "Common", 45.39],
  ["Oolong", "Uncommon", 30],
  ["Matcha", "Rare", 15],
  ["Tea Master", "Legendary", 8],
  ["Chai Titan", "Mythic", 1],
  ["Steep Shade", "Secret", 0.5],
  ["Tea Lord", "Ultra Secret", 0.08],
  ["Tea Prime", "Mystical", 0.02],
  ["Tea Divinity", "Celestial", 0.01],
];
packEmojis["Tea Pack"] = "🍵";

packs["Dim Sum Pack"] = [
  ["Dumpling", "Common", 45.39],
  ["Bao Bun", "Uncommon", 30],
  ["Spring Roll", "Rare", 15],
  ["Dim Sum King", "Legendary", 8],
  ["Wonton Titan", "Mythic", 1],
  ["Steam Shade", "Secret", 0.5],
  ["Dim Sum Lord", "Ultra Secret", 0.08],
  ["Dim Sum Prime", "Mystical", 0.02],
  ["Dim Sum Divinity", "Celestial", 0.01],
];
packEmojis["Dim Sum Pack"] = "🥟";

packs["Curry Pack"] = [
  ["Mild Curry", "Common", 45.39],
  ["Tikka Masala", "Uncommon", 30],
  ["Vindaloo", "Rare", 15],
  ["Curry King", "Legendary", 8],
  ["Spice Titan", "Mythic", 1],
  ["Saffron Shade", "Secret", 0.5],
  ["Curry Lord", "Ultra Secret", 0.08],
  ["Curry Prime", "Mystical", 0.02],
  ["Curry Divinity", "Celestial", 0.01],
];
packEmojis["Curry Pack"] = "🍛";

packs["Soup Pack"] = [
  ["Broth", "Common", 45.39],
  ["Tomato Soup", "Uncommon", 30],
  ["Pho", "Rare", 15],
  ["Soup King", "Legendary", 8],
  ["Bisque Titan", "Mythic", 1],
  ["Steam Ghost", "Secret", 0.5],
  ["Soup Lord", "Ultra Secret", 0.08],
  ["Soup Prime", "Mystical", 0.02],
  ["Soup Divinity", "Celestial", 0.01],
];
packEmojis["Soup Pack"] = "🥣";

packs["Sandwich Pack"] = [
  ["PB&J", "Common", 45.39],
  ["Club Sandwich", "Uncommon", 30],
  ["Reuben", "Rare", 15],
  ["Sandwich King", "Legendary", 8],
  ["Sub Titan", "Mythic", 1],
  ["Bread Shade", "Secret", 0.5],
  ["Sandwich Lord", "Ultra Secret", 0.08],
  ["Sandwich Prime", "Mystical", 0.02],
  ["Sandwich Divinity", "Celestial", 0.01],
];
packEmojis["Sandwich Pack"] = "🥪";

packs["Kebab Pack"] = [
  ["Skewer", "Common", 45.39],
  ["Shish Kebab", "Uncommon", 30],
  ["Doner", "Rare", 15],
  ["Kebab King", "Legendary", 8],
  ["Grill Titan", "Mythic", 1],
  ["Spice Shade", "Secret", 0.5],
  ["Kebab Lord", "Ultra Secret", 0.08],
  ["Kebab Prime", "Mystical", 0.02],
  ["Kebab Divinity", "Celestial", 0.01],
];
packEmojis["Kebab Pack"] = "🥙";

packs["Pie Pack"] = [
  ["Mini Pie", "Common", 45.39],
  ["Apple Pie", "Uncommon", 30],
  ["Pecan Pie", "Rare", 15],
  ["Pie King", "Legendary", 8],
  ["Crust Titan", "Mythic", 1],
  ["Filling Shade", "Secret", 0.5],
  ["Pie Lord", "Ultra Secret", 0.08],
  ["Pie Prime", "Mystical", 0.02],
  ["Pie Divinity", "Celestial", 0.01],
];
packEmojis["Pie Pack"] = "🥧";

packs["Pudding Pack"] = [
  ["Flan", "Common", 45.39],
  ["Rice Pudding", "Uncommon", 30],
  ["Creme Brulee", "Rare", 15],
  ["Pudding King", "Legendary", 8],
  ["Custard Titan", "Mythic", 1],
  ["Caramel Shade", "Secret", 0.5],
  ["Pudding Lord", "Ultra Secret", 0.08],
  ["Pudding Prime", "Mystical", 0.02],
  ["Pudding Divinity", "Celestial", 0.01],
];
packEmojis["Pudding Pack"] = "🍮";

packs["Milkshake Pack"] = [
  ["Vanilla Shake", "Common", 45.39],
  ["Chocolate Shake", "Uncommon", 30],
  ["Strawberry Shake", "Rare", 15],
  ["Shake King", "Legendary", 8],
  ["Malt Titan", "Mythic", 1],
  ["Whip Shade", "Secret", 0.5],
  ["Milkshake Lord", "Ultra Secret", 0.08],
  ["Milkshake Prime", "Mystical", 0.02],
  ["Milkshake Divinity", "Celestial", 0.01],
];
packEmojis["Milkshake Pack"] = "🥛";

packs["Popcorn Pack"] = [
  ["Kernel", "Common", 45.39],
  ["Buttered Popcorn", "Uncommon", 30],
  ["Caramel Corn", "Rare", 15],
  ["Popcorn King", "Legendary", 8],
  ["Pop Titan", "Mythic", 1],
  ["Cinema Shade", "Secret", 0.5],
  ["Popcorn Lord", "Ultra Secret", 0.08],
  ["Popcorn Prime", "Mystical", 0.02],
  ["Popcorn Divinity", "Celestial", 0.01],
];
packEmojis["Popcorn Pack"] = "🍿";

packs["Honey Pack"] = [
  ["Pollen Grain", "Common", 45.39],
  ["Honeycomb", "Uncommon", 30],
  ["Royal Jelly", "Rare", 15],
  ["Honey King", "Legendary", 8],
  ["Nectar Titan", "Mythic", 1],
  ["Amber Shade", "Secret", 0.5],
  ["Honey Lord", "Ultra Secret", 0.08],
  ["Honey Prime", "Mystical", 0.02],
  ["Honey Divinity", "Celestial", 0.01],
];
packEmojis["Honey Pack"] = "🍯";

packs["Cereal Pack"] = [
  ["Cornflake", "Common", 45.39],
  ["Granola", "Uncommon", 30],
  ["Lucky Charm", "Rare", 15],
  ["Cereal King", "Legendary", 8],
  ["Breakfast Titan", "Mythic", 1],
  ["Milk Shade", "Secret", 0.5],
  ["Cereal Lord", "Ultra Secret", 0.08],
  ["Cereal Prime", "Mystical", 0.02],
  ["Cereal Divinity", "Celestial", 0.01],
];
packEmojis["Cereal Pack"] = "🥣";

packs["Avocado Pack"] = [
  ["Seed", "Common", 45.39],
  ["Half Avocado", "Uncommon", 30],
  ["Guacamole", "Rare", 15],
  ["Avocado King", "Legendary", 8],
  ["Green Titan", "Mythic", 1],
  ["Toast Shade", "Secret", 0.5],
  ["Avocado Lord", "Ultra Secret", 0.08],
  ["Avocado Prime", "Mystical", 0.02],
  ["Avocado Divinity", "Celestial", 0.01],
];
packEmojis["Avocado Pack"] = "🥑";

packs["Coconut Pack"] = [
  ["Coconut Shard", "Common", 45.39],
  ["Young Coconut", "Uncommon", 30],
  ["Coconut Cream", "Rare", 15],
  ["Coconut King", "Legendary", 8],
  ["Palm Titan", "Mythic", 1],
  ["Tropical Shade", "Secret", 0.5],
  ["Coconut Lord", "Ultra Secret", 0.08],
  ["Coconut Prime", "Mystical", 0.02],
  ["Coconut Divinity", "Celestial", 0.01],
];
packEmojis["Coconut Pack"] = "🥥";

packs["Pepper Pack"] = [
  ["Bell Pepper", "Common", 45.39],
  ["Jalapeno", "Uncommon", 30],
  ["Habanero", "Rare", 15],
  ["Ghost Pepper", "Legendary", 8],
  ["Reaper Titan", "Mythic", 1],
  ["Capsaicin Shade", "Secret", 0.5],
  ["Pepper Lord", "Ultra Secret", 0.08],
  ["Pepper Prime", "Mystical", 0.02],
  ["Pepper Divinity", "Celestial", 0.01],
];
packEmojis["Pepper Pack"] = "🌶️";

packs["Steak Pack"] = [
  ["Beef Patty", "Common", 45.39],
  ["Sirloin", "Uncommon", 30],
  ["Ribeye", "Rare", 15],
  ["Wagyu King", "Legendary", 8],
  ["Steak Titan", "Mythic", 1],
  ["Grill Shade", "Secret", 0.5],
  ["Steak Lord", "Ultra Secret", 0.08],
  ["Steak Prime", "Mystical", 0.02],
  ["Steak Divinity", "Celestial", 0.01],
];
packEmojis["Steak Pack"] = "🥩";

packs["Waffle Pack"] = [
  ["Mini Waffle", "Common", 45.39],
  ["Belgian Waffle", "Uncommon", 30],
  ["Waffle Stack", "Rare", 15],
  ["Waffle King", "Legendary", 8],
  ["Syrup Titan", "Mythic", 1],
  ["Crispy Shade", "Secret", 0.5],
  ["Waffle Lord", "Ultra Secret", 0.08],
  ["Waffle Prime", "Mystical", 0.02],
  ["Waffle Divinity", "Celestial", 0.01],
];
packEmojis["Waffle Pack"] = "🧇";

packs["Grape Pack"] = [
  ["Green Grape", "Common", 45.39],
  ["Red Grape", "Uncommon", 30],
  ["Wine Grape", "Rare", 15],
  ["Grape King", "Legendary", 8],
  ["Vineyard Titan", "Mythic", 1],
  ["Vine Shade", "Secret", 0.5],
  ["Grape Lord", "Ultra Secret", 0.08],
  ["Grape Prime", "Mystical", 0.02],
  ["Grape Divinity", "Celestial", 0.01],
];
packEmojis["Grape Pack"] = "🍇";

packs["Lemon Pack"] = [
  ["Lemon Slice", "Common", 45.39],
  ["Lemonade", "Uncommon", 30],
  ["Lemon Tart", "Rare", 15],
  ["Lemon King", "Legendary", 8],
  ["Citrus Titan", "Mythic", 1],
  ["Zest Shade", "Secret", 0.5],
  ["Lemon Lord", "Ultra Secret", 0.08],
  ["Lemon Prime", "Mystical", 0.02],
  ["Lemon Divinity", "Celestial", 0.01],
];
packEmojis["Lemon Pack"] = "🍋";

packs["Melon Pack"] = [
  ["Melon Slice", "Common", 45.39],
  ["Honeydew", "Uncommon", 30],
  ["Cantaloupe", "Rare", 15],
  ["Watermelon King", "Legendary", 8],
  ["Melon Titan", "Mythic", 1],
  ["Rind Shade", "Secret", 0.5],
  ["Melon Lord", "Ultra Secret", 0.08],
  ["Melon Prime", "Mystical", 0.02],
  ["Melon Divinity", "Celestial", 0.01],
];
packEmojis["Melon Pack"] = "🍈";

packs["Pretzel Pack"] = [
  ["Mini Pretzel", "Common", 45.39],
  ["Soft Pretzel", "Uncommon", 30],
  ["Pretzel Twist", "Rare", 15],
  ["Pretzel King", "Legendary", 8],
  ["Salt Titan", "Mythic", 1],
  ["Knot Shade", "Secret", 0.5],
  ["Pretzel Lord", "Ultra Secret", 0.08],
  ["Pretzel Prime", "Mystical", 0.02],
  ["Pretzel Divinity", "Celestial", 0.01],
];
packEmojis["Pretzel Pack"] = "🥨";

packs["Burrito Pack"] = [
  ["Bean Burrito", "Common", 45.39],
  ["Chicken Wrap", "Uncommon", 30],
  ["Mega Burrito", "Rare", 15],
  ["Burrito King", "Legendary", 8],
  ["Tortilla Titan", "Mythic", 1],
  ["Salsa Shade", "Secret", 0.5],
  ["Burrito Lord", "Ultra Secret", 0.08],
  ["Burrito Prime", "Mystical", 0.02],
  ["Burrito Divinity", "Celestial", 0.01],
];
packEmojis["Burrito Pack"] = "🌯";

packs["Noodle Pack"] = [
  ["Cup Noodle", "Common", 45.39],
  ["Udon", "Uncommon", 30],
  ["Lo Mein", "Rare", 15],
  ["Noodle King", "Legendary", 8],
  ["Broth Titan", "Mythic", 1],
  ["Slurp Shade", "Secret", 0.5],
  ["Noodle Lord", "Ultra Secret", 0.08],
  ["Noodle Prime", "Mystical", 0.02],
  ["Noodle Divinity", "Celestial", 0.01],
];
packEmojis["Noodle Pack"] = "🍜";

packs["Pancake Pack"] = [
  ["Silver Dollar", "Common", 45.39],
  ["Stack", "Uncommon", 30],
  ["Crepe", "Rare", 15],
  ["Pancake King", "Legendary", 8],
  ["Griddle Titan", "Mythic", 1],
  ["Batter Shade", "Secret", 0.5],
  ["Pancake Lord", "Ultra Secret", 0.08],
  ["Pancake Prime", "Mystical", 0.02],
  ["Pancake Divinity", "Celestial", 0.01],
];
packEmojis["Pancake Pack"] = "🥞";

packs["Waterfall Pack"] = [
  ["Stream", "Common", 45.39],
  ["Cascade", "Uncommon", 30],
  ["Cataract", "Rare", 15],
  ["Niagara King", "Legendary", 8],
  ["Falls Titan", "Mythic", 1],
  ["Mist Shade", "Secret", 0.5],
  ["Waterfall Lord", "Ultra Secret", 0.08],
  ["Waterfall Prime", "Mystical", 0.02],
  ["Waterfall Divinity", "Celestial", 0.01],
];
packEmojis["Waterfall Pack"] = "💧";

packs["River Pack"] = [
  ["Creek", "Common", 45.39],
  ["Brook", "Uncommon", 30],
  ["Rapids", "Rare", 15],
  ["River King", "Legendary", 8],
  ["Delta Titan", "Mythic", 1],
  ["Current Shade", "Secret", 0.5],
  ["River Lord", "Ultra Secret", 0.08],
  ["River Prime", "Mystical", 0.02],
  ["River Divinity", "Celestial", 0.01],
];
packEmojis["River Pack"] = "🏞️";

packs["Lake Pack"] = [
  ["Pond", "Common", 45.39],
  ["Lagoon", "Uncommon", 30],
  ["Great Lake", "Rare", 15],
  ["Lake King", "Legendary", 8],
  ["Depths Titan", "Mythic", 1],
  ["Still Shade", "Secret", 0.5],
  ["Lake Lord", "Ultra Secret", 0.08],
  ["Lake Prime", "Mystical", 0.02],
  ["Lake Divinity", "Celestial", 0.01],
];
packEmojis["Lake Pack"] = "🏞️";

packs["Glacier Pack"] = [
  ["Ice Shard", "Common", 45.39],
  ["Crevasse", "Uncommon", 30],
  ["Iceberg", "Rare", 15],
  ["Glacier King", "Legendary", 8],
  ["Permafrost Titan", "Mythic", 1],
  ["Glacial Shade", "Secret", 0.5],
  ["Glacier Lord", "Ultra Secret", 0.08],
  ["Glacier Prime", "Mystical", 0.02],
  ["Glacier Divinity", "Celestial", 0.01],
];
packEmojis["Glacier Pack"] = "🧊";

packs["Prairie Pack"] = [
  ["Grass Tuft", "Common", 45.39],
  ["Prairie Dog", "Uncommon", 30],
  ["Bison", "Rare", 15],
  ["Prairie King", "Legendary", 8],
  ["Steppe Titan", "Mythic", 1],
  ["Wind Shade", "Secret", 0.5],
  ["Prairie Lord", "Ultra Secret", 0.08],
  ["Prairie Prime", "Mystical", 0.02],
  ["Prairie Divinity", "Celestial", 0.01],
];
packEmojis["Prairie Pack"] = "🌾";

packs["Canyon Pack"] = [
  ["Rock Layer", "Common", 45.39],
  ["Sandstone", "Uncommon", 30],
  ["Arch", "Rare", 15],
  ["Canyon King", "Legendary", 8],
  ["Gorge Titan", "Mythic", 1],
  ["Echo Shade", "Secret", 0.5],
  ["Canyon Lord", "Ultra Secret", 0.08],
  ["Canyon Prime", "Mystical", 0.02],
  ["Canyon Divinity", "Celestial", 0.01],
];
packEmojis["Canyon Pack"] = "🏜️";

packs["Rainforest Pack"] = [
  ["Fern", "Common", 45.39],
  ["Toucan", "Uncommon", 30],
  ["Jaguar", "Rare", 15],
  ["Canopy King", "Legendary", 8],
  ["Rainforest Titan", "Mythic", 1],
  ["Monsoon Shade", "Secret", 0.5],
  ["Rainforest Lord", "Ultra Secret", 0.08],
  ["Rainforest Prime", "Mystical", 0.02],
  ["Rainforest Divinity", "Celestial", 0.01],
];
packEmojis["Rainforest Pack"] = "🌧️";

packs["Oasis Pack"] = [
  ["Palm Frond", "Common", 45.39],
  ["Spring Water", "Uncommon", 30],
  ["Mirage", "Rare", 15],
  ["Oasis King", "Legendary", 8],
  ["Oasis Titan", "Mythic", 1],
  ["Desert Rose Shade", "Secret", 0.5],
  ["Oasis Lord", "Ultra Secret", 0.08],
  ["Oasis Prime", "Mystical", 0.02],
  ["Oasis Divinity", "Celestial", 0.01],
];
packEmojis["Oasis Pack"] = "🏝️";

packs["Coral Pack"] = [
  ["Polyp", "Common", 45.39],
  ["Fan Coral", "Uncommon", 30],
  ["Brain Coral", "Rare", 15],
  ["Coral King", "Legendary", 8],
  ["Barrier Titan", "Mythic", 1],
  ["Bleach Shade", "Secret", 0.5],
  ["Coral Lord", "Ultra Secret", 0.08],
  ["Coral Prime", "Mystical", 0.02],
  ["Coral Divinity", "Celestial", 0.01],
];
packEmojis["Coral Pack"] = "🪸";

packs["Mangrove Pack"] = [
  ["Root", "Common", 45.39],
  ["Mangrove Crab", "Uncommon", 30],
  ["Mudskipper", "Rare", 15],
  ["Mangrove King", "Legendary", 8],
  ["Estuary Titan", "Mythic", 1],
  ["Brackish Shade", "Secret", 0.5],
  ["Mangrove Lord", "Ultra Secret", 0.08],
  ["Mangrove Prime", "Mystical", 0.02],
  ["Mangrove Divinity", "Celestial", 0.01],
];
packEmojis["Mangrove Pack"] = "🌿";

packs["Tide Pool Pack"] = [
  ["Sea Snail", "Common", 45.39],
  ["Hermit Crab", "Uncommon", 30],
  ["Sea Urchin", "Rare", 15],
  ["Tide King", "Legendary", 8],
  ["Pool Titan", "Mythic", 1],
  ["Low Tide Shade", "Secret", 0.5],
  ["Tidal Lord", "Ultra Secret", 0.08],
  ["Tide Prime", "Mystical", 0.02],
  ["Tide Pool Divinity", "Celestial", 0.01],
];
packEmojis["Tide Pool Pack"] = "🐚";

packs["Fjord Pack"] = [
  ["Cliff Face", "Common", 45.39],
  ["Viking Ship", "Uncommon", 30],
  ["Northern Light", "Rare", 15],
  ["Fjord King", "Legendary", 8],
  ["Nordic Titan", "Mythic", 1],
  ["Fjord Shade", "Secret", 0.5],
  ["Fjord Lord", "Ultra Secret", 0.08],
  ["Fjord Prime", "Mystical", 0.02],
  ["Fjord Divinity", "Celestial", 0.01],
];
packEmojis["Fjord Pack"] = "⛰️";

packs["Marsh Pack"] = [
  ["Cattail", "Common", 45.39],
  ["Heron", "Uncommon", 30],
  ["Gator", "Rare", 15],
  ["Marsh King", "Legendary", 8],
  ["Wetland Titan", "Mythic", 1],
  ["Fog Shade", "Secret", 0.5],
  ["Marsh Lord", "Ultra Secret", 0.08],
  ["Marsh Prime", "Mystical", 0.02],
  ["Marsh Divinity", "Celestial", 0.01],
];
packEmojis["Marsh Pack"] = "🌿";

packs["Valley Pack"] = [
  ["Meadow", "Common", 45.39],
  ["Wildflower", "Uncommon", 30],
  ["Valley Elk", "Rare", 15],
  ["Valley King", "Legendary", 8],
  ["Vale Titan", "Mythic", 1],
  ["Mist Valley Shade", "Secret", 0.5],
  ["Valley Lord", "Ultra Secret", 0.08],
  ["Valley Prime", "Mystical", 0.02],
  ["Valley Divinity", "Celestial", 0.01],
];
packEmojis["Valley Pack"] = "🌄";

packs["Dune Pack"] = [
  ["Sand Grain", "Common", 45.39],
  ["Sand Dune", "Uncommon", 30],
  ["Desert Fox", "Rare", 15],
  ["Dune King", "Legendary", 8],
  ["Sandstorm Titan", "Mythic", 1],
  ["Mirage Shade", "Secret", 0.5],
  ["Dune Lord", "Ultra Secret", 0.08],
  ["Dune Prime", "Mystical", 0.02],
  ["Dune Divinity", "Celestial", 0.01],
];
packEmojis["Dune Pack"] = "🏜️";

packs["Savanna Pack"] = [
  ["Grass Patch", "Common", 45.39],
  ["Giraffe", "Uncommon", 30],
  ["Wildebeest", "Rare", 15],
  ["Savanna King", "Legendary", 8],
  ["Migration Titan", "Mythic", 1],
  ["Heat Shade", "Secret", 0.5],
  ["Savanna Lord", "Ultra Secret", 0.08],
  ["Savanna Prime", "Mystical", 0.02],
  ["Savanna Divinity", "Celestial", 0.01],
];
packEmojis["Savanna Pack"] = "🦒";

packs["Plateau Pack"] = [
  ["Flat Rock", "Common", 45.39],
  ["Mesa Bird", "Uncommon", 30],
  ["Highland Goat", "Rare", 15],
  ["Plateau King", "Legendary", 8],
  ["Tableland Titan", "Mythic", 1],
  ["Altitude Shade", "Secret", 0.5],
  ["Plateau Lord", "Ultra Secret", 0.08],
  ["Plateau Prime", "Mystical", 0.02],
  ["Plateau Divinity", "Celestial", 0.01],
];
packEmojis["Plateau Pack"] = "🗻";

packs["Volcano Island Pack"] = [
  ["Pumice", "Common", 45.39],
  ["Hot Spring", "Uncommon", 30],
  ["Sulfur Vent", "Rare", 15],
  ["Caldera King", "Legendary", 8],
  ["Eruption Titan", "Mythic", 1],
  ["Lava Shade", "Secret", 0.5],
  ["Volcanic Lord", "Ultra Secret", 0.08],
  ["Volcano Isle Prime", "Mystical", 0.02],
  ["Volcano Island Divinity", "Celestial", 0.01],
];
packEmojis["Volcano Island Pack"] = "🌋";

packs["Bayou Pack"] = [
  ["Moss", "Common", 45.39],
  ["Crawfish", "Uncommon", 30],
  ["Bayou Gator", "Rare", 15],
  ["Bayou King", "Legendary", 8],
  ["Swamp Gas Titan", "Mythic", 1],
  ["Voodoo Shade", "Secret", 0.5],
  ["Bayou Lord", "Ultra Secret", 0.08],
  ["Bayou Prime", "Mystical", 0.02],
  ["Bayou Divinity", "Celestial", 0.01],
];
packEmojis["Bayou Pack"] = "🐊";

packs["Steppe Pack"] = [
  ["Wild Grass", "Common", 45.39],
  ["Nomad", "Uncommon", 30],
  ["Steppe Eagle", "Rare", 15],
  ["Khan", "Legendary", 8],
  ["Steppe Titan", "Mythic", 1],
  ["Wind Shade", "Secret", 0.5],
  ["Steppe Lord", "Ultra Secret", 0.08],
  ["Steppe Prime", "Mystical", 0.02],
  ["Steppe Divinity", "Celestial", 0.01],
];
packEmojis["Steppe Pack"] = "🐎";

packs["Archipelago Pack"] = [
  ["Sandy Shore", "Common", 45.39],
  ["Coconut Palm", "Uncommon", 30],
  ["Sea Turtle", "Rare", 15],
  ["Island Chief", "Legendary", 8],
  ["Archipelago Titan", "Mythic", 1],
  ["Lagoon Shade", "Secret", 0.5],
  ["Archipelago Lord", "Ultra Secret", 0.08],
  ["Archipelago Prime", "Mystical", 0.02],
  ["Archipelago Divinity", "Celestial", 0.01],
];
packEmojis["Archipelago Pack"] = "🏝️";

packs["Geyser Pack"] = [
  ["Hot Rock", "Common", 45.39],
  ["Steam Vent", "Uncommon", 30],
  ["Mud Pot", "Rare", 15],
  ["Geyser King", "Legendary", 8],
  ["Thermal Titan", "Mythic", 1],
  ["Boiling Shade", "Secret", 0.5],
  ["Geyser Lord", "Ultra Secret", 0.08],
  ["Geyser Prime", "Mystical", 0.02],
  ["Geyser Divinity", "Celestial", 0.01],
];
packEmojis["Geyser Pack"] = "♨️";

packs["Tidal Wave Pack"] = [
  ["Ripple", "Common", 45.39],
  ["Swell", "Uncommon", 30],
  ["Breaker", "Rare", 15],
  ["Tsunami King", "Legendary", 8],
  ["Wave Titan", "Mythic", 1],
  ["Surge Shade", "Secret", 0.5],
  ["Tidal Lord", "Ultra Secret", 0.08],
  ["Tidal Prime", "Mystical", 0.02],
  ["Tidal Wave Divinity", "Celestial", 0.01],
];
packEmojis["Tidal Wave Pack"] = "🌊";

packs["Iceberg Pack"] = [
  ["Ice Chip", "Common", 45.39],
  ["Frost Cap", "Uncommon", 30],
  ["Berg Fragment", "Rare", 15],
  ["Iceberg King", "Legendary", 8],
  ["Titanic Ice", "Mythic", 1],
  ["Submerged Shade", "Secret", 0.5],
  ["Iceberg Lord", "Ultra Secret", 0.08],
  ["Iceberg Prime", "Mystical", 0.02],
  ["Iceberg Divinity", "Celestial", 0.01],
];
packEmojis["Iceberg Pack"] = "🏔️";

packs["Reef Pack"] = [
  ["Clam", "Common", 45.39],
  ["Parrotfish", "Uncommon", 30],
  ["Moray Eel", "Rare", 15],
  ["Reef King", "Legendary", 8],
  ["Lagoon Titan", "Mythic", 1],
  ["Coral Shade", "Secret", 0.5],
  ["Reef Lord", "Ultra Secret", 0.08],
  ["Reef Prime", "Mystical", 0.02],
  ["Reef Divinity", "Celestial", 0.01],
];
packEmojis["Reef Pack"] = "🐠";

packs["Swimming Pack"] = [
  ["Kickboard", "Common", 45.39],
  ["Freestyle", "Uncommon", 30],
  ["Backstroke", "Rare", 15],
  ["Swim King", "Legendary", 8],
  ["Aqua Titan", "Mythic", 1],
  ["Lane Shade", "Secret", 0.5],
  ["Swim Lord", "Ultra Secret", 0.08],
  ["Swimming Prime", "Mystical", 0.02],
  ["Swimming Divinity", "Celestial", 0.01],
];
packEmojis["Swimming Pack"] = "🏊";

packs["Tennis Pack"] = [
  ["Tennis Ball", "Common", 45.39],
  ["Racket", "Uncommon", 30],
  ["Ace Shot", "Rare", 15],
  ["Tennis King", "Legendary", 8],
  ["Grand Slam", "Mythic", 1],
  ["Court Shade", "Secret", 0.5],
  ["Tennis Lord", "Ultra Secret", 0.08],
  ["Tennis Prime", "Mystical", 0.02],
  ["Tennis Divinity", "Celestial", 0.01],
];
packEmojis["Tennis Pack"] = "🎾";

packs["Golf Pack"] = [
  ["Golf Tee", "Common", 45.39],
  ["Iron Club", "Uncommon", 30],
  ["Birdie", "Rare", 15],
  ["Golf King", "Legendary", 8],
  ["Hole-in-One Titan", "Mythic", 1],
  ["Green Shade", "Secret", 0.5],
  ["Golf Lord", "Ultra Secret", 0.08],
  ["Golf Prime", "Mystical", 0.02],
  ["Golf Divinity", "Celestial", 0.01],
];
packEmojis["Golf Pack"] = "⛳";

packs["Boxing Pack"] = [
  ["Sparring Glove", "Common", 45.39],
  ["Jab", "Uncommon", 30],
  ["Uppercut", "Rare", 15],
  ["Boxing King", "Legendary", 8],
  ["Ring Titan", "Mythic", 1],
  ["Corner Shade", "Secret", 0.5],
  ["Boxing Lord", "Ultra Secret", 0.08],
  ["Boxing Prime", "Mystical", 0.02],
  ["Boxing Divinity", "Celestial", 0.01],
];
packEmojis["Boxing Pack"] = "🥊";

packs["Fencing Pack"] = [
  ["Foil", "Common", 45.39],
  ["Epee", "Uncommon", 30],
  ["Sabre", "Rare", 15],
  ["Fencing King", "Legendary", 8],
  ["Duel Titan", "Mythic", 1],
  ["Parry Shade", "Secret", 0.5],
  ["Fencing Lord", "Ultra Secret", 0.08],
  ["Fencing Prime", "Mystical", 0.02],
  ["Fencing Divinity", "Celestial", 0.01],
];
packEmojis["Fencing Pack"] = "🤺";

packs["Surfing Pack"] = [
  ["Foam Board", "Common", 45.39],
  ["Longboard", "Uncommon", 30],
  ["Barrel Ride", "Rare", 15],
  ["Surf King", "Legendary", 8],
  ["Wave Rider", "Mythic", 1],
  ["Rip Shade", "Secret", 0.5],
  ["Surfing Lord", "Ultra Secret", 0.08],
  ["Surfing Prime", "Mystical", 0.02],
  ["Surfing Divinity", "Celestial", 0.01],
];
packEmojis["Surfing Pack"] = "🏄";

packs["Snowboard Pack"] = [
  ["Bunny Slope", "Common", 45.39],
  ["Halfpipe", "Uncommon", 30],
  ["Black Diamond", "Rare", 15],
  ["Snowboard King", "Legendary", 8],
  ["Powder Titan", "Mythic", 1],
  ["Blizzard Shade", "Secret", 0.5],
  ["Snowboard Lord", "Ultra Secret", 0.08],
  ["Snowboard Prime", "Mystical", 0.02],
  ["Snowboard Divinity", "Celestial", 0.01],
];
packEmojis["Snowboard Pack"] = "🏂";

packs["Skiing Pack"] = [
  ["Ski Poles", "Common", 45.39],
  ["Slalom", "Uncommon", 30],
  ["Giant Slalom", "Rare", 15],
  ["Ski King", "Legendary", 8],
  ["Alpine Titan", "Mythic", 1],
  ["Avalanche Shade", "Secret", 0.5],
  ["Ski Lord", "Ultra Secret", 0.08],
  ["Skiing Prime", "Mystical", 0.02],
  ["Skiing Divinity", "Celestial", 0.01],
];
packEmojis["Skiing Pack"] = "⛷️";

packs["Hockey Pack"] = [
  ["Puck", "Common", 45.39],
  ["Slapshot", "Uncommon", 30],
  ["Power Play", "Rare", 15],
  ["Hockey King", "Legendary", 8],
  ["Ice Titan", "Mythic", 1],
  ["Rink Shade", "Secret", 0.5],
  ["Hockey Lord", "Ultra Secret", 0.08],
  ["Hockey Prime", "Mystical", 0.02],
  ["Hockey Divinity", "Celestial", 0.01],
];
packEmojis["Hockey Pack"] = "🏒";

packs["Cricket Pack"] = [
  ["Cricket Ball", "Common", 45.39],
  ["Batsman", "Uncommon", 30],
  ["Bowler", "Rare", 15],
  ["Cricket King", "Legendary", 8],
  ["Wicket Titan", "Mythic", 1],
  ["Pitch Shade", "Secret", 0.5],
  ["Cricket Lord", "Ultra Secret", 0.08],
  ["Cricket Prime", "Mystical", 0.02],
  ["Cricket Divinity", "Celestial", 0.01],
];
packEmojis["Cricket Pack"] = "🏏";

packs["Rugby Pack"] = [
  ["Rugby Ball", "Common", 45.39],
  ["Scrum", "Uncommon", 30],
  ["Try Scorer", "Rare", 15],
  ["Rugby King", "Legendary", 8],
  ["Pitch Titan", "Mythic", 1],
  ["Tackle Shade", "Secret", 0.5],
  ["Rugby Lord", "Ultra Secret", 0.08],
  ["Rugby Prime", "Mystical", 0.02],
  ["Rugby Divinity", "Celestial", 0.01],
];
packEmojis["Rugby Pack"] = "🏉";

packs["Bowling Pack"] = [
  ["Pin", "Common", 45.39],
  ["Spare", "Uncommon", 30],
  ["Strike", "Rare", 15],
  ["Bowling King", "Legendary", 8],
  ["Lane Titan", "Mythic", 1],
  ["Gutter Shade", "Secret", 0.5],
  ["Bowling Lord", "Ultra Secret", 0.08],
  ["Bowling Prime", "Mystical", 0.02],
  ["Bowling Divinity", "Celestial", 0.01],
];
packEmojis["Bowling Pack"] = "🎳";

packs["Volleyball Pack"] = [
  ["Beach Ball", "Common", 45.39],
  ["Bump", "Uncommon", 30],
  ["Spike", "Rare", 15],
  ["Volleyball King", "Legendary", 8],
  ["Net Titan", "Mythic", 1],
  ["Sand Shade", "Secret", 0.5],
  ["Volleyball Lord", "Ultra Secret", 0.08],
  ["Volleyball Prime", "Mystical", 0.02],
  ["Volleyball Divinity", "Celestial", 0.01],
];
packEmojis["Volleyball Pack"] = "🏐";

packs["Gymnastics Pack"] = [
  ["Mat", "Common", 45.39],
  ["Balance Beam", "Uncommon", 30],
  ["Vault", "Rare", 15],
  ["Gymnastics King", "Legendary", 8],
  ["Floor Titan", "Mythic", 1],
  ["Flip Shade", "Secret", 0.5],
  ["Gymnastics Lord", "Ultra Secret", 0.08],
  ["Gymnastics Prime", "Mystical", 0.02],
  ["Gymnastics Divinity", "Celestial", 0.01],
];
packEmojis["Gymnastics Pack"] = "🤸";

packs["Diving Pack"] = [
  ["Snorkel", "Common", 45.39],
  ["Scuba Tank", "Uncommon", 30],
  ["Deep Dive", "Rare", 15],
  ["Diving King", "Legendary", 8],
  ["Pressure Titan", "Mythic", 1],
  ["Abyss Shade", "Secret", 0.5],
  ["Diving Lord", "Ultra Secret", 0.08],
  ["Diving Prime", "Mystical", 0.02],
  ["Diving Divinity", "Celestial", 0.01],
];
packEmojis["Diving Pack"] = "🤿";

packs["Cycling Pack"] = [
  ["Training Wheels", "Common", 45.39],
  ["Road Bike", "Uncommon", 30],
  ["Mountain Bike", "Rare", 15],
  ["Tour King", "Legendary", 8],
  ["Pedal Titan", "Mythic", 1],
  ["Chain Shade", "Secret", 0.5],
  ["Cycling Lord", "Ultra Secret", 0.08],
  ["Cycling Prime", "Mystical", 0.02],
  ["Cycling Divinity", "Celestial", 0.01],
];
packEmojis["Cycling Pack"] = "🚴";

packs["Marathon Pack"] = [
  ["Sneaker", "Common", 45.39],
  ["Relay Baton", "Uncommon", 30],
  ["Finish Line", "Rare", 15],
  ["Marathon King", "Legendary", 8],
  ["Endurance Titan", "Mythic", 1],
  ["Pace Shade", "Secret", 0.5],
  ["Marathon Lord", "Ultra Secret", 0.08],
  ["Marathon Prime", "Mystical", 0.02],
  ["Marathon Divinity", "Celestial", 0.01],
];
packEmojis["Marathon Pack"] = "🏃";

packs["Sailing Race Pack"] = [
  ["Dinghy", "Common", 45.39],
  ["Catamaran", "Uncommon", 30],
  ["Yacht Racer", "Rare", 15],
  ["Regatta King", "Legendary", 8],
  ["Wind Titan", "Mythic", 1],
  ["Calm Shade", "Secret", 0.5],
  ["Sailing Race Lord", "Ultra Secret", 0.08],
  ["Sailing Race Prime", "Mystical", 0.02],
  ["Sailing Race Divinity", "Celestial", 0.01],
];
packEmojis["Sailing Race Pack"] = "⛵";

packs["Figure Skating Pack"] = [
  ["Ice Skate", "Common", 45.39],
  ["Spin", "Uncommon", 30],
  ["Triple Axel", "Rare", 15],
  ["Skate King", "Legendary", 8],
  ["Ice Dance Titan", "Mythic", 1],
  ["Frost Shade", "Secret", 0.5],
  ["Skate Lord", "Ultra Secret", 0.08],
  ["Skating Prime", "Mystical", 0.02],
  ["Figure Skating Divinity", "Celestial", 0.01],
];
packEmojis["Figure Skating Pack"] = "⛸️";

packs["Karate Pack"] = [
  ["Yellow Belt", "Common", 45.39],
  ["Orange Belt", "Uncommon", 30],
  ["Brown Belt", "Rare", 15],
  ["Karate King", "Legendary", 8],
  ["Dan Titan", "Mythic", 1],
  ["Kata Shade", "Secret", 0.5],
  ["Karate Lord", "Ultra Secret", 0.08],
  ["Karate Prime", "Mystical", 0.02],
  ["Karate Divinity", "Celestial", 0.01],
];
packEmojis["Karate Pack"] = "🥋";

packs["Badminton Pack"] = [
  ["Shuttlecock", "Common", 45.39],
  ["Smash", "Uncommon", 30],
  ["Drop Shot", "Rare", 15],
  ["Badminton King", "Legendary", 8],
  ["Rally Titan", "Mythic", 1],
  ["Net Shade", "Secret", 0.5],
  ["Badminton Lord", "Ultra Secret", 0.08],
  ["Badminton Prime", "Mystical", 0.02],
  ["Badminton Divinity", "Celestial", 0.01],
];
packEmojis["Badminton Pack"] = "🏸";

packs["Polo Pack"] = [
  ["Mallet", "Common", 45.39],
  ["Chukka", "Uncommon", 30],
  ["Polo Pony", "Rare", 15],
  ["Polo King", "Legendary", 8],
  ["Field Titan", "Mythic", 1],
  ["Gallop Shade", "Secret", 0.5],
  ["Polo Lord", "Ultra Secret", 0.08],
  ["Polo Prime", "Mystical", 0.02],
  ["Polo Divinity", "Celestial", 0.01],
];
packEmojis["Polo Pack"] = "🐎";

packs["Table Tennis Pack"] = [
  ["Paddle", "Common", 45.39],
  ["Top Spin", "Uncommon", 30],
  ["Slam", "Rare", 15],
  ["Table Tennis King", "Legendary", 8],
  ["Ping Pong Titan", "Mythic", 1],
  ["Serve Shade", "Secret", 0.5],
  ["Table Tennis Lord", "Ultra Secret", 0.08],
  ["Table Tennis Prime", "Mystical", 0.02],
  ["Table Tennis Divinity", "Celestial", 0.01],
];
packEmojis["Table Tennis Pack"] = "🏓";

packs["Lacrosse Pack"] = [
  ["Stick", "Common", 45.39],
  ["Cradle", "Uncommon", 30],
  ["Quick Shot", "Rare", 15],
  ["Lacrosse King", "Legendary", 8],
  ["Field Titan", "Mythic", 1],
  ["Goal Shade", "Secret", 0.5],
  ["Lacrosse Lord", "Ultra Secret", 0.08],
  ["Lacrosse Prime", "Mystical", 0.02],
  ["Lacrosse Divinity", "Celestial", 0.01],
];
packEmojis["Lacrosse Pack"] = "🥍";

packs["Curling Pack"] = [
  ["Curling Stone", "Common", 45.39],
  ["Sweeper", "Uncommon", 30],
  ["Slider", "Rare", 15],
  ["Curling King", "Legendary", 8],
  ["Ice Titan", "Mythic", 1],
  ["House Shade", "Secret", 0.5],
  ["Curling Lord", "Ultra Secret", 0.08],
  ["Curling Prime", "Mystical", 0.02],
  ["Curling Divinity", "Celestial", 0.01],
];
packEmojis["Curling Pack"] = "🥌";

packs["Jazz Pack"] = [
  ["Saxophone", "Common", 45.39],
  ["Trumpet Solo", "Uncommon", 30],
  ["Bass Walk", "Rare", 15],
  ["Jazz King", "Legendary", 8],
  ["Bebop Titan", "Mythic", 1],
  ["Blue Note Shade", "Secret", 0.5],
  ["Jazz Lord", "Ultra Secret", 0.08],
  ["Jazz Prime", "Mystical", 0.02],
  ["Jazz Divinity", "Celestial", 0.01],
];
packEmojis["Jazz Pack"] = "🎷";

packs["Rock Pack"] = [
  ["Power Chord", "Common", 45.39],
  ["Distortion", "Uncommon", 30],
  ["Shred", "Rare", 15],
  ["Rock King", "Legendary", 8],
  ["Metal Titan", "Mythic", 1],
  ["Amplifier Shade", "Secret", 0.5],
  ["Rock Lord", "Ultra Secret", 0.08],
  ["Rock Prime", "Mystical", 0.02],
  ["Rock Divinity", "Celestial", 0.01],
];
packEmojis["Rock Pack"] = "🎸";

packs["Classical Pack"] = [
  ["Violin Bow", "Common", 45.39],
  ["Sonata", "Uncommon", 30],
  ["Concerto", "Rare", 15],
  ["Maestro", "Legendary", 8],
  ["Symphony Titan", "Mythic", 1],
  ["Adagio Shade", "Secret", 0.5],
  ["Classical Lord", "Ultra Secret", 0.08],
  ["Classical Prime", "Mystical", 0.02],
  ["Classical Divinity", "Celestial", 0.01],
];
packEmojis["Classical Pack"] = "🎻";

packs["Electronic Pack"] = [
  ["Synth Pad", "Common", 45.39],
  ["Bass Drop", "Uncommon", 30],
  ["Dubstep", "Rare", 15],
  ["DJ King", "Legendary", 8],
  ["Waveform Titan", "Mythic", 1],
  ["Frequency Shade", "Secret", 0.5],
  ["Electronic Lord", "Ultra Secret", 0.08],
  ["Electronic Prime", "Mystical", 0.02],
  ["Electronic Divinity", "Celestial", 0.01],
];
packEmojis["Electronic Pack"] = "🎧";

packs["Opera Pack"] = [
  ["Overture", "Common", 45.39],
  ["Aria", "Uncommon", 30],
  ["Soprano", "Rare", 15],
  ["Opera King", "Legendary", 8],
  ["Crescendo Titan", "Mythic", 1],
  ["Curtain Shade", "Secret", 0.5],
  ["Opera Lord", "Ultra Secret", 0.08],
  ["Opera Prime", "Mystical", 0.02],
  ["Opera Divinity", "Celestial", 0.01],
];
packEmojis["Opera Pack"] = "🎭";

packs["Drum Pack"] = [
  ["Snare", "Common", 45.39],
  ["Hi-Hat", "Uncommon", 30],
  ["Double Bass", "Rare", 15],
  ["Drum King", "Legendary", 8],
  ["Rhythm Titan", "Mythic", 1],
  ["Beat Shade", "Secret", 0.5],
  ["Drum Lord", "Ultra Secret", 0.08],
  ["Drum Prime", "Mystical", 0.02],
  ["Drum Divinity", "Celestial", 0.01],
];
packEmojis["Drum Pack"] = "🥁";

packs["Piano Pack"] = [
  ["Key", "Common", 45.39],
  ["Chord", "Uncommon", 30],
  ["Grand Piano", "Rare", 15],
  ["Pianist King", "Legendary", 8],
  ["Steinway Titan", "Mythic", 1],
  ["Pedal Shade", "Secret", 0.5],
  ["Piano Lord", "Ultra Secret", 0.08],
  ["Piano Prime", "Mystical", 0.02],
  ["Piano Divinity", "Celestial", 0.01],
];
packEmojis["Piano Pack"] = "🎹";

packs["Guitar Hero Pack"] = [
  ["Open String", "Common", 45.39],
  ["Barre Chord", "Uncommon", 30],
  ["Whammy Bar", "Rare", 15],
  ["Guitar King", "Legendary", 8],
  ["Riff Titan", "Mythic", 1],
  ["Fret Shade", "Secret", 0.5],
  ["Guitar Lord", "Ultra Secret", 0.08],
  ["Guitar Prime", "Mystical", 0.02],
  ["Guitar Divinity", "Celestial", 0.01],
];
packEmojis["Guitar Hero Pack"] = "🎸";

packs["Trumpet Pack"] = [
  ["Mouthpiece", "Common", 45.39],
  ["Bugle", "Uncommon", 30],
  ["Cornet", "Rare", 15],
  ["Trumpet King", "Legendary", 8],
  ["Brass Titan", "Mythic", 1],
  ["Fanfare Shade", "Secret", 0.5],
  ["Trumpet Lord", "Ultra Secret", 0.08],
  ["Trumpet Prime", "Mystical", 0.02],
  ["Trumpet Divinity", "Celestial", 0.01],
];
packEmojis["Trumpet Pack"] = "🎺";

packs["Harp Pack"] = [
  ["String", "Common", 45.39],
  ["Glissando", "Uncommon", 30],
  ["Golden Harp", "Rare", 15],
  ["Harp King", "Legendary", 8],
  ["Ethereal Titan", "Mythic", 1],
  ["Angel Shade", "Secret", 0.5],
  ["Harp Lord", "Ultra Secret", 0.08],
  ["Harp Prime", "Mystical", 0.02],
  ["Harp Divinity", "Celestial", 0.01],
];
packEmojis["Harp Pack"] = "🪕";

packs["Choir Pack"] = [
  ["Alto", "Common", 45.39],
  ["Tenor", "Uncommon", 30],
  ["Baritone", "Rare", 15],
  ["Choir King", "Legendary", 8],
  ["Harmony Titan", "Mythic", 1],
  ["Chant Shade", "Secret", 0.5],
  ["Choir Lord", "Ultra Secret", 0.08],
  ["Choir Prime", "Mystical", 0.02],
  ["Choir Divinity", "Celestial", 0.01],
];
packEmojis["Choir Pack"] = "🎤";

packs["Vinyl Pack"] = [
  ["Single", "Common", 45.39],
  ["EP", "Uncommon", 30],
  ["LP", "Rare", 15],
  ["Vinyl King", "Legendary", 8],
  ["Platinum Titan", "Mythic", 1],
  ["Groove Shade", "Secret", 0.5],
  ["Vinyl Lord", "Ultra Secret", 0.08],
  ["Vinyl Prime", "Mystical", 0.02],
  ["Vinyl Divinity", "Celestial", 0.01],
];
packEmojis["Vinyl Pack"] = "📀";

packs["Ukulele Pack"] = [
  ["Strum", "Common", 45.39],
  ["Fingerpick", "Uncommon", 30],
  ["Island Song", "Rare", 15],
  ["Ukulele King", "Legendary", 8],
  ["Uke Titan", "Mythic", 1],
  ["Melody Shade", "Secret", 0.5],
  ["Ukulele Lord", "Ultra Secret", 0.08],
  ["Ukulele Prime", "Mystical", 0.02],
  ["Ukulele Divinity", "Celestial", 0.01],
];
packEmojis["Ukulele Pack"] = "🪈";

packs["Karaoke Pack"] = [
  ["Mic Stand", "Common", 45.39],
  ["Duet", "Uncommon", 30],
  ["Power Ballad", "Rare", 15],
  ["Karaoke King", "Legendary", 8],
  ["Stage Titan", "Mythic", 1],
  ["Echo Shade", "Secret", 0.5],
  ["Karaoke Lord", "Ultra Secret", 0.08],
  ["Karaoke Prime", "Mystical", 0.02],
  ["Karaoke Divinity", "Celestial", 0.01],
];
packEmojis["Karaoke Pack"] = "🎤";

packs["Orchestra Pack"] = [
  ["Music Stand", "Common", 45.39],
  ["First Chair", "Uncommon", 30],
  ["Conductor Baton", "Rare", 15],
  ["Orchestra King", "Legendary", 8],
  ["Philharmonic Titan", "Mythic", 1],
  ["Encore Shade", "Secret", 0.5],
  ["Orchestra Lord", "Ultra Secret", 0.08],
  ["Orchestra Prime", "Mystical", 0.02],
  ["Orchestra Divinity", "Celestial", 0.01],
];
packEmojis["Orchestra Pack"] = "🎼";

packs["Bicycle Pack"] = [
  ["Tricycle", "Common", 45.39],
  ["BMX", "Uncommon", 30],
  ["Tandem", "Rare", 15],
  ["Bicycle King", "Legendary", 8],
  ["Velocity Titan", "Mythic", 1],
  ["Spoke Shade", "Secret", 0.5],
  ["Bicycle Lord", "Ultra Secret", 0.08],
  ["Bicycle Prime", "Mystical", 0.02],
  ["Bicycle Divinity", "Celestial", 0.01],
];
packEmojis["Bicycle Pack"] = "🚲";

packs["Motorcycle Pack"] = [
  ["Moped", "Common", 45.39],
  ["Chopper", "Uncommon", 30],
  ["Superbike", "Rare", 15],
  ["Biker King", "Legendary", 8],
  ["Throttle Titan", "Mythic", 1],
  ["Exhaust Shade", "Secret", 0.5],
  ["Motorcycle Lord", "Ultra Secret", 0.08],
  ["Motorcycle Prime", "Mystical", 0.02],
  ["Motorcycle Divinity", "Celestial", 0.01],
];
packEmojis["Motorcycle Pack"] = "🏍️";

packs["Truck Pack"] = [
  ["Pickup", "Common", 45.39],
  ["Semi", "Uncommon", 30],
  ["Monster Truck", "Rare", 15],
  ["Truck King", "Legendary", 8],
  ["Freight Titan", "Mythic", 1],
  ["Diesel Shade", "Secret", 0.5],
  ["Truck Lord", "Ultra Secret", 0.08],
  ["Truck Prime", "Mystical", 0.02],
  ["Truck Divinity", "Celestial", 0.01],
];
packEmojis["Truck Pack"] = "🚛";

packs["Airplane Pack"] = [
  ["Paper Plane", "Common", 45.39],
  ["Propeller", "Uncommon", 30],
  ["Jet", "Rare", 15],
  ["Pilot King", "Legendary", 8],
  ["Mach Titan", "Mythic", 1],
  ["Cloud Shade", "Secret", 0.5],
  ["Airplane Lord", "Ultra Secret", 0.08],
  ["Airplane Prime", "Mystical", 0.02],
  ["Airplane Divinity", "Celestial", 0.01],
];
packEmojis["Airplane Pack"] = "✈️";

packs["Helicopter Pack"] = [
  ["Drone Copter", "Common", 45.39],
  ["Chopper", "Uncommon", 30],
  ["Apache", "Rare", 15],
  ["Heli King", "Legendary", 8],
  ["Rotor Titan", "Mythic", 1],
  ["Hover Shade", "Secret", 0.5],
  ["Helicopter Lord", "Ultra Secret", 0.08],
  ["Helicopter Prime", "Mystical", 0.02],
  ["Helicopter Divinity", "Celestial", 0.01],
];
packEmojis["Helicopter Pack"] = "🚁";

packs["Submarine Pack"] = [
  ["Periscope", "Common", 45.39],
  ["Torpedo", "Uncommon", 30],
  ["Nuclear Sub", "Rare", 15],
  ["Admiral", "Legendary", 8],
  ["Depth Titan", "Mythic", 1],
  ["Sonar Shade", "Secret", 0.5],
  ["Submarine Lord", "Ultra Secret", 0.08],
  ["Submarine Prime", "Mystical", 0.02],
  ["Submarine Divinity", "Celestial", 0.01],
];
packEmojis["Submarine Pack"] = "🚢";

packs["Hot Air Pack"] = [
  ["Basket", "Common", 45.39],
  ["Burner", "Uncommon", 30],
  ["Cloud Rider", "Rare", 15],
  ["Balloon King", "Legendary", 8],
  ["Altitude Titan", "Mythic", 1],
  ["Sky Shade", "Secret", 0.5],
  ["Hot Air Lord", "Ultra Secret", 0.08],
  ["Hot Air Prime", "Mystical", 0.02],
  ["Hot Air Divinity", "Celestial", 0.01],
];
packEmojis["Hot Air Pack"] = "🎈";

packs["Scooter Pack"] = [
  ["Kick Scooter", "Common", 45.39],
  ["Vespa", "Uncommon", 30],
  ["Electric Scooter", "Rare", 15],
  ["Scooter King", "Legendary", 8],
  ["Zip Titan", "Mythic", 1],
  ["Street Shade", "Secret", 0.5],
  ["Scooter Lord", "Ultra Secret", 0.08],
  ["Scooter Prime", "Mystical", 0.02],
  ["Scooter Divinity", "Celestial", 0.01],
];
packEmojis["Scooter Pack"] = "🛴";

packs["Snowmobile Pack"] = [
  ["Sled", "Common", 45.39],
  ["Snow Runner", "Uncommon", 30],
  ["Arctic Cat", "Rare", 15],
  ["Snowmobile King", "Legendary", 8],
  ["Blizzard Titan", "Mythic", 1],
  ["Powder Shade", "Secret", 0.5],
  ["Snowmobile Lord", "Ultra Secret", 0.08],
  ["Snowmobile Prime", "Mystical", 0.02],
  ["Snowmobile Divinity", "Celestial", 0.01],
];
packEmojis["Snowmobile Pack"] = "🛷";

packs["Gondola Pack"] = [
  ["Cable Car", "Common", 45.39],
  ["Lift Chair", "Uncommon", 30],
  ["Peak Tram", "Rare", 15],
  ["Gondola King", "Legendary", 8],
  ["Summit Titan", "Mythic", 1],
  ["Fog Shade", "Secret", 0.5],
  ["Gondola Lord", "Ultra Secret", 0.08],
  ["Gondola Prime", "Mystical", 0.02],
  ["Gondola Divinity", "Celestial", 0.01],
];
packEmojis["Gondola Pack"] = "🚡";

packs["Spaceship Pack"] = [
  ["Escape Pod", "Common", 45.39],
  ["Star Fighter", "Uncommon", 30],
  ["Cruiser", "Rare", 15],
  ["Fleet Commander", "Legendary", 8],
  ["Warp Titan", "Mythic", 1],
  ["Nebula Shade", "Secret", 0.5],
  ["Spaceship Lord", "Ultra Secret", 0.08],
  ["Spaceship Prime", "Mystical", 0.02],
  ["Spaceship Divinity", "Celestial", 0.01],
];
packEmojis["Spaceship Pack"] = "🛸";

packs["Canoe Pack"] = [
  ["Paddle", "Common", 45.39],
  ["Birch Canoe", "Uncommon", 30],
  ["War Canoe", "Rare", 15],
  ["River King", "Legendary", 8],
  ["Rapids Titan", "Mythic", 1],
  ["Wake Shade", "Secret", 0.5],
  ["Canoe Lord", "Ultra Secret", 0.08],
  ["Canoe Prime", "Mystical", 0.02],
  ["Canoe Divinity", "Celestial", 0.01],
];
packEmojis["Canoe Pack"] = "🛶";

packs["Bus Pack"] = [
  ["Mini Bus", "Common", 45.39],
  ["Double Decker", "Uncommon", 30],
  ["Tour Bus", "Rare", 15],
  ["Bus King", "Legendary", 8],
  ["Transit Titan", "Mythic", 1],
  ["Route Shade", "Secret", 0.5],
  ["Bus Lord", "Ultra Secret", 0.08],
  ["Bus Prime", "Mystical", 0.02],
  ["Bus Divinity", "Celestial", 0.01],
];
packEmojis["Bus Pack"] = "🚌";

packs["Taxi Pack"] = [
  ["Meter", "Common", 45.39],
  ["Yellow Cab", "Uncommon", 30],
  ["Limo", "Rare", 15],
  ["Taxi King", "Legendary", 8],
  ["Fare Titan", "Mythic", 1],
  ["Dispatch Shade", "Secret", 0.5],
  ["Taxi Lord", "Ultra Secret", 0.08],
  ["Taxi Prime", "Mystical", 0.02],
  ["Taxi Divinity", "Celestial", 0.01],
];
packEmojis["Taxi Pack"] = "🚕";

packs["Ambulance Pack"] = [
  ["First Aid", "Common", 45.39],
  ["Stretcher", "Uncommon", 30],
  ["Paramedic", "Rare", 15],
  ["ER King", "Legendary", 8],
  ["Rescue Titan", "Mythic", 1],
  ["Siren Shade", "Secret", 0.5],
  ["Ambulance Lord", "Ultra Secret", 0.08],
  ["Ambulance Prime", "Mystical", 0.02],
  ["Ambulance Divinity", "Celestial", 0.01],
];
packEmojis["Ambulance Pack"] = "🚑";

packs["Fire Truck Pack"] = [
  ["Hose", "Common", 45.39],
  ["Ladder", "Uncommon", 30],
  ["Dalmatian", "Rare", 15],
  ["Fire Chief", "Legendary", 8],
  ["Inferno Titan", "Mythic", 1],
  ["Alarm Shade", "Secret", 0.5],
  ["Fire Truck Lord", "Ultra Secret", 0.08],
  ["Fire Truck Prime", "Mystical", 0.02],
  ["Fire Truck Divinity", "Celestial", 0.01],
];
packEmojis["Fire Truck Pack"] = "🚒";

packs["Tractor Pack"] = [
  ["Plow", "Common", 45.39],
  ["Combine", "Uncommon", 30],
  ["Harvester", "Rare", 15],
  ["Tractor King", "Legendary", 8],
  ["Farm Titan", "Mythic", 1],
  ["Field Shade", "Secret", 0.5],
  ["Tractor Lord", "Ultra Secret", 0.08],
  ["Tractor Prime", "Mystical", 0.02],
  ["Tractor Divinity", "Celestial", 0.01],
];
packEmojis["Tractor Pack"] = "🚜";

packs["Ferry Pack"] = [
  ["Rowboat", "Common", 45.39],
  ["Tugboat", "Uncommon", 30],
  ["Car Ferry", "Rare", 15],
  ["Ferry King", "Legendary", 8],
  ["Harbor Titan", "Mythic", 1],
  ["Wake Shade", "Secret", 0.5],
  ["Ferry Lord", "Ultra Secret", 0.08],
  ["Ferry Prime", "Mystical", 0.02],
  ["Ferry Divinity", "Celestial", 0.01],
];
packEmojis["Ferry Pack"] = "⛴️";

packs["Rickshaw Pack"] = [
  ["Cart", "Common", 45.39],
  ["Cycle Rickshaw", "Uncommon", 30],
  ["Auto Rickshaw", "Rare", 15],
  ["Rickshaw King", "Legendary", 8],
  ["Street Titan", "Mythic", 1],
  ["Jingle Shade", "Secret", 0.5],
  ["Rickshaw Lord", "Ultra Secret", 0.08],
  ["Rickshaw Prime", "Mystical", 0.02],
  ["Rickshaw Divinity", "Celestial", 0.01],
];
packEmojis["Rickshaw Pack"] = "🛺";

packs["Zeppelin Pack"] = [
  ["Gas Cell", "Common", 45.39],
  ["Rigid Airship", "Uncommon", 30],
  ["War Blimp", "Rare", 15],
  ["Zeppelin King", "Legendary", 8],
  ["Airship Titan", "Mythic", 1],
  ["Hydrogen Shade", "Secret", 0.5],
  ["Zeppelin Lord", "Ultra Secret", 0.08],
  ["Zeppelin Prime", "Mystical", 0.02],
  ["Zeppelin Divinity", "Celestial", 0.01],
];
packEmojis["Zeppelin Pack"] = "🎈";

packs["Chef Pack"] = [
  ["Sous Chef", "Common", 45.39],
  ["Pastry Chef", "Uncommon", 30],
  ["Head Chef", "Rare", 15],
  ["Chef King", "Legendary", 8],
  ["Kitchen Titan", "Mythic", 1],
  ["Recipe Shade", "Secret", 0.5],
  ["Chef Lord", "Ultra Secret", 0.08],
  ["Chef Prime", "Mystical", 0.02],
  ["Chef Divinity", "Celestial", 0.01],
];
packEmojis["Chef Pack"] = "👨‍🍳";

packs["Firefighter Pack"] = [
  ["Cadet", "Common", 45.39],
  ["Smoke Jumper", "Uncommon", 30],
  ["Fire Captain", "Rare", 15],
  ["Fire King", "Legendary", 8],
  ["Blaze Titan", "Mythic", 1],
  ["Ember Shade", "Secret", 0.5],
  ["Firefighter Lord", "Ultra Secret", 0.08],
  ["Firefighter Prime", "Mystical", 0.02],
  ["Firefighter Divinity", "Celestial", 0.01],
];
packEmojis["Firefighter Pack"] = "👨‍🚒";

packs["Doctor Pack"] = [
  ["Intern", "Common", 45.39],
  ["Surgeon", "Uncommon", 30],
  ["Specialist", "Rare", 15],
  ["Doctor King", "Legendary", 8],
  ["Healer Titan", "Mythic", 1],
  ["Scalpel Shade", "Secret", 0.5],
  ["Doctor Lord", "Ultra Secret", 0.08],
  ["Doctor Prime", "Mystical", 0.02],
  ["Doctor Divinity", "Celestial", 0.01],
];
packEmojis["Doctor Pack"] = "👨‍⚕️";

packs["Pilot Pack"] = [
  ["Co-Pilot", "Common", 45.39],
  ["Captain", "Uncommon", 30],
  ["Test Pilot", "Rare", 15],
  ["Ace Pilot", "Legendary", 8],
  ["Flight Titan", "Mythic", 1],
  ["Cockpit Shade", "Secret", 0.5],
  ["Pilot Lord", "Ultra Secret", 0.08],
  ["Pilot Prime", "Mystical", 0.02],
  ["Pilot Divinity", "Celestial", 0.01],
];
packEmojis["Pilot Pack"] = "👨‍✈️";

packs["Detective Pack"] = [
  ["Magnifying Glass", "Common", 45.39],
  ["Clue Finder", "Uncommon", 30],
  ["Inspector", "Rare", 15],
  ["Detective King", "Legendary", 8],
  ["Mystery Titan", "Mythic", 1],
  ["Alibi Shade", "Secret", 0.5],
  ["Detective Lord", "Ultra Secret", 0.08],
  ["Detective Prime", "Mystical", 0.02],
  ["Detective Divinity", "Celestial", 0.01],
];
packEmojis["Detective Pack"] = "🕵️";

packs["Mechanic Pack"] = [
  ["Wrench", "Common", 45.39],
  ["Socket Set", "Uncommon", 30],
  ["Engine Swap", "Rare", 15],
  ["Mechanic King", "Legendary", 8],
  ["Gear Titan", "Mythic", 1],
  ["Grease Shade", "Secret", 0.5],
  ["Mechanic Lord", "Ultra Secret", 0.08],
  ["Mechanic Prime", "Mystical", 0.02],
  ["Mechanic Divinity", "Celestial", 0.01],
];
packEmojis["Mechanic Pack"] = "🔧";

packs["Carpenter Pack"] = [
  ["Sawdust", "Common", 45.39],
  ["Chisel", "Uncommon", 30],
  ["Dovetail", "Rare", 15],
  ["Carpenter King", "Legendary", 8],
  ["Timber Titan", "Mythic", 1],
  ["Grain Shade", "Secret", 0.5],
  ["Carpenter Lord", "Ultra Secret", 0.08],
  ["Carpenter Prime", "Mystical", 0.02],
  ["Carpenter Divinity", "Celestial", 0.01],
];
packEmojis["Carpenter Pack"] = "🪚";

packs["Electrician Pack"] = [
  ["Wire", "Common", 45.39],
  ["Circuit Breaker", "Uncommon", 30],
  ["Transformer", "Rare", 15],
  ["Electrician King", "Legendary", 8],
  ["Voltage Titan", "Mythic", 1],
  ["Spark Shade", "Secret", 0.5],
  ["Electrician Lord", "Ultra Secret", 0.08],
  ["Electrician Prime", "Mystical", 0.02],
  ["Electrician Divinity", "Celestial", 0.01],
];
packEmojis["Electrician Pack"] = "⚡";

packs["Architect Pack"] = [
  ["Blueprint", "Common", 45.39],
  ["Scale Model", "Uncommon", 30],
  ["Skyscraper", "Rare", 15],
  ["Architect King", "Legendary", 8],
  ["Design Titan", "Mythic", 1],
  ["Draft Shade", "Secret", 0.5],
  ["Architect Lord", "Ultra Secret", 0.08],
  ["Architect Prime", "Mystical", 0.02],
  ["Architect Divinity", "Celestial", 0.01],
];
packEmojis["Architect Pack"] = "📐";

packs["Blacksmith Pack"] = [
  ["Anvil", "Common", 45.39],
  ["Iron Ingot", "Uncommon", 30],
  ["Damascus Steel", "Rare", 15],
  ["Blacksmith King", "Legendary", 8],
  ["Forge Titan", "Mythic", 1],
  ["Ember Shade", "Secret", 0.5],
  ["Blacksmith Lord", "Ultra Secret", 0.08],
  ["Blacksmith Prime", "Mystical", 0.02],
  ["Blacksmith Divinity", "Celestial", 0.01],
];
packEmojis["Blacksmith Pack"] = "🔨";

packs["Jeweler Pack"] = [
  ["Raw Stone", "Common", 45.39],
  ["Cut Gem", "Uncommon", 30],
  ["Tiara", "Rare", 15],
  ["Jeweler King", "Legendary", 8],
  ["Facet Titan", "Mythic", 1],
  ["Luster Shade", "Secret", 0.5],
  ["Jeweler Lord", "Ultra Secret", 0.08],
  ["Jeweler Prime", "Mystical", 0.02],
  ["Jeweler Divinity", "Celestial", 0.01],
];
packEmojis["Jeweler Pack"] = "💍";

packs["Tailor Pack"] = [
  ["Thread", "Common", 45.39],
  ["Needle", "Uncommon", 30],
  ["Silk Robe", "Rare", 15],
  ["Tailor King", "Legendary", 8],
  ["Stitch Titan", "Mythic", 1],
  ["Pattern Shade", "Secret", 0.5],
  ["Tailor Lord", "Ultra Secret", 0.08],
  ["Tailor Prime", "Mystical", 0.02],
  ["Tailor Divinity", "Celestial", 0.01],
];
packEmojis["Tailor Pack"] = "🧵";

packs["Astronaut Pack"] = [
  ["Space Suit", "Common", 45.39],
  ["EVA Walk", "Uncommon", 30],
  ["Moon Step", "Rare", 15],
  ["Commander", "Legendary", 8],
  ["Space Titan", "Mythic", 1],
  ["Zero-G Shade", "Secret", 0.5],
  ["Astronaut Lord", "Ultra Secret", 0.08],
  ["Astronaut Prime", "Mystical", 0.02],
  ["Astronaut Divinity", "Celestial", 0.01],
];
packEmojis["Astronaut Pack"] = "👨‍🚀";

packs["Marine Biologist Pack"] = [
  ["Specimen Jar", "Common", 45.39],
  ["Diving Belt", "Uncommon", 30],
  ["Whale Tag", "Rare", 15],
  ["Marine King", "Legendary", 8],
  ["Ocean Titan", "Mythic", 1],
  ["Depth Shade", "Secret", 0.5],
  ["Marine Lord", "Ultra Secret", 0.08],
  ["Marine Prime", "Mystical", 0.02],
  ["Marine Divinity", "Celestial", 0.01],
];
packEmojis["Marine Biologist Pack"] = "🐋";

packs["Archaeologist Pack"] = [
  ["Brush", "Common", 45.39],
  ["Pottery Shard", "Uncommon", 30],
  ["Lost City", "Rare", 15],
  ["Archaeo King", "Legendary", 8],
  ["Dig Titan", "Mythic", 1],
  ["Sand Shade", "Secret", 0.5],
  ["Archaeologist Lord", "Ultra Secret", 0.08],
  ["Archaeologist Prime", "Mystical", 0.02],
  ["Archaeologist Divinity", "Celestial", 0.01],
];
packEmojis["Archaeologist Pack"] = "🏺";

packs["Baker Pack"] = [
  ["Rolling Pin", "Common", 45.39],
  ["Dough Ball", "Uncommon", 30],
  ["Sourdough", "Rare", 15],
  ["Baker King", "Legendary", 8],
  ["Oven Titan", "Mythic", 1],
  ["Flour Shade", "Secret", 0.5],
  ["Baker Lord", "Ultra Secret", 0.08],
  ["Baker Prime", "Mystical", 0.02],
  ["Baker Divinity", "Celestial", 0.01],
];
packEmojis["Baker Pack"] = "🧑‍🍳";

packs["Farmer Pack"] = [
  ["Pitchfork", "Common", 45.39],
  ["Tractor Seat", "Uncommon", 30],
  ["Golden Wheat", "Rare", 15],
  ["Farmer King", "Legendary", 8],
  ["Harvest Titan", "Mythic", 1],
  ["Scarecrow Shade", "Secret", 0.5],
  ["Farmer Lord", "Ultra Secret", 0.08],
  ["Farmer Prime", "Mystical", 0.02],
  ["Farmer Divinity", "Celestial", 0.01],
];
packEmojis["Farmer Pack"] = "👨‍🌾";

packs["Barber Pack"] = [
  ["Scissors", "Common", 45.39],
  ["Straight Razor", "Uncommon", 30],
  ["Hot Towel", "Rare", 15],
  ["Barber King", "Legendary", 8],
  ["Style Titan", "Mythic", 1],
  ["Trim Shade", "Secret", 0.5],
  ["Barber Lord", "Ultra Secret", 0.08],
  ["Barber Prime", "Mystical", 0.02],
  ["Barber Divinity", "Celestial", 0.01],
];
packEmojis["Barber Pack"] = "💈";

packs["Florist Pack"] = [
  ["Seedling", "Common", 45.39],
  ["Bouquet", "Uncommon", 30],
  ["Rose Garden", "Rare", 15],
  ["Florist King", "Legendary", 8],
  ["Bloom Titan", "Mythic", 1],
  ["Petal Shade", "Secret", 0.5],
  ["Florist Lord", "Ultra Secret", 0.08],
  ["Florist Prime", "Mystical", 0.02],
  ["Florist Divinity", "Celestial", 0.01],
];
packEmojis["Florist Pack"] = "💐";

packs["Astronomer Pack"] = [
  ["Star Chart", "Common", 45.39],
  ["Binary Star", "Uncommon", 30],
  ["Pulsar", "Rare", 15],
  ["Astronomer King", "Legendary", 8],
  ["Cosmos Titan", "Mythic", 1],
  ["Eclipse Shade", "Secret", 0.5],
  ["Astronomer Lord", "Ultra Secret", 0.08],
  ["Astronomer Prime", "Mystical", 0.02],
  ["Astronomer Divinity", "Celestial", 0.01],
];
packEmojis["Astronomer Pack"] = "🔭";

packs["Werewolf Pack"] = [
  ["Moon Pup", "Common", 45.39],
  ["Night Howler", "Uncommon", 30],
  ["Alpha Were", "Rare", 15],
  ["Werewolf King", "Legendary", 8],
  ["Lycan Titan", "Mythic", 1],
  ["Silver Shade", "Secret", 0.5],
  ["Werewolf Lord", "Ultra Secret", 0.08],
  ["Werewolf Prime", "Mystical", 0.02],
  ["Werewolf Divinity", "Celestial", 0.01],
];
packEmojis["Werewolf Pack"] = "🐺";

packs["Witch Pack"] = [
  ["Black Cat", "Common", 45.39],
  ["Broomstick", "Uncommon", 30],
  ["Cauldron", "Rare", 15],
  ["Witch King", "Legendary", 8],
  ["Coven Titan", "Mythic", 1],
  ["Hex Shade", "Secret", 0.5],
  ["Witch Lord", "Ultra Secret", 0.08],
  ["Witch Prime", "Mystical", 0.02],
  ["Witch Divinity", "Celestial", 0.01],
];
packEmojis["Witch Pack"] = "🧙‍♀️";

packs["Necromancer Pack"] = [
  ["Bone Shard", "Common", 45.39],
  ["Skeleton Minion", "Uncommon", 30],
  ["Lich", "Rare", 15],
  ["Necro King", "Legendary", 8],
  ["Death Titan", "Mythic", 1],
  ["Soul Shade", "Secret", 0.5],
  ["Necromancer Lord", "Ultra Secret", 0.08],
  ["Necromancer Prime", "Mystical", 0.02],
  ["Necromancer Divinity", "Celestial", 0.01],
];
packEmojis["Necromancer Pack"] = "💀";

packs["Paladin Pack"] = [
  ["Holy Shield", "Common", 45.39],
  ["Light Blade", "Uncommon", 30],
  ["Divine Armor", "Rare", 15],
  ["Paladin King", "Legendary", 8],
  ["Holy Titan", "Mythic", 1],
  ["Radiance Shade", "Secret", 0.5],
  ["Paladin Lord", "Ultra Secret", 0.08],
  ["Paladin Prime", "Mystical", 0.02],
  ["Paladin Divinity", "Celestial", 0.01],
];
packEmojis["Paladin Pack"] = "⚔️";

packs["Ranger Pack"] = [
  ["Tracker", "Common", 45.39],
  ["Bowstring", "Uncommon", 30],
  ["Beast Master", "Rare", 15],
  ["Ranger King", "Legendary", 8],
  ["Wild Titan", "Mythic", 1],
  ["Forest Shade", "Secret", 0.5],
  ["Ranger Lord", "Ultra Secret", 0.08],
  ["Ranger Prime", "Mystical", 0.02],
  ["Ranger Divinity", "Celestial", 0.01],
];
packEmojis["Ranger Pack"] = "🏹";

packs["Bard Pack"] = [
  ["Lute", "Common", 45.39],
  ["Song of Courage", "Uncommon", 30],
  ["Epic Ballad", "Rare", 15],
  ["Bard King", "Legendary", 8],
  ["Melody Titan", "Mythic", 1],
  ["Rhyme Shade", "Secret", 0.5],
  ["Bard Lord", "Ultra Secret", 0.08],
  ["Bard Prime", "Mystical", 0.02],
  ["Bard Divinity", "Celestial", 0.01],
];
packEmojis["Bard Pack"] = "🪕";

packs["Sorcerer Pack"] = [
  ["Magic Spark", "Common", 45.39],
  ["Fire Bolt", "Uncommon", 30],
  ["Chain Lightning", "Rare", 15],
  ["Sorcerer King", "Legendary", 8],
  ["Arcane Titan", "Mythic", 1],
  ["Mystic Shade", "Secret", 0.5],
  ["Sorcerer Lord", "Ultra Secret", 0.08],
  ["Sorcerer Prime", "Mystical", 0.02],
  ["Sorcerer Divinity", "Celestial", 0.01],
];
packEmojis["Sorcerer Pack"] = "🔮";

packs["Shaman Pack"] = [
  ["Spirit Stone", "Common", 45.39],
  ["Totem Pole", "Uncommon", 30],
  ["Dream Walker", "Rare", 15],
  ["Shaman King", "Legendary", 8],
  ["Ancestral Titan", "Mythic", 1],
  ["Spirit Shade", "Secret", 0.5],
  ["Shaman Lord", "Ultra Secret", 0.08],
  ["Shaman Prime", "Mystical", 0.02],
  ["Shaman Divinity", "Celestial", 0.01],
];
packEmojis["Shaman Pack"] = "🪶";

packs["Oracle Pack"] = [
  ["Crystal Ball", "Common", 45.39],
  ["Third Eye", "Uncommon", 30],
  ["Prophecy", "Rare", 15],
  ["Oracle King", "Legendary", 8],
  ["Vision Titan", "Mythic", 1],
  ["Fate Shade", "Secret", 0.5],
  ["Oracle Lord", "Ultra Secret", 0.08],
  ["Oracle Prime", "Mystical", 0.02],
  ["Oracle Divinity", "Celestial", 0.01],
];
packEmojis["Oracle Pack"] = "🔮";

packs["Minotaur Pack"] = [
  ["Horn Fragment", "Common", 45.39],
  ["Labyrinth Runner", "Uncommon", 30],
  ["Bull Warrior", "Rare", 15],
  ["Minotaur King", "Legendary", 8],
  ["Maze Titan", "Mythic", 1],
  ["Labyrinth Shade", "Secret", 0.5],
  ["Minotaur Lord", "Ultra Secret", 0.08],
  ["Minotaur Prime", "Mystical", 0.02],
  ["Minotaur Divinity", "Celestial", 0.01],
];
packEmojis["Minotaur Pack"] = "🐂";

packs["Hydra Pack"] = [
  ["Hatchling Head", "Common", 45.39],
  ["Twin Necks", "Uncommon", 30],
  ["Five-Headed", "Rare", 15],
  ["Hydra King", "Legendary", 8],
  ["Regeneration Titan", "Mythic", 1],
  ["Swamp Shade", "Secret", 0.5],
  ["Hydra Lord", "Ultra Secret", 0.08],
  ["Hydra Prime", "Mystical", 0.02],
  ["Hydra Divinity", "Celestial", 0.01],
];
packEmojis["Hydra Pack"] = "🐍";

packs["Sphinx Pack"] = [
  ["Sand Cat", "Common", 45.39],
  ["Riddler", "Uncommon", 30],
  ["Guardian", "Rare", 15],
  ["Sphinx King", "Legendary", 8],
  ["Riddle Titan", "Mythic", 1],
  ["Desert Shade", "Secret", 0.5],
  ["Sphinx Lord", "Ultra Secret", 0.08],
  ["Sphinx Prime", "Mystical", 0.02],
  ["Sphinx Divinity", "Celestial", 0.01],
];
packEmojis["Sphinx Pack"] = "🦁";

packs["Kraken Pack"] = [
  ["Tentacle", "Common", 45.39],
  ["Ink Cloud", "Uncommon", 30],
  ["Ship Crusher", "Rare", 15],
  ["Kraken King", "Legendary", 8],
  ["Abyss Titan", "Mythic", 1],
  ["Deep Shade", "Secret", 0.5],
  ["Kraken Lord", "Ultra Secret", 0.08],
  ["Kraken Prime", "Mystical", 0.02],
  ["Kraken Divinity", "Celestial", 0.01],
];
packEmojis["Kraken Pack"] = "🦑";

packs["Gargoyle Pack"] = [
  ["Stone Wing", "Common", 45.39],
  ["Perch Guard", "Uncommon", 30],
  ["Night Watcher", "Rare", 15],
  ["Gargoyle King", "Legendary", 8],
  ["Stone Titan", "Mythic", 1],
  ["Chimera Shade", "Secret", 0.5],
  ["Gargoyle Lord", "Ultra Secret", 0.08],
  ["Gargoyle Prime", "Mystical", 0.02],
  ["Gargoyle Divinity", "Celestial", 0.01],
];
packEmojis["Gargoyle Pack"] = "🗿";

packs["Djinn Pack"] = [
  ["Smoke Ring", "Common", 45.39],
  ["Brass Lamp", "Uncommon", 30],
  ["Wish Granter", "Rare", 15],
  ["Djinn King", "Legendary", 8],
  ["Genie Titan", "Mythic", 1],
  ["Mirage Shade", "Secret", 0.5],
  ["Djinn Lord", "Ultra Secret", 0.08],
  ["Djinn Prime", "Mystical", 0.02],
  ["Djinn Divinity", "Celestial", 0.01],
];
packEmojis["Djinn Pack"] = "🧞";

packs["Vampire Pack"] = [
  ["Fang", "Common", 45.39],
  ["Night Stalker", "Uncommon", 30],
  ["Blood Moon", "Rare", 15],
  ["Vampire King", "Legendary", 8],
  ["Nosferatu Titan", "Mythic", 1],
  ["Coffin Shade", "Secret", 0.5],
  ["Vampire Lord", "Ultra Secret", 0.08],
  ["Vampire Prime", "Mystical", 0.02],
  ["Vampire Divinity", "Celestial", 0.01],
];
packEmojis["Vampire Pack"] = "🧛";

packs["Ghost Pack"] = [
  ["Orb", "Common", 45.39],
  ["Poltergeist", "Uncommon", 30],
  ["Banshee", "Rare", 15],
  ["Ghost King", "Legendary", 8],
  ["Phantom Titan", "Mythic", 1],
  ["Veil Shade", "Secret", 0.5],
  ["Ghost Lord", "Ultra Secret", 0.08],
  ["Ghost Prime", "Mystical", 0.02],
  ["Ghost Divinity", "Celestial", 0.01],
];
packEmojis["Ghost Pack"] = "👻";

packs["Goblin Pack"] = [
  ["Gremlin", "Common", 45.39],
  ["Hobgoblin", "Uncommon", 30],
  ["Goblin Chief", "Rare", 15],
  ["Goblin King", "Legendary", 8],
  ["Horde Titan", "Mythic", 1],
  ["Cave Shade", "Secret", 0.5],
  ["Goblin Lord", "Ultra Secret", 0.08],
  ["Goblin Prime", "Mystical", 0.02],
  ["Goblin Divinity", "Celestial", 0.01],
];
packEmojis["Goblin Pack"] = "👺";

packs["Yeti Pack"] = [
  ["Footprint", "Common", 45.39],
  ["Snow Beast", "Uncommon", 30],
  ["Abominable", "Rare", 15],
  ["Yeti King", "Legendary", 8],
  ["Frost Titan", "Mythic", 1],
  ["Blizzard Shade", "Secret", 0.5],
  ["Yeti Lord", "Ultra Secret", 0.08],
  ["Yeti Prime", "Mystical", 0.02],
  ["Yeti Divinity", "Celestial", 0.01],
];
packEmojis["Yeti Pack"] = "❄️";

packs["Leprechaun Pack"] = [
  ["Four-Leaf Clover", "Common", 45.39],
  ["Pot of Gold", "Uncommon", 30],
  ["Rainbow Walker", "Rare", 15],
  ["Leprechaun King", "Legendary", 8],
  ["Lucky Titan", "Mythic", 1],
  ["Fortune Shade", "Secret", 0.5],
  ["Leprechaun Lord", "Ultra Secret", 0.08],
  ["Leprechaun Prime", "Mystical", 0.02],
  ["Leprechaun Divinity", "Celestial", 0.01],
];
packEmojis["Leprechaun Pack"] = "🍀";

packs["Griffin Pack"] = [
  ["Eagle Wing", "Common", 45.39],
  ["Lion Paw", "Uncommon", 30],
  ["Sky Patrol", "Rare", 15],
  ["Griffin King", "Legendary", 8],
  ["Aerial Titan", "Mythic", 1],
  ["Roost Shade", "Secret", 0.5],
  ["Griffin Lord", "Ultra Secret", 0.08],
  ["Griffin Prime", "Mystical", 0.02],
  ["Griffin Divinity", "Celestial", 0.01],
];
packEmojis["Griffin Pack"] = "🦅";

packs["Basilisk Pack"] = [
  ["Stone Gaze", "Common", 45.39],
  ["Scale Armor", "Uncommon", 30],
  ["Death Stare", "Rare", 15],
  ["Basilisk King", "Legendary", 8],
  ["Petrify Titan", "Mythic", 1],
  ["Serpent Shade", "Secret", 0.5],
  ["Basilisk Lord", "Ultra Secret", 0.08],
  ["Basilisk Prime", "Mystical", 0.02],
  ["Basilisk Divinity", "Celestial", 0.01],
];
packEmojis["Basilisk Pack"] = "🐍";

packs["Chimera Pack"] = [
  ["Lion Head", "Common", 45.39],
  ["Goat Body", "Uncommon", 30],
  ["Serpent Tail", "Rare", 15],
  ["Chimera King", "Legendary", 8],
  ["Hybrid Titan", "Mythic", 1],
  ["Monster Shade", "Secret", 0.5],
  ["Chimera Lord", "Ultra Secret", 0.08],
  ["Chimera Prime", "Mystical", 0.02],
  ["Chimera Divinity", "Celestial", 0.01],
];
packEmojis["Chimera Pack"] = "🐲";

packs["Cyclops Pack"] = [
  ["Boulder", "Common", 45.39],
  ["Club", "Uncommon", 30],
  ["One-Eye Scout", "Rare", 15],
  ["Cyclops King", "Legendary", 8],
  ["Giant Titan", "Mythic", 1],
  ["Cave Shade", "Secret", 0.5],
  ["Cyclops Lord", "Ultra Secret", 0.08],
  ["Cyclops Prime", "Mystical", 0.02],
  ["Cyclops Divinity", "Celestial", 0.01],
];
packEmojis["Cyclops Pack"] = "👁️";

packs["Nymph Pack"] = [
  ["Dewdrop", "Common", 45.39],
  ["Stream Dancer", "Uncommon", 30],
  ["Forest Nymph", "Rare", 15],
  ["Nymph Queen", "Legendary", 8],
  ["Nature Titan", "Mythic", 1],
  ["Glade Shade", "Secret", 0.5],
  ["Nymph Lord", "Ultra Secret", 0.08],
  ["Nymph Prime", "Mystical", 0.02],
  ["Nymph Divinity", "Celestial", 0.01],
];
packEmojis["Nymph Pack"] = "🧚‍♀️";

packs["Chemistry Pack"] = [
  ["Atom", "Common", 45.39],
  ["Molecule", "Uncommon", 30],
  ["Catalyst", "Rare", 15],
  ["Chemistry King", "Legendary", 8],
  ["Reaction Titan", "Mythic", 1],
  ["Element Shade", "Secret", 0.5],
  ["Chemistry Lord", "Ultra Secret", 0.08],
  ["Chemistry Prime", "Mystical", 0.02],
  ["Chemistry Divinity", "Celestial", 0.01],
];
packEmojis["Chemistry Pack"] = "🧪";

packs["Astronomy Pack"] = [
  ["Planetarium", "Common", 45.39],
  ["Telescope Lens", "Uncommon", 30],
  ["Galaxy Cluster", "Rare", 15],
  ["Astronomy King", "Legendary", 8],
  ["Celestial Titan", "Mythic", 1],
  ["Void Shade", "Secret", 0.5],
  ["Astronomy Lord", "Ultra Secret", 0.08],
  ["Astronomy Prime", "Mystical", 0.02],
  ["Astronomy Divinity", "Celestial", 0.01],
];
packEmojis["Astronomy Pack"] = "🌠";

packs["Geology Pack"] = [
  ["Mineral", "Common", 45.39],
  ["Geode", "Uncommon", 30],
  ["Diamond Vein", "Rare", 15],
  ["Geology King", "Legendary", 8],
  ["Tectonic Titan", "Mythic", 1],
  ["Magma Shade", "Secret", 0.5],
  ["Geology Lord", "Ultra Secret", 0.08],
  ["Geology Prime", "Mystical", 0.02],
  ["Geology Divinity", "Celestial", 0.01],
];
packEmojis["Geology Pack"] = "🪨";

packs["Meteorology Pack"] = [
  ["Barometer", "Common", 45.39],
  ["Weather Vane", "Uncommon", 30],
  ["Storm Chaser", "Rare", 15],
  ["Meteorology King", "Legendary", 8],
  ["Forecast Titan", "Mythic", 1],
  ["Climate Shade", "Secret", 0.5],
  ["Meteorology Lord", "Ultra Secret", 0.08],
  ["Meteorology Prime", "Mystical", 0.02],
  ["Meteorology Divinity", "Celestial", 0.01],
];
packEmojis["Meteorology Pack"] = "🌤️";

packs["Botany Pack"] = [
  ["Sprout", "Common", 45.39],
  ["Fern Leaf", "Uncommon", 30],
  ["Redwood", "Rare", 15],
  ["Botany King", "Legendary", 8],
  ["Chlorophyll Titan", "Mythic", 1],
  ["Root Shade", "Secret", 0.5],
  ["Botany Lord", "Ultra Secret", 0.08],
  ["Botany Prime", "Mystical", 0.02],
  ["Botany Divinity", "Celestial", 0.01],
];
packEmojis["Botany Pack"] = "🌱";

packs["Paleontology Pack"] = [
  ["Fossil Fragment", "Common", 45.39],
  ["Amber", "Uncommon", 30],
  ["Complete Skeleton", "Rare", 15],
  ["Paleo King", "Legendary", 8],
  ["Excavation Titan", "Mythic", 1],
  ["Sediment Shade", "Secret", 0.5],
  ["Paleontology Lord", "Ultra Secret", 0.08],
  ["Paleontology Prime", "Mystical", 0.02],
  ["Paleontology Divinity", "Celestial", 0.01],
];
packEmojis["Paleontology Pack"] = "🦴";

packs["VR Pack"] = [
  ["Headset", "Common", 45.39],
  ["Controller", "Uncommon", 30],
  ["Virtual World", "Rare", 15],
  ["VR King", "Legendary", 8],
  ["Matrix Titan", "Mythic", 1],
  ["Render Shade", "Secret", 0.5],
  ["VR Lord", "Ultra Secret", 0.08],
  ["VR Prime", "Mystical", 0.02],
  ["VR Divinity", "Celestial", 0.01],
];
packEmojis["VR Pack"] = "🥽";

packs["3D Print Pack"] = [
  ["Filament", "Common", 45.39],
  ["Layer Print", "Uncommon", 30],
  ["Prototype", "Rare", 15],
  ["Print King", "Legendary", 8],
  ["Additive Titan", "Mythic", 1],
  ["Nozzle Shade", "Secret", 0.5],
  ["3D Print Lord", "Ultra Secret", 0.08],
  ["3D Print Prime", "Mystical", 0.02],
  ["3D Print Divinity", "Celestial", 0.01],
];
packEmojis["3D Print Pack"] = "🖨️";

packs["Drone Pack"] = [
  ["Propeller", "Common", 45.39],
  ["FPV Goggles", "Uncommon", 30],
  ["Racing Drone", "Rare", 15],
  ["Drone King", "Legendary", 8],
  ["Aerial Titan", "Mythic", 1],
  ["Signal Shade", "Secret", 0.5],
  ["Drone Lord", "Ultra Secret", 0.08],
  ["Drone Prime", "Mystical", 0.02],
  ["Drone Divinity", "Celestial", 0.01],
];
packEmojis["Drone Pack"] = "🛩️";

packs["Solar Pack"] = [
  ["Solar Cell", "Common", 45.39],
  ["Panel Array", "Uncommon", 30],
  ["Solar Farm", "Rare", 15],
  ["Solar King", "Legendary", 8],
  ["Photon Titan", "Mythic", 1],
  ["UV Shade", "Secret", 0.5],
  ["Solar Lord", "Ultra Secret", 0.08],
  ["Solar Prime", "Mystical", 0.02],
  ["Solar Divinity", "Celestial", 0.01],
];
packEmojis["Solar Pack"] = "☀️";

packs["Wind Power Pack"] = [
  ["Breeze", "Common", 45.39],
  ["Windmill", "Uncommon", 30],
  ["Turbine Farm", "Rare", 15],
  ["Wind King", "Legendary", 8],
  ["Gust Titan", "Mythic", 1],
  ["Cyclone Shade", "Secret", 0.5],
  ["Wind Lord", "Ultra Secret", 0.08],
  ["Wind Prime", "Mystical", 0.02],
  ["Wind Divinity", "Celestial", 0.01],
];
packEmojis["Wind Power Pack"] = "💨";

packs["Battery Pack"] = [
  ["AA Cell", "Common", 45.39],
  ["Lithium Ion", "Uncommon", 30],
  ["Power Wall", "Rare", 15],
  ["Battery King", "Legendary", 8],
  ["Energy Titan", "Mythic", 1],
  ["Charge Shade", "Secret", 0.5],
  ["Battery Lord", "Ultra Secret", 0.08],
  ["Battery Prime", "Mystical", 0.02],
  ["Battery Divinity", "Celestial", 0.01],
];
packEmojis["Battery Pack"] = "🔋";

packs["Microscope Pack"] = [
  ["Slide", "Common", 45.39],
  ["Cell Sample", "Uncommon", 30],
  ["Microbe", "Rare", 15],
  ["Micro King", "Legendary", 8],
  ["Nano Titan", "Mythic", 1],
  ["Lens Shade", "Secret", 0.5],
  ["Microscope Lord", "Ultra Secret", 0.08],
  ["Microscope Prime", "Mystical", 0.02],
  ["Microscope Divinity", "Celestial", 0.01],
];
packEmojis["Microscope Pack"] = "🔬";

packs["Magnet Pack"] = [
  ["Iron Filing", "Common", 45.39],
  ["Bar Magnet", "Uncommon", 30],
  ["Electromagnet", "Rare", 15],
  ["Magnet King", "Legendary", 8],
  ["Polar Titan", "Mythic", 1],
  ["Field Shade", "Secret", 0.5],
  ["Magnet Lord", "Ultra Secret", 0.08],
  ["Magnet Prime", "Mystical", 0.02],
  ["Magnet Divinity", "Celestial", 0.01],
];
packEmojis["Magnet Pack"] = "🧲";

packs["Compass Pack"] = [
  ["Needle", "Common", 45.39],
  ["Rose Compass", "Uncommon", 30],
  ["Gyroscope", "Rare", 15],
  ["Navigator King", "Legendary", 8],
  ["Direction Titan", "Mythic", 1],
  ["North Shade", "Secret", 0.5],
  ["Compass Lord", "Ultra Secret", 0.08],
  ["Compass Prime", "Mystical", 0.02],
  ["Compass Divinity", "Celestial", 0.01],
];
packEmojis["Compass Pack"] = "🧭";

packs["Clock Tower Pack"] = [
  ["Pendulum", "Common", 45.39],
  ["Gear Train", "Uncommon", 30],
  ["Bell Tower", "Rare", 15],
  ["Clock Tower King", "Legendary", 8],
  ["Time Titan", "Mythic", 1],
  ["Midnight Shade", "Secret", 0.5],
  ["Clock Tower Lord", "Ultra Secret", 0.08],
  ["Clock Tower Prime", "Mystical", 0.02],
  ["Clock Tower Divinity", "Celestial", 0.01],
];
packEmojis["Clock Tower Pack"] = "🕰️";

packs["Radio Pack"] = [
  ["Antenna Wire", "Common", 45.39],
  ["AM Signal", "Uncommon", 30],
  ["FM Broadcast", "Rare", 15],
  ["Radio King", "Legendary", 8],
  ["Frequency Titan", "Mythic", 1],
  ["Static Shade", "Secret", 0.5],
  ["Radio Lord", "Ultra Secret", 0.08],
  ["Radio Prime", "Mystical", 0.02],
  ["Radio Divinity", "Celestial", 0.01],
];
packEmojis["Radio Pack"] = "📻";

packs["Camera Pack"] = [
  ["Lens Cap", "Common", 45.39],
  ["Film Roll", "Uncommon", 30],
  ["SLR", "Rare", 15],
  ["Camera King", "Legendary", 8],
  ["Shutter Titan", "Mythic", 1],
  ["Focus Shade", "Secret", 0.5],
  ["Camera Lord", "Ultra Secret", 0.08],
  ["Camera Prime", "Mystical", 0.02],
  ["Camera Divinity", "Celestial", 0.01],
];
packEmojis["Camera Pack"] = "📷";

packs["Thermometer Pack"] = [
  ["Mercury Drop", "Common", 45.39],
  ["Digital Read", "Uncommon", 30],
  ["Infrared", "Rare", 15],
  ["Thermo King", "Legendary", 8],
  ["Heat Titan", "Mythic", 1],
  ["Fever Shade", "Secret", 0.5],
  ["Thermometer Lord", "Ultra Secret", 0.08],
  ["Thermometer Prime", "Mystical", 0.02],
  ["Thermometer Divinity", "Celestial", 0.01],
];
packEmojis["Thermometer Pack"] = "🌡️";

packs["Electricity Pack"] = [
  ["Static Ball", "Common", 45.39],
  ["Tesla Coil", "Uncommon", 30],
  ["Lightning Rod", "Rare", 15],
  ["Volt King", "Legendary", 8],
  ["Current Titan", "Mythic", 1],
  ["Arc Shade", "Secret", 0.5],
  ["Electricity Lord", "Ultra Secret", 0.08],
  ["Electricity Prime", "Mystical", 0.02],
  ["Electricity Divinity", "Celestial", 0.01],
];
packEmojis["Electricity Pack"] = "⚡";

packs["Atom Pack"] = [
  ["Proton", "Common", 45.39],
  ["Neutron", "Uncommon", 30],
  ["Electron Cloud", "Rare", 15],
  ["Atom King", "Legendary", 8],
  ["Fusion Titan", "Mythic", 1],
  ["Fission Shade", "Secret", 0.5],
  ["Atom Lord", "Ultra Secret", 0.08],
  ["Atom Prime", "Mystical", 0.02],
  ["Atom Divinity", "Celestial", 0.01],
];
packEmojis["Atom Pack"] = "⚛️";

packs["DNA Pack"] = [
  ["Nucleotide", "Common", 45.39],
  ["Double Helix", "Uncommon", 30],
  ["Gene Splice", "Rare", 15],
  ["DNA King", "Legendary", 8],
  ["Genome Titan", "Mythic", 1],
  ["Mutation Shade", "Secret", 0.5],
  ["DNA Lord", "Ultra Secret", 0.08],
  ["DNA Prime", "Mystical", 0.02],
  ["DNA Divinity", "Celestial", 0.01],
];
packEmojis["DNA Pack"] = "🧬";

packs["Fossil Pack"] = [
  ["Trilobite", "Common", 45.39],
  ["Ammonite", "Uncommon", 30],
  ["Raptor Claw", "Rare", 15],
  ["Fossil King", "Legendary", 8],
  ["Amber Titan", "Mythic", 1],
  ["Petrified Shade", "Secret", 0.5],
  ["Fossil Lord", "Ultra Secret", 0.08],
  ["Fossil Prime", "Mystical", 0.02],
  ["Fossil Divinity", "Celestial", 0.01],
];
packEmojis["Fossil Pack"] = "🦕";

packs["Volcano Science Pack"] = [
  ["Seismograph", "Common", 45.39],
  ["Lava Sample", "Uncommon", 30],
  ["Pyroclastic Flow", "Rare", 15],
  ["Volcanologist King", "Legendary", 8],
  ["Eruption Titan", "Mythic", 1],
  ["Ash Cloud Shade", "Secret", 0.5],
  ["Volcano Science Lord", "Ultra Secret", 0.08],
  ["Volcano Science Prime", "Mystical", 0.02],
  ["Volcano Science Divinity", "Celestial", 0.01],
];
packEmojis["Volcano Science Pack"] = "🌋";

packs["Space Probe Pack"] = [
  ["Solar Panel", "Common", 45.39],
  ["Antenna Dish", "Uncommon", 30],
  ["Voyager", "Rare", 15],
  ["Probe King", "Legendary", 8],
  ["Deep Space Titan", "Mythic", 1],
  ["Void Shade", "Secret", 0.5],
  ["Space Probe Lord", "Ultra Secret", 0.08],
  ["Space Probe Prime", "Mystical", 0.02],
  ["Space Probe Divinity", "Celestial", 0.01],
];
packEmojis["Space Probe Pack"] = "🛰️";

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

// === Add Divine rarity (0.005%) to all existing packs ===
const divineNames: Record<string, string> = {
  "Wise School Pack": "Wildcats",
  "Spooky Pack": "Soul Reaper Supreme",
  "Ocean Pack": "Poseidon Ascended",
  "Space Pack": "Cosmic Singularity",
  "Fantasy Pack": "Fate Weaver",
  "Cyber Pack": "Sentient Nexus",
  "Jungle Pack": "Gaia Incarnate",
  "Winter Pack": "Absolute Zero",
  "Desert Pack": "Eternal Sands",
  "Volcano Pack": "Magma Godform",
  "Candy Pack": "Sugar Godform",
  "Toy Pack": "Toy Godform",
  "Music Pack": "Symphony Eternal",
  "Penguin Pack": "Penguin Godform",
  "Dragon Pack": "Dragon Godform",
  "Phoenix Pack": "Phoenix Godform",
  "Angel Pack": "Seraph Supreme",
  "Demon Pack": "Demon Godform",
  "Titan Pack": "Titan Godform",
};

Object.keys(packs).forEach((packName) => {
  const items = packs[packName];
  const dName = divineNames[packName] || packName.replace(" Pack", "") + " Godform";
  // Reduce Common chance by 0.005 to make room for Divine
  items[0] = [items[0][0], items[0][1], +(items[0][2] - 0.005).toFixed(3)];
  items.push([dName, "Divine" as Rarity, 0.005]);
});

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
