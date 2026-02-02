import { Readable } from 'node:stream';

let appPromise;

async function getApp() {
  if (!appPromise) {
    // Ensure the server entry returns the Hono app (not a listening server)
    process.env.VITE_BUILD = 'true';
    const mod = await import('../build/server/index.js');
    appPromise = await mod.default;
  }

  return appPromise;
}

export default async function handler(req, res) {
  const app = await getApp();

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const url = `${proto}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(','));
    }
  }

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : Readable.toWeb(req);

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  });

  const response = await app.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}