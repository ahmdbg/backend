import express from 'express';
import db from '../models/db.js';

const router = express.Router();

// GET murid berdasarkan kelas dan jumlah_terpilih < 2
router.get('/:kelas', (req, res) => {
    const { kelas } = req.params;
    const sql = 'SELECT * FROM murid WHERE kelas = ? AND jumlah_terpilih < 2';
    db.query(sql, [kelas], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

export default router;
