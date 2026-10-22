export const generateSermonDraft = (input: {
  title: string;
  theme: string;
  type: string;
  audience: string;
  duration: string;
  style: string;
  language: string;
  speaker: string;
  place: string;
  date: string;
}) => {
  const generated = `
Judul: ${input.title}
Tema: ${input.theme}
Jenis: ${input.type}
Sasaran: ${input.audience}
Durasi: ${input.duration}
Gaya bahasa: ${input.style}
Bahasa: ${input.language}
Penyampai: ${input.speaker}
Tempat: ${input.place}
Tanggal: ${input.date}

Muqaddimah:
Bismillahirrahmanirrahim. Segala puji bagi Allah, Tuhan semesta alam. Syukur kita panjatkan atas nikmat iman, Islam, dan kesehatan, sehingga kita dapat hadir dalam kegiatan ini dengan hati yang bersih dan penuh manfaat.

Isi inti:
Materi ini menekankan pentingnya ${input.theme.toLowerCase()} sebagai bagian dari kehidupan bermasyarakat. Dalam konteks ${input.audience.toLowerCase()}, manusia perlu menumbuhkan kesadaran bahwa ibadah tidak hanya menjadi rutinitas, tetapi juga bentuk aktualisasi akhlak dan ketaatan kepada Allah SWT.

Penutup:
Semoga Allah SWT senantiasa memberi petunjuk dan kekuatan kepada kita untuk mengamalkan ajaran yang telah disampaikan. Aamiin.

Catatan sistem:
- Status AI: Draf AI
- Perlu verifikasi sumber dalil dan referensi sebelum disahkan.
- Hasil ini bersifat pembantu editorial, bukan fatwa resmi Kementerian Agama RI.
  `;

  return {
    title: input.title || 'Naskah Baru',
    content: generated,
    status: 'Draf AI' as const
  };
};

export const generateMaterialDraft = (input: {
  title: string;
  category: string;
  format: string;
  audience: string;
  location: string;
  method: string;
}) => {
  const generated = `
Judul: ${input.title}
Kategori: ${input.category}
Format: ${input.format}
Sasaran: ${input.audience}
Lokasi: ${input.location}
Metode: ${input.method}

Latar belakang:
Materi ini disusun untuk menjawab kebutuhan sasaran dalam memahami dan mengimplementasikan ${input.category.toLowerCase()} secara kontekstual dan aplikatif.

Pokok materi:
1. Pemahaman dasar tema
2. Tantangan dan kebutuhan sasaran
3. Solusi dan aplikasi dalam kehidupan sehari-hari
4. Evaluasi dan tindak lanjut

Kesimpulan:
Diharapkan melalui materi ini, peserta dapat memahami konsep, menerapkan dalam kehidupan sehari-hari, dan menumbuhkan kesadaran untuk terus belajar serta berbuat kebaikan.

Catatan sistem:
- Status AI: Draf AI
- Sumber dalil dan referensi perlu diverifikasi sebelum dipublikasikan.
  `;

  return {
    title: input.title || 'Materi Baru',
    content: generated,
    status: 'Draf AI' as const
  };
};

export const buildAutomaticReport = (items: Array<{ title: string; participants: number; summary: string }>, period: string) => {
  const totalParticipants = items.reduce((sum, item) => sum + item.participants, 0);
  return {
    period,
    totalActivities: items.length,
    totalParticipants,
    narrative: `
Laporan ${period}: Sebanyak ${items.length} kegiatan telah dicatat dan divalidasi dengan total ${totalParticipants} peserta. Kegiatan difokuskan pada materi yang relevan dengan pelayanan masyarakat, penguatan keluarga, dan edukasi keagamaan. Hasilnya menunjukkan bahwa penyuluhan telah membawa manfaat nyata bagi sasaran dan memperkuat dokumentasi kegiatan secara administratif.

Rekap:
- Kegiatan: ${items.length}
- Peserta: ${totalParticipants}
- Fokus utama: edukasi keagamaan, keluarga sakinah, dan moderasi beragama
- Status dokumen: sebagian masih menunggu verifikasi lampiran
    `
  };
};
