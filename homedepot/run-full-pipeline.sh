#!/bin/bash
set -e
cd /home/pi/arklet/homedepot

echo "=== Starting Home Depot scrape pipeline ==="
echo "Time: $(date)"

echo ""
echo "=== Step 1: Scraping all deals ==="
node scrape-fresh.js 2>&1

echo ""
echo "=== Step 2: Generating HTML ==="
node generate-html-v2.js 2>&1

echo ""
echo "=== Step 3: Committing and pushing ==="
cd /home/pi/arklet
git add homedepot/deals-data-all.json homedepot/deals-data.json homedepot/index.html homedepot/scrape-fresh.js homedepot/run-full-pipeline.sh
git commit -m "Update Home Depot deals data - full scrape with all pagination

- Removed dateAdded filter to capture all deals per store
- Added pagination logging for verification
- Writes to both deals-data.json and deals-data-all.json
- Regenerated HTML

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push

echo ""
echo "=== Pipeline complete ==="
echo "Time: $(date)"
