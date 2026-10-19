import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  HelpCircle,
  CheckCircle2,
  X,
  Gamepad2,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
} from 'lucide-react';
import { DifficultyLevel, Question, SubjectType } from '../../types';
import { sound } from '../../services/soundService';
import { AddQuestionModal } from './AddQuestionModal';

interface QuestionBankViewProps {
  questions: Question[];
  onAddQuestion: (question: Omit<Question, 'id'>) => void;
  onAddMultipleQuestions?: (questions: Omit<Question, 'id'>[]) => void;
  onUpdateQuestion: (id: string, updated: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onUseInGame: (question: Question) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  onAddQuestion,
  onAddMultipleQuestions,
  onUpdateQuestion,
  onDeleteQuestion,
  onUseInGame,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showExplanations, setShowExplanations] = useState<boolean>(true);

  // Add Question Modal state
  const [internalAddModalOpen, setInternalAddModalOpen] = useState(false);

  // Edit Question Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Delete Confirm State
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Edit Form State
  const [editSubject, setEditSubject] = useState<SubjectType>('Matematika');
  const [editTopic, setEditTopic] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<DifficultyLevel>('Sedang');
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '', '']);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState<number>(0);
  const [editExplanation, setEditExplanation] = useState('');
  const [editHint, setEditHint] = useState('');
  const [editFormError, setEditFormError] = useState('');

  const openAddModal = () => {
    sound.playClick();
    setInternalAddModalOpen(true);
  };

  const closeAddModal = () => {
    setInternalAddModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const openEditModal = (q: Question) => {
    sound.playClick();
    setEditingQuestion(q);
    setEditSubject(q.subject);
    setEditTopic(q.topic);
    setEditDifficulty(q.difficulty);
    setEditQuestionText(q.question);
    setEditOptions([...q.options]);
    setEditCorrectAnswer(q.correctAnswer);
    setEditExplanation(q.explanation);
    setEditHint(q.hint || '');
    setEditFormError('');
    setIsEditModalOpen(true);
  };

  const handleEditOptionChange = (idx: number, val: string) => {
    const updated = [...editOptions];
    updated[idx] = val;
    setEditOptions(updated);
  };

  const handleSaveEditQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuestionText.trim()) {
      setEditFormError('Teks pertanyaan tidak boleh kosong.');
      return;
    }
    if (!editTopic.trim()) {
      setEditFormError('Topik materi tidak boleh kosong.');
      return;
    }
    if (editOptions.some((opt) => !opt.trim())) {
      setEditFormError('Semua 4 pilihan jawaban harus diisi.');
      return;
    }
    if (!editExplanation.trim()) {
      setEditFormError('Pembahasan/penjelasan jawaban harus diisi.');
      return;
    }

    if (editingQuestion) {
      onUpdateQuestion(editingQuestion.id, {
        subject: editSubject,
        topic: editTopic.trim(),
        difficulty: editDifficulty,
        question: editQuestionText.trim(),
        options: editOptions.map((o) => o.trim()),
        correctAnswer: editCorrectAnswer,
        explanation: editExplanation.trim(),
        hint: editHint.trim() || undefined,
      });
    }

    sound.playCorrect();
    setIsEditModalOpen(false);
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchSearch && matchSubject && matchDifficulty;
  });

  const isAddingOpen = isAddModalOpen || internalAddModalOpen;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-emerald-600" />
            <span>Bank Soal Terstruktur Kelas IV</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kumpulan bank soal pilihan ganda lengkap dengan kunci jawaban, pembahasan, dan indikator topik materi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-200 transition flex items-center gap-2 cursor-pointer transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari teks soal atau materi..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">Semua Mata Pelajaran</option>
            <option value="Matematika">Matematika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="IPAS">IPAS</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">Semua Tingkat</option>
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Menantang">Menantang</option>
          </select>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowExplanations(!showExplanations);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition ml-auto"
          >
            {showExplanations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showExplanations ? 'Sembunyikan Kunci' : 'Tampilkan Kunci'}</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-amber-200/80 text-center shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak Ada Soal yang Sesuai</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Coba sesuaikan kata kunci pencarian atau tambahkan soal baru ke bank soal.
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold transition shadow-xs"
          >
            Tambah Soal Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:border-amber-300 transition space-y-3"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                    {q.subject}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                    Topik: {q.topic}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Tingkat: {q.difficulty}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onUseInGame(q);
                    }}
                    className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
                    title="Gunakan pada Game Baru"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Gunakan</span>
                  </button>
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition"
                    title="Ubah Soal"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setQuestionToDelete(q);
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
                {idx + 1}. {q.question}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctAnswer;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-2 ${
                        showExplanations && isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          showExplanations && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                      {showExplanations && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation & Hint */}
              {showExplanations && (
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <p className="text-slate-600">
                    <strong className="text-slate-900 font-bold">💡 Pembahasan:</strong> {q.explanation}
                  </p>
                  {q.hint && (
                    <p className="text-amber-800">
                      <strong className="font-bold">Petunjuk:</strong> {q.hint}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Question Modal (Shared component) */}
      <AddQuestionModal
        isOpen={isAddingOpen}
        onClose={closeAddModal}
        onAddQuestion={onAddQuestion}
        onAddMultipleQuestions={onAddMultipleQuestions}
      />

      {/* Edit Question Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Ubah Butir Soal</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditQuestion} className="space-y-4">
              {editFormError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  {editFormError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value as SubjectType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="IPAS">IPAS</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Topik / Materi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Menantang">Menantang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Pertanyaan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Pilihan Jawaban (Pilih radio pada jawaban yang benar) <span className="text-rose-500">*</span>
                </label>
                {editOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="editCorrectAnswer"
                      checked={editCorrectAnswer === idx}
                      onChange={() => setEditCorrectAnswer(idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="w-6 text-xs font-black text-slate-700">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleEditOptionChange(idx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pembahasan / Penjelasan Jawaban <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Petunjuk (Opsional)</label>
                <input
                  type="text"
                  value={editHint}
                  onChange={(e) => setEditHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Hapus Soal Ini?</h4>
            <p className="text-xs text-slate-600 mb-5">
              Apakah Anda yakin ingin menghapus butir soal ini dari bank soal?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onDeleteQuestion(questionToDelete.id);
                  setQuestionToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
