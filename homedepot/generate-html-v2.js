const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/home/pi/arklet/homedepot/deals-data.json', 'utf8'));

// Apply known distances for stores missing them
const knownDistances = {
  1010: 15.2, 1002: 16.5, 653: 22.1, 6610: 17.2, 6037: 16.8,
  1055: 24.5, 6640: 24.8, 654: 18.3, 2304: 17.5, 611: 19.8, 6627: 17.9,
};
data.forEach(s => {
  if (s.distance === null && knownDistances[s.num]) s.distance = knownDistances[s.num];
});
data.sort((a, b) => (a.distance || 999) - (b.distance || 999));

function formatDate(ts) {
  const d = new Date(ts * 1000);
  const now = new Date();
  const diffMs = now - d;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Build a product key from title (used to link same product across stores)
function productKey(title) {
  return title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

const now = new Date();
const generatedDate = now.toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
});

let totalDeals = 0;
data.forEach(s => totalDeals += s.deals.length);

let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home Depot Clearance Deals near 91403 | Scraped from homedepot.deal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.5;
    }

    .header {
      background: linear-gradient(135deg, #f96302, #e55b00);
      color: white;
      padding: 24px 20px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .header h1 { font-size: 24px; margin-bottom: 4px; }
    .header .subtitle { font-size: 14px; opacity: 0.9; }
    .header .meta { font-size: 12px; margin-top: 8px; opacity: 0.8; }

    .header .filters-info {
      display: flex; flex-wrap: wrap; gap: 8px;
      justify-content: center; margin-top: 12px;
    }
    .header .filter-badge {
      background: rgba(255,255,255,0.2);
      padding: 3px 10px; border-radius: 12px; font-size: 12px;
    }

    .top-controls {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      position: sticky;
      top: 106px;
      z-index: 99;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .toggle-hidden-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #555;
      transition: all 0.15s;
    }

    .toggle-hidden-btn:hover { border-color: #f96302; color: #f96302; }

    .toggle-hidden-btn.active {
      background: #fff5f0;
      border-color: #f96302;
      color: #f96302;
    }

    .hidden-count {
      background: #e53e3e;
      color: white;
      padding: 1px 7px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    .hidden-count.zero { background: #ccc; }

    .update-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border: 2px solid #f96302;
      border-radius: 6px;
      background: #f96302;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      color: white;
      transition: all 0.2s;
    }
    .update-btn:hover:not(:disabled) { background: #e55b00; border-color: #e55b00; }
    .update-btn:disabled {
      background: #ccc;
      border-color: #ccc;
      cursor: not-allowed;
      color: #fff;
    }
    .update-btn .spinner {
      display: none;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .update-btn.running .spinner { display: inline-block; }
    .update-btn.running .btn-icon { display: none; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }

    .stats-bar {
      display: flex; gap: 16px; flex-wrap: wrap;
      justify-content: center; margin-bottom: 24px;
    }
    .stat-card {
      background: white; border-radius: 8px; padding: 12px 20px;
      text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); min-width: 140px;
    }
    .stat-card .value { font-size: 24px; font-weight: 700; color: #f96302; }
    .stat-card .label { font-size: 12px; color: #666; text-transform: uppercase; }

    .store-nav {
      background: white; border-radius: 8px; padding: 16px;
      margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .store-nav h2 { font-size: 16px; margin-bottom: 12px; color: #333; }
    .store-nav .store-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .store-nav a {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; background: #f0f0f0; border-radius: 6px;
      text-decoration: none; color: #333; font-size: 13px; transition: all 0.15s;
    }
    .store-nav a:hover { background: #f96302; color: white; }
    .store-nav a .deal-count {
      background: #f96302; color: white; font-size: 11px;
      padding: 1px 6px; border-radius: 10px; font-weight: 600;
    }
    .store-nav a:hover .deal-count { background: rgba(255,255,255,0.3); }
    .store-nav a .distance { font-size: 11px; color: #999; }
    .store-nav a:hover .distance { color: rgba(255,255,255,0.8); }
    .store-nav a.no-deals { opacity: 0.5; }

    .store-section {
      background: white; border-radius: 8px; margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;
    }
    .store-header {
      background: #2c3e50; color: white; padding: 16px 20px;
      cursor: pointer; display: flex; justify-content: space-between;
      align-items: center; user-select: none;
    }
    .store-header:hover { background: #34495e; }
    .store-header .left { display: flex; align-items: center; gap: 12px; }
    .store-header .store-number {
      background: #f96302; color: white; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; font-weight: 600;
    }
    .store-header h2 { font-size: 16px; font-weight: 600; }
    .store-header .address { font-size: 13px; opacity: 0.8; margin-top: 2px; }
    .store-header .right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
    .store-header .badge {
      font-size: 12px; padding: 3px 10px; border-radius: 12px;
      background: rgba(255,255,255,0.15);
    }
    .store-header .chevron { font-size: 20px; transition: transform 0.2s; }
    .store-section.collapsed .deals-table-wrap { display: none; }
    .store-section.collapsed .store-header .chevron { transform: rotate(-90deg); }

    .deals-table-wrap { overflow-x: auto; }
    .deals-table { width: 100%; border-collapse: collapse; }
    .deals-table th {
      background: #f8f9fa; padding: 10px 12px; text-align: left;
      font-size: 12px; font-weight: 600; color: #666;
      text-transform: uppercase; border-bottom: 2px solid #eee;
    }
    .deals-table td {
      padding: 10px 12px; border-bottom: 1px solid #f0f0f0;
      font-size: 13px; vertical-align: middle;
    }
    .deals-table tr:hover { background: #fef8f5; }
    .deals-table tr.hidden-deal { display: none; }
    .deals-table tr.hidden-deal.show-hidden {
      display: table-row;
      opacity: 0.45;
      background: #fff8f8;
    }

    .deals-table .product-cell { display: flex; align-items: center; gap: 10px; }
    .deals-table .product-img {
      width: 50px; height: 50px; object-fit: contain;
      border-radius: 4px; flex-shrink: 0; background: #f5f5f5;
    }
    .deals-table .product-name { font-weight: 500; color: #333; max-width: 400px; }
    .deals-table .product-category { font-size: 11px; color: #999; margin-top: 2px; }
    .deals-table .price { font-weight: 700; color: #333; }
    .deals-table .original-price { text-decoration: line-through; color: #999; font-size: 12px; }
    .deals-table .discount { color: #e53e3e; font-weight: 700; }
    .deals-table .saved { color: #38a169; font-weight: 700; font-size: 14px; }
    .deals-table .date { color: #666; font-size: 12px; }
    .deals-table .stock-badge {
      display: inline-block; padding: 2px 8px; border-radius: 10px;
      font-size: 11px; font-weight: 600;
    }
    .deals-table .stock-low { background: #fff5f5; color: #e53e3e; }
    .deals-table .stock-ok { background: #f0fff4; color: #38a169; }
    .deals-table .stock-zero { background: #f5f5f5; color: #999; }

    .deals-table a.deal-link {
      display: inline-block; padding: 4px 10px; background: #f96302;
      color: white; text-decoration: none; border-radius: 4px;
      font-size: 12px; font-weight: 500; transition: background 0.15s;
    }
    .deals-table a.deal-link:hover { background: #e55b00; }

    .hide-checkbox {
      width: 18px; height: 18px; cursor: pointer;
      accent-color: #e53e3e;
    }

    .no-deals-msg {
      padding: 40px 20px; text-align: center; color: #999; font-size: 14px;
    }

    .footer {
      text-align: center; padding: 24px; color: #999; font-size: 12px;
    }
    .footer a { color: #f96302; text-decoration: none; }

    @media (max-width: 768px) {
      .header h1 { font-size: 18px; }
      .top-controls { top: 95px; flex-wrap: wrap; }
      .store-header { flex-direction: column; align-items: flex-start; gap: 8px; }
      .store-header .right { width: 100%; justify-content: flex-start; }
      .container { padding: 12px; }
    }
  </style>
</head>
<body>

<div class="header">
  <h1>Home Depot Clearance Deals near 91403</h1>
  <div class="subtitle">Data scraped from homedepot.deal (rebelsavings.com)</div>
  <div class="filters-info">
    <span class="filter-badge">Within 50 mi of 91403</span>
    <span class="filter-badge">Added within last month</span>
    <span class="filter-badge">Sorted by $ saved</span>
  </div>
  <div class="meta">Generated: ${generatedDate} &bull; ${data.length} stores &bull; ${totalDeals} deals</div>
</div>

<div class="top-controls">
  <button class="toggle-hidden-btn" id="toggleHiddenBtn" onclick="toggleShowHidden()">
    <span id="toggleIcon">&#9744;</span>
    Show Hidden Deals
    <span class="hidden-count zero" id="hiddenCountBadge">0</span>
  </button>
  <span style="font-size:12px;color:#999;" id="hiddenInfo">No hidden deals</span>
  <button class="update-btn" id="updateBtn" onclick="startScrape()">
    <span class="btn-icon">&#x21bb;</span>
    <span class="spinner"></span>
    <span class="btn-label">Update Deals</span>
  </button>
</div>

<div class="container">

  <div class="stats-bar">
    <div class="stat-card">
      <div class="value">${data.length}</div>
      <div class="label">Stores</div>
    </div>
    <div class="stat-card">
      <div class="value" id="visibleDealsCount">${totalDeals}</div>
      <div class="label">Visible Deals</div>
    </div>
    <div class="stat-card">
      <div class="value">${data.filter(s => s.deals.length > 0).length}</div>
      <div class="label">Stores w/ Deals</div>
    </div>
    <div class="stat-card">
      <div class="value">$${data.reduce((max, s) => {
        const storeMax = s.deals.reduce((m, d) => Math.max(m, d.dollarSaved), 0);
        return Math.max(max, storeMax);
      }, 0).toFixed(0)}</div>
      <div class="label">Max Savings</div>
    </div>
  </div>

  <div class="store-nav">
    <h2>Jump to Store (ordered by distance from 91403)</h2>
    <div class="store-list">
`;

data.forEach(store => {
  const hasDeals = store.deals.length > 0;
  html += `      <a href="#store-${store.num}" class="${hasDeals ? '' : 'no-deals'}">${store.city}`;
  if (store.distance) html += ` <span class="distance">${store.distance}mi</span>`;
  if (hasDeals) html += ` <span class="deal-count" data-store="${store.num}">${store.deals.length}</span>`;
  html += `</a>\n`;
});

html += `    </div>
  </div>

`;

// Generate store sections
data.forEach(store => {
  const hasDeals = store.deals.length > 0;
  html += `  <div class="store-section${hasDeals ? '' : ' collapsed'}" id="store-${store.num}">
    <div class="store-header" onclick="this.parentElement.classList.toggle('collapsed')">
      <div class="left">
        <span class="store-number">#${store.num}</span>
        <div>
          <h2>${escapeHtml(store.city)}</h2>
          <div class="address">${escapeHtml(store.address)}</div>
        </div>
      </div>
      <div class="right">
        <span class="badge">${store.distance ? store.distance + ' mi' : '&mdash;'}</span>
        <span class="badge">${store.deals.length} deal${store.deals.length !== 1 ? 's' : ''}</span>
        <span class="chevron">&#9660;</span>
      </div>
    </div>
`;

  if (hasDeals) {
    html += `    <div class="deals-table-wrap">
    <table class="deals-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Price</th>
          <th>Discount</th>
          <th>You Save</th>
          <th>Stock</th>
          <th>Added</th>
          <th>Link</th>
          <th>Hide</th>
        </tr>
      </thead>
      <tbody>
`;

    store.deals.forEach((deal, idx) => {
      const stockClass = deal.stock === 0 ? 'stock-zero' : deal.stock <= 2 ? 'stock-low' : 'stock-ok';
      const stockLabel = deal.stock === 0 ? 'OOS' : `${deal.stock} left`;
      const pkey = productKey(deal.title);

      html += `        <tr data-pkey="${pkey}">
          <td>${idx + 1}</td>
          <td>
            <div class="product-cell">
              <img class="product-img" src="${escapeHtml(deal.image_url || '')}" alt="" loading="lazy" onerror="this.style.display='none'">
              <div>
                <div class="product-name">${escapeHtml(deal.title)}</div>
                <div class="product-category">${escapeHtml(deal.category || '')}${deal.subcategory ? ' &rsaquo; ' + escapeHtml(deal.subcategory) : ''}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="price">$${deal.price.toFixed(2)}</div>
            <div class="original-price">$${deal.originalPrice.toFixed(2)}</div>
          </td>
          <td><span class="discount">${deal.discount}% off</span></td>
          <td><span class="saved">$${deal.dollarSaved.toFixed(2)}</span></td>
          <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
          <td><span class="date">${formatDate(deal.dateAdded)}</span></td>
          <td><a class="deal-link" href="${escapeHtml(deal.link)}" target="_blank" rel="noopener">View</a></td>
          <td><input type="checkbox" class="hide-checkbox" data-pkey="${pkey}" onchange="toggleHide(this)"></td>
        </tr>
`;
    });

    html += `      </tbody>
    </table>
    </div>
`;
  } else {
    html += `    <div class="no-deals-msg">No deals matching current filters at this store</div>
`;
  }

  html += `  </div>

`;
});

html += `</div>

<div class="footer">
  Data source: <a href="https://homedepot.deal" target="_blank">homedepot.deal</a> (rebelsavings.com) &bull;
  Filters: Within 50 mi of 91403, last 1 month &bull;
  Deals ranked by dollar amount saved (original price &minus; sale price) descending<br>
  Dollar saved = Price / (100% &minus; Discount%) &minus; Price
</div>

<script>
(function() {
  // ===== HIDE / SHOW HIDDEN DEALS (server-persisted) =====
  const API_BASE = '/homedepot/api';
  let hiddenSet = new Set();
  let showingHidden = false;

  async function loadHidden() {
    try {
      const res = await fetch(API_BASE + '/hidden-deals');
      const arr = await res.json();
      hiddenSet = new Set(arr);
    } catch (e) {
      console.error('Failed to load hidden deals:', e);
    }
    applyHidden();
  }

  async function serverHide(pkey) {
    try {
      const res = await fetch(API_BASE + '/hidden-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hide', pkey })
      });
      const arr = await res.json();
      hiddenSet = new Set(arr);
    } catch (e) { console.error('Failed to hide deal:', e); }
  }

  async function serverUnhide(pkey) {
    try {
      const res = await fetch(API_BASE + '/hidden-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unhide', pkey })
      });
      const arr = await res.json();
      hiddenSet = new Set(arr);
    } catch (e) { console.error('Failed to unhide deal:', e); }
  }

  function applyHidden() {
    const rows = document.querySelectorAll('tr[data-pkey]');
    const checkboxes = document.querySelectorAll('.hide-checkbox');
    let hiddenCount = 0;

    rows.forEach(row => {
      const pkey = row.getAttribute('data-pkey');
      if (hiddenSet.has(pkey)) {
        row.classList.add('hidden-deal');
        if (showingHidden) row.classList.add('show-hidden');
        else row.classList.remove('show-hidden');
        hiddenCount++;
      } else {
        row.classList.remove('hidden-deal', 'show-hidden');
      }
    });

    checkboxes.forEach(cb => {
      cb.checked = hiddenSet.has(cb.getAttribute('data-pkey'));
    });

    const badge = document.getElementById('hiddenCountBadge');
    const info = document.getElementById('hiddenInfo');
    const visibleCount = document.getElementById('visibleDealsCount');
    const uniqueHidden = hiddenSet.size;

    badge.textContent = hiddenCount;
    badge.className = 'hidden-count' + (hiddenCount === 0 ? ' zero' : '');
    info.textContent = hiddenCount === 0
      ? 'No hidden deals'
      : hiddenCount + ' deal row' + (hiddenCount !== 1 ? 's' : '') + ' hidden (' + uniqueHidden + ' product' + (uniqueHidden !== 1 ? 's' : '') + ')';
    visibleCount.textContent = ${totalDeals} - hiddenCount;

    // Update jump-to-store nav counts to show only visible deals
    document.querySelectorAll('.store-nav .deal-count[data-store]').forEach(badge => {
      const storeNum = badge.getAttribute('data-store');
      const section = document.getElementById('store-' + storeNum);
      if (!section) return;
      const totalRows = section.querySelectorAll('tr[data-pkey]').length;
      const hiddenRows = section.querySelectorAll('tr[data-pkey].hidden-deal').length;
      const showHidden = showingHidden;
      const visibleRows = showHidden ? totalRows : totalRows - hiddenRows;
      badge.textContent = visibleRows;
    });
  }

  window.toggleHide = async function(checkbox) {
    const pkey = checkbox.getAttribute('data-pkey');
    if (checkbox.checked) {
      hiddenSet.add(pkey);
      applyHidden();
      await serverHide(pkey);
    } else {
      hiddenSet.delete(pkey);
      applyHidden();
      await serverUnhide(pkey);
    }
    applyHidden();
  };

  window.toggleShowHidden = function() {
    showingHidden = !showingHidden;
    const btn = document.getElementById('toggleHiddenBtn');
    const icon = document.getElementById('toggleIcon');
    if (showingHidden) {
      btn.classList.add('active');
      icon.innerHTML = '&#9745;';
    } else {
      btn.classList.remove('active');
      icon.innerHTML = '&#9744;';
    }
    applyHidden();
  };

  // Smooth scroll for nav links
  document.querySelectorAll('.store-nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.classList.remove('collapsed');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Load hidden state from server on page load
  loadHidden();

  // ===== UPDATE / SCRAPE BUTTON =====
  const updateBtn = document.getElementById('updateBtn');
  const btnLabel = updateBtn.querySelector('.btn-label');

  function setRunning(running) {
    updateBtn.disabled = running;
    if (running) {
      updateBtn.classList.add('running');
      btnLabel.textContent = 'Updating...';
    } else {
      updateBtn.classList.remove('running');
      btnLabel.textContent = 'Update Deals';
    }
  }

  async function checkScrapeStatus() {
    try {
      const res = await fetch(API_BASE + '/scrape-status');
      const data = await res.json();
      if (data.running) {
        setRunning(true);
      } else if (data.exitCode === 0 && updateBtn.classList.contains('running')) {
        // Just finished successfully — reload the page to show new data
        setRunning(false);
        location.reload();
      } else {
        setRunning(false);
      }
      return data.running;
    } catch (e) {
      return false;
    }
  }

  window.startScrape = async function() {
    if (updateBtn.disabled) return;
    setRunning(true);
    try {
      const res = await fetch(API_BASE + '/scrape-start', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        // Already running
        setRunning(true);
      }
    } catch (e) {
      setRunning(false);
      alert('Failed to start update: ' + e.message);
      return;
    }
    // Poll for completion
    const poll = setInterval(async () => {
      const running = await checkScrapeStatus();
      if (!running) clearInterval(poll);
    }, 5000);
  };

  // Check on page load if a scrape is already running
  checkScrapeStatus();
})();
</script>

</body>
</html>`;

fs.writeFileSync('/home/pi/arklet/homedepot/index.html', html);
console.log('Generated index.html');
console.log('File size:', (html.length / 1024).toFixed(1), 'KB');
console.log('Stores:', data.length);
console.log('Total deals:', totalDeals);
