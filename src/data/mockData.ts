import type { ActivityEntry, AppSettings, EvidenceItem, GuidanceGroup, MaterialDraft, SermonDraft } from '../types';

export const defaultUser = {
  id: 'u-001',
  name: 'Akhmad Syarif',
  position: 'Penyuluh Agama Islam',
  unit: 'Kementerian Agama Kabupaten Sumenep',
  role: 'penyuluh' as const
};

export const defaultSettings: AppSettings = {
  orgName: 'Kementerian Agama RI',
  orgCode: 'KAB-2025-SUMENEP',
  aiMode: 'demo',
  requireVerification: true,
  themeColor: '#145a3d'
};

export const initialSermons: SermonDraft[] = [
  {
    id: 's-1',
    title: 'Urgensi Menjaga Keikhlasan Dalam Beribadah',
    theme: 'Ibadah dan Keikhlasan',
    type: 'Khutbah Jumat',
    audience: 'Jamaah masjid',
    status: 'Perlu penyuntingan',
    content: 'Tema ini membahas pentingnya niat, ketulusan, dan konsistensi ibadah. Khutbah menekankan bahwa ibadah yang ikhlas akan membawa ketenangan hati dan keberkahan hidup.',
    createdAt: '2026-10-13'
  },
  {
    id: 's-2',
    title: 'Keluarga Sakinah sebagai Pilar Moderasi Beragama',
    theme: 'Keluarga Sakinah',
    type: 'Ceramah umum',
    audience: 'Calon pengantin',
    status: 'Siap ditinjau',
    content: 'Materi ini menjelaskan peran keluarga sakinah dalam membentuk karakter moderat, toleran, dan produktif dalam masyarakat.',
    createdAt: '2026-10-10'
  }
];

export const initialMaterials: MaterialDraft[] = [
  {
    id: 'm-1',
    title: 'Moderasi Beragama di Lingkungan Sekolah',
    category: 'Moderasi beragama',
    format: 'Modul pembelajaran',
    status: 'Draf AI',
    content: 'Materi membahas pentingnya sikap toleran, dialog antarumat, dan menumbuhkan pemahaman keagamaan yang sehat di lingkungan pendidikan.',
    createdAt: '2026-10-12'
  },
  {
    id: 'm-2',
    title: 'Pencegahan Hoaks Keagamaan',
    category: 'Literasi digital',
    format: 'Handout peserta',
    status: 'Perlu verifikasi',
    content: 'Topik ini berisi strategi membedakan informasi yang valid, mencegah penyebaran konten hoaks, dan membangun literasi digital yang aman.',
    createdAt: '2026-10-09'
  }
];

export const initialActivities: ActivityEntry[] = [
  {
    id: 'a-1',
    title: 'Penyuluhan Keluarga Sakinah',
    type: 'Penyuluhan tatap muka',
    date: '2026-10-05',
    location: 'Masjid Al Hidayah',
    participants: 45,
    summary: 'Penyuluhan tentang komunikasi harmonis dalam keluarga dan penanganan konflik sederhana.',
    status: 'Tervalidasi'
  },
  {
    id: 'a-2',
    title: 'Konsultasi Pernikahan',
    type: 'Bimbingan perkawinan',
    date: '2026-10-15',
    location: 'KUA Sumenep',
    participants: 18,
    summary: 'Bimbingan persiapan nikah dan pemahaman hak serta kewajiban pasangan.',
    status: 'Tersimpan'
  }
];

export const initialGroups: GuidanceGroup[] = [
  {
    id: 'g-1',
    name: 'Majelis Taklim Baitul Jannah',
    category: 'Majelis taklim',
    leader: 'H. Suyuti',
    location: 'Kelurahan Pabian',
    members: 40,
    status: 'Aktif'
  },
  {
    id: 'g-2',
    name: 'Kelompok Remaja Islam',
    category: 'Remaja',
    leader: 'M. Arifin',
    location: 'Desa Guluk-Guluk',
    members: 26,
    status: 'Aktif'
  }
];

export const initialEvidence: EvidenceItem[] = [
  {
    id: 'e-1',
    title: 'Foto dokumentasi penyuluhan',
    type: 'Foto',
    linkedActivity: 'Penyuluhan Keluarga Sakinah',
    verified: true,
    fileSize: '2.4 MB'
  },
  {
    id: 'e-2',
    title: 'Daftar hadir peserta',
    type: 'Daftar hadir',
    linkedActivity: 'Konsultasi Pernikahan',
    verified: false,
    fileSize: '320 KB'
  }
];

export const initialReports = [
  {
    id: 'r-1',
    title: 'Laporan Bulanan Oktober 2026',
    category: 'Bulanan',
    summary: 'Dua kegiatan penyuluhan utama, 63 peserta, dan 1 dokumentasi belum tervalidasi.'
  }
];
