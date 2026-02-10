#!/usr/bin/env node

// Daily Arklet News Generator
// Fetches real headlines, generates 6 funny Arklet-themed articles via Claude API,
// appends them to newsData.ts, and rebuilds the app.

const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

// Load API key
const envPath = path.join(process.env.HOME, ".env.news");
const envContent = fs.readFileSync(envPath, "utf-8");
const API_KEY = envContent.match(/ANTHROPIC_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) {
  console.error("No ANTHROPIC_API_KEY found in ~/.env.news");
  process.exit(1);
}

const NEWS_FILE = path.join(__dirname, "..", "src", "data", "newsData.ts");

// Format today's date as "Mon DD, YYYY"
function getTodayFormatted() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date();
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Get the next article ID by reading newsData.ts
function getNextId() {
  const content = fs.readFileSync(NEWS_FILE, "utf-8");
  const ids = [...content.matchAll(/id:\s*"(\d+)"/g)].map(m => parseInt(m[1]));
  return Math.max(...ids, 0) + 1;
}

// Fetch real headlines from Google News RSS
function fetchRealHeadlines() {
  return new Promise((resolve, reject) => {
    https.get("https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        const titles = [...data.matchAll(/<title><!\[CDATA\[(.+?)\]\]><\/title>/g)]
          .map(m => m[1])
          .filter(t => t !== "Google News")
          .slice(0, 15);
        // Fallback: also try non-CDATA titles
        if (titles.length < 5) {
          const fallback = [...data.matchAll(/<title>([^<]+)<\/title>/g)]
            .map(m => m[1])
            .filter(t => t !== "Google News" && !titles.includes(t))
            .slice(0, 15);
          titles.push(...fallback);
        }
        resolve(titles.slice(0, 15));
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Call Claude API
function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
            return;
          }
          resolve(parsed.content[0].text);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.slice(0, 500)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting daily news generation...`);

  const today = getTodayFormatted();
  const nextId = getNextId();
  console.log(`Date: ${today}, Next ID: ${nextId}`);

  // Fetch real headlines
  let headlines = [];
  try {
    headlines = await fetchRealHeadlines();
    console.log(`Fetched ${headlines.length} real headlines`);
  } catch (e) {
    console.warn("Could not fetch headlines, will generate without them:", e.message);
  }

  const headlineList = headlines.length > 0
    ? `Here are today's real top news headlines for inspiration:\n${headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}`
    : "Generate articles inspired by plausible current events.";

  const prompt = `You write satirical news articles for a web game called "Arklet" (formerly "Blooket" style). Players open packs to collect items called "Arks" of various rarities: Common, Uncommon, Rare, Epic, Legendary, Mythic, Celestial, Divine (rarest). Players can trade arks, compete in multiplayer games, and climb leaderboards.

Today's date: ${today}

${headlineList}

Generate exactly 6 funny satirical news articles for today:
- Articles 1-3: Inspired by REAL news headlines above, but twisted into Arklet-themed satire. The connection to the real story should be recognizable but the Arklet spin should be absurd and funny.
- Articles 4-6: Based on fictional celebrities playing Arklet OR fictional user stories. Make these hilarious.

For each article, provide a JSON object with these fields:
- emoji: a single relevant emoji
- title: catchy, funny headline (under 80 chars)
- author: a funny fake publication name
- category: one of "Celebrity", "Player", "Trending", "Tech", "Entertainment"
- content: 2-3 sentences of satirical content. Be genuinely funny — use absurd escalation, irony, and unexpected twists.

IMPORTANT RULES:
- Do NOT include any articles based on political, geopolitical, or boring/dry topics. Skip any real headlines about politics, elections, government, wars, international relations, economics, finance, legal rulings, or anything kids would find boring. ONLY use headlines about sports, entertainment, tech, gaming, celebrities, viral trends, funny/weird stories, and other topics that kids and teens would find exciting and entertaining.
- Return ONLY a valid JSON array of 6 objects, no markdown, no explanation. Example format:
[{"emoji":"x","title":"x","author":"x","category":"x","content":"x"}]`;

  console.log("Calling Claude API...");
  const response = await callClaude(prompt);

  // Parse the JSON response
  let articles;
  try {
    // Try to extract JSON array from response (in case there's extra text)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");
    articles = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse Claude response:", e.message);
    console.error("Raw response:", response.slice(0, 1000));
    process.exit(1);
  }

  if (!Array.isArray(articles) || articles.length !== 6) {
    console.error(`Expected 6 articles, got ${articles?.length}`);
    process.exit(1);
  }

  // Build the TypeScript entries
  const entries = articles.map((a, i) => {
    const id = nextId + i;
    const escaped = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
    return `  {
    id: "${id}",
    emoji: "${escaped(a.emoji)}",
    title: "${escaped(a.title)}",
    author: "${escaped(a.author)}",
    date: "${today}",
    category: "${escaped(a.category)}",
    content:
      "${escaped(a.content)}",
  }`;
  });

  // Read current file and insert before the closing ];
  let fileContent = fs.readFileSync(NEWS_FILE, "utf-8");
  const insertPoint = fileContent.lastIndexOf("];");
  if (insertPoint === -1) {
    console.error("Could not find ]; in newsData.ts");
    process.exit(1);
  }

  const newContent =
    fileContent.slice(0, insertPoint) +
    entries.map(e => e + ",\n").join("") +
    fileContent.slice(insertPoint);

  fs.writeFileSync(NEWS_FILE, newContent, "utf-8");
  console.log(`Appended ${articles.length} articles to newsData.ts`);

  // Rebuild
  console.log("Rebuilding app...");
  try {
    execSync("npx vite build", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      timeout: 180000,
    });
    console.log("Build complete!");
  } catch (e) {
    console.error("Build failed:", e.message);
    process.exit(1);
  }

  console.log(`[${new Date().toISOString()}] Done! Added ${articles.length} articles for ${today}`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
