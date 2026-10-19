import React, { useState } from 'react';
import {
  X,
  Plus,
  BookOpen,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Eye,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { DifficultyLevel, Question, SubjectType } from '../../types';
import { sound } from '../../services/soundService';

interface AddQuestionModalProps {
  isOpen: boolean;
  initialSubject?: SubjectType;
  initialTopic?: string;
  onClose: () => void;
  onAddQuestion: (question: Omit<Question, 'id'>) => void;
  onAddMultipleQuestions?: (questions: Omit<Question, 'id'>[]) => void;
  targetGameTitle?: string;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  initialSubject = 'Matematika',
  initialTopic = '',
  onClose,
  onAddQuestion,
  onAddMultipleQuestions,
  targetGameTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'templates'>('single');

  // Single Question Form State
  const [subject, setSubject] = useState<SubjectType>(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Sedang');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [formError, setFormError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Bulk Import Form State
  const [bulkText, setBulkText] = useState('');
  const [bulkSubject, setBulkSubject] = useState<SubjectType>(initialSubject);
  const [bulkTopic, setBulkTopic] = useState(initialTopic);
  const [bulkDifficulty, setBulkDifficulty] = useState<DifficultyLevel>('Sedang');
  const [bulkError, setBulkError] = useState('');
  const [bulkPreviewList, setBulkPreviewList] = useState<Omit<Question, 'id'>[]>([]);

  // Ready-to-use Class IV Curriculum Templates
  const readyTemplates: Omit<Question, 'id'>[] = [
    {
      subject: 'Matematika',
      topic: 'KPK dan FPB',
      difficulty: 'Sedang',
      type: 'multiple_choice',
      question: 'Faktor Persekutuan Terbesar (FPB) dari bilangan 12 dan 18 adalah...',
      options: ['2', '3', '6', '9'],
      correctAnswer: 2,
      explanation: 'Faktor 12 = 1, 2, 3, 4, 6, 12. Faktor 18 = 1, 2, 3, 6, 9, 18. Faktor persekutuan terbesar adalah 6.',
      hint: 'Cari angka terbesar yang dapat membagi habis 12 dan 18.',
    },
    {
      subject: 'Matematika',
      topic: 'Operasi Hitung Perkalian',
      difficulty: 'Mudah',
      type: 'multiple_choice',
      question: 'Berapakah hasil dari 25 × 4?',
      options: ['75', '100', '125', '150'],
      correctAnswer: 1,
      explanation: '25 dikalikan 4 sama dengan 100 (25 + 25 + 25 + 25 = 100).',
      hint: 'Pikirkan uang 25 rupiah sebanyak 4 keping.',
    },
    {
      subject: 'Bahasa Indonesia',
      topic: 'Tanda Baca dan Huruf Kapital',
      difficulty: 'Mudah',
      type: 'multiple_choice',
      question: 'Manakah penulisan kalimat yang menggunakan huruf kapital secara benar?',
      options: [
        'faiz berlibur ke danau ranau.',
        'Faiz berlibur ke Danau Ranau.',
        'Faiz Berlibur Ke Danau Ranau.',
        'faiz Berlibur ke danau Ranau.',
      ],
      correctAnswer: 1,
      explanation: 'Awal kalimat serta nama orang dan nama geografis (Danau Ranau) wajib diawali huruf kapital.',
      hint: 'Perhatikan huruf awal kalimat dan nama tempat geografis.',
    },
    {
      subject: 'Bahasa Indonesia',
      topic: 'Paragraf Deskripsi',
      difficulty: 'Sedang',
      type: 'multiple_choice',
      question: 'Teks yang menggambarkan suatu objek secara rinci sehingga pembaca seolah-olah melihat dan merasakannya sendiri disebut...',
      options: ['Teks Narasi', 'Teks Deskripsi', 'Teks Eksplanasi', 'Teks Prosedur'],
      correctAnswer: 1,
      explanation: 'Teks deskripsi melukiskan objek atau keadaan melalui pancaindra agar pembaca memperoleh gambaran nyata.',
      hint: 'Kata dasarnya "deskripsi" yang berarti menggambarkan.',
    },
    {
      subject: 'IPAS',
      topic: 'Daur Hidup Hewan (Metamorfosis)',
      difficulty: 'Sedang',
      type: 'multiple_choice',
      question: 'Urutan daur hidup kupu-kupu yang benar dari awal adalah...',
      options: [
        'Telur → Ulat (Larva) → Kepompong (Pupa) → Kupu-kupu dewasa',
        'Telur → Kepompong → Ulat → Kupu-kupu dewasa',
        'Ulat → Telur → Kepompong → Kupu-kupu dewasa',
        'Kepompong → Telur → Ulat → Kupu-kupu dewasa',
      ],
      correctAnswer: 0,
      explanation: 'Kupu-kupu mengalami metamorfosis sempurna: berawal dari telur, menetas menjadi ulat (larva), menjadi kepompong (pupa), lalu keluar menjadi kupu-kupu dewasa (imago).',
      hint: 'Dimulai dari telur yang menetas menjadi ulat pemakan daun.',
    },
    {
      subject: 'IPAS',
      topic: 'Sifat-Sifat Cahaya',
      difficulty: 'Mudah',
      type: 'multiple_choice',
      question: 'Terjadinya bayangan kita di dinding saat terkena sorot lampu senter membuktikan bahwa cahaya...',
      options: ['Dapat dibiaskan', 'Merambat lurus', 'Dapat diuraikan', 'Menembus benda gelap'],
      correctAnswer: 1,
      explanation: 'Cahaya merambat lurus, sehingga ketika terhalang oleh tubuh kita (benda gelap), terbentuk bayangan di belakangnya.',
      hint: 'Cahaya tidak dapat berbelok melewati benda padat.',
    },
    {
      subject: 'Pendidikan Pancasila',
      topic: 'Gotong Royong',
      difficulty: 'Mudah',
      type: 'multiple_choice',
      question: 'Kegiatan membersihkan lingkungan kelas bersama-sama secara sukarela mencerminkan pengamalan nilai...',
      options: ['Individualisme', 'Gotong royong', 'Konsumerisme', 'Egoisme'],
      correctAnswer: 1,
      explanation: 'Gotong royong adalah bekerja bersama-sama untuk mencapai tujuan bersama tanpa pamrih, sesuai karakter bangsa Indonesia.',
      hint: 'Sikap bekerja sama saling membantu.',
    },
    {
      subject: 'Pendidikan Pancasila',
      topic: 'Norma dan Aturan di Sekolah',
      difficulty: 'Sedang',
      type: 'multiple_choice',
      question: 'Apa tujuan utama dibuatnya tata tertib dan aturan di sekolah SDN 32 Rantau Bayur?',
      options: [
        'Agar guru bisa menghukum siswa yang bersalah',
        'Menciptakan suasana belajar yang aman, tertib, dan nyaman bagi semua',
        'Membuat siswa merasa takut dan terkekang',
        'Menambah tugas yang harus dikerjakan siswa',
      ],
      correctAnswer: 1,
      explanation: 'Aturan sekolah dibuat agar kegiatan belajar berlangsung secara tertib, aman, saling menghormati, dan harmonis.',
      hint: 'Tujuannya positif demi kebaikan seluruh warga sekolah.',
    },
  ];

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  // Quick fill helper
  const handleQuickFillExample = (exampleIndex: number) => {
    const tmpl = readyTemplates[exampleIndex];
    if (!tmpl) return;
    sound.playClick();
    setSubject(tmpl.subject);
    setTopic(tmpl.topic);
    setDifficulty(tmpl.difficulty);
    setQuestionText(tmpl.question);
    setOptions([...tmpl.options]);
    setCorrectAnswer(tmpl.correctAnswer);
    setExplanation(tmpl.explanation);
    setHint(tmpl.hint || '');
    setFormError('');
  };

  // Submit Single Question
  const handleSaveSingle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!questionText.trim()) {
      setFormError('Teks pertanyaan wajib diisi.');
      return;
    }
    if (!topic.trim()) {
      setFormError('Topik materi wajib diisi.');
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setFormError('Semua 4 opsi pilihan jawaban (A, B, C, D) harus diisi.');
      return;
    }
    if (!explanation.trim()) {
      setFormError('Pembahasan/penjelasan jawaban wajib diisi untuk edukasi siswa.');
      return;
    }

    sound.playCorrect();
    onAddQuestion({
      subject,
      topic: topic.trim(),
      difficulty,
      type: 'multiple_choice',
      question: questionText.trim(),
      options: options.map((o) => o.trim()),
      correctAnswer,
      explanation: explanation.trim(),
      hint: hint.trim() || undefined,
    });

    onClose();
  };

  // Parse bulk text
  // Supports format: Pertanyaan | Pilihan A | Pilihan B | Pilihan C | Pilihan D | Kunci (A/B/C/D atau 0-3) | Pembahasan
  const handleParseBulk = () => {
    setBulkError('');
    if (!bulkText.trim()) {
      setBulkError('Tempelkan atau ketikkan teks soal terlebih dahulu.');
      return;
    }

    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const parsedList: Omit<Question, 'id'>[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split('|').map((p) => p.trim());

      if (parts.length >= 6) {
        const qText = parts[0];
        const optA = parts[1];
        const optB = parts[2];
        const optC = parts[3];
        const optD = parts[4];
        const keyRaw = parts[5].toUpperCase();
        const expl = parts[6] || `Pembahasan untuk soal materi ${bulkTopic || 'terkait'}.`;

        let keyIdx = 0;
        if (keyRaw === 'B' || keyRaw === '1') keyIdx = 1;
        else if (keyRaw === 'C' || keyRaw === '2') keyIdx = 2;
        else if (keyRaw === 'D' || keyRaw === '3') keyIdx = 3;

        parsedList.push({
          subject: bulkSubject,
          topic: bulkTopic.trim() || 'Latihan Terstruktur',
          difficulty: bulkDifficulty,
          type: 'multiple_choice',
          question: qText,
          options: [optA, optB, optC, optD],
          correctAnswer: keyIdx,
          explanation: expl,
        });
      }
    }

    if (parsedList.length === 0) {
      setBulkError(
        'Format tidak sesuai. Gunakan pemisah tanda pipa (|):\nPertanyaan | Opsi A | Opsi B | Opsi C | Opsi D | Kunci (A/B/C/D) | Pembahasan'
      );
      return;
    }

    sound.playClick();
    setBulkPreviewList(parsedList);
  };

  // Submit bulk questions
  const handleSaveBulk = () => {
    if (bulkPreviewList.length === 0) return;
    sound.playFanfare();

    if (onAddMultipleQuestions) {
      onAddMultipleQuestions(bulkPreviewList);
    } else {
      bulkPreviewList.forEach((q) => onAddQuestion(q));
    }

    onClose();
  };

  // Add a template directly
  const handleUseTemplate = (tmpl: Omit<Question, 'id'>) => {
    sound.playCorrect();
    onAddQuestion(tmpl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {targetGameTitle ? `Tambah Soal Baru: "${targetGameTitle}"` : 'Tambah Butir Soal Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Lengkapi bank soal kelas IV SDN 32 Rantau Bayur secara mudah dan praktis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('single');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Tulis 1 Soal Manual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('bulk');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'bulk'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tempel Banyak Soal (Format Teks)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('templates');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pilih Template Siap Pakai</span>
          </button>
        </div>

        {/* --- TAB 1: SINGLE QUESTION FORM --- */}
        {activeTab === 'single' && (
          <form onSubmit={handleSaveSingle} className="space-y-4">
            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Quick Templates Bar */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Inspirasi Cepat:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFillExample(1)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition"
                >
                  Hitung Perkalian
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillExample(3)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition"
                >
                  Teks Deskripsi
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillExample(4)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition"
                >
                  Daur Hidup Hewan
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillExample(6)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition"
                >
                  Gotong Royong
                </button>
              </div>
            </div>

            {/* Meta Row: Subject, Topic, Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="Matematika">Matematika (Hutan Numerasi)</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia (Negeri Kata)</option>
                  <option value="IPAS">IPAS (Laboratorium Alam)</option>
                  <option value="Pendidikan Pancasila">Pendidikan Pancasila (Pulau Pancasila)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik / Materi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Pecahan Senilai"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="Mudah">Mudah (Pengenalan)</option>
                  <option value="Sedang">Sedang (Standar Kelas IV)</option>
                  <option value="Menantang">Menantang (Pemecahan Masalah)</option>
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Pertanyaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Tuliskan butir soal dengan bahasa yang ramah dan mudah dipahami siswa kelas IV SD..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            {/* 4 Options with Radio Key Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Jawaban (Pilih lingkaran pada jawaban yang benar) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {options.map((opt, idx) => {
                  const isKey = correctAnswer === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                        isKey ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctAnswerOption"
                        checked={isKey}
                        onChange={() => {
                          sound.playClick();
                          setCorrectAnswer(idx);
                        }}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title="Tandai sebagai kunci jawaban yang benar"
                      />
                      <span className="w-5 text-xs font-black text-slate-700">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        required
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation & Hint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pembahasan / Penjelasan Jawaban <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Mengapa jawaban tersebut benar? Tuliskan penjelasan ringkas dan mendidik..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Petunjuk (Opsional)</label>
                <textarea
                  rows={2}
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Petunjuk singkat untuk siswa yang kesulitan menjawab..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Toggle Live Preview */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Sembunyikan Pratinjau Tampilan Siswa' : 'Lihat Pratinjau Tampilan Siswa'}</span>
              </button>
            </div>

            {/* Live Student Preview Card */}
            {showPreview && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Pratinjau Kartu Kuis Siswa:</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    Tingkat: {difficulty}
                  </span>
                </div>
                <p className="font-extrabold text-slate-800 text-sm">
                  {questionText || '(Pertanyaan akan muncul di sini...)'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-xl border flex items-center gap-2 ${
                        oIdx === correctAnswer
                          ? 'bg-emerald-100/90 border-emerald-400 font-bold text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                      <span>{opt || `Opsi ${String.fromCharCode(65 + oIdx)}`}</span>
                      {oIdx === correctAnswer && <span className="ml-auto text-[10px] text-emerald-700">✓ Kunci</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition"
              >
                Simpan & Tambahkan Soal
              </button>
            </div>
          </form>
        )}

        {/* --- TAB 2: BULK IMPORT FORM --- */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Cara Praktis Tempel Banyak Soal Sekaligus:
              </p>
              <p className="text-slate-600 leading-relaxed">
                Tulis atau salin (copy-paste) soal dari dokumen Word/Excel Anda dengan satu baris per butir soal, pisahkan kolom menggunakan tanda pipa (|):
              </p>
              <div className="p-2 rounded-xl bg-white border border-sky-200 font-mono text-[11px] text-slate-700 select-all">
                Pertanyaan? | Opsi A | Opsi B | Opsi C | Opsi D | Kunci (A/B/C/D) | Pembahasan
              </div>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={bulkSubject}
                  onChange={(e) => setBulkSubject(e.target.value as SubjectType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="IPAS">IPAS</option>
                  <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topik Umum</label>
                <input
                  type="text"
                  value={bulkTopic}
                  onChange={(e) => setBulkTopic(e.target.value)}
                  placeholder="Contoh: Latihan Evaluasi Bab 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
                <select
                  value={bulkDifficulty}
                  onChange={(e) => setBulkDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Menantang">Menantang</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area Teks Soal Masal</label>
              <textarea
                rows={6}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Contoh:
Berapakah hasil 12 × 5? | 50 | 60 | 70 | 80 | B | 12 dikali 5 sama dengan 60.
Hewan yang mengalami metamorfosis sempurna adalah... | Belalang | Kupu-kupu | Kecoak | Capung | B | Kupu-kupu melewati fase ulat dan kepompong."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleParseBulk}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition"
              >
                Periksa & Pratinjau Soal
              </button>

              <button
                type="button"
                onClick={() => {
                  setBulkText(
                    `Berapakah hasil dari 15 × 6? | 60 | 75 | 90 | 100 | C | 15 dikalikan 6 sama dengan 90.\nZat hijau daun pada tumbuhan disebut... | Stomata | Klorofil | Oksigen | Batang | B | Klorofil menyerap cahaya matahari untuk fotosintesis.\nSila pertama Pancasila dilambangkan oleh... | Rantai | Bintang | Pohon Beringin | Padi dan Kapas | B | Bintang emas melambangkan Ketuhanan Yang Maha Esa.`
                  );
                }}
                className="text-xs text-amber-700 hover:underline font-semibold"
              >
                Isi Contoh Format
              </button>
            </div>

            {bulkError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {bulkError}
              </div>
            )}

            {/* Parsed Bulk Preview */}
            {bulkPreviewList.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>{bulkPreviewList.length} Soal Berhasil Terbaca & Siap Dimasukkan:</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {bulkPreviewList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1"
                    >
                      <p className="font-bold text-slate-800">
                        {idx + 1}. {item.question}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-semibold">
                        Kunci: {String.fromCharCode(65 + item.correctAnswer)}. {item.options[item.correctAnswer]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveBulk}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition"
                  >
                    Tambahkan Semua {bulkPreviewList.length} Soal ke Bank Soal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: READY TEMPLATES SELECTION --- */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <span className="font-bold">Koleksi Soal Kurikulum Kelas IV Terkurasi:</span>
              <p className="text-slate-600 mt-0.5">
                Pilih soal yang ingin Anda gunakan langsung pada kuis atau bank soal dengan satu klik tombol &ldquo;Tambahkan&rdquo;.
              </p>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {readyTemplates.map((tmpl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-300 bg-white transition flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {tmpl.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">Topik: {tmpl.topic}</span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs">{tmpl.question}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Kunci: {String.fromCharCode(65 + tmpl.correctAnswer)}. {tmpl.options[tmpl.correctAnswer]}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(tmpl)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambahkan Soal Ini</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
