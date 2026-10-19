import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Health & status check
  app.get('/api/health', (_req, res) => {
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      hasApiKey,
      appName: 'PETUALANGAN CERDAS',
      school: 'SDN 32 Rantau Bayur',
    });
  });

  // Optional AI Module: Generate quiz questions using Gemini API
  app.post('/api/gemini/generate-questions', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          success: false,
          error: 'Kunci API Gemini belum dikonfigurasi di server. Aplikasi dapat berjalan 100% menggunakan bank soal lokal.',
        });
      }

      const { subject, topic, grade = 'Kelas IV SD', count = 5, difficulty = 'Sedang' } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Anda adalah guru ahli dan pengembang kurikulum sekolah dasar di Indonesia.
Buatlah tepat ${count} butir soal pilihan ganda berkualitas tinggi untuk siswa ${grade} (usia 9-11 tahun) dengan spesifikasi:
- Mata Pelajaran: ${subject}
- Topik / Materi: ${topic}
- Tingkat Kesulitan: ${difficulty}

Pedoman pembuatan soal:
1. Kalimat soal jelas, ramah anak, dan mendidik.
2. Tepat 4 pilihan jawaban yang masuk akal dan adil.
3. Tepat 1 jawaban benar dengan indeks (0, 1, 2, atau 3).
4. Penjelasan singkat yang konstruktif dan memotivasi siswa SD.`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Batas waktu permintaan AI terlampaui (timeout).')), 10000)
      );

      const response: any = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              description: 'Daftar soal pilihan ganda kelas 4 SD',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: 'Teks soal pertanyaan' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Tepat 4 opsi pilihan jawaban',
                  },
                  correctAnswer: {
                    type: Type.INTEGER,
                    description: 'Indeks jawaban yang benar (0-3)',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Penjelasan/pembahasan jawaban yang ramah anak',
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: 'Tingkat kesulitan (Mudah, Sedang, atau Menantang)',
                  },
                },
                required: ['question', 'options', 'correctAnswer', 'explanation'],
              },
            },
          },
        }),
        timeoutPromise,
      ]);

      const text = response.text?.trim() || '[]';
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Draf soal tidak dapat diproses dari AI.');
      }

      const questions = parsed.map((item, i) => ({
        id: `gen-${Date.now()}-${i + 1}`,
        subject: subject || 'Tematik',
        topic: topic || 'Materi Umum',
        difficulty: item.difficulty || difficulty,
        type: 'multiple_choice',
        question: String(item.question || '').trim(),
        options: Array.isArray(item.options) && item.options.length === 4
          ? item.options.map((opt: any) => String(opt).trim())
          : ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        correctAnswer: (typeof item.correctAnswer === 'number' && item.correctAnswer >= 0 && item.correctAnswer <= 3)
          ? item.correctAnswer
          : 0,
        explanation: String(item.explanation || 'Pembahasan materi.').trim(),
      }));

      return res.json({
        success: true,
        questions,
      });
    } catch (err: any) {
      console.error('Gemini error:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Terjadi kendala saat meminta draf soal ke Gemini. Silakan gunakan bank soal lokal.',
      });
    }
  });

  // Serve static assets in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Petualangan Cerdas berjalan di port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
