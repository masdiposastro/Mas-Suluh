import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const demoUsers = {
  'penyuluh@kemenag.go.id': {
    id: 'u-001',
    email: 'penyuluh@kemenag.go.id',
    name: 'Akhmad Syarif',
    position: 'Penyuluh Agama Islam',
    unit: 'Kementerian Agama Kabupaten Sumenep',
    role: 'penyuluh',
    nip: '199201012024031001',
    phone: '081234567890',
    address: 'Kabupaten Sumenep',
    passwordHash: bcrypt.hashSync('password123', 10),
  },
  'admin@kemenag.go.id': {
    id: 'u-002',
    email: 'admin@kemenag.go.id',
    name: 'Administrator Sistem',
    position: 'Administrator Aplikasi',
    unit: 'Pusat Data Kementerian Agama',
    role: 'admin',
    nip: '198601012010011002',
    phone: '081234567891',
    address: 'Jakarta',
    passwordHash: bcrypt.hashSync('password123', 10),
  },
  'koordinator@kemenag.go.id': {
    id: 'u-003',
    email: 'koordinator@kemenag.go.id',
    name: 'Rizal Hidayat',
    position: 'Koordinator Peninjau',
    unit: 'Kementerian Agama Kabupaten Sumenep',
    role: 'koordinator',
    nip: '198501012015021003',
    phone: '081234567892',
    address: 'Kabupaten Sumenep',
    passwordHash: bcrypt.hashSync('password123', 10),
  },
};

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function createAuthToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    unit: user.unit,
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '8h',
  });
}

export function verifyAuthToken(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch {
    return null;
  }
}

export function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const decoded = verifyAuthToken(token);

  if (!decoded || !decoded.sub) {
    return null;
  }

  const user = Object.values(demoUsers).find((candidate) => candidate.id === decoded.sub);
  return user ? sanitizeUser(user) : null;
}

export async function loginDemoUser({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const account = demoUsers[normalizedEmail];

  if (!account) return null;
  if (!bcrypt.compareSync(String(password || ''), account.passwordHash)) return null;

  const user = sanitizeUser(account);

  return {
    token: createAuthToken(user),
    user,
  };
}

export function updateDemoProfile(userId, payload = {}) {
  const sourceUser = Object.values(demoUsers).find((user) => user.id === userId);
  if (!sourceUser) return null;

  const nextUser = {
    ...sourceUser,
    ...payload,
  };

  demoUsers[nextUser.email.toLowerCase()] = nextUser;
  return sanitizeUser(nextUser);
}

export function listDemoUsers() {
  return Object.values(demoUsers).map((user) => sanitizeUser(user));
}
