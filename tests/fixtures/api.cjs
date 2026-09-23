// Local fixture service only. Never connects to a database or upstream API.
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const requestLog = require('node:path').join(os.tmpdir(), 'fixture-5100-requests.log');

const member = (id) => ({
  _id: id, profileKey: id, firstname: 'Fixture', lastname: id,
  avatar: '/icons/layout/logo.png',
});

http.createServer((req, res) => {
  try { fs.appendFileSync(requestLog, `${new Date().toISOString()} ${req.method} ${req.url}\n`); } catch {}
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://127.0.0.1:5100');
  if (req.method !== 'GET') {
    res.writeHead(405).end('{}');
    return;
  }
  if (url.pathname === '/api/v1/users') {
    const regular = url.searchParams.get('filter')?.includes('false');
    res.end(JSON.stringify({ currentPage: 1, totalPages: 3, data: {
      users: regular ? Array.from({ length: 8 }, (_, i) => member(`member-${i}`)) : [],
    }}));
  } else if (url.pathname.startsWith('/api/v1/album/')) {
    res.end(JSON.stringify({ data: {
      album: { slug: 'fixture-album', name: 'Fixture album', imageList: [] },
      pagination: { currentPage: 1, totalPages: 3 },
    }}));
  } else {
    res.end(JSON.stringify({ status: 'success', data: [] }));
  }
}).listen(5100, '127.0.0.1', () => console.log('Fixture API listening on 127.0.0.1:5100'));
