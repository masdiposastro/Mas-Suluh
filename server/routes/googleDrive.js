import express from 'express';
import multer from 'multer';
import { uploadToGoogleDrive, getGoogleDriveStatus } from '../services/googleDriveService.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.get('/config', (_req, res) => {
  return res.json({
    success: true,
    data: getGoogleDriveStatus(),
  });
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required.',
      });
    }

    const folderId = req.body.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
    const fileName = req.body.fileName || req.file.originalname;

    const result = await uploadToGoogleDrive({
      file: req.file,
      folderId,
      fileName,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google Drive upload failed';
    return res.status(500).json({
      success: false,
      message,
    });
  }
});

export default router;
