export type Role = 'admin' | 'penyuluh' | 'koordinator' | 'viewer';

export type ActivityType =
  | 'Penyuluhan tatap muka'
  | 'Bimbingan kelompok'
  | 'Bimbingan individu'
  | 'Ceramah agama'
  | 'Pengajian'
  | 'Bimbingan perkawinan'
  | 'Konsultasi keagamaan'
  | 'Pendampingan kelompok binaan'
  | 'Penyuluhan digital'
  | 'Kegiatan lintas sektor';

export interface UserProfile {
  id: string;
  name: string;
  position: string;
  unit: string;
  role: Role;
}

export interface SermonDraft {
  id: string;
  title: string;
  theme: string;
  type: string;
  audience: string;
  status: 'Draf AI' | 'Perlu penyuntingan' | 'Perlu verifikasi' | 'Siap ditinjau' | 'Disetujui pengguna';
  content: string;
  createdAt: string;
}

export interface MaterialDraft {
  id: string;
  title: string;
  category: string;
  format: string;
  status: 'Draf AI' | 'Perlu penyuntingan' | 'Perlu verifikasi' | 'Siap ditinjau' | 'Disetujui pengguna';
  content: string;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  title: string;
  type: ActivityType;
  date: string;
  location: string;
  participants: number;
  summary: string;
  status: 'Tersimpan' | 'Perlu revisi' | 'Tervalidasi';
}

export interface GuidanceGroup {
  id: string;
  name: string;
  category: string;
  leader: string;
  location: string;
  members: number;
  status: 'Aktif' | 'Tidak aktif';
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: string;
  linkedActivity: string;
  verified: boolean;
  fileSize: string;
}

export interface AppSettings {
  orgName: string;
  orgCode: string;
  aiMode: 'demo' | 'live';
  requireVerification: boolean;
  themeColor: string;
}
