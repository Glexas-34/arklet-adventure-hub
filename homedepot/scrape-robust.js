const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Delays (ms) - generous to avoid rate limits
const DELAY_BETWEEN_PAGES_MIN = 2000;
const DELAY_BETWEEN_PAGES_MAX = 4000;
const DELAY_BETWEEN_STORES_MIN = 4000;
const DELAY_BETWEEN_STORES_MAX = 8000;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const randomDelay = (min, max) => sleep(min + Math.floor(Math.random() * (max - min)));
const log = (msg) => {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`[${ts}] ${msg}`);
};

// ===== PROGRESS =====
function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
  catch { return { completedStores: {} }; }
}
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}
function saveResults(allStoreData) {
  const sorted = [...allStoreData].sort((a, b) => (a.distance || 999) - (b.distance || 999));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sorted, null, 2));
  fs.writeFileSync(OUTPUT_FILE_ALL, JSON.stringify(sorted, null, 2));
}

// ===== MAIN =====
(async () => {
  const resumeMode = process.argv.includes('--resume');
  log('=== Home Depot Scraper (Full Pagination) ===');
  log(`Resume: ${resumeMode ? 'YES' : 'fresh'} | Stores: ${stores.length}`);

  let progress = resumeMode ? loadProgress() : { completedStores: {} };

  // Clean up old profile
  const userDataDir = '/tmp/puppeteer-scrape-profile';
  if (!resumeMode) {
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch(e) {}
  }

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    userDataDir,
    protocolTimeout: 300000, // 5 min timeout for slow Pi
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu', '--single-process',
    ]
  });

  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
  });

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  log('Loading rebelsavings.com...');
  await page.goto('https://rebelsavings.com/', { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(12000);

  let title = await page.title();
  log(`Page: "${title}"`);

  // Handle security checkpoint
  for (let attempt = 0; attempt < 5; attempt++) {
    if (title.includes('Just a moment') || title.includes('Checking') || title.includes('Security') || title.includes('Vercel')) {
      log(`Security checkpoint, waiting 20s (${attempt + 1}/5)...`);
      await sleep(20000);
      title = await page.title();
      log(`Now: "${title}"`);
    } else break;
  }

  // Test API
  log('Testing API...');
  const test = await page.evaluate(async () => {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        retailer: "hd", sortBy: "dateAdded:desc",
        filterBy: "store:6644", page: 1, query: "*", perPage: 250
      })
    });
    const data = await res.json();
    return { found: data.found, hits: data.hits?.length, error: data.error };
  });

  log(`API test: found=${test.found}, hits=${test.hits}${test.error ? ', error=' + JSON.stringify(test.error) : ''}`);

  if (!test.found && !test.hits) {
    log('API not working. Exiting.');
    await browser.close();
    process.exit(1);
  }

  // Helper: fetch one page with retry
  async function fetchPage(storeNum, pageNum, maxRetries = 6) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await page.evaluate(async (sn, pn) => {
          try {
            const res = await fetch('/api/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                retailer: "hd", sortBy: "dateAdded:desc",
                filterBy: `store:${sn}`, page: pn, query: "*", perPage: 250
              })
            });
            if (!res.ok) return { httpStatus: res.status, error: true };
            const data = await res.json();
            return data;
          } catch (e) {
            return { error: true, message: e.message };
          }
        }, storeNum, pageNum);

        if (result.error) {
          const code = result.httpStatus || 'unknown';
          if (code === 429 || code === 503) {
            const backoff = attempt * 8000 + Math.random() * 3000;
            log(`    Rate limited (${code}). Backoff ${(backoff/1000).toFixed(0)}s (${attempt}/${maxRetries})`);
            await sleep(backoff);
            continue;
          }
          if (code === 403) {
            log(`    Forbidden (403). Refreshing page...`);
            await page.reload({ waitUntil: 'networkidle2', timeout: 90000 });
            await sleep(15000);
            continue;
          }
          log(`    Error: ${JSON.stringify(result).slice(0, 200)}. Retrying (${attempt}/${maxRetries})...`);
          await sleep(5000);
          continue;
        }
        return result;
      } catch (e) {
        log(`    Evaluate error: ${e.message.slice(0, 100)}. Retrying (${attempt}/${maxRetries})...`);
        // If protocol error, try reloading the page
        if (e.message.includes('timed out') || e.message.includes('Protocol')) {
          log(`    Reloading page due to protocol error...`);
          try {
            await page.reload({ waitUntil: 'networkidle2', timeout: 90000 });
            await sleep(15000);
          } catch (reloadErr) {
            log(`    Reload also failed: ${reloadErr.message.slice(0, 80)}`);
          }
        }
        await sleep(5000 * attempt);
      }
    }
    return { hits: [], found: 0 };
  }

  // ===== SCRAPING LOOP =====
  const allStoreData = [];

  // Load completed stores (resume)
  if (resumeMode) {
    for (const storeData of Object.values(progress.completedStores)) {
      allStoreData.push(storeData);
    }
    log(`Resumed with ${allStoreData.length} stores already scraped`);
  }

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];

    if (progress.completedStores[store.num]) {
      log(`[${i + 1}/${stores.length}] #${store.num} (${store.city}) - SKIP`);
      continue;
    }

    log(`[${i + 1}/${stores.length}] Store #${store.num} (${store.city})...`);

    const allDeals = [];
    let pageNum = 1;
    let totalExpected = null;
    let emptyPages = 0;

    while (true) {
      const result = await fetchPage(store.num, pageNum);

      if (result.found !== undefined) {
        totalExpected = result.found;
      }

      if (result.hits && result.hits.length > 0) {
        emptyPages = 0;
        log(`    Page ${pageNum}: ${result.hits.length} hits (total: ${totalExpected}, fetched: ${allDeals.length + result.hits.length})`);

        for (const h of result.hits) {
          const d = h.document;
          const discountPct = d.discount / 100;
          const originalPrice = discountPct < 1 ? d.price / (1 - discountPct) : d.price;
          allDeals.push({
            ...d,
            originalPrice: Math.round(originalPrice * 100) / 100,
            dollarSaved: Math.round((originalPrice - d.price) * 100) / 100,
          });
        }

        // Check if we have all deals
        if (totalExpected && allDeals.length >= totalExpected) {
          break; // Done with this store
        }
        pageNum++;
      } else {
        emptyPages++;
        if (emptyPages >= 2 || !totalExpected || allDeals.length >= totalExpected) {
          break;
        }
        // Try skipping a page in case of API gap
        log(`    Page ${pageNum}: empty (have ${allDeals.length}/${totalExpected}). Skipping...`);
        pageNum++;
      }

      // Delay between pages
      await randomDelay(DELAY_BETWEEN_PAGES_MIN, DELAY_BETWEEN_PAGES_MAX);
    }

    allDeals.sort((a, b) => b.dollarSaved - a.dollarSaved);
    const storeResult = { ...store, deals: allDeals };
    allStoreData.push(storeResult);

    // Save progress incrementally
    progress.completedStores[store.num] = storeResult;
    saveProgress(progress);
    saveResults([...allStoreData]);

    log(`  => ${allDeals.length} deals (expected: ${totalExpected || '?'})`);

    if (i < stores.length - 1) {
      await randomDelay(DELAY_BETWEEN_STORES_MIN, DELAY_BETWEEN_STORES_MAX);
    }
  }

  await browser.close();

  // Final save
  saveResults(allStoreData);
  try { fs.unlinkSync(PROGRESS_FILE); } catch {}

  // Summary
  let total = 0;
  allStoreData.forEach(s => total += s.deals.length);
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

  log(`\nSaved to ${OUTPUT_FILE}`);
})();
