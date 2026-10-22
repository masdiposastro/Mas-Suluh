import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import activityLogRoutes from './routes/activityLogs.js';
import googleDriveRoutes from './routes/googleDrive.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'suluh-islami-api-scaffold',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/google-drive', googleDriveRoutes);

app.use((error, _req, res, _next) => {
  console.error('[API ERROR]', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`SULUH ISLAMI API scaffold running on http://localhost:${port}`);
});
