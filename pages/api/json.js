export default async function handler(req, res) {
  const repo = 'MadManMax123/incvoting';
  const path = 'questions.json';
  const token = process.env.GITHUB_TOKEN;
  const apiBase = `https://api.github.com/repos/${repo}/contents/${path}`;

  if (req.method === 'GET') {
    const fileRes = await fetch(apiBase, {
      headers: { Authorization: `token ${token}` },
    });
    const file = await fileRes.json();
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    res.status(200).json(JSON.parse(content));
  }

  if (req.method === 'PUT') {
    const getRes = await fetch(apiBase, {
      headers: { Authorization: `token ${token}` },
    });
    const existing = await getRes.json();
    const encoded = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update questions.json via admin panel',
        content: encoded,
        sha: existing.sha,
      }),
    });

    if (putRes.ok) res.status(200).json({ success: true });
    else res.status(500).json({ error: 'Failed to update' });
  }
}
