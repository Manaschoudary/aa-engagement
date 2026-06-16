// api/guests/[id].js — PATCH /api/guests/:id  (update)
//                       DELETE /api/guests/:id (remove)
import { getDb } from '../_db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'ID required' });

  let oid;
  try {
    oid = new ObjectId(id);
  } catch {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const db  = await getDb();
    const col = db.collection('rsvps');

    // ── PATCH: update one RSVP ─────────────────────────────────────────────
    if (req.method === 'PATCH') {
      const updates = { ...req.body };
      delete updates._id;

      await col.updateOne(
        { _id: oid },
        { $set: { ...updates, updatedAt: new Date() } }
      );
      return res.status(200).json({ success: true });
    }

    // ── DELETE: remove one RSVP ────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const result = await col.deleteOne({ _id: oid });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('guests/[id] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
