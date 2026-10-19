import React, { useState } from 'react';
import {
  ScreenShare,
  Users,
  User,
  Tv,
  Play,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Game, GameMode, StudentGroup } from '../../types';
import { sound } from '../../services/soundService';

interface ClassroomGameViewProps {
  games: Game[];
  groups: StudentGroup[];
  onStartClassroomGame: (game: Game, mode: GameMode, groupName?: string) => void;
}

export const ClassroomGameView: React.FC<ClassroomGameViewProps> = ({
  games,
  groups,
  onStartClassroomGame,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('projector');
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || '');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');

  const selectedGame = games.find((g) => g.id === selectedGameId) || games[0];
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleLaunch = () => {
    if (!selectedGame) return;
    sound.playClick();
    onStartClassroomGame(
      selectedGame,
      selectedMode,
      selectedMode === 'group' ? selectedGroup?.name : undefined
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-200/50">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-teal-100 mb-3 border border-white/20">
            <ScreenShare className="w-3.5 h-3.5 text-teal-200" />
            <span>Mode Pembelajaran Klasikal & Kelompok</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Permainan Kelas Interaktif
          </h2>
          <p className="mt-2 text-sm sm:text-base text-teal-100 leading-relaxed font-medium">
            Meriahkan suasana kelas di SDN 32 Rantau Bayur dengan kuis bersama di proyektor, kompetisi antarkelompok regu yang sehat, atau latihan individu mandiri.
          </p>
        </div>
      </div>

      {/* 3 Modes Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mode Proyektor */}
        <div
          onClick={() => {
            sound.playClick();
            setSelectedMode('projector');
          }}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selectedMode === 'projector'
              ? 'bg-teal-50/80 border-teal-500 shadow-md ring-2 ring-teal-300'
              : 'bg-white border-amber-200/80 hover:border-teal-300'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Mode Proyektor Kelas</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tampilan huruf ekstra besar untuk ditayangkan di layar proyektor / TV depan kelas. Siswa berdiskusi bersama dan guru mengontrol pengungkapan jawaban.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800">
            <span>Satu Komputer Guru</span>
            {selectedMode === 'projector' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
          </div>
        </div>

        {/* Mode Kelompok */}
        <div
          onClick={() => {
            sound.playClick();
            setSelectedMode('group');
          }}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selectedMode === 'group'
              ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-300'
              : 'bg-white border-amber-200/80 hover:border-amber-300'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Mode Kelompok Regu</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Mainkan per regu (Rajawali, Garuda, Harimau, Komodo). Skor diakumulasikan ke kelompok untuk melatih kerja sama, gotong royong, dan musyawarah.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Gotong Royong & Regu</span>
            {selectedMode === 'group' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
          </div>
        </div>

        {/* Mode Individu */}
        <div
          onClick={() => {
            sound.playClick();
            setSelectedMode('individual');
          }}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selectedMode === 'individual'
              ? 'bg-sky-50/80 border-sky-500 shadow-md ring-2 ring-sky-300'
              : 'bg-white border-amber-200/80 hover:border-sky-300'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Mode Individu Mandiri</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Siswa memainkan misi secara pribadi untuk menguji kemandirian pemahaman materi, mengumpulkan poin XP, dan mendapatkan lencana pribadi.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-800">
            <span>Prestasi Pribadi Siswa</span>
            {selectedMode === 'individual' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
          </div>
        </div>
      </div>

      {/* Game Selection & Launch Box */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Pilih Misi Permainan yang Akan Dimainkan di Kelas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Misi Permainan</label>
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-teal-400"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} - {g.subject} ({g.questionIds.length} Soal)
                </option>
              ))}
            </select>
          </div>

          {selectedMode === 'group' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelompok Bertanding</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-amber-400"
              >
                {groups.map((grp) => (
                  <option key={grp.id} value={grp.id}>
                    {grp.avatar} {grp.name} ({grp.members.length} anggota)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Mission Preview */}
        {selectedGame && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 space-y-1">
            <p className="font-extrabold text-slate-900 text-sm">{selectedGame.title}</p>
            <p className="text-amber-800 font-semibold">
              Mata Pelajaran: {selectedGame.subject} • Topik: {selectedGame.topic}
            </p>
            <p className="text-slate-600">{selectedGame.learningObjective}</p>
          </div>
        )}

        {/* Launch Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm shadow-lg shadow-teal-200 transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Mulai Permainan Kelas Sekarang!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
