import React from 'react';
import { Phone, Heart, ShieldCheck, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white/70 border-t border-amber-200/60 py-6 px-4 sm:px-6 text-slate-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: App Identity */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <Compass className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-800">PETUALANGAN CERDAS</span>
          <span className="text-slate-400">|</span>
          <span>Game Edukasi Interaktif Kelas IV SD</span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold text-amber-700">SDN 32 Rantau Bayur</span>
        </div>

        {/* Center: Developer & Contact */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            Dikembangkan oleh <span className="font-bold text-slate-800">Hepri Joni</span>
          </span>
          <span className="text-slate-400">•</span>
          <a
            href="tel:081367963694"
            className="inline-flex items-center gap-1 text-slate-700 hover:text-amber-600 font-semibold transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>081367963694</span>
          </a>
        </div>

        {/* Right: Slogan & Privacy Note */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privasi Ramah Anak & Penyimpanan Lokal</span>
        </div>
      </div>
    </footer>
  );
};
