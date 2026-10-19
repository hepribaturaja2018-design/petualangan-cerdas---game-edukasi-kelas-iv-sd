import { AppSettings, AppStateData, Game, GameSession, Question, Student, StudentGroup } from '../types';
import { DEFAULT_SETTINGS, INITIAL_GAMES, INITIAL_GROUPS, INITIAL_QUESTIONS, INITIAL_STUDENTS } from '../data/initialData';

const STORAGE_KEY = 'petualangan_cerdas_data_v1';

export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Load complete state from localStorage or initialize defaults
  public loadState(): AppStateData {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (parsed && parsed.schemaVersion === 1) {
          return {
            schemaVersion: 1,
            settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
            students: Array.isArray(parsed.students) ? parsed.students : INITIAL_STUDENTS,
            groups: Array.isArray(parsed.groups) ? parsed.groups : INITIAL_GROUPS,
            questions: Array.isArray(parsed.questions) ? parsed.questions : INITIAL_QUESTIONS,
            games: Array.isArray(parsed.games) ? parsed.games : INITIAL_GAMES,
            sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage, menggunakan data inisial.', e);
    }

    // Default state if nothing found or corrupted
    const defaultState: AppStateData = {
      schemaVersion: 1,
      settings: DEFAULT_SETTINGS,
      students: INITIAL_STUDENTS,
      groups: INITIAL_GROUPS,
      questions: INITIAL_QUESTIONS,
      games: INITIAL_GAMES,
      sessions: [
        {
          id: 'sess-demo-1',
          gameId: 'game-1',
          gameTitle: 'Penjelajahan Hutan Numerasi',
          subject: 'Matematika',
          topic: 'Pecahan dan Pengukuran',
          mode: 'individual',
          participantId: 'std-1',
          participantName: 'Ahmad Faiz Pratama',
          avatar: '🦅',
          totalQuestions: 4,
          correctCount: 4,
          incorrectCount: 0,
          score: 40,
          maxScore: 40,
          percentage: 100,
          durationSeconds: 95,
          stars: 3,
          xpEarned: 120,
          badges: [],
          completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          answers: [],
        },
        {
          id: 'sess-demo-2',
          gameId: 'game-2',
          gameTitle: 'Misi Rahasia Negeri Kata',
          subject: 'Bahasa Indonesia',
          topic: 'Gagasan Pokok dan Tata Kalimat',
          mode: 'individual',
          participantId: 'std-2',
          participantName: 'Siti Nur Aisyah',
          avatar: '🌟',
          totalQuestions: 4,
          correctCount: 4,
          incorrectCount: 0,
          score: 40,
          maxScore: 40,
          percentage: 100,
          durationSeconds: 88,
          stars: 3,
          xpEarned: 120,
          badges: [],
          completedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          answers: [],
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    this.saveState(defaultState);
    return defaultState;
  }

  // Save complete state to localStorage
  public saveState(state: AppStateData): boolean {
    try {
      const toSave = {
        ...state,
        schemaVersion: 1,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      return true;
    } catch (e) {
      console.error('Penyimpanan lokal penuh atau tidak diizinkan oleh peramban.', e);
      return false;
    }
  }

  // Export full JSON backup
  public exportBackupJson(state: AppStateData) {
    const filename = `cadangan-petualangan-cerdas-sdn32-${new Date().toISOString().slice(0, 10)}.json`;
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Validate imported JSON data
  public validateImportedJson(parsed: any): { valid: boolean; message: string; summary?: any } {
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, message: 'Format berkas tidak berupa objek JSON yang valid.' };
    }
    if (parsed.schemaVersion !== 1) {
      return { valid: false, message: `Versi skema cadangan tidak sesuai (harus versi 1, ditemukan: ${parsed.schemaVersion || 'tidak ada'}).` };
    }
    if (!Array.isArray(parsed.students)) {
      return { valid: false, message: 'Data siswa di dalam berkas cadangan tidak valid.' };
    }
    if (!Array.isArray(parsed.questions)) {
      return { valid: false, message: 'Data bank soal di dalam berkas cadangan tidak valid.' };
    }
    if (!Array.isArray(parsed.games)) {
      return { valid: false, message: 'Data permainan di dalam berkas cadangan tidak valid.' };
    }

    return {
      valid: true,
      message: 'Berkas cadangan valid dan siap dipulihkan.',
      summary: {
        studentsCount: parsed.students.length,
        questionsCount: parsed.questions.length,
        gamesCount: parsed.games.length,
        sessionsCount: Array.isArray(parsed.sessions) ? parsed.sessions.length : 0,
        schoolName: parsed.settings?.schoolName || 'SDN 32 Rantau Bayur',
        lastUpdated: parsed.lastUpdated || '-',
      },
    };
  }

  // Export learning sessions to CSV for Indonesian Excel
  public exportSessionsToCsv(sessions: GameSession[], settings: AppSettings) {
    const filename = `laporan-hasil-belajar-${settings.schoolName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;

    const headers = [
      'ID Sesi',
      'Tanggal & Waktu',
      'Nama Siswa / Tim',
      'Judul Permainan',
      'Mata Pelajaran',
      'Topik Pembelajaran',
      'Mode Permainan',
      'Jumlah Soal',
      'Jawaban Benar',
      'Jawaban Salah',
      'Skor Akhir',
      'Skor Maksimal',
      'Persentase Nilai (%)',
      'Bintang Diraih',
      'XP Diperoleh',
      'Durasi (detik)',
    ];

    const escapeCsv = (val: any) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = sessions.map((s) => [
      escapeCsv(s.id),
      escapeCsv(new Date(s.completedAt).toLocaleString('id-ID')),
      escapeCsv(s.participantName),
      escapeCsv(s.gameTitle),
      escapeCsv(s.subject),
      escapeCsv(s.topic),
      escapeCsv(s.mode === 'individual' ? 'Individu' : s.mode === 'group' ? 'Kelompok' : 'Proyektor'),
      s.totalQuestions,
      s.correctCount,
      s.incorrectCount,
      s.score,
      s.maxScore,
      s.percentage,
      s.stars,
      s.xpEarned,
      s.durationSeconds,
    ]);

    // UTF-8 BOM for Microsoft Excel compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Reset data to empty or fresh seed
  public resetToDefault(): AppStateData {
    const freshState: AppStateData = {
      schemaVersion: 1,
      settings: DEFAULT_SETTINGS,
      students: INITIAL_STUDENTS,
      groups: INITIAL_GROUPS,
      questions: INITIAL_QUESTIONS,
      games: INITIAL_GAMES,
      sessions: [],
      lastUpdated: new Date().toISOString(),
    };
    this.saveState(freshState);
    return freshState;
  }
}

export const storage = StorageService.getInstance();
