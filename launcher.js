const { spawn, execSync } = require('child_process');
const path = require('path');

const NODE = 'C:\\Users\\15798\\AppData\\Local\\hermes\\node\\node.exe';
const SERVER = path.join(__dirname, 'deepseek-monitor-server.js');
const PORT = 38899;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // Start the proxy server
  const server = spawn(NODE, [SERVER], {
    stdio: 'ignore',
    detached: true,
    windowsHide: true
  });
  server.unref();

  // Wait for it to be ready
  await sleep(3000);
}

main().catch(err => {
  // Silent fail - VBS handles error display
  process.exit(1);
});
