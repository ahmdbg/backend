import db from '../models/db.js';

export const tambahPengunjung = (req, res) => {
  const { nama, jk, kelas, nama_murid, status, no_wa } = req.body;
  const query = 'INSERT INTO pengunjung (nama, jk, kelas, nama_murid, status, no_wa) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nama, jk, kelas, nama_murid, status, no_wa], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};

export const getPengunjung = (req, res) => {
  db.query('SELECT * FROM pengunjung', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
