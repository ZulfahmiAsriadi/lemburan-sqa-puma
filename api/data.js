import fs from 'fs';
import path from 'path';

const GIST_ID = '7641278f0b480b8bc4541881f994dd99';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.GITHUB_TOKEN;

  // GET: Retrieve data
  if (req.method === 'GET') {
    if (token) {
      try {
        const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'Vercel-SQA-Puma',
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (r.ok) {
          const gist = await r.json();
          const content = gist.files['data.json'].content;
          return res.status(200).json(JSON.parse(content));
        }
      } catch (err) {
        console.error('Gist fetch error:', err);
      }
    }

    // Fallback: Read local data.json bundled with the deploy
    try {
      const p = path.join(process.cwd(), 'data.json');
      const data = fs.readFileSync(p, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
  }

  // POST: Update data
  if (req.method === 'POST') {
    if (token) {
      try {
        let bodyData = req.body;
        if (typeof bodyData === 'string') {
          try { bodyData = JSON.parse(bodyData); } catch (e) {}
        }
        const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'Vercel-SQA-Puma',
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            description: 'SQA PUMA Timesheet Cloud DB - Auto-synced 24/7',
            files: {
              'data.json': {
                content: JSON.stringify(bodyData, null, 2)
              }
            }
          })
        });
        if (patchRes.ok) {
          return res.status(200).json({ status: 'ok', message: 'Data saved to cloud' });
        }
      } catch (err) {
        console.error('Gist patch error:', err);
      }
    }
    return res.status(200).json({ status: 'ok', message: 'Data accepted' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
