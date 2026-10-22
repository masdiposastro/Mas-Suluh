import { useMemo, useState } from 'react';
import type { ActivityEntry, AppSettings, EvidenceItem, GuidanceGroup, MaterialDraft, SermonDraft } from './types';
import { defaultSettings, defaultUser, initialActivities, initialEvidence, initialGroups, initialMaterials, initialReports, initialSermons } from './data/mockData';

const STORAGE_KEY = 'suluh-islami-state';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function App() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'sermon' | 'materials' | 'activity' | 'groups' | 'reports' | 'archive' | 'settings'>('dashboard');
  const [profile] = useState(defaultUser);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored).settings };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  const [sermons, setSermons] = useState<SermonDraft[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).sermons || initialSermons;
      } catch {
        return initialSermons;
      }
    }
    return initialSermons;
  });
  const [materials, setMaterials] = useState<MaterialDraft[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).materials || initialMaterials;
      } catch {
        return initialMaterials;
      }
    }
    return initialMaterials;
  });
  const [activities, setActivities] = useState<ActivityEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).activities || initialActivities;
      } catch {
        return initialActivities;
      }
    }
    return initialActivities;
  });
  const [groups, setGroups] = useState<GuidanceGroup[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).groups || initialGroups;
      } catch {
        return initialGroups;
      }
    }
    return initialGroups;
  });
  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).evidence || initialEvidence;
      } catch {
        return initialEvidence;
      }
    }
    return initialEvidence;
  });

  useEffect(() => {
    const state = { sermons, materials, activities, groups, evidence, settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [sermons, materials, activities, groups, evidence, settings]);

  const stats = useMemo(() => {
    const thisMonth = activities.filter((item) => item.date.startsWith('2026-10')).length;
    const totalParticipants = activities.reduce((sum, item) => sum + item.participants, 0);
    const pendingReview = sermons.filter((item) => item.status !== 'Disetujui pengguna').length + materials.filter((item) => item.status !== 'Disetujui pengguna').length;
    return {
      thisMonth,
      totalParticipants,
      sermonCount: sermons.length,
      groupCount: groups.length,
      reportCount: activities.length,
      pendingReview
    };
  }, [activities, sermons, groups, materials]);

  const [sermonForm, setSermonForm] = useState({
    title: '',
    theme: 'Keikhlasan dalam ibadah',
    type: 'Khutbah Jumat',
    audience: 'Jamaah masjid',
    duration: '20 menit',
    style: 'Komunikatif',
    language: 'Indonesia',
    speaker: profile.name,
    place: 'Masjid Al-Hidayah',
    date: '2026-10-25'
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    category: 'Moderasi beragama',
    format: 'Naskah penyuluhan',
    audience: 'Remaja dan keluarga',
    location: 'Masjid dan sekolah',
    method: 'Ceramah interaktif'
  });

  const [activityForm, setActivityForm] = useState({
    title: '',
    type: 'Penyuluhan tatap muka' as ActivityEntry['type'],
    date: '2026-10-20',
    location: '',
    participants: 30,
    summary: ''
  });

  const [groupForm, setGroupForm] = useState({
    name: '',
    category: 'Majelis taklim',
    leader: '',
    location: '',
    members: 20
  });

  const [reportPeriod, setReportPeriod] = useState('Bulan ini');

  const handleGenerateSermon = () => {
    const generated = generateSermonDraft(sermonForm);
    setSermons((current) => [{
      id: createId('sermon'),
      title: generated.title,
      theme: sermonForm.theme,
      type: sermonForm.type,
      audience: sermonForm.audience,
      status: generated.status,
      content: generated.content,
      createdAt: new Date().toISOString().slice(0, 10)
    }, ...current]);
    setActiveSection('sermon');
  };

  const handleGenerateMaterial = () => {
    const generated = generateMaterialDraft(materialForm);
    setMaterials((current) => [{
      id: createId('material'),
      title: generated.title,
      category: materialForm.category,
      format: materialForm.format,
      status: generated.status,
      content: generated.content,
      createdAt: new Date().toISOString().slice(0, 10)
    }, ...current]);
    setActiveSection('materials');
  };

  const handleAddActivity = () => {
    if (!activityForm.title.trim()) return;
    setActivities((current) => [{
      id: createId('activity'),
      title: activityForm.title,
      type: activityForm.type,
      date: activityForm.date,
      location: activityForm.location || 'Lokasi belum diisi',
      participants: Number(activityForm.participants) || 0,
      summary: activityForm.summary || 'Ringkasan belum ditulis.',
      status: 'Tersimpan'
    }, ...current]);
    setActivityForm({
      title: '',
      type: 'Penyuluhan tatap muka',
      date: '2026-10-20',
      location: '',
      participants: 30,
      summary: ''
    });
    setActiveSection('activity');
  };

  const handleAddGroup = () => {
    if (!groupForm.name.trim()) return;
    setGroups((current) => [{
      id: createId('group'),
      name: groupForm.name,
      category: groupForm.category,
      leader: groupForm.leader || 'Belum ditentukan',
      location: groupForm.location || 'Belum ditentukan',
      members: Number(groupForm.members) || 0,
      status: 'Aktif'
    }, ...current]);
    setGroupForm({
      name: '',
      category: 'Majelis taklim',
      leader: '',
      location: '',
      members: 20
    });
    setActiveSection('groups');
  };

  const report = buildAutomaticReport(activities.map((item) => ({
    title: item.title,
    participants: item.participants,
    summary: item.summary
  })), reportPeriod);

  const renderNavButton = (key: string, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setActiveSection(key as any)}
      className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
        activeSection === key
          ? 'bg-brand-700 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-72">
            <div className="card">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-700">SULUH ISLAMI</p>
                  <h1 className="mt-2 text-xl font-bold text-slate-900">Penyuluh Agama</h1>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {settings.aiMode === 'demo' ? 'Demo AI' : 'Live AI'}
                </div>
              </div>

              <nav className="space-y-2">
                {renderNavButton('dashboard', 'Dashboard')}
                {renderNavButton('sermon', 'Generator Khutbah')}
                {renderNavButton('materials', 'Generator Materi')}
                {renderNavButton('activity', 'Catat Kegiatan')}
                {renderNavButton('groups', 'Kelompok Binaan')}
                {renderNavButton('reports', 'Laporan Kegiatan')}
                {renderNavButton('archive', 'Eviden & Lampiran')}
                {renderNavButton('settings', 'Pengaturan')}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <header className="card mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Selamat datang</p>
                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="badge">{profile.position}</span>
                <span className="badge">{profile.unit}</span>
              </div>
            </header>

            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {[
                    ['Kegiatan bulan ini', stats.thisMonth],
                    ['Peserta tercatat', stats.totalParticipants],
                    ['Naskah dibuat', sermons.length],
                    ['Kelompok binaan', groups.length],
                    ['Dokumen rencana', stats.pendingReview]
                  ].map(([label, value]) => (
                    <div key={label} className="card">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-3 text-3xl font-bold text-brand-700">{value}</p>
                    </div>
                  ))}
                </section>

                <section className="card">
                  <h3 className="section-title">Statistik kegiatan</h3>
                  <div className="mt-5 flex h-48 items-end gap-3">
                    {[45, 52, 68, 60, 88, 70, 94].map((value, index) => (
                      <div key={index} className="flex-1 rounded-t-xl bg-brand-500/80" style={{ height: `${value}%` }}>
                        <span className="block pt-2 text-center text-xs text-slate-700">{['J', 'F', 'M', 'A', 'M', 'J', 'J'][index]}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'sermon' && (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="card">
                  <h3 className="section-title">Generator naskah khutbah</h3>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <input value={sermonForm.title} onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Judul naskah" />
                    <input value={sermonForm.theme} onChange={(e) => setSermonForm({ ...sermonForm, theme: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Tema utama" />
                    <select value={sermonForm.type} onChange={(e) => setSermonForm({ ...sermonForm, type: e.target.value })} className="rounded-xl border border-slate-200 p-3">
                      <option>Khutbah Jumat</option>
                      <option>Khutbah Idulfitri</option>
                      <option>Khutbah Iduladha</option>
                      <option>Ceramah umum</option>
                    </select>
                    <input value={sermonForm.audience} onChange={(e) => setSermonForm({ ...sermonForm, audience: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Sasaran jamaah" />
                    <input value={sermonForm.duration} onChange={(e) => setSermonForm({ ...sermonForm, duration: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Durasi" />
                    <select value={sermonForm.style} onChange={(e) => setSermonForm({ ...sermonForm, style: e.target.value })} className="rounded-xl border border-slate-200 p-3">
                      <option>Komunikatif</option>
                      <option>Formal</option>
                      <option>Populer</option>
                      <option>Akademis</option>
                    </select>
                    <select value={sermonForm.language} onChange={(e) => setSermonForm({ ...sermonForm, language: e.target.value })} className="rounded-xl border border-slate-200 p-3">
                      <option>Indonesia</option>
                      <option>Jawa</option>
                      <option>Madura</option>
                    </select>
                    <input value={sermonForm.speaker} onChange={(e) => setSermonForm({ ...sermonForm, speaker: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Nama penyuluh" />
                    <input value={sermonForm.place} onChange={(e) => setSermonForm({ ...sermonForm, place: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Tempat kegiatan" />
                    <input type="date" value={sermonForm.date} onChange={(e) => setSermonForm({ ...sermonForm, date: e.target.value })} className="rounded-xl border border-slate-200 p-3" />
                  </div>
                  <button type="button" onClick={handleGenerateSermon} className="mt-5 rounded-xl bg-brand-700 px-4 py-3 font-medium text-white">Generate draft</button>
                </div>

                <div className="space-y-4">
                  {sermons.slice(0, 4).map((item) => (
                    <div key={item.id} className="card">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                        <span className="badge">{item.status}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{item.type} • {item.audience}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.content.slice(0, 120)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'materials' && (
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div className="card">
                  <h3 className="section-title">Generator materi bimbingan</h3>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <input value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Judul materi" />
                    <select value={materialForm.category} onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })} className="rounded-xl border border-slate-200 p-3">
                      <option>Keluarga sakinah</option>
                      <option>Moderasi beragama</option>
                      <option>Literasi digital</option>
                      <option>Akhlak</option>
                    </select>
                    <select value={materialForm.format} onChange={(e) => setMaterialForm({ ...materialForm, format: e.target.value })} className="rounded-xl border border-slate-200 p-3">
                      <option>Naskah penyuluhan</option>
                      <option>Modul pembelajaran</option>
                      <option>Handout peserta</option>
                      <option>Slide presentasi</option>
                    </select>
                    <input value={materialForm.audience} onChange={(e) => setMaterialForm({ ...materialForm, audience: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Sasaran" />
                    <input value={materialForm.location} onChange={(e) => setMaterialForm({ ...materialForm, location: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Lokasi" />
                    <input value={materialForm.method} onChange={(e) => setMaterialForm({ ...materialForm, method: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Metode" />
                  </div>
                  <button type="button" onClick={handleGenerateMaterial} className="mt-5 rounded-xl bg-brand-700 px-4 py-3 font-medium text-white">Generate materi</button>
                </div>

                <div className="space-y-4">
                  {materials.slice(0, 4).map((item) => (
                    <div key={item.id} className="card">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                        <span className="badge">{item.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.category} • {item.format}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.content.slice(0, 120)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'activity' && (
              <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
                <div className="card">
                  <h3 className="section-title">Catat kegiatan</h3>
                  <div className="mt-5 space-y-4">
                    <input value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Judul kegiatan" />
                    <select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as ActivityEntry['type'] })} className="w-full rounded-xl border border-slate-200 p-3">
                      <option>Penyuluhan tatap muka</option>
                      <option>Bimbingan kelompok</option>
                      <option>Bimbingan perkawinan</option>
                      <option>Ceramah agama</option>
                    </select>
                    <input type="date" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" />
                    <input value={activityForm.location} onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Lokasi kegiatan" />
                    <input type="number" value={activityForm.participants} onChange={(e) => setActivityForm({ ...activityForm, participants: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Jumlah peserta" />
                    <textarea value={activityForm.summary} onChange={(e) => setActivityForm({ ...activityForm, summary: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" rows={4} placeholder="Ringkasan hasil kegiatan" />
                    <button type="button" onClick={handleAddActivity} className="w-full rounded-xl bg-brand-700 px-4 py-3 font-medium text-white">Simpan kegiatan</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {activities.map((item) => (
                    <div key={item.id} className="card">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                        <span className="badge">{item.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.type} • {item.date}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.location} • {item.participants} peserta</p>
                      <p className="mt-3 text-sm text-slate-700">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'groups' && (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="card">
                  <h3 className="section-title">Tambah kelompok binaan</h3>
                  <div className="mt-5 space-y-4">
                    <input value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Nama kelompok" />
                    <select value={groupForm.category} onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3">
                      <option>Majelis taklim</option>
                      <option>Remaja</option>
                      <option>Keluarga</option>
                      <option>Komunitas masjid</option>
                    </select>
                    <input value={groupForm.leader} onChange={(e) => setGroupForm({ ...groupForm, leader: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Penanggung jawab" />
                    <input value={groupForm.location} onChange={(e) => setGroupForm({ ...groupForm, location: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Alamat / wilayah" />
                    <input type="number" value={groupForm.members} onChange={(e) => setGroupForm({ ...groupForm, members: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 p-3" placeholder="Jumlah anggota" />
                    <button type="button" onClick={handleAddGroup} className="w-full rounded-xl bg-brand-700 px-4 py-3 font-medium text-white">Simpan kelompok</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {groups.map((group) => (
                    <div key={group.id} className="card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-800">{group.name}</h4>
                          <p className="mt-1 text-sm text-slate-600">{group.category}</p>
                        </div>
                        <span className="badge">{group.status}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">Penanggung jawab: {group.leader}</p>
                      <p className="mt-1 text-sm text-slate-500">{group.location} • {group.members} anggota</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="section-title">Laporan otomatis</h3>
                    <select value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)} className="rounded-xl border border-slate-200 p-3">
                      <option>Bulan ini</option>
                      <option>Triwulan ini</option>
                      <option>Tahun ini</option>
                    </select>
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-brand-700">{report.period}</p>
                    <h4 className="mt-2 text-xl font-semibold text-slate-900">Ringkasan laporan</h4>
                    <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">{report.narrative}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'archive' && (
              <div className="card">
                <h3 className="section-title">Eviden dan lampiran</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {evidence.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                        <span className={`badge ${item.verified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                          {item.verified ? 'Terverifikasi' : 'Perlu verifikasi'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.type} • {item.fileSize}</p>
                      <p className="mt-1 text-sm text-slate-500">Kegiatan: {item.linkedActivity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="card">
                <h3 className="section-title">Pengaturan aplikasi</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input value={settings.orgName} onChange={(e) => setSettings({ ...settings, orgName: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Nama instansi" />
                  <input value={settings.orgCode} onChange={(e) => setSettings({ ...settings, orgCode: e.target.value })} className="rounded-xl border border-slate-200 p-3" placeholder="Kode instansi" />
                  <select value={settings.aiMode} onChange={(e) => setSettings({ ...settings, aiMode: e.target.value as AppSettings['aiMode'] })} className="rounded-xl border border-slate-200 p-3">
                    <option value="demo">Demo AI</option>
                    <option value="live">Live AI</option>
                  </select>
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                    <input type="checkbox" checked={settings.requireVerification} onChange={(e) => setSettings({ ...settings, requireVerification: e.target.checked })} />
                    <span>Wajib verifikasi referensi</span>
                  </label>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
