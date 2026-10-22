import express from 'express';
import { getUserFromRequest, loginDemoUser, updateDemoProfile } from '../services/authService.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan kata sandi wajib diisi.',
    });
  }

  const session = await loginDemoUser({ email, password });

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Kredensial tidak valid.',
    });
  }

  return res.status(200).json({
    success: true,
    data: session,
  });
});

router.post('/logout', (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout berhasil.',
  });
});

router.get('/me', (req, res) => {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Sesi tidak valid atau token habis masa berlaku.',
    });
  }

  return res.status(200).json({
    success: true,
    data: { user },
  });
});

router.put('/profile', (req, res) => {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Sesi tidak valid.',
    });
  }

  const updated = updateDemoProfile(user.id, req.body || {});

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Profil tidak ditemukan.',
    });
  }

  return res.status(200).json({
    success: true,
    data: { user: updated },
  });
});

export default router;
