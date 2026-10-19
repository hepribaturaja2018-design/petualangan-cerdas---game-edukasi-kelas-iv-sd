import React from 'react';
import {
  Compass,
  School,
  User,
  Phone,
  ShieldCheck,
  Cpu,
  Database,
  Sparkles,
  Heart,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Brand & Identity Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-200/50">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl shadow-inner shrink-0">
            🧭
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-amber-100 mb-2 border border-white/20">
              <span>Versi 1.0.0 Edu-Release</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">PETUALANGAN CERDAS</h2>
            <p className="text-sm font-semibold text-amber-100 mt-1">
              Game Edukasi Interaktif Kelas IV Sekolah Dasar
            </p>
            <p className="text-xs sm:text-sm text-white/95 italic mt-2">
              &ldquo;Belajar Seru, Berpetualang, Raih Prestasi!&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Developer & Institution Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Institusi */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Identitas Institusi
              </span>
              <h3 className="text-lg font-black text-slate-800">SDN 32 Rantau Bayur</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Didedikasikan untuk mendukung kegiatan belajar mengajar aktif, menyenangkan, dan berpusat pada siswa di SDN 32 Rantau Bayur, Kabupaten Banyuasin.
          </p>
        </div>

        {/* Pengembang */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Pengembang Aplikasi
              </span>
              <h3 className="text-lg font-black text-slate-800">Hepri Joni</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Kontak Pengembang:</span>
            <a href="tel:081367963694" className="font-extrabold text-amber-700 hover:underline">
              081367963694
            </a>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Nomor kontak dicantumkan untuk kemudahan konsultasi teknis dan masukan pengembangan aplikasi oleh pendidik.
          </p>
        </div>
      </div>

      {/* Feature & Privacy Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-sm">Penyimpanan Lokal Mandiri</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data tersimpan aman di browser Anda menggunakan localStorage dan format JSON yang dapat dicadangkan kapan saja tanpa server database luar.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-sm">Privasi Ramah Anak</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Minimisasi data privasi: tidak meminta NIK, alamat rumah, atau data sensitif. Bebas iklan dan bebas pelacak komersial.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-sm">Integrasi AI Opsional</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Didukung fitur opsional Google Gemini API untuk membantu merancang variasi soal. Aplikasi tetap 100% berfungsi normal tanpa koneksi AI.
          </p>
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3">
        <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-600" />
          <span>Arsitektur & Spesifikasi Teknologi</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="font-bold text-slate-800 block">Frontend</span>
            <span className="text-slate-500">React 19 + TypeScript</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="font-bold text-slate-800 block">Desain UI</span>
            <span className="text-slate-500">Tailwind CSS + Lucide</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="font-bold text-slate-800 block">Efek Suara</span>
            <span className="text-slate-500">Web Audio API Sintetis</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="font-bold text-slate-800 block">Laporan Hasil</span>
            <span className="text-slate-500">CSV BOM + Cetak Ramah Kertas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
