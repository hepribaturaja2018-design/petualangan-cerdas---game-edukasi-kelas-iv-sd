import React from 'react';
import { Volume2, VolumeX, Menu, Compass, Sparkles, School } from 'lucide-react';
import { AppSettings, Student } from '../../types';
import { sound } from '../../services/soundService';

interface HeaderProps {
  settings: AppSettings;
  studentsCount: number;
  gamesCount: number;
  onToggleSound: () => void;
  onOpenMobileMenu: () => void;
  onStartAdventure: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  studentsCount,
  gamesCount,
  onToggleSound,
  onOpenMobileMenu,
  onStartAdventure,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-xs px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenMobileMenu();
            }}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-amber-100 transition"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-200 shrink-0 transform hover:rotate-6 transition">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  PETUALANGAN CERDAS
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Kelas IV
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-amber-600 inline" />
                <span>{settings.schoolName}</span>
                <span className="hidden md:inline">• Guru: {settings.teacherName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Sound toggle, quick info & Launch Adventure button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              settings.soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title={settings.soundEnabled ? 'Efek Suara Aktif (Klik untuk Matikan)' : 'Efek Suara Mati (Klik untuk Nyalakan)'}
          >
            {settings.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Suara Senyap</span>
              </>
            )}
          </button>

          {/* Quick Start Mission button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onStartAdventure();
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-200 transition transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Mulai Misi!</span>
          </button>
        </div>
      </div>
    </header>
  );
};
