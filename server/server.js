import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads.js';
import authRouter from './routes/auth.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
