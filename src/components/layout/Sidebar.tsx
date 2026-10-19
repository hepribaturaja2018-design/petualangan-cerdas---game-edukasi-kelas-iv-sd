import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  Gamepad2,
  BookOpen,
  ScreenShare,
  Sparkles,
  BarChart3,
  Settings,
  Info,
  X,
  GraduationCap,
} from 'lucide-react';
import { ActiveNavTab } from '../../types';
import { sound } from '../../services/soundService';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  studentsCount: number;
  questionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  studentsCount,
  questionsCount,
}) => {
  const menuItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'students', label: 'Data Siswa', icon: <Users className="w-5 h-5" />, badge: `${studentsCount}` },
    { id: 'adventure', label: 'Dunia Petualangan', icon: <Compass className="w-5 h-5 text-amber-500" /> },
    { id: 'game-builder', label: 'Buat Game', icon: <Gamepad2 className="w-5 h-5 text-indigo-500" /> },
    { id: 'question-bank', label: 'Bank Soal', icon: <BookOpen className="w-5 h-5" />, badge: `${questionsCount}` },
    { id: 'classroom-game', label: 'Permainan Kelas', icon: <ScreenShare className="w-5 h-5 text-teal-600" /> },
    { id: 'classroom-tools', label: 'Aktivitas Kelas', icon: <Sparkles className="w-5 h-5 text-pink-500" /> },
    { id: 'reports', label: 'Hasil Belajar', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
    { id: 'about', label: 'Tentang Aplikasi', icon: <Info className="w-5 h-5" /> },
  ];

  const handleSelect = (tab: ActiveNavTab) => {
    sound.playClick();
    onSelectTab(tab);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full bg-amber-50/70 border-r border-amber-200/60 p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-amber-200/60 lg:hidden">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-amber-600" />
          <span className="font-extrabold text-slate-800 text-sm">Menu Petualangan</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-200/50 transition"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slogan Banner */}
      <div className="hidden lg:block mb-4 p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🎒</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Kelas IV SD</span>
        </div>
        <p className="text-xs font-semibold text-white/95 leading-relaxed">
          &ldquo;Belajar Seru, Berpetualang, Raih Prestasi!&rdquo;
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 text-left ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-300/60 translate-x-1'
                  : 'text-slate-700 hover:bg-amber-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-200/70 text-amber-900'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Profile Card */}
      <div className="mt-4 pt-3 border-t border-amber-200/60">
        <div className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-sm">
            HJ
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">Hepri Joni</p>
            <p className="text-[11px] text-slate-500 truncate">SDN 32 Rantau Bayur</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-[61px] h-[calc(100vh-61px)]">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
