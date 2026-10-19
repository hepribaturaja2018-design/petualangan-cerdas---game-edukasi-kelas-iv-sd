import React, { useState } from 'react';
import {
  Compass,
  Play,
  Star,
  CheckCircle2,
  TreePine,
  BookMarked,
  FlaskConical,
  Flag,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { Game, GameSession, Student } from '../../types';
import { sound } from '../../services/soundService';

interface AdventureWorldViewProps {
  games: Game[];
  sessions: GameSession[];
  students: Student[];
  onStartMission: (game: Game, student?: Student) => void;
}

export const AdventureWorldView: React.FC<AdventureWorldViewProps> = ({
  games,
  sessions,
  students,
  onStartMission,
}) => {
  const [selectedRealm, setSelectedRealm] = useState<'all' | 'numerasi' | 'kata' | 'alam' | 'pancasila'>('all');
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || '');

  const activeStudent = students.find((s) => s.id === activeStudentId);

  // Realms meta
  const realms = [
    {
      id: 'numerasi',
      name: 'Hutan Numerasi',
      subject: 'Matematika',
      icon: <TreePine className="w-6 h-6 text-emerald-700" />,
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Lembah perhitungan, petualangan pecahan senilai, dan teka-teki pengukuran panjang.',
    },
    {
      id: 'kata',
      name: 'Negeri Kata',
      subject: 'Bahasa Indonesia',
      icon: <BookMarked className="w-6 h-6 text-sky-700" />,
      color: 'from-sky-500 to-indigo-600',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      description: 'Menara kosakata, istana kalimat efektif, dan misteri pencarian gagasan pokok paragraf.',
    },
    {
      id: 'alam',
      name: 'Laboratorium Alam',
      subject: 'IPAS',
      icon: <FlaskConical className="w-6 h-6 text-amber-700" />,
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Eksperimen keajaiban fotosintesis, bagian tumbuhan, dan energi di lingkungan sekitar.',
    },
    {
      id: 'pancasila',
      name: 'Pulau Pancasila',
      subject: 'Pendidikan Pancasila',
      icon: <Flag className="w-6 h-6 text-rose-700" />,
      color: 'from-rose-500 to-red-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Teluk gotong royong, tugu persatuan Bhinneka Tunggal Ika, dan benteng musyawarah mufakat.',
    },
  ];

  // Map games to realm and check status
  const getGameStatus = (game: Game) => {
    const studentSessions = sessions.filter(
      (s) => s.gameId === game.id && (activeStudentId ? s.participantId === activeStudentId : true)
    );
    if (studentSessions.length === 0) return { status: 'Belum Dimainkan', stars: 0, highscore: 0 };
    const maxScore = Math.max(...studentSessions.map((s) => s.percentage));
    const maxStars = Math.max(...studentSessions.map((s) => s.stars));
    return {
      status: 'Selesai',
      stars: maxStars,
      highscore: maxScore,
    };
  };

  const filteredGames = games.filter((g) => {
    if (selectedRealm === 'all') return true;
    if (selectedRealm === 'numerasi') return g.subject === 'Matematika';
    if (selectedRealm === 'kata') return g.subject === 'Bahasa Indonesia';
    if (selectedRealm === 'alam') return g.subject === 'IPAS';
    if (selectedRealm === 'pancasila') return g.subject === 'Pendidikan Pancasila';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Adventure Map Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 p-6 sm:p-8 text-white shadow-xl shadow-amber-300/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-amber-100 mb-3 border border-white/20">
            <Compass className="w-3.5 h-3.5 text-amber-200" />
            <span>Peta Ekspedisi Belajar SD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Dunia Petualangan Cerdas
          </h2>
          <p className="mt-2 text-sm sm:text-base text-amber-100 leading-relaxed font-medium">
            Jelajahi 4 wilayah edukasi interaktif untuk siswa kelas IV SDN 32 Rantau Bayur. Taklukkan setiap misi, kumpulkan bintang, dan raih lencana kehormatan!
          </p>

          {/* Active Student Selector */}
          <div className="mt-5 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{activeStudent?.avatar || '🧭'}</span>
              <div>
                <p className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">Pemain yang Sedang Aktif:</p>
                <p className="text-sm font-extrabold text-white">
                  {activeStudent ? activeStudent.name : 'Mode Tamu / Seluruh Kelas'}
                </p>
              </div>
            </div>

            {students.length > 0 && (
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold border-none shadow-xs focus:ring-2 focus:ring-amber-300 cursor-pointer"
              >
                <option value="">Pilih Siswa...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.avatar} {s.name} ({s.group})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Decorative Map SVG Graphic in Background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-20 pointer-events-none hidden md:block">
          <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-current">
            <path d="M40 30 Q60 10 90 40 T160 50 Q180 90 150 140 T80 170 Q20 160 30 110 Z" />
            <circle cx="70" cy="60" r="8" fill="#fff" />
            <circle cx="120" cy="90" r="8" fill="#fff" />
            <circle cx="90" cy="140" r="8" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* 4 Island / Realm Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {realms.map((realm) => {
          const isSelected = selectedRealm === realm.id;
          return (
            <button
              key={realm.id}
              onClick={() => {
                sound.playClick();
                setSelectedRealm(isSelected ? 'all' : (realm.id as any));
              }}
              className={`p-4 rounded-3xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300 scale-102'
                  : 'bg-white border-amber-200/80 hover:border-amber-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                    {realm.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${realm.badgeBg}`}>
                    {realm.subject}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{realm.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{realm.description}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>{games.filter((g) => g.subject === realm.subject).length} Misi</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {isSelected ? 'Terpilih' : 'Klik Filter'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicator */}
      {selectedRealm !== 'all' && (
        <div className="flex items-center justify-between bg-amber-100/70 border border-amber-300 rounded-2xl px-4 py-2 text-xs">
          <span className="font-bold text-amber-900">
            Menampilkan misi khusus: <span className="underline">{realms.find((r) => r.id === selectedRealm)?.name}</span>
          </span>
          <button
            onClick={() => setSelectedRealm('all')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Tampilkan Semua Wilayah
          </button>
        </div>
      )}

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGames.map((game) => {
          const info = getGameStatus(game);
          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 border border-amber-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                      {game.subject}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                      Tingkat: {game.difficulty}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      info.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {info.status === 'Selesai' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{info.status}</span>
                  </span>
                </div>

                {/* Title & Topic */}
                <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">{game.title}</h3>
                <p className="text-xs font-semibold text-amber-700 mt-1">Topik: {game.topic}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{game.learningObjective}</p>
              </div>

              {/* Bottom Meta & Launch Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    {game.questionIds.length} Soal Pilihan
                  </span>

                  {info.status === 'Selesai' && info.stars > 0 && (
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      {'⭐'.repeat(info.stars)}
                      <span className="text-slate-600 text-[11px] ml-1">({info.highscore}%)</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onStartMission(game, activeStudent);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-200 transition transform active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai Misi!</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
