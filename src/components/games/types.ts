import { Rarity } from "@/data/gameData";

export interface GameResult {
  score: number;
  maxScore: number;
  normalizedScore: number; // 0-1
  gameId?: string;
}

export interface ArcadeProgress {
  nickname: string;
  gameName: string;
  score: number;
  status: "playing" | "finished";
}

export interface MiniGameProps {
  onGameEnd: (result: GameResult) => void;
  onExit: () => void;
  onProgressUpdate?: (progress: ArcadeProgress) => void;
  onScoreChange?: (score: number) => void;
}

export interface ArcadeReward {
  itemName: string;
  rarity: Rarity;
  packName: string;
}

export interface GameMeta {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const GAME_LIST: GameMeta[] = [
  { id: "snake", name: "Snek No Steppy", emoji: "🐍", description: "One more apple... just one mo— OH NO", color: "from-green-500 to-lime-600" },
  { id: "whackamole", name: "Emotional Support Bonker", emoji: "🔨", description: "Therapy is expensive, bonking moles is free", color: "from-amber-500 to-yellow-600" },
  { id: "helicopter", name: "Gravity Is A Suggestion", emoji: "🚁", description: "Fly like nobody's watching (the walls)", color: "from-sky-500 to-blue-600" },
  { id: "bloons", name: "Pop Goes My Sanity", emoji: "🎈", description: "Balloons never asked for this violence", color: "from-red-400 to-pink-500" },
  { id: "reaction", name: "Blink And You Lose", emoji: "⚡", description: "Your reflexes vs your overconfidence", color: "from-yellow-400 to-orange-500" },
  { id: "kittencannon", name: "YEET The Kitten", emoji: "🐱", description: "No cats were harmed (they loved it)", color: "from-orange-400 to-red-500" },
  { id: "zombocalypse", name: "Undead Middle Management", emoji: "🧟", description: "Zombies want brains, you want points", color: "from-green-700 to-gray-800" },
  { id: "brickbreaker", name: "Rage Against The Bricks", emoji: "🧱", description: "Every brick personally insulted you", color: "from-purple-500 to-pink-600" },
  { id: "monkeyslap", name: "Return To Monke (Slap)", emoji: "🐵", description: "Evolution peaked at slapping speed", color: "from-yellow-600 to-amber-700" },
  { id: "tanks", name: "Kaboom Or Be Kaboomed", emoji: "💥", description: "Diplomacy was never an option", color: "from-green-600 to-emerald-600" },
  { id: "pinchhitter", name: "Touch Grass (Baseball)", emoji: "⚾", description: "Swing like your WiFi depends on it", color: "from-red-500 to-rose-600" },
  { id: "typing", name: "Angry Keyboard Noises", emoji: "⌨️", description: "Type so fast your keyboard files a complaint", color: "from-gray-500 to-slate-600" },
  { id: "math", name: "Math Speedrun Any%", emoji: "🔢", description: "Your calculator is crying right now", color: "from-blue-600 to-cyan-600" },
  { id: "raftwars", name: "Splash Damage Only", emoji: "💦", description: "Getting wet is not optional", color: "from-blue-400 to-teal-500" },
  { id: "impossiblequiz", name: "IQ Test (Gone Wrong)", emoji: "🧠", description: "The questions make sense... to someone", color: "from-violet-500 to-purple-600" },
  { id: "colormatch", name: "My Eyes Are Lying", emoji: "🌈", description: "Your brain and your eyes are in a fight", color: "from-pink-500 to-purple-500" },
  { id: "miniputt", name: "Smol Ball Big Dreams", emoji: "⛳", description: "Mini golf, maximum rage", color: "from-emerald-500 to-teal-600" },
  { id: "memory", name: "Goldfish Memory Deluxe", emoji: "🃏", description: "Wait, which card was... nevermind", color: "from-indigo-500 to-blue-600" },
  { id: "bowman", name: "Stick Man Had It Coming", emoji: "🏹", description: "Arrows go brrrrr", color: "from-amber-600 to-orange-600" },
  { id: "pattern", name: "Simon Says Get Rekt", emoji: "🔴", description: "Your memory after round 5: 404", color: "from-red-500 to-orange-500" },
  { id: "dragracer", name: "Fast & Curious", emoji: "🏎️", description: "Shift gears or shift blame", color: "from-red-600 to-yellow-500" },
  { id: "effingworms", name: "Worm With An Attitude", emoji: "🪱", description: "Eat the entire food chain", color: "from-pink-700 to-rose-800" },
  { id: "bubblespinner", name: "Pop Therapy Session", emoji: "🫧", description: "Like bubble wrap but competitive", color: "from-cyan-400 to-blue-500" },
  { id: "towerstack", name: "Jenga But Make It Stressful", emoji: "🏗️", description: "One pixel off and it's all over", color: "from-indigo-500 to-violet-600" },
  { id: "speedbuilder", name: "IKEA Speedrun", emoji: "🔧", description: "Build it from memory, no manual", color: "from-orange-500 to-amber-600" },
  { id: "ghosthunter", name: "Casper's Worst Nightmare", emoji: "👻", description: "These ghosts regret showing up", color: "from-purple-700 to-slate-900" },
  { id: "rocketgoal", name: "GOOOOOAL (x100)", emoji: "⚽", description: "The keeper has a family, you monster", color: "from-green-600 to-emerald-700" },
  { id: "kartdash", name: "Mario Kart At Home", emoji: "🏎️", description: "We have Mario Kart at home:", color: "from-red-500 to-orange-600" },
  { id: "targetblitz", name: "Aim Assist Not Included", emoji: "🎯", description: "Click heads, ask questions never", color: "from-green-800 to-gray-900" },
  { id: "eggtoss", name: "Eggcelent Trajectory", emoji: "🥚", description: "Physics degree finally paying off", color: "from-sky-400 to-blue-500" },
  { id: "zonerunner", name: "The Floor Is Lava (But Worse)", emoji: "🔵", description: "Stay inside or perish dramatically", color: "from-blue-700 to-purple-800" },
  { id: "gardenrush", name: "Farmville Panic Mode", emoji: "🌻", description: "Harvest or the weeds win", color: "from-green-500 to-amber-600" },
  { id: "mineclicker", name: "Minecraft But Just Punching", emoji: "⛏️", description: "Click rocks, find shiny things, repeat", color: "from-stone-600 to-slate-800" },
];
