import express from 'express';
import cors from 'cors';
import muridRoute from './routes/muridRoute.js';
import pengunjungRoute from './routes/pengunjungRoute.js';
import authRoute from './routes/authRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/murid', muridRoute);
app.use('/api/pengunjung', pengunjungRoute);
app.use('/api/admin', authRoute);




const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});