export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    position: string;
    unit: string;
    role: 'admin' | 'penyuluh' | 'koordinator' | 'viewer';
    nip?: string;
    phone?: string;
    address?: string;
  };
};

export type UserForm = {
  email: string;
  password: string;
  name: string;
  position: string;
  unit: string;
  role: 'admin' | 'penyuluh' | 'koordinator' | 'viewer';
  nip?: string;
  phone?: string;
  address?: string;
};

export const AUTH_STORAGE_KEY = 'suluh-islami-auth';

export const demoUsers: Record<string, LoginResponse['user']> = {
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
  },
};

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.trim().length >= 8;
}

export function validateUserProfile(payload: Partial<UserForm>) {
  const errors: string[] = [];

  if (!payload.email || !validateEmail(payload.email)) {
    errors.push('Email tidak valid.');
  }

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push('Nama lengkap wajib diisi.');
  }

  if (!payload.position || payload.position.trim().length < 2) {
    errors.push('Jabatan wajib diisi.');
  }

  if (!payload.unit || payload.unit.trim().length < 2) {
    errors.push('Unit kerja wajib diisi.');
  }

  if (payload.password && !validatePassword(payload.password)) {
    errors.push('Kata sandi minimal 8 karakter.');
  }

  if (payload.role && !['admin', 'penyuluh', 'koordinator', 'viewer'].includes(payload.role)) {
    errors.push('Role tidak valid.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function safeReadAuthSession(): LoginResponse | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: LoginResponse) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function loginWithDemoCredentials(email: string, password: string): LoginResponse | null {
  const normalizedEmail = email.trim().toLowerCase();
  const user = demoUsers[normalizedEmail];

  if (!user) return null;
  if (password.length < 8) return null;

  return {
    token: `demo-token-${user.id}`,
    user,
  };
}

export function updateProfileFromSession(user: LoginResponse['user']): LoginResponse {
  const existing = safeReadAuthSession();
  const nextSession: LoginResponse = {
    token: existing?.token ?? 'demo-token-session',
    user,
  };
  saveAuthSession(nextSession);
  return nextSession;
}
