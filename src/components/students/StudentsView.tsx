import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Trophy,
  Star,
  Award,
  Sparkles,
  ArrowUpDown,
  X,
  Check,
} from 'lucide-react';
import { Student, StudentGroup } from '../../types';
import { sound } from '../../services/soundService';
import { INITIAL_STUDENTS } from '../../data/initialData';

interface StudentsViewProps {
  students: Student[];
  groups: StudentGroup[];
  onAddStudent: (student: Omit<Student, 'id' | 'totalScore' | 'gamesPlayed' | 'starsEarned' | 'xp' | 'createdAt'>) => void;
  onUpdateStudent: (id: string, updated: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onLoadDemoStudents: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  groups,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onLoadDemoStudents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'score_desc'>('name_asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [group, setGroup] = useState('Kelompok Rajawali');
  const [avatar, setAvatar] = useState('🦅');
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const availableAvatars = ['🦅', '🌟', '🐯', '🐬', '🚀', '🌸', '🦁', '🐼', '🦊', '🦉', '🐢', '🎒'];

  const openAddModal = () => {
    sound.playClick();
    setEditingStudent(null);
    setName('');
    setCode(`SD32-${String(students.length + 1).padStart(2, '0')}`);
    setGroup('Kelompok Rajawali');
    setAvatar('🦅');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    sound.playClick();
    setEditingStudent(student);
    setName(student.name);
    setCode(student.code || '');
    setGroup(student.group || 'Kelompok Rajawali');
    setAvatar(student.avatar || '🦅');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama siswa tidak boleh kosong.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent(editingStudent.id, {
        name: name.trim(),
        code: code.trim(),
        group,
        avatar,
      });
    } else {
      onAddStudent({
        name: name.trim(),
        code: code.trim(),
        group,
        avatar,
      });
    }

    sound.playCorrect();
    setIsModalOpen(false);
  };

  // Filter & Sort
  const filteredStudents = students
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
      return matchSearch && matchGroup;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'score_desc') return b.totalScore - a.totalScore;
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-amber-500" />
            <span>Data Siswa Kelas IV</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola identitas belajar, kelompok regu, serta rekam capaian petualangan siswa SDN 32 Rantau Bayur.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {students.length === 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onLoadDemoStudents();
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition"
            >
              + Muat Contoh Siswa
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-200 transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau kode siswa..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Kelompok:</span>
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">Semua Kelompok</option>
            <option value="Kelompok Rajawali">Kelompok Rajawali</option>
            <option value="Kelompok Garuda">Kelompok Garuda</option>
            <option value="Kelompok Harimau">Kelompok Harimau</option>
            <option value="Kelompok Komodo">Kelompok Komodo</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium ml-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Urutkan:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="name_asc">Nama (A - Z)</option>
            <option value="name_desc">Nama (Z - A)</option>
            <option value="score_desc">Skor Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-amber-200/80 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto mb-3">
            🎒
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {students.length === 0 ? 'Belum Ada Data Siswa' : 'Siswa Tidak Ditemukan'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
            {students.length === 0
              ? 'Tambahkan siswa baru atau muat contoh siswa fiktif SDN 32 Rantau Bayur untuk mencoba simulasi kuis.'
              : 'Silakan sesuaikan kata kunci pencarian atau ganti filter kelompok di atas.'}
          </p>
          {students.length === 0 && (
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm transition"
            >
              Tambah Siswa Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Avatar & Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {student.avatar || '🎒'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{student.name}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{student.code || 'Tanpa Kode'}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {student.group || 'Umum'}
                  </span>
                </div>

                {/* Score Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 my-2 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Skor</span>
                    <span className="font-black text-amber-900 text-sm">{student.totalScore}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Main</span>
                    <span className="font-black text-slate-800 text-sm">{student.gamesPlayed}x</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Bintang</span>
                    <span className="font-black text-amber-500 text-sm flex items-center justify-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {student.starsEarned}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openEditModal(student)}
                  className="p-2 rounded-xl text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition"
                  title="Ubah Siswa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStudentToDelete(student);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Hapus Siswa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingStudent ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Ilham"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode Siswa Internal (Opsional)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: SD32-07"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelompok Belajar</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Kelompok Rajawali">Kelompok Rajawali</option>
                  <option value="Kelompok Garuda">Kelompok Garuda</option>
                  <option value="Kelompok Harimau">Kelompok Harimau</option>
                  <option value="Kelompok Komodo">Kelompok Komodo</option>
                  <option value="Kelompok Bintang">Kelompok Bintang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Avatar Petualang</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableAvatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`h-11 rounded-xl text-xl flex items-center justify-center border transition ${
                        avatar === av
                          ? 'bg-amber-100 border-amber-500 shadow-xs scale-105'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Hapus Data Siswa?</h4>
            <p className="text-xs text-slate-600 mb-5">
              Apakah Anda yakin ingin menghapus siswa <span className="font-bold text-slate-900">{studentToDelete.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
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
