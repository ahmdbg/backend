import db from '../models/db.js';

export const getMuridByKelas = (req, res) => {
  const kelas = req.params.kelas;
  const query = 'SELECT * FROM murid WHERE kelas = ?';
  db.query(query, [kelas], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
