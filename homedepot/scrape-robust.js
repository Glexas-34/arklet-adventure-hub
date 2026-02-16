const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// ===== STORE LIST =====
const stores = [
  { num: 6644, address: "7870 Van Nuys Blvd, Panorama City, CA 91402", city: "Panorama City", distance: 4.0 },
  { num: 6613, address: "11600 Sherman Way, North Hollywood, CA 91605", city: "North Hollywood", distance: 4.9 },
  { num: 6661, address: "16800 Roscoe Blvd, Van Nuys, CA 91406", city: "Van Nuys", distance: 5.2 },
  { num: 6632, address: "6345 Variel Ave, Woodland Hills, CA 91367", city: "Woodland Hills", distance: 8.5 },
  { num: 6654, address: "1200 Flower Street, Burbank, CA 91502", city: "Burbank", distance: 8.7 },
  { num: 6616, address: "5600 Sunset Blvd, Hollywood, CA 90028", city: "Hollywood", distance: 8.9 },
  { num: 612, address: "21218 Roscoe Blvd, Canoga Park, CA 91304", city: "Canoga Park", distance: 9.3 },
  { num: 609, address: "12960 Foothill Blvd, San Fernando, CA 91340", city: "San Fernando", distance: 9.7 },
  { num: 1070, address: "22855 Victory Blvd, West Hills, CA 91307", city: "West Hills", distance: 10.3 },
  { num: 649, address: "5040 San Fernando Rd, Glendale, CA 91204", city: "Glendale", distance: 10.4 },
  { num: 1048, address: "1675 Wilshire Blvd, Los Angeles, CA 90017", city: "Los Angeles (Wilshire)", distance: 12.4 },
  { num: 1061, address: "4925 W Slauson Ave, Los Angeles, CA 90056", city: "Los Angeles (Slauson)", distance: 12.6 },
  { num: 6689, address: "2055 N Figueroa St, Los Angeles, CA 90065", city: "Los Angeles (Figueroa)", distance: 13.8 },
  { num: 6855, address: "8801 S La Cienega Blvd, Inglewood, CA 90301", city: "Inglewood (La Cienega)", distance: 14.5 },
  { num: 1010, address: "3363 Century Blvd, Inglewood, CA 90303", city: "Inglewood (Century)", distance: 15.2 },
  { num: 1002, address: "3040 Slauson Ave, Huntington Park, CA 90255", city: "Huntington Park", distance: 16.5 },
  { num: 653, address: "20642 Golden Triangle Rd, Santa Clarita, CA 91351", city: "Santa Clarita (Golden Triangle)", distance: 22.1 },
  { num: 6610, address: "500 S Marengo Ave, Alhambra, CA 91803", city: "Alhambra", distance: 17.2 },
  { num: 6037, address: "2881 E. Walnut Street, Pasadena, CA 91107", city: "Pasadena", distance: 16.8 },
  { num: 1055, address: "28033 Newhall Ranch Rd, Santa Clarita, CA 91355", city: "Santa Clarita (Newhall)", distance: 24.5 },
  { num: 6640, address: "575 Cochran St, Simi Valley, CA 93065", city: "Simi Valley", distance: 24.8 },
  { num: 654, address: "7015 Telegraph Rd, Commerce, CA 90040", city: "Commerce", distance: 18.3 },
  { num: 2304, address: "3500 Market Place, Monterey Park, CA 91755", city: "Monterey Park", distance: 17.5 },
  { num: 611, address: "740 182nd St, Gardena, CA 90248", city: "Gardena", distance: 19.8 },
  { num: 6627, address: "7121 Firestone Blvd, Downey, CA 90241", city: "Downey", distance: 17.9 },
];

// ===== CONFIGURATION =====
const PROGRESS_FILE = path.join(__dirname, 'scrape-progress.json');
const OUTPUT_FILE = path.join(__dirname, 'deals-data.json');
const OUTPUT_FILE_ALL = path.join(__dirname, 'deals-data-all.json');
const VPN_AUTH_FILE = '/home/pi/arklet/nordvpn-auth.txt';
const VPN_CONFIGS = [
  '/home/pi/arklet/us5063.nordvpn.com.udp.ovpn',
  '/home/pi/arklet/us8563.nordvpn.com.udp.ovpn',
  '/home/pi/arklet/us5063.nordvpn.com.tcp.ovpn',
  '/home/pi/arklet/us8563.nordvpn.com.tcp.ovpn',
];
const TARGET_IPS = ['216.150.16.1', '216.150.16.193'];

// Delays (ms) - generous to avoid detection
const DELAY_BETWEEN_PAGES_MIN = 3000;
const DELAY_BETWEEN_PAGES_MAX = 7000;
const DELAY_BETWEEN_STORES_MIN = 8000;
const DELAY_BETWEEN_STORES_MAX = 15000;
const DELAY_AFTER_BLOCK = 60000;
const VPN_ROTATE_EVERY_N_STORES = 8; // Rotate VPN every N stores

// User agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
];

// ===== HELPERS =====
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const randomDelay = (min, max) => sleep(min + Math.floor(Math.random() * (max - min)));
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
const log = (msg) => {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`[${ts}] ${msg}`);
};

// ===== VPN MANAGEMENT =====
let currentVpnConfig = -1;
let vpnProcess = null;

function killVpn() {
  try {
    execSync('sudo killall openvpn 2>/dev/null', { stdio: 'ignore' });
  } catch (e) {}
  vpnProcess = null;
  // Wait for tun to go down
  for (let i = 0; i < 10; i++) {
    try {
      execSync('ip link show tun0 2>/dev/null', { stdio: 'ignore' });
      execSync('sleep 1');
    } catch {
      break; // tun0 is gone
    }
  }
}

function connectVpn(configIdx) {
  killVpn();
  const config = VPN_CONFIGS[configIdx % VPN_CONFIGS.length];
  log(`VPN: Connecting via ${path.basename(config)}...`);

  try {
    // Start openvpn with split tunneling (--route-nopull preserves default route/SSH)
    execSync(
      `sudo openvpn --config "${config}" --auth-user-pass "${VPN_AUTH_FILE}" ` +
      `--route-nopull --daemon --log /tmp/openvpn.log --writepid /tmp/openvpn.pid`,
      { stdio: 'inherit', timeout: 15000 }
    );

    // Wait for tun0 to come up (max 30s)
    let connected = false;
    for (let i = 0; i < 30; i++) {
      try {
        execSync('ip link show tun0 2>/dev/null', { stdio: 'ignore' });
        connected = true;
        break;
      } catch {
        execSync('sleep 1');
      }
    }

    if (!connected) {
      log('VPN: tun0 did not come up. Checking log...');
      try {
        const vpnLog = execSync('tail -20 /tmp/openvpn.log').toString();
        log(`VPN log:\n${vpnLog}`);
      } catch (e) {}
      return false;
    }

    // Add routes for rebelsavings.com through VPN tunnel
    for (const ip of TARGET_IPS) {
      try {
        execSync(`sudo ip route add ${ip}/32 dev tun0 2>/dev/null`, { stdio: 'ignore' });
      } catch (e) {} // May already exist
    }

    // Verify the route
    const myIp = getPublicIp();
    log(`VPN: Connected! tun0 is up. Public IP for target: routing through VPN`);
    return true;
  } catch (e) {
    log(`VPN: Connection failed: ${e.message}`);
    return false;
  }
}

function rotateVpn() {
  currentVpnConfig++;
  return connectVpn(currentVpnConfig);
}

function getPublicIp() {
  try {
    return execSync('curl -s --max-time 5 https://api.ipify.org 2>/dev/null').toString().trim();
  } catch {
    return 'unknown';
  }
}

// ===== PROGRESS MANAGEMENT =====
function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return { completedStores: {}, startedAt: new Date().toISOString() };
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function saveResults(allStoreData) {
  allStoreData.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  const json = JSON.stringify(allStoreData, null, 2);
  fs.writeFileSync(OUTPUT_FILE, json);
  fs.writeFileSync(OUTPUT_FILE_ALL, json);
}

// ===== MAIN SCRAPER =====
(async () => {
  const useVpn = process.argv.includes('--vpn');
  const resumeMode = process.argv.includes('--resume');

  log('=== Home Depot Robust Scraper ===');
  log(`VPN mode: ${useVpn ? 'ENABLED' : 'disabled'}`);
  log(`Resume mode: ${resumeMode ? 'ENABLED' : 'fresh start'}`);
  log(`Stores to scrape: ${stores.length}`);

  // Load previous progress if resuming
  let progress = resumeMode ? loadProgress() : { completedStores: {}, startedAt: new Date().toISOString() };

  // Connect VPN if requested
  if (useVpn) {
    const vpnOk = rotateVpn();
    if (!vpnOk) {
      log('WARNING: VPN connection failed. Proceeding without VPN.');
    }
  }

  // Delete old browser profile for fresh session
  const userDataDir = '/tmp/puppeteer-robust-profile';
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  const ua = randomUA();
  log(`Using User-Agent: ${ua.slice(0, 60)}...`);

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    userDataDir,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--window-size=1920,1080',
    ]
  });

  let page = await browser.newPage();

  // Comprehensive stealth
  await page.evaluateOnNewDocument(() => {
    // Hide webdriver
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    // Fake plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5].map(() => ({ length: 1 }))
    });
    // Fake languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en']
    });
    // Chrome runtime
    window.chrome = { runtime: {} };
    // Permission query
    const origQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (params) =>
      params.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : origQuery(params);
    // WebGL vendor
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(p) {
      if (p === 37445) return 'Intel Inc.';
      if (p === 37446) return 'Intel Iris OpenGL Engine';
      return getParam.call(this, p);
    };
  });

  await page.setUserAgent(ua);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  });

  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to site
  log('Loading rebelsavings.com...');
  await page.goto('https://rebelsavings.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(8000);

  const pageTitle = await page.title();
  const pageUrl = page.url();
  log(`Page loaded: "${pageTitle}" at ${pageUrl}`);

  // Handle security checkpoints
  if (pageTitle.includes('Just a moment') || pageTitle.includes('Checking') || pageTitle.includes('Security') || pageTitle.includes('Vercel')) {
    log('Security checkpoint detected, waiting 30s...');
    await sleep(30000);
    const newTitle = await page.title();
    log(`After wait: "${newTitle}"`);

    if (newTitle.includes('Just a moment') || newTitle.includes('Checking')) {
      log('Still blocked. Will try VPN rotation...');
      if (useVpn) {
        rotateVpn();
        await sleep(5000);
        await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
        await sleep(10000);
      }
    }
  }

  // Test API
  log('Testing API...');
  let apiWorking = false;
  for (let testAttempt = 1; testAttempt <= 5; testAttempt++) {
    const test = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            retailer: "hd", sortBy: "dateAdded:desc", filterBy: "stock:>0",
            page: 1, query: "*", perPage: 1
          })
        });
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          return { status: res.status, found: data.found, hasError: !!data.error, raw: text.slice(0, 500) };
        } catch {
          return { status: res.status, hasError: true, raw: text.slice(0, 500) };
        }
      } catch (e) {
        return { hasError: true, raw: e.message };
      }
    });

    log(`API test ${testAttempt}: status=${test.status}, found=${test.found}, error=${test.hasError}`);
    if (test.hasError) log(`  Response: ${test.raw}`);

    if (!test.hasError && test.found !== undefined) {
      log(`API working! Total deals in system: ${test.found}`);
      apiWorking = true;
      break;
    }

    if (testAttempt < 5) {
      log(`Waiting 15s before retry...`);
      await sleep(15000);
    }
  }

  if (!apiWorking) {
    log('API NOT WORKING after all retries. Exiting.');
    await browser.close();
    if (useVpn) killVpn();
    process.exit(1);
  }

  // Fetch a single page with comprehensive retry logic
  async function fetchPage(payload, maxRetries = 8) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await page.evaluate(async (p) => {
          try {
            const res = await fetch('/api/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(p)
            });
            const text = await res.text();
            try {
              const data = JSON.parse(text);
              return { status: res.status, ...data };
            } catch {
              return { status: res.status, error: { code: String(res.status) }, raw: text.slice(0, 300) };
            }
          } catch (e) {
            return { error: { code: 'network', message: e.message } };
          }
        }, payload);

        // Check for rate limit
        if (result.error) {
          const code = result.error.code;
          if (code === '429' || code === '503' || code === '502') {
            const backoff = Math.min(attempt * 8000, 60000) + Math.random() * 5000;
            log(`    Rate limited (${code}). Backoff ${(backoff/1000).toFixed(1)}s (attempt ${attempt}/${maxRetries})...`);
            await sleep(backoff);
            continue;
          }
          if (code === '403') {
            log(`    Forbidden (403). May need VPN rotation.`);
            return { hits: [], blocked: true };
          }
        }

        return result;
      } catch (e) {
        log(`    Page evaluate error: ${e.message}. Retrying...`);
        await sleep(5000);
      }
    }
    log(`    WARNING: All ${maxRetries} retries exhausted`);
    return { hits: [] };
  }

  // ===== MAIN SCRAPING LOOP =====
  const allStoreData = [];

  // Load previously completed stores if resuming
  if (resumeMode) {
    for (const [storeNum, storeData] of Object.entries(progress.completedStores)) {
      allStoreData.push(storeData);
    }
    log(`Resumed with ${allStoreData.length} previously scraped stores`);
  }

  let consecutiveBlocks = 0;
  let storesSinceVpnRotation = 0;

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];

    // Skip if already completed (resume mode)
    if (progress.completedStores[store.num]) {
      log(`[${i + 1}/${stores.length}] Store #${store.num} (${store.city}) - SKIPPED (already scraped)`);
      continue;
    }

    // VPN rotation every N stores
    if (useVpn && storesSinceVpnRotation >= VPN_ROTATE_EVERY_N_STORES) {
      log(`Rotating VPN (every ${VPN_ROTATE_EVERY_N_STORES} stores)...`);
      rotateVpn();
      storesSinceVpnRotation = 0;
      await sleep(5000);
      // Reload page to get new session with new IP
      await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(5000);
    }

    log(`[${i + 1}/${stores.length}] Store #${store.num} (${store.city})...`);

    const allDeals = [];
    let pageNum = 1;
    let hasMore = true;
    let storeBlocked = false;

    while (hasMore) {
      const result = await fetchPage({
        retailer: "hd",
        sortBy: "dateAdded:desc",
        filterBy: `store:${store.num}`,
        page: pageNum,
        query: "*",
        perPage: 250 // API may cap this, but we request max
      });

      if (result.blocked) {
        storeBlocked = true;
        consecutiveBlocks++;
        log(`  BLOCKED on store #${store.num}. Consecutive blocks: ${consecutiveBlocks}`);

        if (useVpn && consecutiveBlocks <= 4) {
          log(`  Rotating VPN and retrying store...`);
          rotateVpn();
          storesSinceVpnRotation = 0;
          await sleep(10000);
          await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
          await sleep(8000);
          // Retry this store from scratch
          allDeals.length = 0;
          pageNum = 1;
          storeBlocked = false;
          continue;
        } else {
          log(`  Waiting ${DELAY_AFTER_BLOCK/1000}s before continuing...`);
          await sleep(DELAY_AFTER_BLOCK);
          break;
        }
      }

      if (result.hits && result.hits.length > 0) {
        consecutiveBlocks = 0;
        const totalFound = result.found || 0;
        log(`    Page ${pageNum}: ${result.hits.length} hits (${totalFound} total for store, ${allDeals.length + result.hits.length} fetched so far)`);

        result.hits.forEach(h => {
          const d = h.document;
          const discountPct = d.discount / 100;
          const originalPrice = discountPct < 1 ? d.price / (1 - discountPct) : d.price;
          allDeals.push({
            ...d,
            originalPrice: Math.round(originalPrice * 100) / 100,
            dollarSaved: Math.round((originalPrice - d.price) * 100) / 100,
          });
        });

        // Check if we have all deals
        hasMore = allDeals.length < totalFound;
        pageNum++;
      } else {
        // Empty result
        if (result.found !== undefined && result.found > 0 && allDeals.length < result.found) {
          log(`    Page ${pageNum}: empty but ${result.found} expected (have ${allDeals.length}). Retrying...`);
          await sleep(5000);
          const retry = await fetchPage({
            retailer: "hd", sortBy: "dateAdded:desc",
            filterBy: `store:${store.num}`, page: pageNum,
            query: "*", perPage: 250
          });
          if (retry.hits && retry.hits.length > 0) {
            // Don't increment pageNum, re-enter loop to process this result
            continue;
          }
          // Still empty - try next page in case of API gap
          if (pageNum < Math.ceil((result.found || 0) / 25) + 2) {
            log(`    Skipping to next page...`);
            pageNum++;
            continue;
          }
        }
        hasMore = false;
      }

      // Random delay between pages
      if (hasMore) {
        await randomDelay(DELAY_BETWEEN_PAGES_MIN, DELAY_BETWEEN_PAGES_MAX);
      }
    }

    // Sort deals by dollar saved
    allDeals.sort((a, b) => b.dollarSaved - a.dollarSaved);

    const storeResult = { ...store, deals: allDeals };
    allStoreData.push(storeResult);

    // Save progress
    progress.completedStores[store.num] = storeResult;
    saveProgress(progress);

    log(`  => ${allDeals.length} deals total for ${store.city}`);
    storesSinceVpnRotation++;

    // Save intermediate results
    saveResults([...allStoreData]);

    // Random delay between stores
    if (i < stores.length - 1) {
      const delay = DELAY_BETWEEN_STORES_MIN + Math.floor(Math.random() * (DELAY_BETWEEN_STORES_MAX - DELAY_BETWEEN_STORES_MIN));
      log(`  Waiting ${(delay/1000).toFixed(1)}s before next store...`);
      await sleep(delay);
    }
  }

  await browser.close();
  if (useVpn) killVpn();

  // Final save
  saveResults(allStoreData);

  // Clean up progress file
  try { fs.unlinkSync(PROGRESS_FILE); } catch (e) {}

  // Summary
  let total = 0;
  allStoreData.forEach(s => { total += s.deals.length; });
  log(`\n===== SCRAPE COMPLETE =====`);
  log(`${total} total deals across ${allStoreData.length} stores\n`);
  allStoreData
    .sort((a, b) => (a.distance || 999) - (b.distance || 999))
    .forEach(s => log(`  ${s.city} (#${s.num}): ${s.deals.length} deals, ${s.distance} mi`));

  const storesWithZero = allStoreData.filter(s => s.deals.length === 0);
  if (storesWithZero.length > 0) {
    log(`\nWARNING: ${storesWithZero.length} stores have 0 deals:`);
    storesWithZero.forEach(s => log(`  - ${s.city} (#${s.num})`));
  }

  const storesWith25 = allStoreData.filter(s => s.deals.length === 25);
  if (storesWith25.length > 0) {
    log(`\nWARNING: ${storesWith25.length} stores have exactly 25 deals (may indicate pagination failure):`);
    storesWith25.forEach(s => log(`  - ${s.city} (#${s.num})`));
  }

  log(`\nResults saved to ${OUTPUT_FILE}`);
})();
