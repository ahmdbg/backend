// File: server/routes/pengunjung.js
import express from 'express';
import db from '../models/db.js';
import { sendWA } from '../waBot.js';

const router = express.Router();

// CREATE pengunjung
router.post('/', (req, res) => {
    const { nama, jk, kelas, nama_murid, status, no_wa } = req.body;

    // Check total pengunjung first
    db.query('SELECT COUNT(*) as total FROM pengunjung', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const totalPengunjung = result[0].total;

        if (totalPengunjung >= 250) {
            return res.status(400).json({ error: 'Maaf, semua kursi telah terisi penuh' });
        }

        // Tentukan range kursi
        const min = jk === 'L' ? 1 : 126;
        const max = jk === 'L' ? 125 : 250;

        // Cari nomor kursi tersedia
        const kursiQuery = `
          SELECT nomor_kursi FROM pengunjung WHERE nomor_kursi BETWEEN ? AND ?
        `;

        db.query(kursiQuery, [min, max], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const taken = result.map(row => row.nomor_kursi);
            const available = [];

            for (let i = min; i <= max; i++) {
                if (!taken.includes(i)) available.push(i);
            }

            if (available.length === 0) {
                return res.status(400).json({ error: 'Nomor kursi penuh untuk kategori ini' });
            }

            const nomor_kursi = available[0]; // ambil yang paling awal

            // Masukkan data + nomor kursi ke pengunjung
            const insertSql = `
            INSERT INTO pengunjung (nama, jk, kelas, nama_murid, status, no_wa, nomor_kursi)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

            db.query(insertSql, [nama, jk, kelas, nama_murid, status, no_wa, nomor_kursi], async (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                db.query(`UPDATE murid SET jumlah_terpilih = jumlah_terpilih + 1 WHERE nama = ?`, [nama_murid]);

                // Kirim pesan WA ke user
                const pesan = `Halo ${nama},\n\nBooking tiket kamu berhasil!\n- Kursi: ${nomor_kursi}\n- Status: ${status}\n\nSampai jumpa di acara 🎉`;

                try {
                    await sendWA(no_wa, pesan); // Gunakan no_wa dari input user
                    res.json({ success: true, id: result.insertId });
                } catch (error) {
                    // Tetap kirim response sukses meski pengiriman WA gagal
                    console.error('Gagal kirim WA:', error);
                    res.json({ success: true, id: result.insertId, waError: error.message });
                }
            });
        });
    });
});

// GET /api/pengunjung/count
router.get('/count', async (req, res) => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM pengunjung');
    res.json({ total: rows[0].total });
});


// routes/pengunjung.js (atau file route kamu)
router.patch('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status_pakai } = req.body;

    if (!['belum_dipakai', 'sudah_dipakai'].includes(status_pakai)) {
        return res.status(400).json({ error: 'Status tidak valid' });
    }

    try {
        db.query('UPDATE pengunjung SET status_pakai = ? WHERE id = ?', [status_pakai, id]);
        res.json({ message: 'Status diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update status' });
    }
});

// READ pengunjung by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM pengunjung WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Not found' });

        res.json(result[0]);
    });
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM pengunjung ORDER BY id DESC', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

export default router;
