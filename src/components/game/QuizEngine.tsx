import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Star,
  Sparkles,
  RotateCcw,
  LogOut,
  Award,
  Zap,
} from 'lucide-react';
import { Badge, Game, GameSession, Question, SessionAnswer, Student } from '../../types';
import { sound } from '../../services/soundService';

interface QuizEngineProps {
  game: Game;
  questions: Question[];
  currentStudent?: Student | null;
  mode?: 'individual' | 'group' | 'projector';
  participantName?: string;
  onFinishGame: (session: GameSession) => void;
  onExitGame: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  game,
  questions,
  currentStudent,
  mode = 'individual',
  participantName,
  onFinishGame,
  onExitGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Score tracking
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<SessionAnswer[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Canvas confetti ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  const playerName = participantName || currentStudent?.name || (mode === 'group' ? 'Kelompok Petualang' : 'Petualang SDN 32');
  const playerAvatar = currentStudent?.avatar || (mode === 'group' ? '👥' : '🧭');

  // Elapsed time tracker
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  // Confetti effect on completion
  useEffect(() => {
    if (!isFinished) return;

    sound.playFanfare();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
    }[] = [];

    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
      });
    }

    let animId: number;
    let frames = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 140) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isFinished]);

  // Answer handler (Strict anti-double click / double scoring)
  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered || isFinished) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      setCorrectCount((prev) => prev + 1);
    } else {
      sound.playIncorrect();
      setIncorrectCount((prev) => prev + 1);
    }

    const answerRecord: SessionAnswer = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      selectedAnswer: optionIndex,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      topic: currentQ.topic,
    };

    setAnswersLog((prev) => [...prev, answerRecord]);
  };

  // Next question or finish
  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < totalQ) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
    }
  };

  // Calculate final score
  const finalPercentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
  const pointsPerQ = game.pointsPerQuestion || 10;
  const finalScore = correctCount * pointsPerQ;
  const maxPossibleScore = totalQ * pointsPerQ;

  // Star threshold calculation:
  // 90-100%: 3 stars, 70-89%: 2 stars, 50-69%: 1 star, <50%: 0 stars (apresiasi partisipasi)
  let starsEarned = 0;
  if (finalPercentage >= 90) starsEarned = 3;
  else if (finalPercentage >= 70) starsEarned = 2;
  else if (finalPercentage >= 50) starsEarned = 1;

  const xpEarned = correctCount * 25 + (starsEarned === 3 ? 50 : starsEarned === 2 ? 30 : 15);

  // Determine badges earned
  const earnedBadges: Badge[] = [];
  if (finalPercentage === 100) {
    earnedBadges.push({
      id: 'badge-sempurna',
      name: 'Misi Sempurna',
      icon: '🏆',
      description: 'Menjawab semua soal dengan benar tanpa kesalahan!',
      criteria: 'score === 100',
    });
  }
  if (starsEarned === 3) {
    earnedBadges.push({
      id: 'badge-peningkatan',
      name: 'Juara Peningkatan',
      icon: '⭐',
      description: 'Meraih 3 bintang pada tantangan petualangan.',
      criteria: 'stars === 3',
    });
  }
  if (totalQ >= 4) {
    earnedBadges.push({
      id: 'badge-pantang-menyerah',
      name: 'Pantang Menyerah',
      icon: '💪',
      description: 'Menyelesaikan seluruh rute petualangan hingga akhir.',
      criteria: 'completed === true',
    });
  }

  // Final submission
  const handleSaveAndExit = () => {
    sound.playClick();
    const session: GameSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      gameId: game.id,
      gameTitle: game.title,
      subject: game.subject,
      topic: game.topic,
      mode: mode,
      participantId: currentStudent?.id || (mode === 'group' ? 'group-team' : 'class-all'),
      participantName: playerName,
      avatar: playerAvatar,
      totalQuestions: totalQ,
      correctCount,
      incorrectCount,
      score: finalScore,
      maxScore: maxPossibleScore,
      percentage: finalPercentage,
      durationSeconds: elapsedSeconds,
      stars: starsEarned,
      xpEarned,
      badges: earnedBadges,
      completedAt: new Date().toISOString(),
      answers: answersLog,
    };
    onFinishGame(session);
  };

  // If questions are empty
  if (totalQ === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xl text-center border border-amber-200 mt-10">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-4">
          🧭
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Soal Belum Tersedia</h2>
        <p className="text-slate-600 text-sm mb-6">
          Misi ini belum memiliki butir soal yang aktif. Silakan tambahkan soal melalui menu Bank Soal atau Game Builder.
        </p>
        <button
          onClick={onExitGame}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  // --- FINISH SCREEN ---
  if (isFinished) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center p-4">
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

        <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-amber-200 p-6 sm:p-8 animate-in zoom-in-95 duration-300">
          {/* Header celebration */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200 mb-3 transform hover:scale-110 transition">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Petualangan Selesai!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Selamat kepada <span className="font-bold text-amber-700">{playerName}</span> ({playerAvatar}) atas usaha luar biasa!
            </p>
          </div>

          {/* Stars Ceremony */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {[1, 2, 3].map((starNum) => {
              const isEarned = starNum <= starsEarned;
              return (
                <div
                  key={starNum}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-500 transform ${
                    isEarned
                      ? 'bg-amber-50 border-amber-300 scale-110 shadow-md shadow-amber-200'
                      : 'bg-slate-50 border-slate-200 opacity-40'
                  }`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      isEarned ? 'text-amber-500 fill-amber-400 animate-pulse' : 'text-slate-300'
                    }`}
                  />
                  <span className="text-[11px] font-bold text-slate-600 mt-1">Bintang {starNum}</span>
                </div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs font-semibold text-amber-800">Skor Akhir</span>
              <p className="text-xl font-extrabold text-amber-900 mt-0.5">
                {finalScore} <span className="text-xs text-amber-700 font-normal">/ {maxPossibleScore}</span>
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-semibold text-emerald-800">Persentase</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-0.5">{finalPercentage}%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <span className="text-xs font-semibold text-sky-800">Benar / Total</span>
              <p className="text-xl font-extrabold text-sky-900 mt-0.5">
                {correctCount} <span className="text-xs text-sky-700 font-normal">/ {totalQ}</span>
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-xs font-semibold text-purple-800">XP Diperoleh</span>
              <p className="text-xl font-extrabold text-purple-900 mt-0.5 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-purple-600 fill-purple-500" />
                +{xpEarned}
              </p>
            </div>
          </div>

          {/* Badges unlocked */}
          {earnedBadges.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Lencana Baru Terbuka!
              </h4>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span className="text-base">{b.icon}</span>
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Review Accordion / List */}
          <div className="mb-6 max-h-48 overflow-y-auto space-y-2 pr-1 border-t border-b border-slate-100 py-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ringkasan Jawaban:</p>
            {answersLog.map((ans, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  ans.isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                {ans.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{ans.questionText}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Topik: {ans.topic}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setIncorrectCount(0);
                setAnswersLog([]);
                setIsFinished(false);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>

            <button
              onClick={handleSaveAndExit}
              className="w-full flex-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Kembali ke Hasil Belajar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE GAMEPLAY SCREEN ---
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionColors = [
    { border: 'hover:border-sky-400', active: 'bg-sky-50 border-sky-400 text-sky-950', badge: 'bg-sky-100 text-sky-800' },
    { border: 'hover:border-emerald-400', active: 'bg-emerald-50 border-emerald-400 text-emerald-950', badge: 'bg-emerald-100 text-emerald-800' },
    { border: 'hover:border-amber-400', active: 'bg-amber-50 border-amber-400 text-amber-950', badge: 'bg-amber-100 text-amber-800' },
    { border: 'hover:border-purple-400', active: 'bg-purple-50 border-purple-400 text-purple-950', badge: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 animate-in fade-in duration-200">
      {/* Game Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-200/80 mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-xs">
            {playerAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm sm:text-base">{playerName}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {game.subject}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">{game.title}</p>
          </div>
        </div>

        {/* Live Score & Exit button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-bold uppercase text-amber-800 block">Skor</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-900">{correctCount * pointsPerQ}</span>
          </div>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Keluar dari permainan"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5 px-1">
          <span>Soal {currentIndex + 1} dari {totalQ}</span>
          <span>Topik: {currentQ.topic}</span>
        </div>
        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / totalQ) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/90 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Tingkat: {currentQ.difficulty}
          </span>

          {currentQ.hint && (
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-xl transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Tutup Petunjuk' : 'Lihat Petunjuk'}</span>
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && currentQ.hint && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed animate-in fade-in">
            <strong className="font-bold">💡 Petunjuk:</strong> {currentQ.hint}
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug sm:leading-relaxed mb-6">
          {currentQ.question}
        </h3>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrectAnswer = optIdx === currentQ.correctAnswer;
            const colorScheme = optionColors[optIdx % optionColors.length];

            let stateStyle = 'bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-amber-300';

            if (isAnswered) {
              if (isCorrectAnswer) {
                stateStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300';
              } else if (isSelected && !isCorrectAnswer) {
                stateStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300';
              } else {
                stateStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              stateStyle = colorScheme.active;
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(optIdx)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-3 transform active:scale-98 cursor-pointer disabled:cursor-default ${stateStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isAnswered && isCorrectAnswer
                      ? 'bg-emerald-600 text-white'
                      : isAnswered && isSelected && !isCorrectAnswer
                      ? 'bg-rose-600 text-white'
                      : colorScheme.badge
                  }`}
                >
                  {optionLetters[optIdx]}
                </span>
                <span className="text-sm font-semibold leading-relaxed flex-1 pt-0.5">{option}</span>
                {isAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback & Explanation Card */}
      {isAnswered && (
        <div
          className={`rounded-3xl p-5 mb-5 border animate-in slide-in-from-bottom-2 duration-200 ${
            selectedOption === currentQ.correctAnswer
              ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900'
              : 'bg-amber-50/95 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 font-extrabold text-sm sm:text-base">
            {selectedOption === currentQ.correctAnswer ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Hebat! Jawabanmu benar. Teruskan petualanganmu!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Belum tepat, tetapi tidak apa-apa. Yuk pelajari pembahasannya!</span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 mt-1 pl-7">
            <strong className="font-bold text-slate-900">Pembahasan:</strong> {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-end gap-3">
        {isAnswered && (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-orange-200 transition transform active:scale-95 flex items-center gap-2"
          >
            <span>{currentIndex + 1 < totalQ ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Akhiri Petualangan?</h4>
            <p className="text-xs text-slate-600 mb-5">
              Progres soal saat ini belum tersimpan jika kamu keluar sekarang. Apakah kamu yakin ingin keluar?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Lanjut Bermain
              </button>
              <button
                type="button"
                onClick={onExitGame}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
