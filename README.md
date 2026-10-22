# Mas-Suluh

Aplikasi web generator naskah khutbah, materi bimbingan dan penyuluhan, serta laporan kegiatan penyuluh agama Islam. Repositori ini berisi prototype MVP berbasis React + TypeScript + Vite dengan desain admin, struktur data, skema database, dan dokumentasi deployment yang siap dikembangkan lebih lanjut ke versi produksi.

## Fitur utama

- Dashboard penyuluh dengan ringkasan aktivitas
- Generator naskah khutbah dan materi penyuluhan
- Pencatatan kegiatan dan laporan otomatis
- Manajemen kelompok binaan
- Dokumentasi eviden dan arsip
- Mode AI demo yang jelas diberi label
- Skema database PostgreSQL/Supabase
- Dokumentasi instalasi dan deployment

## Teknologi

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS
- Database: PostgreSQL / Supabase
- AI: service terpisah dengan mode demo

## Cara menjalankan

1. Instal dependensi:
   npm install
2. Salin file contoh environment:
   cp .env.example .env
3. Jalankan aplikasi:
   npm run dev
4. Build untuk produksi:
   npm run build

## Struktur utama

- src/App.tsx — aplikasi utama
- src/data/mockData.ts — data pengujian dan contoh data
- src/lib/aiService.ts — layanan AI demo
- database/schema.sql — skema database
- docs/DEVELOPMENT_PLAN.md — roadmap implementasi

## Catatan keamanan

- API key tidak disimpan di frontend.
- Mode AI saat ini adalah demo dan diberi label jelas.
- Integrasi AI nyata perlu dikonfigurasi melalui variabel lingkungan dan backend aman.

## Roadmap aplikasi

Tahap 1 sampai 9 sesuai master prompt telah diimplementasikan dalam bentuk fondasi dan prototipe aplikasi yang dapat berjalan.
