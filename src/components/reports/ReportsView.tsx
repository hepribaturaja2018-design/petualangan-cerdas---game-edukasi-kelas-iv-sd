import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  Award,
  Star,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { AppSettings, GameSession } from '../../types';
import { sound } from '../../services/soundService';

interface ReportsViewProps {
  sessions: GameSession[];
  settings: AppSettings;
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  sessions,
  settings,
  onExportCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedSessionDetail, setSelectedSessionDetail] = useState<GameSession | null>(null);

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const matchSearch =
      s.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gameTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject = subjectFilter === 'all' || s.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const totalSessions = sessions.length;
  const avgPercentage =
    totalSessions > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.percentage, 0) / totalSessions)
      : 0;
  const totalStars = sessions.reduce((acc, s) => acc + s.stars, 0);
  const masteryCount = sessions.filter((s) => s.percentage >= 75).length;
  const masteryRate = totalSessions > 0 ? Math.round((masteryCount / totalSessions) * 100) : 0;

  // Analysis of topics needing remedial reinforcement
  const wrongTopicsCount: Record<string, number> = {};
  sessions.forEach((s) => {
    if (Array.isArray(s.answers)) {
      s.answers.forEach((ans) => {
        if (!ans.isCorrect && ans.topic) {
          wrongTopicsCount[ans.topic] = (wrongTopicsCount[ans.topic] || 0) + 1;
        }
      });
    }
  });

  const topRemedialTopics = Object.entries(wrongTopicsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:m-0 print:p-0">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-purple-600" />
            <span>Hasil Belajar & Laporan Pembelajaran</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekap evaluasi hasil petualangan belajar kuis interaktif kelas IV SDN 32 Rantau Bayur.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Laporan</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExportCsv();
            }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-200 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Print Friendly Header (Visible only when printing) */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          PEMERINTAH KABUPATEN BANYUASIN - DINAS PENDIDIKAN
        </h1>
        <h2 className="text-lg font-black uppercase text-slate-900">{settings.schoolName}</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          LAPORAN HASIL BELAJAR DAN EVALUASI PETUALANGAN CERDAS {settings.className.toUpperCase()}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Guru Pengampu: {settings.teacherName} • Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs print:border-slate-300">
          <span className="text-xs font-bold text-slate-500 uppercase">Rata-Rata Kelas</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">{avgPercentage}%</p>
          <span className="text-[11px] text-slate-400">Dari {totalSessions} total sesi</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs print:border-slate-300">
          <span className="text-xs font-bold text-slate-500 uppercase">Tingkat Ketuntasan</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{masteryRate}%</p>
          <span className="text-[11px] text-slate-400">{masteryCount} sesi tuntas (≥ 75%)</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs print:border-slate-300">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Bintang</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400" />
            {totalStars}
          </p>
          <span className="text-[11px] text-slate-400">Bintang prestasi diraih</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs print:border-slate-300">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Sesi Belajar</span>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">{totalSessions}</p>
          <span className="text-[11px] text-slate-400">Permainan diselesaikan</span>
        </div>
      </div>

      {/* Remedial Topics Advice */}
      {topRemedialTopics.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs print:border-slate-300">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Analisis Topik yang Membutuhkan Penguatan / Remedial</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Berdasarkan riwayat akumulasi jawaban kuis siswa, topik berikut paling sering mengalami kekeliruan:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topRemedialTopics.map(([topicName, count]) => (
              <div
                key={topicName}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-extrabold text-slate-800 block text-xs truncate max-w-[170px]">
                    {topicName}
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold">{count} kali jawaban salah</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[10px]">
                  Review
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Hidden during print) */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between print:hidden">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, judul game, atau topik..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">Semua Mata Pelajaran</option>
            <option value="Matematika">Matematika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="IPAS">IPAS</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
          </select>
        </div>
      </div>

      {/* Sessions Records Table */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden print:border-slate-300">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Riwayat Sesi Belajar ({filteredSessions.length} Data)
          </h3>
          <span className="text-xs text-slate-400">Klik baris untuk melihat detail</span>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Belum ada data rekaman hasil belajar yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-amber-50/70 border-b border-amber-200/60 text-slate-600 font-bold">
                  <th className="py-3 px-4">Tanggal & Waktu</th>
                  <th className="py-3 px-4">Nama Siswa / Tim</th>
                  <th className="py-3 px-4">Judul Permainan</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Benar / Soal</th>
                  <th className="py-3 px-4 text-center">Skor</th>
                  <th className="py-3 px-4 text-center">Nilai</th>
                  <th className="py-3 px-4 text-center">Bintang</th>
                  <th className="py-3 px-4 text-center">Durasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map((sess) => (
                  <tr
                    key={sess.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSessionDetail(sess);
                    }}
                    className="hover:bg-amber-50/50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(sess.completedAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <span>{sess.avatar || '⭐'}</span>
                      <span className="truncate max-w-[150px]">{sess.participantName}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 truncate max-w-[160px]">
                      {sess.gameTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {sess.subject}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {sess.correctCount} / {sess.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{sess.score}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-black text-xs ${
                          sess.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : sess.percentage >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sess.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-amber-500">
                      {sess.stars > 0 ? '⭐'.repeat(sess.stars) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">{sess.durationSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSessionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in print:hidden">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Rincian Lembar Jawaban Sesi</h3>
              <button
                onClick={() => setSelectedSessionDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Peserta:</span>
                <span className="font-bold text-slate-800">{selectedSessionDetail.participantName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Permainan:</span>
                <span className="font-bold text-slate-800">{selectedSessionDetail.gameTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nilai Persentase:</span>
                <span className="font-extrabold text-amber-700">{selectedSessionDetail.percentage}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Durasi Pengerjaan:</span>
                <span className="font-semibold text-slate-700">{selectedSessionDetail.durationSeconds} detik</span>
              </div>
            </div>

            {selectedSessionDetail.answers && selectedSessionDetail.answers.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daftar Soal:</p>
                {selectedSessionDetail.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-xs ${
                      ans.isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{idx + 1}.</span>
                      <span className="font-semibold text-slate-800 flex-1">{ans.questionText}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          ans.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {ans.isCorrect ? 'Benar' : 'Salah'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Topik: {ans.topic}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
