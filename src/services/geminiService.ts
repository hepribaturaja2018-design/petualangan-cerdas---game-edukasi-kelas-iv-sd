import { Question, SubjectType, DifficultyLevel } from '../types';

export interface GenerateQuestionsParams {
  subject: SubjectType;
  topic: string;
  grade?: string;
  count: number;
  difficulty: DifficultyLevel;
}

export interface GenerateResult {
  success: boolean;
  questions?: Question[];
  error?: string;
  usingFallback?: boolean;
}

export async function checkGeminiHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { status: 'error', hasApiKey: false };
    }
    const data = await res.json();
    return { status: data.status || 'ok', hasApiKey: Boolean(data.hasApiKey) };
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function generateQuestionsWithGemini(
  params: GenerateQuestionsParams
): Promise<GenerateResult> {
  try {
    const response = await fetch('/api/gemini/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Layanan AI Gemini sedang tidak tersedia. Silakan gunakan bank soal lokal.',
      };
    }

    return {
      success: true,
      questions: data.questions,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Tidak dapat terhubung ke server pembuat soal AI. Anda dapat memilih soal langsung dari Bank Soal Lokal.',
    };
  }
}
