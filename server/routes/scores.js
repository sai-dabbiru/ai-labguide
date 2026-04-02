import express from 'express';
import { getDB, saveDB } from '../db.js';

const router = express.Router();

// GET /api/scores/:userId
router.get('/:userId', (req, res) => {
  const db = getDB();
  const rows = db.exec('SELECT lab_id, pre, ex, post, bonus, total FROM scores WHERE user_id = ?', [parseInt(req.params.userId)]);
  const scores = {};
  if (rows.length > 0) {
    rows[0].values.forEach(r => {
      scores[r[0]] = { pre: r[1], ex: r[2], post: r[3], bonus: r[4], total: r[5] };
    });
  }
  res.json(scores);
});

// PUT /api/scores/:userId/:labId
router.put('/:userId/:labId', (req, res) => {
  const { pre = 0, ex = 0, post = 0, bonus = 0 } = req.body;
  const total = pre + ex + post + bonus;
  const userId = parseInt(req.params.userId);
  const labId = parseInt(req.params.labId);
  const db = getDB();

  // Check if exists
  const existing = db.exec('SELECT id FROM scores WHERE user_id = ? AND lab_id = ?', [userId, labId]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    db.run('UPDATE scores SET pre=?, ex=?, post=?, bonus=?, total=?, updated_at=datetime(\'now\') WHERE user_id=? AND lab_id=?',
      [pre, ex, post, bonus, total, userId, labId]);
  } else {
    db.run('INSERT INTO scores (user_id, lab_id, pre, ex, post, bonus, total) VALUES (?,?,?,?,?,?,?)',
      [userId, labId, pre, ex, post, bonus, total]);
  }
  saveDB();
  res.json({ lab_id: labId, pre, ex, post, bonus, total });
});

// DELETE /api/scores/:userId
router.delete('/:userId', (req, res) => {
  const db = getDB();
  db.run('DELETE FROM scores WHERE user_id = ?', [parseInt(req.params.userId)]);
  saveDB();
  res.json({ success: true });
});



export default router;
