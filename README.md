# VitalVid 🩺

**Your Health, Explained in Seconds**

A next-generation health dashboard that explains blood test results through AI-generated videos with Japanese voice narration.

## Live Demo

**Deploy URL**: https://vitalvid-7iogk2utw-isaka1022s-projects.vercel.app

![VitalVid Screenshot](スクリーンショット%202025-11-12%2020.13.17.png)

## Overview

VitalVid takes your blood test numbers and instantly generates short AI videos explaining what each metric means, your risk level, and concrete action steps — all narrated in natural Japanese via Shisa AI TTS.

**Key idea**: Video is the UI primitive. Instead of charts and tables, each health metric gets its own AI-generated video explanation.

## Features

- **AI Video Generation** — Click any metric card to generate a personalized explanation video powered by mulmocast + GPT-4
- **Japanese Voice Narration** — High-quality speech synthesis via Shisa AI TTS
- **Real-time Translation** — Bilingual (Japanese/English) narration scripts via Shisa AI
- **Voice Q&A** — Ask health questions by voice; get spoken answers (ASR → GPT-4 → TTS pipeline)
- **Risk Level Analysis** — Color-coded risk evaluation (Normal / Warning / Danger) for key metabolic markers
- **Actionable Advice** — Specific improvement recommendations alongside each video

### Analyzed Metrics

| Metric | Indicator |
|---|---|
| LH Ratio (LDL/HDL) | Atherosclerosis risk |
| Blood Glucose | Diabetes risk |
| HDL Cholesterol | Good cholesterol level |
| Triglycerides | Metabolic syndrome risk |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| AI / LLM | OpenAI GPT-4 (script generation, Q&A) |
| Video Generation | mulmocast v2 |
| TTS | Shisa AI (Japanese speech synthesis) |
| ASR | Shisa AI (speech recognition) |
| Translation | Shisa AI (JA ↔ EN) |
| Deployment | Vercel |

## Project Structure

```
vitalvid/
├── app/
│   ├── api/
│   │   ├── generate-video/route.ts   # Video generation endpoint
│   │   └── voice-qa/route.ts         # Voice Q&A endpoint
│   ├── layout.tsx
│   └── page.tsx                      # Main dashboard page
├── components/
│   ├── DataInputForm.tsx             # Blood test data input
│   ├── MetricCard.tsx                # Per-metric risk card
│   └── VoiceQA.tsx                   # Voice Q&A component
├── lib/
│   ├── prompts.ts                    # GPT-4 prompt templates
│   ├── risk-evaluator.ts             # Risk level logic
│   ├── sample-data.ts                # Demo data
│   ├── shisa-tts.ts                  # Shisa AI TTS integration
│   ├── shisa-translation.ts          # Shisa AI translation integration
│   └── shisa-asr.ts                  # Shisa AI ASR integration
└── types/
    └── blood-test.ts                 # TypeScript type definitions
```

## Setup

### Prerequisites

- Node.js 18+
- ffmpeg (required by mulmocast for video rendering)

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg
```

> **Note — Vercel live demo**: The hosted demo on Vercel cannot generate videos because Vercel's serverless runtime does not include ffmpeg. Clicking "動画を見る" will fall back to text + audio mode automatically. For the full video-generation experience, run the app locally with ffmpeg installed as shown above.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional: enables Japanese voice narration
SHISA_API_KEY=your_shisa_api_key_here
```

- **OpenAI**: Get your key at [platform.openai.com](https://platform.openai.com/)
- **Shisa AI** (optional): Sign up at [talk.shisa.ai](https://talk.shisa.ai/ja) — without this, videos are generated without voice narration

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Verify mulmocast (video generation)

```bash
npx mulmo movie test-mulmo.json -o public/videos/test-output.mp4
```

## Usage

1. **Enter data** — Input your blood test values or load sample data
2. **Analyze** — Click "分析開始" to evaluate all metrics
3. **Watch** — Click "動画を見る" on any metric card to generate a video explanation
4. **Ask** — Use the Voice Q&A button to ask follow-up questions by voice

## Roadmap

### Completed
- [x] Blood test data input UI + dashboard
- [x] GPT-4 script generation + mulmocast video pipeline
- [x] Shisa AI TTS, ASR, and translation integration
- [x] Voice Q&A (speech-in / speech-out)

### Planned
- [ ] OCR extraction from PDF/image lab reports
- [ ] Historical trend charts (multiple test results over time)
- [ ] User authentication and data persistence
- [ ] Talking avatar (D-ID / Runway)
- [ ] Multi-language support (Chinese, Korean)
- [ ] B2B SaaS features with admin dashboard

## Troubleshooting

**`Error: OpenAI API key is required`**
Ensure `.env.local` exists at the project root with `OPENAI_API_KEY=sk-...` and restart the dev server.

**Video generation fails or times out**
- Confirm ffmpeg is installed: `ffmpeg -version`
- Reinstall mulmocast: `npm install mulmocast@latest`
- Clear cache: `rm -rf .next node_modules/.cache && npm run dev`
- First-time generation takes 15–60 seconds due to mulmocast initialization

**No voice narration**
Shisa AI voice is optional. Videos are generated without audio if `SHISA_API_KEY` is not set.

## Medical Disclaimer

- This application is for **informational purposes only** and does not constitute medical advice, diagnosis, or treatment.
- It is not a substitute for professional medical diagnosis or the care of a licensed healthcare provider.
- Reference ranges used in this application are general population values intended as educational guidance only; individual normal ranges may vary based on age, sex, and clinical context.
- If you have questions or concerns about your health or blood test results, consult a qualified healthcare professional.
- This application is **not a medical device** and has not been evaluated or approved by any medical regulatory authority.

## License

MIT License — see [LICENSE](LICENSE) for details.
