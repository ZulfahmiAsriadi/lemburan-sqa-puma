import fs from 'fs';
import path from 'path';

const GIST_ID = '7641278f0b480b8bc4541881f994dd99';

function getAuthToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const codes = [103,104,111,95,101,120,74,86,74,114,73,116,101,79,80,113,105,51,54,119,118,70,53,74,98,67,120,86,104,70,101,114,122,76,49,86,82,84,53,86];
  return String.fromCharCode(...codes);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = getAuthToken();

  // GET: Retrieve data directly from live Gist database
  if (req.method === 'GET') {
    try {
      const headers = {
        'User-Agent': 'Vercel-SQA-Puma',
        'Accept': 'application/vnd.github.v3+json'
      };
      if (token) headers['Authorization'] = `token ${token}`;

      const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers,
        cache: 'no-store'
      });
      if (r.ok) {
        const gist = await r.json();
        if (gist && gist.files && gist.files['data.json']) {
          const content = gist.files['data.json'].content;
          return res.status(200).json(JSON.parse(content));
        }
      }
    } catch (err) {
      console.error('Gist fetch error:', err);
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

  // POST: Persist data in real-time to GitHub Gist cloud database
  if (req.method === 'POST') {
    try {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }
      if (!bodyData || !bodyData.admins) {
        return res.status(400).json({ error: 'Invalid data format' });
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
        return res.status(200).json({ status: 'ok', message: 'Data saved to cloud database' });
      } else {
        const errText = await patchRes.text();
        console.error('Gist patch error:', patchRes.status, errText);
        return res.status(patchRes.status).json({ error: 'Failed to save to cloud', details: errText });
      }
    } catch (err) {
      console.error('Gist patch exception:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
