import db from '../models/db.js';
import bcrypt from 'bcrypt';

export const login = (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM admin WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ success: true });
  });
};
