import express from 'express';
import { getDB, saveDB } from '../db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    return res.status(400).json({ error: 'Username must be at least 2 characters' });
  }

  const db = getDB();
  const trimmed = username.trim().toLowerCase();

  let rows = db.exec('SELECT id, username FROM users WHERE username = ?', [trimmed]);
  if (rows.length === 0 || rows[0].values.length === 0) {
    db.run('INSERT INTO users (username) VALUES (?)', [trimmed]);
    const idRows = db.exec('SELECT last_insert_rowid() as id');
    const id = idRows[0].values[0][0];
    saveDB();
    return res.json({ id, username: trimmed });
  }

  const user = { id: rows[0].values[0][0], username: rows[0].values[0][1] };
  res.json(user);
});

// GET /api/auth/user/:id
router.get('/user/:id', (req, res) => {
  const db = getDB();
  const rows = db.exec('SELECT id, username, created_at FROM users WHERE id = ?', [parseInt(req.params.id)]);
  if (rows.length === 0 || rows[0].values.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  const r = rows[0].values[0];
  res.json({ id: r[0], username: r[1], created_at: r[2] });
});

export default router;
