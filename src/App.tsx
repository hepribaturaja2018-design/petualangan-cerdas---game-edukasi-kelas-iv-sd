import React, { useState, useEffect } from 'react';
import { ActiveNavTab, AppSettings, AppStateData, Game, GameMode, GameSession, Question, Student } from './types';
import { storage } from './services/storageService';
import { sound } from './services/soundService';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { AdventureWorldView } from './components/adventure/AdventureWorldView';
import { GameBuilderView } from './components/game-builder/GameBuilderView';
import { QuestionBankView } from './components/question-bank/QuestionBankView';
import { ClassroomGameView } from './components/classroom-game/ClassroomGameView';
import { ClassroomToolsView } from './components/classroom-tools/ClassroomToolsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';
import { QuizEngine } from './components/game/QuizEngine';
import { AddQuestionModal } from './components/question-bank/AddQuestionModal';
import { INITIAL_STUDENTS } from './data/initialData';

export default function App() {
  const [appState, setAppState] = useState<AppStateData>(() => storage.loadState());
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Add Question Modal Trigger
  const [isGlobalAddQuestionOpen, setIsGlobalAddQuestionOpen] = useState(false);

  // Active Game State
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [activeStudentPlayer, setActiveStudentPlayer] = useState<Student | null>(null);
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('individual');
  const [activeParticipantName, setActiveParticipantName] = useState<string | undefined>(undefined);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info' | 'error', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync sound service with state settings
  useEffect(() => {
    sound.setEnabled(appState.settings.soundEnabled);
  }, [appState.settings.soundEnabled]);

  // Persist state changes
  const updateAndSaveState = (updater: (prev: AppStateData) => AppStateData) => {
    setAppState((prev) => {
      const next = updater(prev);
      storage.saveState(next);
      return next;
    });
  };

  // Toggle sound
  const handleToggleSound = () => {
    updateAndSaveState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: !prev.settings.soundEnabled,
      },
    }));
  };

  // Start game handler
  const handleStartGame = (
    game: Game,
    student?: Student,
    mode: GameMode = 'individual',
    participantName?: string
  ) => {
    // Resolve questions for this game
    const gameQuestions = appState.questions.filter((q) => game.questionIds.includes(q.id));

    if (gameQuestions.length === 0) {
      addToast(
        'warning',
        'Misi ini belum memiliki butir soal yang aktif. Silakan pilih atau tambahkan soal di Bank Soal.',
        'Soal Belum Lengkap'
      );
      return;
    }

    setActiveGame(game);
    setActiveStudentPlayer(student || appState.students[0] || null);
    setActiveGameMode(mode);
    setActiveParticipantName(participantName);
  };

  // Game completed handler
  const handleFinishGame = (session: GameSession) => {
    updateAndSaveState((prev) => {
      // Update student stats if individual
      let updatedStudents = [...prev.students];
      if (session.participantId && session.mode === 'individual') {
        updatedStudents = updatedStudents.map((std) => {
          if (std.id === session.participantId) {
            return {
              ...std,
              totalScore: std.totalScore + session.score,
              gamesPlayed: std.gamesPlayed + 1,
              starsEarned: std.starsEarned + session.stars,
              xp: std.xp + session.xpEarned,
            };
          }
          return std;
        });
      }

      return {
        ...prev,
        students: updatedStudents,
        sessions: [session, ...prev.sessions],
      };
    });

    setActiveGame(null);
    setActiveTab('reports');
    addToast(
      'success',
      `Hasil kuis berhasil dicatat! Nilai: ${session.percentage}% (${session.stars} Bintang).`,
      'Petualangan Disimpan'
    );
  };

  // Exit game
  const handleExitGame = () => {
    setActiveGame(null);
  };

  // Student CRUD
  const handleAddStudent = (
    newStudent: Omit<Student, 'id' | 'totalScore' | 'gamesPlayed' | 'starsEarned' | 'xp' | 'createdAt'>
  ) => {
    const student: Student = {
      ...newStudent,
      id: `std-${Date.now()}`,
      totalScore: 0,
      gamesPlayed: 0,
      starsEarned: 0,
      xp: 0,
      createdAt: new Date().toISOString(),
    };

    updateAndSaveState((prev) => ({
      ...prev,
      students: [...prev.students, student],
    }));

    addToast('success', `Siswa ${student.name} berhasil ditambahkan!`, 'Data Tersimpan');
  };

  const handleUpdateStudent = (id: string, updated: Partial<Student>) => {
    updateAndSaveState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
    addToast('success', 'Perubahan data siswa berhasil disimpan.', 'Data Diperbarui');
  };

  const handleDeleteStudent = (id: string) => {
    updateAndSaveState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
    }));
    addToast('info', 'Data siswa telah dihapus.', 'Penghapusan Berhasil');
  };

  const handleLoadDemoStudents = () => {
    updateAndSaveState((prev) => ({
      ...prev,
      students: INITIAL_STUDENTS,
    }));
    addToast('success', 'Contoh siswa fiktif SDN 32 Rantau Bayur berhasil dimuat.', 'Demo Dimuat');
  };

  // Question CRUD (Single and Multiple)
  const handleAddQuestion = (newQuestion: Omit<Question, 'id'>) => {
    const question: Question = {
      ...newQuestion,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    updateAndSaveState((prev) => ({
      ...prev,
      questions: [question, ...prev.questions],
    }));

    addToast('success', 'Butir soal baru berhasil ditambahkan ke Bank Soal!', 'Soal Tersimpan');
  };

  const handleAddMultipleQuestions = (newQuestions: Omit<Question, 'id'>[]) => {
    const formatted: Question[] = newQuestions.map((q, idx) => ({
      ...q,
      id: `q-${Date.now()}-${idx + 1}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    }));

    updateAndSaveState((prev) => ({
      ...prev,
      questions: [...formatted, ...prev.questions],
    }));

    addToast(
      'success',
      `Berhasil menambahkan ${formatted.length} butir soal baru ke Bank Soal!`,
      'Soal Masal Tersimpan'
    );
  };

  const handleUpdateQuestion = (id: string, updated: Partial<Question>) => {
    updateAndSaveState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updated } : q)),
    }));
    addToast('success', 'Butir soal berhasil diperbarui.', 'Soal Diperbarui');
  };

  const handleDeleteQuestion = (id: string) => {
    updateAndSaveState((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
      games: prev.games.map((g) => ({
        ...g,
        questionIds: g.questionIds.filter((qid) => qid !== id),
      })),
    }));
    addToast('info', 'Butir soal telah dihapus dari bank soal.', 'Soal Dihapus');
  };

  // Game Builder save
  const handleSaveGame = (newGame: Game, createdQuestions?: Question[]) => {
    updateAndSaveState((prev) => {
      const updatedQuestions = createdQuestions ? [...createdQuestions, ...prev.questions] : prev.questions;
      return {
        ...prev,
        questions: updatedQuestions,
        games: [newGame, ...prev.games],
      };
    });

    addToast(
      'success',
      `Permainan "${newGame.title}" berhasil disimpan dan siap dimainkan!`,
      'Game Diterbitkan'
    );
  };

  // Settings update
  const handleUpdateSettings = (newSettings: AppSettings) => {
    updateAndSaveState((prev) => ({
      ...prev,
      settings: newSettings,
    }));
    addToast('success', 'Pengaturan aplikasi berhasil disimpan.', 'Pengaturan Tersimpan');
  };

  // Backup & Restore
  const handleBackupJson = () => {
    storage.exportBackupJson(appState);
    addToast('success', 'Berkas cadangan JSON berhasil diunduh ke komputer Anda.', 'Cadangan Selesai');
  };

  const handleRestoreState = (importedState: AppStateData) => {
    storage.saveState(importedState);
    setAppState(importedState);
    addToast('success', 'Data aplikasi berhasil dipulihkan dari cadangan JSON.', 'Pemulihan Selesai');
  };

  const handleExportCsv = () => {
    storage.exportSessionsToCsv(appState.sessions, appState.settings);
    addToast('success', 'Laporan hasil belajar berhasil diekspor ke format CSV.', 'Ekspor CSV');
  };

  const handleResetData = () => {
    const fresh = storage.resetToDefault();
    setAppState(fresh);
    addToast('warning', 'Data aplikasi telah direset ke paket awal.', 'Reset Berhasil');
  };

  // Active Game Render: If activeGame is present, display focused game engine
  if (activeGame) {
    const gameQuestions = appState.questions.filter((q) => activeGame.questionIds.includes(q.id));
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-amber-50/60 text-slate-800">
        <NotificationToast toasts={toasts} onDismiss={removeToast} />
        <QuizEngine
          game={activeGame}
          questions={gameQuestions}
          currentStudent={activeStudentPlayer}
          mode={activeGameMode}
          participantName={activeParticipantName}
          onFinishGame={handleFinishGame}
          onExitGame={handleExitGame}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Toast notifications */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />

      {/* Global Add Question Modal (can be opened from Dashboard quick action, etc.) */}
      <AddQuestionModal
        isOpen={isGlobalAddQuestionOpen}
        onClose={() => setIsGlobalAddQuestionOpen(false)}
        onAddQuestion={handleAddQuestion}
        onAddMultipleQuestions={handleAddMultipleQuestions}
      />

      {/* Header */}
      <Header
        settings={appState.settings}
        studentsCount={appState.students.length}
        gamesCount={appState.games.length}
        onToggleSound={handleToggleSound}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onStartAdventure={() => setActiveTab('adventure')}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          studentsCount={appState.students.length}
          questionsCount={appState.questions.length}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              state={appState}
              onNavigate={setActiveTab}
              onQuickStartGame={(g) => handleStartGame(g)}
              onBackupData={handleBackupJson}
              onOpenAddQuestion={() => setIsGlobalAddQuestionOpen(true)}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={appState.students}
              groups={appState.groups}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onLoadDemoStudents={handleLoadDemoStudents}
            />
          )}

          {activeTab === 'adventure' && (
            <AdventureWorldView
              games={appState.games}
              sessions={appState.sessions}
              students={appState.students}
              onStartMission={(g, s) => handleStartGame(g, s, 'individual')}
            />
          )}

          {activeTab === 'game-builder' && (
            <GameBuilderView
              questions={appState.questions}
              onSaveGame={handleSaveGame}
              onNavigateToAdventure={() => setActiveTab('adventure')}
            />
          )}

          {activeTab === 'question-bank' && (
            <QuestionBankView
              questions={appState.questions}
              onAddQuestion={handleAddQuestion}
              onAddMultipleQuestions={handleAddMultipleQuestions}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onUseInGame={(q) => {
                setActiveTab('game-builder');
              }}
            />
          )}

          {activeTab === 'classroom-game' && (
            <ClassroomGameView
              games={appState.games}
              groups={appState.groups}
              onStartClassroomGame={(g, mode, groupName) => handleStartGame(g, undefined, mode, groupName)}
            />
          )}

          {activeTab === 'classroom-tools' && (
            <ClassroomToolsView students={appState.students} />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              sessions={appState.sessions}
              settings={appState.settings}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={appState.settings}
              state={appState}
              onUpdateSettings={handleUpdateSettings}
              onBackupJson={handleBackupJson}
              onRestoreState={handleRestoreState}
              onResetData={handleResetData}
            />
          )}

          {activeTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
