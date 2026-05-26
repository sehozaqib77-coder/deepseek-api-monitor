/**
 * DeepSeek 缓存 & 余额监控 - 本地服务器
 * 解决 file:// 协议 CORS 问题
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 38899;
const HTML_FILE = path.join(__dirname, 'deepseek-monitor.html');

// ================ DeepSeek API Proxy ================
function proxyRequest(targetUrl, method, body, apiKey) {
  return new Promise((resolve, reject) => {
    const mod = targetUrl.startsWith('https:') ? https : http;
    const opts = {
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    const req = mod.request(targetUrl, opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ================ HTTP Server ================
const server = http.createServer(async (req, res) => {
  // CORS headers (allow localhost)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const pathname = req.url.split('?')[0];

  // === API: Get Balance ===
  if (pathname === '/api/balance' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { apiKey } = JSON.parse(body);
        if (!apiKey || !apiKey.startsWith('sk-')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid API key' }));
          return;
        }
        const result = await proxyRequest(
          'https://api.deepseek.com/user/balance',
          'GET',
          null,
          apiKey
        );
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // === API: Test Chat (for cache stats) ===
  if (pathname === '/api/test' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { apiKey } = JSON.parse(body);
        if (!apiKey || !apiKey.startsWith('sk-')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid API key' }));
          return;
        }
        const payload = JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an AI assistant with deep knowledge of programming, mathematics, science, literature, history, and the arts. You provide clear, concise, and accurate responses. You help users solve problems, learn new concepts, and think through complex ideas step by step. You always respond in a friendly, professional manner and adapt your explanations to the user\'s level of understanding. You can write code, analyze data, explain theories, and offer creative solutions. Your goal is to be as helpful as possible while maintaining accuracy and intellectual honesty. You never provide false information and always clarify when you are unsure about something.' },
            { role: 'user', content: 'Reply with just "ok" (nothing else).' }
          ],
          max_tokens: 5,
          stream: false
        });
        const result = await proxyRequest(
          'https://api.deepseek.com/chat/completions',
          'POST',
          payload,
          apiKey
        );
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // === Serve HTML ===
  if (pathname === '/' || pathname === '/index.html') {
    try {
      const html = fs.readFileSync(HTML_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error reading HTML file: ' + err.message);
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✓ DeepSeek Monitor 已启动`);
  console.log(`  地址: http://127.0.0.1:${PORT}`);
  console.log(`  按 Ctrl+C 停止服务器`);
});
