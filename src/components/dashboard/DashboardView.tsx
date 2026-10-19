import React from 'react';
import {
  Users,
  Gamepad2,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
} from 'lucide-react';
import { ActiveNavTab, AppStateData, Game, GameSession, Student } from '../../types';
import { sound } from '../../services/soundService';

interface DashboardViewProps {
  state: AppStateData;
  onNavigate: (tab: ActiveNavTab) => void;
  onQuickStartGame: (game: Game) => void;
  onBackupData: () => void;
  onOpenAddQuestion?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate,
  onQuickStartGame,
  onBackupData,
  onOpenAddQuestion,
}) => {
  const { students, games, questions, sessions, settings } = state;

  const totalStudents = students.length;
  const totalGames = games.length;
  const totalQuestions = questions.length;
  const totalSessions = sessions.length;

  // Calculate average class score
  const avgScore =
    totalSessions > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.percentage, 0) / totalSessions)
      : 0;

  // Mastery distribution:
  // Tinggi (>= 80%), Sedang (60-79%), Perlu Bimbingan (< 60%)
  const highMastery = sessions.filter((s) => s.percentage >= 80).length;
  const mediumMastery = sessions.filter((s) => s.percentage >= 60 && s.percentage < 80).length;
  const lowMastery = sessions.filter((s) => s.percentage < 60).length;

  // Subject distribution
  const subjectPlayCounts: Record<string, number> = {
    Matematika: 0,
    'Bahasa Indonesia': 0,
    IPAS: 0,
    'Pendidikan Pancasila': 0,
  };
  sessions.forEach((s) => {
    if (subjectPlayCounts[s.subject] !== undefined) {
      subjectPlayCounts[s.subject]++;
    }
  });

  // Recent 5 sessions
  const recentSessions = [...sessions].reverse().slice(0, 5);

  // Recommendations for teacher
  const recommendations: string[] = [];
  if (totalStudents === 0) {
    recommendations.push('Belum ada data siswa. Daftarkan siswa kelas IV untuk mulai mencatat riwayat belajar.');
  } else if (totalSessions === 0) {
    recommendations.push('Mulai sesi kuis pertama dari menu Dunia Petualangan atau Permainan Kelas!');
  } else {
    if (lowMastery > 0) {
      recommendations.push(
        `Terdapat ${lowMastery} sesi dengan nilai di bawah 60%. Pertimbangkan melakukan review materi pada sesi tanya jawab kelas.`
      );
    }
    if (avgScore >= 80) {
      recommendations.push(
        'Rata-rata kelas sangat baik (≥ 80%). Siswa siap untuk tantangan tingkat Menantang pada topik berikutnya!'
      );
    }
    recommendations.push('Gunakan alat bantu Aktivitas Kelas (Pengacak Nama / Roda Keberuntungan) untuk menghidupkan suasana belajar.');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-lg shadow-orange-200/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-amber-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Selamat Datang, Bapak {settings.teacherName}!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Petualangan Cerdas {settings.className}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-amber-100 leading-relaxed font-medium">
            Ubah suasana kelas di <span className="font-bold text-white">{settings.schoolName}</span> menjadi ajang
            petualangan belajar yang seru, interaktif, dan penuh prestasi!
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('adventure');
              }}
              className="px-5 py-2.5 rounded-2xl bg-white text-orange-600 font-extrabold text-xs sm:text-sm shadow-md hover:bg-amber-50 transition transform active:scale-95 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-orange-500" />
              <span>Jelajahi Dunia Petualangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('classroom-tools');
              }}
              className="px-4 py-2.5 rounded-2xl bg-orange-700/60 hover:bg-orange-700/80 text-white font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-xs transition"
            >
              Buka Aktivitas Kelas
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-24 top-0 -translate-y-8 w-40 h-40 rounded-full bg-amber-400/20 pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Siswa</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalStudents}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Siswa terdaftar aktif</p>
        </div>

        {/* Total Permainan */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Permainan</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalGames}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Misi siap dimainkan</p>
        </div>

        {/* Total Soal */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Bank Soal</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalQuestions}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Butir soal terverifikasi</p>
        </div>

        {/* Sesi Selesai */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Sesi Selesai</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSessions}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Rata-rata: {avgScore}%</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Aksi Cepat Guru</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('students');
            }}
            className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-sky-600" />
            <span>Tambah Siswa</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('game-builder');
            }}
            className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4 text-indigo-600" />
            <span>Buat Game</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('adventure');
            }}
            className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Mulai Misi</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenAddQuestion) {
                onOpenAddQuestion();
              } else {
                onNavigate('question-bank');
              }
            }}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Tambah Soal</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('reports');
            }}
            className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Lihat Laporan</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onBackupData();
            }}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Cadangkan Data</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visualisasi & Ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Charts & Mastery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tingkat Penguasaan & Mapel Chart */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span>Distribusi Penguasaan Materi</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{totalSessions} sesi dievaluasi</span>
            </div>

            {totalSessions === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                Belum ada data sesi permainan untuk divisualisasikan.
              </div>
            ) : (
              <div className="space-y-4">
                {/* 3 Mastery Bars */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-700">Tinggi (Nilai ≥ 80%)</span>
                    <span className="text-emerald-900">{highMastery} sesi ({Math.round((highMastery / totalSessions) * 100)}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(highMastery / totalSessions) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-700">Sedang (Nilai 60% - 79%)</span>
                    <span className="text-amber-900">{mediumMastery} sesi ({Math.round((mediumMastery / totalSessions) * 100)}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${(mediumMastery / totalSessions) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-rose-700">Perlu Bimbingan (Nilai &lt; 60%)</span>
                    <span className="text-rose-900">{lowMastery} sesi ({Math.round((lowMastery / totalSessions) * 100)}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${(lowMastery / totalSessions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Subject Activity Breakdown */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Aktivitas per Mata Pelajaran
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-amber-800 font-bold block">Matematika</span>
                      <span className="text-base font-extrabold text-amber-950">{subjectPlayCounts.Matematika} kali</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200">
                      <span className="text-sky-800 font-bold block">B. Indonesia</span>
                      <span className="text-base font-extrabold text-sky-950">{subjectPlayCounts['Bahasa Indonesia']} kali</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-800 font-bold block">IPAS</span>
                      <span className="text-base font-extrabold text-emerald-950">{subjectPlayCounts.IPAS} kali</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                      <span className="text-rose-800 font-bold block">Pancasila</span>
                      <span className="text-base font-extrabold text-rose-950">{subjectPlayCounts['Pendidikan Pancasila']} kali</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Playable Games */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-indigo-600" />
                <span>Misi Siap Dimainkan</span>
              </h3>
              <button
                onClick={() => onNavigate('adventure')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {games.slice(0, 4).map((game) => (
                <div
                  key={game.id}
                  className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                        {game.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">{game.questionIds.length} Soal</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{game.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{game.topic}</p>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onQuickStartGame(game);
                    }}
                    className="mt-3 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Mulai Main</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Recent Sessions */}
        <div className="space-y-6">
          {/* Teacher Recommendations */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Rekomendasi Tindak Lanjut</span>
            </h3>
            <div className="space-y-2.5">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950 leading-relaxed flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Learning Sessions */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Hasil Terbaru</span>
              </h3>
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Semua
              </button>
            </div>

            {recentSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada riwayat permainan.</p>
            ) : (
              <div className="space-y-2.5">
                {recentSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-amber-200 bg-slate-50/50 hover:bg-white transition flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-xl shrink-0">{sess.avatar || '⭐'}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{sess.participantName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{sess.gameTitle}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-amber-700 block">{sess.percentage}%</span>
                      <span className="text-[10px] text-slate-400">
                        {sess.stars > 0 ? '⭐'.repeat(sess.stars) : 'Partisipasi'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
