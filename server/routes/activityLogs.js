import express from 'express';
import multer from 'multer';
import { listActivityLogs, createActivityLog } from '../services/activityLogService.js';
import { uploadToGoogleDrive, getGoogleDriveStatus } from '../services/googleDriveService.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.get('/', (req, res) => {
  const logs = listActivityLogs({
    entity_type: 'activity_log',
    user_id: req.query.user_id || undefined,
  });

  return res.json({
    success: true,
    count: logs.length,
    data: logs,
  });
});

router.post('/', (req, res) => {
  const { user_id, action, entity_type, entity_id, metadata } = req.body || {};

  if (!action || !entity_type) {
    return res.status(400).json({
      success: false,
      message: 'action and entity_type are required.',
    });
  }

  const entry = createActivityLog({
    user_id,
    action,
    entity_type,
    entity_id,
    metadata,
  });

  return res.status(201).json({
    success: true,
    data: entry,
  });
});

export default router;
