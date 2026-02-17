#!/bin/bash
set -e
cd /home/pi/arklet/homedepot

LOG_FILE="/home/pi/arklet/homedepot/pipeline-$(date +%Y%m%d-%H%M%S).log"
NODE_HEAP="--max-old-space-size=300"

echo "=== Home Depot Full Pipeline ===" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "Memory: $(awk '/MemAvailable/ {printf "%.0fMB", $2/1024}' /proc/meminfo) available" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# ===== Step 1: Scrape all deals =====
echo "=== Step 1: Scraping all deals (robust mode) ===" | tee -a "$LOG_FILE"

# Try without VPN first
echo "Attempting scrape without VPN..." | tee -a "$LOG_FILE"
if timeout 2700 node $NODE_HEAP scrape-robust.js 2>&1 | tee -a "$LOG_FILE"; then
  echo "Scrape succeeded!" | tee -a "$LOG_FILE"
else
  echo "Scrape failed without VPN. Trying with VPN..." | tee -a "$LOG_FILE"
  # Resume with VPN enabled
  timeout 2700 node $NODE_HEAP scrape-robust.js --vpn --resume 2>&1 | tee -a "$LOG_FILE" || {
    echo "Scrape failed even with VPN." | tee -a "$LOG_FILE"
    exit 1
  }
fi

# ===== Step 2: Generate HTML =====
echo "" | tee -a "$LOG_FILE"
echo "=== Step 2: Generating HTML ===" | tee -a "$LOG_FILE"
node generate-html-v2.js 2>&1 | tee -a "$LOG_FILE"

# ===== Step 3: Verify results =====
echo "" | tee -a "$LOG_FILE"
echo "=== Step 3: Verification ===" | tee -a "$LOG_FILE"
node -e "
const d=JSON.parse(require('fs').readFileSync('deals-data.json','utf8'));
let total=0;
d.forEach(s => { total += s.deals.length; console.log('Store #'+s.num+' ('+s.city+'): '+s.deals.length+' deals'); });
console.log('\nTotal: '+total+' deals across '+d.length+' stores');
const under25 = d.filter(s => s.deals.length <= 25);
if (under25.length > 0) {
  console.log('\nStores with <=25 deals (may need re-scrape):');
  under25.forEach(s => console.log('  - '+s.city+' (#'+s.num+'): '+s.deals.length));
}
" 2>&1 | tee -a "$LOG_FILE"

# ===== Step 4: Commit and push =====
echo "" | tee -a "$LOG_FILE"
echo "=== Step 4: Committing and pushing ===" | tee -a "$LOG_FILE"
cd /home/pi/arklet

TOTAL_DEALS=$(node -e "const d=JSON.parse(require('fs').readFileSync('homedepot/deals-data.json','utf8')); let t=0; d.forEach(s=>t+=s.deals.length); console.log(t)")
NUM_STORES=$(node -e "const d=JSON.parse(require('fs').readFileSync('homedepot/deals-data.json','utf8')); console.log(d.length)")

git add homedepot/deals-data-all.json homedepot/deals-data.json homedepot/index.html \
        homedepot/scrape-robust.js homedepot/run-full-pipeline.sh \
        homedepot/generate-html-v2.js homedepot/hidden-api.js

git commit -m "$(cat <<EOF
Update Home Depot deals - full scrape ${TOTAL_DEALS} deals across ${NUM_STORES} stores

- Robust scraper with anti-detection, pagination, VPN rotation support
- Full pagination to capture all deals per store (not just first 25)
- Server-persisted hidden deals (survives browser/device changes)
- Incremental progress saving for resume capability

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)" 2>&1 | tee -a "$LOG_FILE"

git push 2>&1 | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "=== Pipeline COMPLETE ===" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"
echo "Total deals: $TOTAL_DEALS across $NUM_STORES stores" | tee -a "$LOG_FILE"
