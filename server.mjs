import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const args = process.argv.slice(2);
const portIndex = args.findIndex(arg => arg === '--port');
const port = Number(portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || 7100);
const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
    const file = join(root, pathname === '/' ? 'index.html' : safePath);
    const data = await readFile(file);
    res.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`First Click Prop Studio preview: http://localhost:${port}`));
