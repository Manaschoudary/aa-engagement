// api/guests.js — GET /api/guests  (admin list)
import { getDb } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db  = await getDb();
    const col = db.collection('rsvps');

    const rsvps = await col
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = rsvps.map(r => ({
      ...r,
      _id: r._id.toString(),
    }));
    return res.status(200).json({ rsvps: serialized });
  } catch (err) {
    console.error('Guests API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

