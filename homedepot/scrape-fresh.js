const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

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

// Delete old browser profile to get fresh session
const userDataDir = '/tmp/puppeteer-fresh-profile';
try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch(e) {}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    userDataDir,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();

  // Stealth tweaks
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  console.log('Loading page with fresh profile...');
  await page.goto('https://rebelsavings.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(8000);

  // Check what the page looks like (debug Cloudflare etc.)
  const pageTitle = await page.title();
  const pageUrl = page.url();
  console.log(`Page loaded: "${pageTitle}" at ${pageUrl}`);

  // If security checkpoint, wait longer for it to resolve
  if (pageTitle.includes('Just a moment') || pageTitle.includes('Checking') || pageTitle.includes('Security') || pageTitle.includes('Vercel')) {
    console.log('Security checkpoint detected, waiting 20s for auto-resolve...');
    await sleep(20000);
    const newTitle = await page.title();
    const newUrl = page.url();
    console.log(`After wait: "${newTitle}" at ${newUrl}`);
  }

  // Test if API works - retry a few times
  let test = null;
  for (let testAttempt = 1; testAttempt <= 3; testAttempt++) {
    test = await page.evaluate(async () => {
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
        return { status: res.status, found: data.found, hasError: !!data.error, raw: text.slice(0, 300) };
      } catch {
        return { status: res.status, hasError: true, raw: text.slice(0, 300) };
      }
    });

    console.log(`API test attempt ${testAttempt}: status=${test.status}, found=${test.found}, error=${test.hasError}`);
    if (test.hasError) console.log(`  Response: ${test.raw}`);

    if (!test.hasError && test.found !== undefined) break;
    if (testAttempt < 3) {
      console.log(`  Waiting 10s before retry...`);
      await sleep(10000);
    }
  }

  if (test.hasError || test.found === undefined) {
    console.log('API blocked after retries. Exiting.');
    await browser.close();
    process.exit(1);
  }

  console.log(`API working! Total deals in system: ${test.found}`);

  // Helper: fetch a single page with retry on 429
  async function fetchPage(payload, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await page.evaluate(async (p) => {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p)
        });
        const data = await res.json();
        return { status: res.status, ...data };
      }, payload);

      if (result.error && result.error.code === '429') {
        const backoff = attempt * 5000; // 5s, 10s, 15s, 20s, 25s
        console.log(`    Rate limited (429). Waiting ${backoff/1000}s before retry ${attempt}/${maxRetries}...`);
        await sleep(backoff);
        continue;
      }

      return result;
    }
    // All retries exhausted
    console.log(`    WARNING: All ${maxRetries} retries exhausted for this page`);
    return { hits: [] };
  }

  const allStoreData = [];

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    console.log(`[${i + 1}/${stores.length}] Store #${store.num} (${store.city})...`);

    const allDeals = [];
    let pageNum = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await fetchPage({
        retailer: "hd",
        sortBy: "dateAdded:desc",
        filterBy: `store:${store.num}`,
        page: pageNum,
        query: "*",
        perPage: 250
      });

      if (result.hits && result.hits.length > 0) {
        const totalFound = result.found || 0;
        console.log(`    Page ${pageNum}: ${result.hits.length} hits (${totalFound} total, ${allDeals.length + result.hits.length} fetched)`);
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
        // API caps at 25 per page regardless of perPage setting
        hasMore = allDeals.length < totalFound;
        pageNum++;
      } else {
        if (result.found !== undefined && result.found > 0 && allDeals.length < result.found) {
          // Got empty page but there should be more - might be a transient issue
          console.log(`    Page ${pageNum}: empty but ${result.found} expected. Retrying after delay...`);
          await sleep(3000);
          // Try one more time
          const retry = await fetchPage({
            retailer: "hd", sortBy: "dateAdded:desc",
            filterBy: `store:${store.num}`, page: pageNum,
            query: "*", perPage: 250
          });
          if (retry.hits && retry.hits.length > 0) {
            continue; // This will re-enter the loop naturally
          }
        }
        hasMore = false;
      }

      // Delay between pages to avoid rate limiting
      if (hasMore) await sleep(1000);
    }

    allDeals.sort((a, b) => b.dollarSaved - a.dollarSaved);

    allStoreData.push({ ...store, deals: allDeals });
    console.log(`  => ${allDeals.length} deals total`);

    // Delay between stores to avoid rate limiting
    await sleep(3000);
  }

  await browser.close();

  // Sort by distance
  allStoreData.sort((a, b) => (a.distance || 999) - (b.distance || 999));

  const jsonOutput = JSON.stringify(allStoreData, null, 2);
  fs.writeFileSync('/home/pi/arklet/homedepot/deals-data-all.json', jsonOutput);
  fs.writeFileSync('/home/pi/arklet/homedepot/deals-data.json', jsonOutput);
  let total = 0;
  allStoreData.forEach(s => { total += s.deals.length; });
  console.log(`\nDone! ${total} total deals across ${allStoreData.length} stores`);
  allStoreData.forEach(s => console.log(`  ${s.city} (#${s.num}): ${s.deals.length} deals, ${s.distance} mi`));

  const storesWithZero = allStoreData.filter(s => s.deals.length === 0);
  if (storesWithZero.length > 0) {
    console.log(`\nWARNING: ${storesWithZero.length} stores have 0 deals:`);
    storesWithZero.forEach(s => console.log(`  - ${s.city} (#${s.num})`));
  }
})();
