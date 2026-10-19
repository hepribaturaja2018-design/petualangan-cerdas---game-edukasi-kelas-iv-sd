import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Shuffle,
  Users,
  Compass,
  Timer,
  Smile,
  MessageSquareHeart,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Volume2,
} from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../services/soundService';

interface ClassroomToolsViewProps {
  students: Student[];
}

export const ClassroomToolsView: React.FC<ClassroomToolsViewProps> = ({ students }) => {
  const [activeTool, setActiveTool] = useState<
    'picker' | 'groups' | 'wheel' | 'timer' | 'energizer' | 'reflection'
  >('picker');

  // --- TOOL 1: NAME PICKER ---
  const [pickedStudent, setPickedStudent] = useState<Student | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleDisplayName, setShuffleDisplayName] = useState<string>('');

  const handlePickRandomStudent = () => {
    if (students.length === 0) return;
    sound.playClick();
    setIsShuffling(true);
    setPickedStudent(null);

    let count = 0;
    const maxShuffle = 20;
    const interval = setInterval(() => {
      sound.playTick();
      const randIdx = Math.floor(Math.random() * students.length);
      setShuffleDisplayName(students[randIdx].name);
      count++;
      if (count >= maxShuffle) {
        clearInterval(interval);
        const finalStudent = students[Math.floor(Math.random() * students.length)];
        setPickedStudent(finalStudent);
        setIsShuffling(false);
        sound.playFanfare();
      }
    }, 100);
  };

  // --- TOOL 2: GROUP GENERATOR ---
  const [groupCount, setGroupCount] = useState<number>(3);
  const [generatedGroups, setGeneratedGroups] = useState<{ name: string; avatar: string; members: Student[] }[]>([]);

  const handleGenerateGroups = () => {
    if (students.length === 0) return;
    sound.playClick();

    // Fisher-Yates shuffle
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const groupTemplates = [
      { name: 'Regu Rajawali Emas', avatar: '🦅' },
      { name: 'Regu Garuda Juara', avatar: '🌟' },
      { name: 'Regu Harimau Berani', avatar: '🐯' },
      { name: 'Regu Komodo Tangguh', avatar: '🐬' },
      { name: 'Regu Bintang Cemerlang', avatar: '✨' },
    ];

    const result: { name: string; avatar: string; members: Student[] }[] = [];
    for (let i = 0; i < groupCount; i++) {
      result.push({
        name: groupTemplates[i % groupTemplates.length].name,
        avatar: groupTemplates[i % groupTemplates.length].avatar,
        members: [],
      });
    }

    shuffled.forEach((student, index) => {
      result[index % groupCount].members.push(student);
    });

    setGeneratedGroups(result);
    sound.playFanfare();
  };

  // --- TOOL 3: WHEEL OF FORTUNE ---
  const wheelItems = [
    'Jawab 1 Soal Matematika',
    'Bonus +20 XP untuk Kelompok!',
    'Bacakan 1 Kalimat Puisi',
    'Tirukan Suara Burung Elang',
    'Sebutkan 1 Sila Pancasila',
    'Tepuk Semangat SDN 32!',
    'Pilih Teman untuk Menjawab',
    'Ceritakan Hewan Kesukaanmu',
  ];
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    sound.playClick();
    setIsSpinning(true);
    setWheelResult(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
    const randomSegment = Math.floor(Math.random() * wheelItems.length);
    const segmentAngle = 360 / wheelItems.length;
    const targetAngle = wheelRotation + extraSpins * 360 + randomSegment * segmentAngle;

    setWheelRotation(targetAngle);

    setTimeout(() => {
      const selectedIndex =
        (wheelItems.length - 1 - (Math.floor(targetAngle / segmentAngle) % wheelItems.length)) %
        wheelItems.length;
      setWheelResult(wheelItems[selectedIndex >= 0 ? selectedIndex : 0]);
      setIsSpinning(false);
      sound.playFanfare();
    }, 3500);
  };

  // --- TOOL 4: TIMER ---
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // default 3 mins
  const [timerRemaining, setTimerRemaining] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            sound.playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  const handlePresetTimer = (secs: number) => {
    sound.playClick();
    setIsTimerRunning(false);
    setTimerSeconds(secs);
    setTimerRemaining(secs);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  // --- TOOL 5: ENERGIZER ---
  const energizers = [
    {
      title: 'Tepuk Semangat SDN 32',
      duration: '3 Menit',
      description: 'Guru: "Tepuk Semangat!" Siswa: (Tepuk 3x) Se! (Tepuk 3x) Ma! (Tepuk 3x) Ngat! SEMANGAT!',
      category: 'Penyegar Suasana',
    },
    {
      title: 'Detektif Kata Berantai',
      duration: '4 Menit',
      description: 'Siswa pertama menyebutkan sebuah kata (misal: "Buku"), siswa berikutnya harus menyebutkan kata baru berawalan huruf terakhir ("Udara"), dan seterusnya!',
      category: 'Kosakata & Konsentrasi',
    },
    {
      title: 'Cermin Gerak Petualang',
      duration: '3 Menit',
      description: 'Satu siswa atau guru berdiri di depan memperagakan gerakan petualang (mendayung, memanjat pohon, mencari harta karun) dan seluruh kelas meniru dengan kompak!',
      category: 'Kinestetik / Gerak Fisik',
    },
    {
      title: 'Angin Bertiup Menuju...',
      duration: '5 Menit',
      description: 'Guru: "Angin bertiup menuju yang memakai jam tangan / membawa botol minum!" Siswa yang dimaksud berdiri dan melompat kecil sekali dengan gembira.',
      category: 'Fokus & Refleks',
    },
  ];

  // --- TOOL 6: REFLEKSI BELAJAR ---
  const reflectionCards = [
    {
      q: 'Apa ilmu atau pengetahuan baru yang paling kamu ingat dari pelajaran hari ini?',
      icon: '💡',
    },
    {
      q: 'Bagian materi mana yang tadi terasa paling menantang atau memerlukan latihan lagi?',
      icon: '🧗',
    },
    {
      q: 'Bagaimana perasaanmu setelah berpetualang dan belajar bersama teman kelompokmu?',
      icon: '😊',
    },
    {
      q: 'Bantuan apa yang kamu berikan kepada temanmu saat memecahkan soal kuis tadi?',
      icon: '🤝',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-pink-500" />
          <span>Aktivitas dan Alat Bantu Kelas</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kumpulan fitur praktis untuk guru kelas IV SDN 32 Rantau Bayur: pengacak nama, pembagi regu, roda putar, timer, ice breaking, dan refleksi belajar.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { id: 'picker', label: 'Pengacak Nama', icon: <Shuffle className="w-4 h-4" /> },
            { id: 'groups', label: 'Pembagi Kelompok', icon: <Users className="w-4 h-4" /> },
            { id: 'wheel', label: 'Roda Putar', icon: <Compass className="w-4 h-4" /> },
            { id: 'timer', label: 'Timer Kegiatan', icon: <Timer className="w-4 h-4" /> },
            { id: 'energizer', label: 'Ice Breaking / Energizer', icon: <Smile className="w-4 h-4" /> },
            { id: 'reflection', label: 'Refleksi Belajar', icon: <MessageSquareHeart className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTool(tab.id as any);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTool === tab.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-102'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- VIEW 1: NAME PICKER --- */}
      {activeTool === 'picker' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs text-center max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-800">Pengacak Nama Siswa</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih satu siswa secara acak untuk menjawab pertanyaan atau memimpin petualangan kelas!
            </p>
          </div>

          <div className="min-h-36 flex items-center justify-center p-6 rounded-3xl bg-amber-50/70 border-2 border-dashed border-amber-300">
            {isShuffling ? (
              <div className="animate-pulse">
                <span className="text-4xl block mb-2">🎲</span>
                <span className="text-2xl font-black text-amber-900">{shuffleDisplayName}</span>
              </div>
            ) : pickedStudent ? (
              <div className="animate-in zoom-in-95 duration-200">
                <span className="text-5xl block mb-2">{pickedStudent.avatar}</span>
                <h4 className="text-2xl font-black text-slate-900">{pickedStudent.name}</h4>
                <p className="text-xs font-bold text-amber-700 mt-1">{pickedStudent.group || 'Kelas IV'}</p>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">
                Tekan tombol di bawah untuk memulai undian nama!
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isShuffling || students.length === 0}
            onClick={handlePickRandomStudent}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-black text-sm shadow-md shadow-amber-200 transition transform active:scale-95 cursor-pointer"
          >
            {isShuffling ? 'Mengundi Nama...' : 'Acak Nama Sekarang!'}
          </button>
        </div>
      )}

      {/* --- VIEW 2: GROUP GENERATOR --- */}
      {activeTool === 'groups' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-800">Pembagi Kelompok Otomatis</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bagi {students.length} siswa kelas IV ke dalam beberapa kelompok secara adil dan seimbang.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Jumlah Kelompok:</span>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                <option value={2}>2 Kelompok</option>
                <option value={3}>3 Kelompok</option>
                <option value={4}>4 Kelompok</option>
                <option value={5}>5 Kelompok</option>
              </select>

              <button
                type="button"
                onClick={handleGenerateGroups}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
              >
                Bagi Sekarang
              </button>
            </div>
          </div>

          {generatedGroups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              {generatedGroups.map((grp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center gap-2.5 pb-2 border-b border-amber-200/60">
                    <span className="text-2xl">{grp.avatar}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{grp.name}</h4>
                      <p className="text-[11px] text-amber-800 font-semibold">{grp.members.length} Siswa</p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {grp.members.map((s, mIdx) => (
                      <li key={s.id} className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 w-4">{mIdx + 1}.</span>
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- VIEW 3: WHEEL OF FORTUNE --- */}
      {activeTool === 'wheel' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs text-center max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-800">Roda Keberuntungan Tantangan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Putar roda untuk menentukan giliran tugas, kuis kilat, atau reward kelas!
            </p>
          </div>

          {/* Interactive Wheel Graphic */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Top Indicator Arrow */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-600 drop-shadow-md" />

            {/* Spinning Circle */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden transition-transform duration-[3500ms] ease-out flex items-center justify-center relative bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              {wheelItems.map((item, idx) => {
                const angle = (360 / wheelItems.length) * idx;
                return (
                  <div
                    key={idx}
                    className="absolute w-full text-center text-[10px] font-extrabold text-white px-2 select-none"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-85px)`,
                      transformOrigin: 'center center',
                    }}
                  >
                    {idx + 1}. {item.slice(0, 16)}...
                  </div>
                );
              })}
              <div className="w-14 h-14 rounded-full bg-white shadow-md z-10 flex items-center justify-center font-black text-amber-600 text-xs">
                SD 32
              </div>
            </div>
          </div>

          {wheelResult && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 animate-in zoom-in-95">
              <span className="text-xs font-bold uppercase text-amber-700 block">Hasil Roda Putar:</span>
              <p className="text-base font-black text-slate-900 mt-1">{wheelResult}</p>
            </div>
          )}

          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpinWheel}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-black text-sm shadow-md shadow-orange-200 transition transform active:scale-95 cursor-pointer"
          >
            {isSpinning ? 'Roda Berputar...' : 'Putar Roda Keberuntungan!'}
          </button>
        </div>
      )}

      {/* --- VIEW 4: TIMER --- */}
      {activeTool === 'timer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs text-center max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-800">Timer Kegiatan Kelas</h3>
            <p className="text-xs text-slate-500 mt-1">
              Hitung mundur untuk diskusi kelompok, pengerjaan tugas, atau kuis cepat.
            </p>
          </div>

          {/* Big Digital Display */}
          <div className="py-8 px-6 rounded-3xl bg-slate-900 text-amber-400 font-mono text-5xl sm:text-6xl font-black shadow-inner tracking-widest">
            {formatTimer(timerRemaining)}
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[60, 120, 180, 300, 600].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handlePresetTimer(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  timerSeconds === sec
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sec / 60} Menit
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsTimerRunning(!isTimerRunning);
              }}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-200 transition flex items-center gap-2 cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Jeda' : 'Mulai'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsTimerRunning(false);
                setTimerRemaining(timerSeconds);
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* --- VIEW 5: ENERGIZER / ICE BREAKING --- */}
      {activeTool === 'energizer' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
            <h3 className="text-lg font-black text-slate-800">Ide Ice Breaking & Energizer Singkat</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kegiatan 3-5 menit untuk menyegarkan konsentrasi dan membangkitkan senyum ceria siswa kelas IV.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {energizers.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.duration}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => sound.playFanfare()}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lakukan Bersama Siswa</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VIEW 6: REFLECTION CARDS --- */}
      {activeTool === 'reflection' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
            <h3 className="text-lg font-black text-slate-800">Kartu Refleksi Belajar Akhir Sesi</h3>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan pertanyaan ini untuk mengajak siswa merenungkan kemajuan dan pengalaman belajar mereka hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reflectionCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shrink-0">
                  {card.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                    Pertanyaan Refleksi #{idx + 1}
                  </span>
                  <p className="text-sm font-bold text-slate-800 leading-snug">{card.q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
