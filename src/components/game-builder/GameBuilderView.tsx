import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { DifficultyLevel, Game, GameMode, Question, QuestionType, SubjectType } from '../../types';
import { sound } from '../../services/soundService';
import { generateQuestionsWithGemini } from '../../services/geminiService';
import { AddQuestionModal } from '../question-bank/AddQuestionModal';

interface GameBuilderViewProps {
  questions: Question[];
  onSaveGame: (newGame: Game, newQuestions?: Question[]) => void;
  onNavigateToAdventure: () => void;
}

export const GameBuilderView: React.FC<GameBuilderViewProps> = ({
  questions,
  onSaveGame,
  onNavigateToAdventure,
}) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectType>('Matematika');
  const [topic, setTopic] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Sedang');
  const [gameType, setGameType] = useState<QuestionType>('multiple_choice');
  const [mode, setMode] = useState<GameMode>('individual');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [pointsPerQuestion, setPointsPerQuestion] = useState<number>(10);

  // Selected questions from local bank
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Newly written custom questions created right inside Game Builder
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState<boolean>(false);

  // AI Generator state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiDraftQuestions, setAiDraftQuestions] = useState<Question[]>([]);

  // Feedback error
  const [validationError, setValidationError] = useState('');

  // Combined available questions for this subject (bank + newly created in this session)
  const availableLocalQuestions = [
    ...customQuestions.filter((q) => q.subject === subject),
    ...questions.filter((q) => q.subject === subject),
  ];

  const handleToggleSelectQuestion = (qId: string) => {
    sound.playClick();
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const handleSelectAllLocal = () => {
    sound.playClick();
    const ids = availableLocalQuestions.map((q) => q.id);
    setSelectedQuestionIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  // Handler for adding a new custom question directly inside Game Builder
  const handleAddCustomQuestionDirectly = (qData: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...qData,
      id: `q-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setCustomQuestions((prev) => [newQ, ...prev]);
    setSelectedQuestionIds((prev) => [...prev, newQ.id]);
    sound.playCorrect();
  };

  // Generate with Gemini AI (Optional Module)
  const handleGenerateAiDraft = async () => {
    if (!topic.trim()) {
      setAiError('Mohon isi topik atau materi pembelajaran terlebih dahulu.');
      return;
    }
    sound.playClick();
    setIsGeneratingAi(true);
    setAiError('');

    const res = await generateQuestionsWithGemini({
      subject,
      topic: topic.trim(),
      grade: 'Kelas IV SD',
      count: 4,
      difficulty,
    });

    setIsGeneratingAi(false);

    if (res.success && res.questions && res.questions.length > 0) {
      sound.playFanfare();
      setAiDraftQuestions(res.questions);
    } else {
      sound.playIncorrect();
      setAiError(res.error || 'AI sedang tidak tersedia. Silakan gunakan tombol "Tulis Soal Baru" atau pilih dari Bank Soal Lokal di bawah.');
    }
  };

  const handleDeleteDraftQuestion = (index: number) => {
    sound.playClick();
    setAiDraftQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Judul permainan wajib diisi.');
      return;
    }
    if (!topic.trim()) {
      setValidationError('Topik atau materi pembelajaran wajib diisi.');
      return;
    }

    // Determine final questions
    let finalQuestionIds = [...selectedQuestionIds];
    let createdQuestions: Question[] = [...customQuestions];

    // If AI draft questions exist, save them as well
    if (aiDraftQuestions.length > 0) {
      createdQuestions = [...createdQuestions, ...aiDraftQuestions];
      const draftIds = aiDraftQuestions.map((q) => q.id);
      finalQuestionIds = Array.from(new Set([...finalQuestionIds, ...draftIds]));
    }

    if (finalQuestionIds.length === 0) {
      setValidationError('Pilihlah minimal 1 butir soal dari Bank Soal Lokal, tulis soal baru, atau buat draf menggunakan AI.');
      return;
    }

    sound.playCorrect();

    const newGame: Game = {
      id: `game-${Date.now()}`,
      title: title.trim(),
      subject,
      topic: topic.trim(),
      learningObjective:
        learningObjective.trim() || `Memahami materi ${topic} untuk siswa kelas IV SD dengan ceria dan menyenangkan.`,
      difficulty,
      gameType,
      mode,
      durationSeconds,
      pointsPerQuestion,
      questionIds: finalQuestionIds,
      createdAt: new Date().toISOString(),
    };

    onSaveGame(newGame, createdQuestions.length > 0 ? createdQuestions : undefined);
    onNavigateToAdventure();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Gamepad2 className="w-7 h-7 text-indigo-600" />
          <span>Game Builder (Pembuat Misi Baru)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Rancang permainan kuis interaktif kelas IV SDN 32 Rantau Bayur sesuai topik pembelajaran harian.
        </p>
      </div>

      <form onSubmit={handleSaveGame} className="space-y-6">
        {validationError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Section 1: Konfigurasi Misi */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>Identitas dan Sasaran Pembelajaran</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Permainan / Misi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Petualangan Pecahan dan Sudut"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value as SubjectType);
                  setSelectedQuestionIds([]);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold"
              >
                <option value="Matematika">Matematika (Hutan Numerasi)</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia (Negeri Kata)</option>
                <option value="IPAS">IPAS (Laboratorium Alam)</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila (Pulau Pancasila)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topik / Materi Pembelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Fotosintesis Tumbuhan Hijau"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Mudah">Mudah (Dasar Pengenalan)</option>
                <option value="Sedang">Sedang (Standar Kelas IV)</option>
                <option value="Menantang">Menantang (Pemecahan Masalah)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Pembelajaran</label>
            <input
              type="text"
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="Contoh: Siswa mampu menyebutkan zat yang diperlukan dalam fotosintesis."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Section 2: Mode dan Aturan Permainan */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>Mode dan Pengaturan Skor</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mode Permainan</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as GameMode)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="individual">Mode Individu (Siswa Mandiri)</option>
                <option value="group">Mode Kelompok / Tim Kelas</option>
                <option value="projector">Mode Proyektor Kelas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Durasi per Soal</label>
              <select
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value={0}>Tanpa Batas Waktu (Santai & Ramah Anak)</option>
                <option value={20}>20 Detik</option>
                <option value={30}>30 Detik</option>
                <option value={60}>60 Detik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Poin per Jawaban Benar</label>
              <input
                type="number"
                min={5}
                max={100}
                step={5}
                value={pointsPerQuestion}
                onChange={(e) => setPointsPerQuestion(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Generator Draf AI Opsional */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Bantuan Generator AI (Opsional)</span>
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Minta AI menghasilkan draf 4 soal otomatis berdasarkan topik <span className="font-bold">&ldquo;{topic || 'yang diisi'}&rdquo;</span>.
              </p>
            </div>

            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={handleGenerateAiDraft}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang Menghasilkan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Draf Soal AI</span>
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="p-3.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-xs">
              <p className="font-bold flex items-center gap-1.5 mb-0.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                Informasi Integrasi AI:
              </p>
              <p>{aiError}</p>
            </div>
          )}

          {/* AI Draft Review */}
          {aiDraftQuestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">
                  Draf Soal AI ({aiDraftQuestions.length} butir) - Silakan periksa kunci jawaban:
                </span>
                <span className="text-[11px] text-amber-800">Dapat diedit atau dihapus sebelum disimpan</span>
              </div>

              <div className="space-y-2.5">
                {aiDraftQuestions.map((draft, idx) => (
                  <div
                    key={draft.id}
                    className="p-3.5 rounded-2xl bg-white border border-amber-200 text-xs shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-800">
                        {idx + 1}. {draft.question}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraftQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus draf ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pl-3">
                      {draft.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded-lg border text-[11px] ${
                            oIdx === draft.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === draft.correctAnswer && '✓ (Kunci)'}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 pl-3">
                      <strong className="text-slate-700">Pembahasan:</strong> {draft.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Bank Soal Lokal & Tambah Soal Manual Langsung */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Pilih Soal ({availableLocalQuestions.length} butir untuk {subject})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centang soal dari bank, atau buat soal baru secara langsung di bawah ini.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsAddQuestionModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tulis Soal Baru untuk Game Ini</span>
              </button>

              {availableLocalQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllLocal}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Pilih Semua Soal {subject}
                </button>
              )}
            </div>
          </div>

          {availableLocalQuestions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-3">
              <p>Belum ada soal untuk mata pelajaran {subject}.</p>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsAddQuestionModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                + Tulis Soal Pertama untuk Misi Ini
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {availableLocalQuestions.map((q) => {
                const isChecked = selectedQuestionIds.includes(q.id);
                const isNewlyCreated = customQuestions.some((cq) => cq.id === q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleSelectQuestion(q.id)}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-amber-50/70 border-amber-400 text-slate-900 ring-1 ring-amber-300'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-amber-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                          Topik: {q.topic}
                        </span>
                        <span className="text-[10px] text-slate-400">Tingkat: {q.difficulty}</span>
                        {isNewlyCreated && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Baru Ditulis
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-800 text-sm leading-snug">{q.question}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Kunci: {String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-700">
            Total Soal Terpilih:{' '}
            <span className="text-amber-800 font-extrabold text-sm">
              {selectedQuestionIds.length + aiDraftQuestions.length} butir
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-200 transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Simpan Permainan & Terbitkan ke Petualangan</span>
          </button>
        </div>
      </form>

      {/* Add Custom Question Modal inside Game Builder */}
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        initialSubject={subject}
        initialTopic={topic}
        targetGameTitle={title || 'Misi Ini'}
        onClose={() => setIsAddQuestionModalOpen(false)}
        onAddQuestion={handleAddCustomQuestionDirectly}
      />
    </div>
  );
};
