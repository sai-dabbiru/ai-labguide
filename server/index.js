import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';
import progressRoutes from './routes/progress.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 80;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/progress', progressRoutes);

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

      app.use(express.static(path.join(__dirname, '../client/dist')));

   // The "catchall" handler: for any request that doesn't match an API route, 
   // send back React's index.html file.
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
   });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize DB then start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n  🚀 Lab Guide API running at http://localhost:${PORT}`);
    console.log(`  📊 Health check: http://localhost:${PORT}/api/health\n`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
