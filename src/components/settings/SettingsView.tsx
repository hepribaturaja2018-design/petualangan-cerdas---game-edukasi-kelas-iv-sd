import React, { useState, useRef } from 'react';
import {
  Settings,
  School,
  User,
  Volume2,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  HelpCircle,
} from 'lucide-react';
import { AppSettings, AppStateData } from '../../types';
import { sound } from '../../services/soundService';
import { storage } from '../../services/storageService';

interface SettingsViewProps {
  settings: AppSettings;
  state: AppStateData;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onBackupJson: () => void;
  onRestoreState: (importedState: AppStateData) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  state,
  onUpdateSettings,
  onBackupJson,
  onRestoreState,
  onResetData,
}) => {
  const [formSettings, setFormSettings] = useState<AppSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  // Import State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importSummary, setImportSummary] = useState<any | null>(null);
  const [pendingImportData, setPendingImportData] = useState<AppStateData | null>(null);
  const [importError, setImportError] = useState<string>('');

  // Reset Confirm State
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCorrect();
    onUpdateSettings(formSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    setImportSummary(null);
    setPendingImportData(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validation = storage.validateImportedJson(parsed);

        if (!validation.valid) {
          sound.playIncorrect();
          setImportError(validation.message);
          return;
        }

        sound.playClick();
        setPendingImportData(parsed);
        setImportSummary(validation.summary);
      } catch (err) {
        sound.playIncorrect();
        setImportError('Berkas gagal dibaca. Pastikan format file adalah JSON cadangan yang valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;
    sound.playFanfare();
    onRestoreState(pendingImportData);
    setPendingImportData(null);
    setImportSummary(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-slate-700" />
          <span>Pengaturan Aplikasi</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sesuaikan profil institusi, identitas kelas, preferensi audio, serta kelola pencadangan data lokal.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Profil Sekolah & Guru */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
            <School className="w-4 h-4 text-amber-600" />
            <span>Identitas Sekolah & Pengampu</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={formSettings.schoolName}
                onChange={(e) => setFormSettings({ ...formSettings, schoolName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelas</label>
              <input
                type="text"
                value={formSettings.className}
                onChange={(e) => setFormSettings({ ...formSettings, className: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Guru Kelas</label>
              <input
                type="text"
                value={formSettings.teacherName}
                onChange={(e) => setFormSettings({ ...formSettings, teacherName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Preferensi Audio & Permainan */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Preferensi Permainan & Suara</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Efek Suara Sintetis</span>
                <span className="text-[11px] text-slate-500">
                  Bunyi chime saat benar, nada lembut saat salah, dan fanfare saat menang.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.soundEnabled}
                onChange={(e) => setFormSettings({ ...formSettings, soundEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Animasi & Konfeti</span>
                <span className="text-[11px] text-slate-500">
                  Transisi kartu dan hujan konfeti saat menyelesaikan kuis petualangan.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.animationsEnabled}
                onChange={(e) => setFormSettings({ ...formSettings, animationsEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save button bar */}
        <div className="flex items-center justify-end gap-3">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Pengaturan berhasil disimpan!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-200 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Section 3: Pencadangan & Pemulihan Data Lokal */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Download className="w-4 h-4 text-sky-600" />
            <span>Pencadangan & Pemulihan Data Lokal</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Data tersimpan secara persisten pada browser lokal guru. Simpan cadangan berkala ke berkas JSON agar data aman jika komputer berganti atau cache browser dibersihkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Backup Action */}
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sky-950 text-sm">Unduh Cadangan Lengkap</h4>
              <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                Menyimpan seluruh data siswa, bank soal, kuis, dan riwayat belajar ke berkas JSON di perangkat Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onBackupJson();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Cadangan JSON</span>
            </button>
          </div>

          {/* Restore Action */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">Pulihkan dari Cadangan</h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Pilih berkas cadangan JSON yang telah diunduh sebelumnya untuk memulihkan seluruh data kelas.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas JSON Cadangan</span>
              </button>
            </div>
          </div>
        </div>

        {importError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Import Preview Modal / Box */}
        {importSummary && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-extrabold text-emerald-950 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Berkas Cadangan Valid! Pratinjau Isi:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-center">
                <span className="text-slate-500 block text-[10px]">Siswa</span>
                <span className="font-bold text-slate-800 text-sm">{importSummary.studentsCount} orang</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-center">
                <span className="text-slate-500 block text-[10px]">Bank Soal</span>
                <span className="font-bold text-slate-800 text-sm">{importSummary.questionsCount} butir</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-center">
                <span className="text-slate-500 block text-[10px]">Permainan</span>
                <span className="font-bold text-slate-800 text-sm">{importSummary.gamesCount} misi</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-center">
                <span className="text-slate-500 block text-[10px]">Sesi Belajar</span>
                <span className="font-bold text-slate-800 text-sm">{importSummary.sessionsCount} sesi</span>
              </div>
            </div>

            <p className="text-xs text-emerald-800">
              Sekolah asal: <span className="font-bold">{importSummary.schoolName}</span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setImportSummary(null);
                  setPendingImportData(null);
                }}
                className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Terapkan & Pulihkan Data
              </button>
            </div>
          </div>
        )}

        {/* Section 4: Reset Data */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Zona Bahaya</h4>
            <p className="text-xs text-slate-500">
              Reset seluruh data ke kondisi awal pabrik dengan paket bank soal default.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowResetConfirm(true);
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
          >
            Reset Data Aplikasi
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Reset Seluruh Data?</h4>
            <p className="text-xs text-slate-600 mb-5">
              Tindakan ini akan mengembalikan data siswa, bank soal, dan hasil belajar ke paket awal. Pastikan Anda telah mengunduh cadangan JSON terlebih dahulu.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
