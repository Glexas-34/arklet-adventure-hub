const http = require('http');
const fs = require('fs');
const path = require('path');

const HIDDEN_FILE = path.join(__dirname, 'hidden-deals.json');
const PORT = 3457;

function readHidden() {
  try {
    return JSON.parse(fs.readFileSync(HIDDEN_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeHidden(data) {
  fs.writeFileSync(HIDDEN_FILE, JSON.stringify(data));
}

// Initialize file if it doesn't exist
if (!fs.existsSync(HIDDEN_FILE)) {
  writeHidden([]);
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/hidden-deals' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readHidden()));
    return;
  }

  if (req.url === '/hidden-deals' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { action, pkey } = JSON.parse(body);
        const hidden = new Set(readHidden());
        if (action === 'hide') {
          hidden.add(pkey);
        } else if (action === 'unhide') {
          hidden.delete(pkey);
        }
        writeHidden([...hidden]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([...hidden]));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Hidden deals API running on port ${PORT}`);
});
