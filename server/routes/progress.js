import express from 'express';
import { getDB, saveDB } from '../db.js';

const router = express.Router();

// GET /api/progress/:userId
router.get('/:userId', (req, res) => {
  const db = getDB();
  const rows = db.exec('SELECT key, value FROM progress WHERE user_id = ?', [parseInt(req.params.userId)]);
  const progress = {};
  if (rows.length > 0) {
    rows[0].values.forEach(r => {
      progress[r[0]] = r[1];
    });
  }
  res.json(progress);
});

// PUT /api/progress/:userId
router.put('/:userId', (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: 'Key is required' });

  const userId = parseInt(req.params.userId);
  const db = getDB();

  const existing = db.exec('SELECT id FROM progress WHERE user_id = ? AND key = ?', [userId, key]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    db.run('UPDATE progress SET value=?, updated_at=datetime(\'now\') WHERE user_id=? AND key=?',
      [value || '', userId, key]);
  } else {
    db.run('INSERT INTO progress (user_id, key, value) VALUES (?,?,?)',
      [userId, key, value || '']);
  }
  saveDB();
  res.json({ success: true });
});

// PUT /api/progress/:userId/batch
router.put('/:userId/batch', (req, res) => {
  const { entries } = req.body;
  if (!entries || !Array.isArray(entries)) return res.status(400).json({ error: 'entries array required' });

  const userId = parseInt(req.params.userId);
  const db = getDB();

  for (const item of entries) {
    const existing = db.exec('SELECT id FROM progress WHERE user_id = ? AND key = ?', [userId, item.key]);
    if (existing.length > 0 && existing[0].values.length > 0) {
      db.run('UPDATE progress SET value=?, updated_at=datetime(\'now\') WHERE user_id=? AND key=?',
        [item.value || '', userId, item.key]);
    } else {
      db.run('INSERT INTO progress (user_id, key, value) VALUES (?,?,?)',
        [userId, item.key, item.value || '']);
    }
  }
  saveDB();
  res.json({ success: true, count: entries.length });
});

// DELETE /api/progress/:userId
router.delete('/:userId', (req, res) => {
  const db = getDB();
  db.run('DELETE FROM progress WHERE user_id = ?', [parseInt(req.params.userId)]);
  saveDB();
  res.json({ success: true });
});

export default router;
