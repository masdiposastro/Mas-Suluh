import { google } from 'googleapis';
import { Readable } from 'stream';

export function getGoogleDriveStatus() {
  const hasServiceAccount = Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const hasFolderId = Boolean(process.env.GOOGLE_DRIVE_FOLDER_ID);

  return {
    configured: hasServiceAccount && hasFolderId,
    serviceAccountConfigured: hasServiceAccount,
    folderIdConfigured: hasFolderId,
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || null,
    note: 'Google Drive integration is backend-only and requires secure environment variables.'
  };
}

export async function uploadToGoogleDrive({ file, folderId, fileName }) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error('Google Drive service account is not configured.');
  }

  if (!folderId && !process.env.GOOGLE_DRIVE_FOLDER_ID) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured.');
  }

  const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const uploadedFile = await drive.files.create({
      requestBody: {
        name: fileName || file.originalname || 'upload-file',
        parents: [targetFolderId],
      },
      media: {
        mimeType: file.mimetype || 'application/octet-stream',
        body: Readable.from(file.buffer),
      },
      fields: 'id,name,mimeType,size,webViewLink,webContentLink',
    });

    return {
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      file: {
        id: uploadedFile.data.id,
        name: uploadedFile.data.name,
        mimeType: uploadedFile.data.mimeType,
        size: uploadedFile.data.size,
        webViewLink: uploadedFile.data.webViewLink,
        webContentLink: uploadedFile.data.webContentLink,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google Drive upload failed';
    throw new Error(message);
  }
}
