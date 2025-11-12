# VitalVid 🩺

**Your Health, Explained in Seconds**

血液検査結果を動画で解説する次世代健康ダッシュボード

## 概要 / Overview

VitalVidは、血液検査の数値を誰でも理解できるように、AI生成動画で解説する健康管理システムです。

- 🎥 **動画をUIとして使用** - クリックするだけで即座に解説動画を生成
- 🎙️ **高品質な日本語音声** - Shisa AI TTSによる自然な音声ナレーション
- 🌐 **AI翻訳機能** - Shisa AIによる日英自動翻訳（リアルタイム）
- 🎤 **音声Q&A** - 音声で質問して音声で答えが返ってくる対話型システム
- 🧪 **精密栄養学に基づく解説** - LH比、血糖値、HDL/LDLなど主要指標を分析
- 💡 **具体的なアクションプラン** - 改善のための実践的なアドバイスを提供

## 🌐 ライブデモ / Live Demo

本番環境で動作中のアプリケーションをご覧ください：

**🚀 デプロイURL**: https://vitalvid-7iogk2utw-isaka1022s-projects.vercel.app

### 利用可能な機能
- 🎥 血液検査結果の動画解説生成
- 🎙️ AI音声ナレーション（Shisa AI TTS）
- 🌐 日英リアルタイム翻訳（Shisa AI Translation）
- 🎤 音声Q&A（音声で質問→音声で回答）
- 📊 リスクレベル分析とアクションプラン

## 技術スタック / Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **AI**: OpenAI GPT-4 (スクリプト生成 & Q&A応答)
- **TTS**: Shisa AI (日本語音声合成) 🆕
- **ASR**: Shisa AI (音声認識) 🆕
- **Translation**: Shisa AI (日英翻訳) 🆕
- **Video Generation**: mulmocast-cli (AI動画生成)
- **Deployment**: Vercel

## セットアップ / Setup

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定:

```bash
# 必須: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# オプション: Shisa AI API Key (日本語TTS音声合成)
SHISA_API_KEY=your_shisa_api_key_here
```

**APIキーの取得方法:**
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/)から取得
- **Shisa AI** (オプション): [Shisa Talk](https://talk.shisa.ai/ja)でアカウント作成後、APIキーを取得
  - Shisa AIを設定すると、高品質な日本語音声ナレーションが追加されます
  - 未設定の場合は、音声なしで動画が生成されます

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

### 4. mulmocastの設定 (動画生成用)

mulmocastは既にプロジェクトにインストールされていますが、ffmpegが必要です：

```bash
# ffmpegのインストール (macOS)
brew install ffmpeg

# Linux (Ubuntu/Debian)
sudo apt update && sudo apt install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg

# または公式サイトからダウンロード
# https://ffmpeg.org/download.html
```

**動画生成のテスト:**

```bash
# テスト動画を生成して動作確認
npx mulmo movie test-mulmo.json -o public/videos/test-output.mp4

# 成功すると以下のファイルが生成されます:
# public/videos/test-output.mp4/mulmo-xxx_en.mp4
```

## 使い方 / Usage

### 基本機能
1. **データ入力**: 血液検査の数値を入力するか、サンプルデータを選択
2. **分析**: 「分析開始」ボタンをクリック
3. **ダッシュボード**: 各指標のリスクレベルが色分けされて表示
4. **動画視聴**: 気になる指標の「動画を見る」ボタンをクリック
5. **音声ナレーション**: Shisa AI APIキーを設定している場合、自動で日本語音声ナレーションが生成されます 🎙️
6. **英語翻訳**: 解説テキストが自動的に英語に翻訳されます 🌐
7. **改善アクション**: 動画・音声と共に具体的な改善方法を確認

### 音声Q&A機能 🆕
1. **マイクボタンをクリック**: 録音を開始
2. **質問を話す**: 「LH比って何ですか？」など
3. **録音停止**: もう一度ボタンをクリック
4. **AI回答**: GPT-4が回答を生成し、音声で読み上げます
   - 音声認識（ASR）で質問をテキスト化
   - GPT-4で回答を生成
   - 音声合成（TTS）で回答を音声化

## 主要機能 / Key Features

### 解析対象指標

- **LH比** (LDL/HDL比) - 動脈硬化リスクの指標
- **血糖値** - 糖尿病リスクの指標
- **HDLコレステロール** - 善玉コレステロール
- **中性脂肪** - メタボリックシンドロームの指標

### リスク評価

- 🟢 **正常範囲** (Normal) - 健康的な状態
- 🟡 **注意** (Warning) - 改善の余地あり
- 🔴 **要改善** (Danger) - 医師への相談を推奨

## プロジェクト構造

```
vitalvid/
├── app/
│   ├── api/
│   │   ├── generate-video/
│   │   │   └── route.ts          # 動画生成API
│   │   └── voice-qa/
│   │       └── route.ts          # 音声Q&A API 🆕
│   ├── globals.css                # グローバルスタイル
│   ├── layout.tsx                 # ルートレイアウト
│   └── page.tsx                   # メインページ
├── components/
│   ├── DataInputForm.tsx          # データ入力フォーム
│   ├── MetricCard.tsx             # 指標カード
│   └── VoiceQA.tsx                # 音声Q&Aコンポーネント 🆕
├── lib/
│   ├── prompts.ts                 # GPT-4プロンプト
│   ├── risk-evaluator.ts          # リスク評価ロジック
│   ├── sample-data.ts             # サンプルデータ
│   ├── shisa-tts.ts               # Shisa AI TTS統合
│   ├── shisa-translation.ts       # Shisa AI翻訳統合 🆕
│   ├── shisa-asr.ts               # Shisa AI ASR統合 🆕
│   └── utils.ts                   # ユーティリティ
├── types/
│   └── blood-test.ts              # TypeScript型定義
├── public/
│   └── videos/                    # 生成動画の保存先
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 開発ロードマップ / Roadmap

### Phase 1 (MVP) ✅
- [x] 血液検査データ入力UI
- [x] ダッシュボード表示
- [x] リスク評価ロジック
- [x] GPT-4スクリプト生成
- [x] mulmocast統合
- [x] 動画プレーヤー

### Phase 2 (完了) ✅
- [x] Shisa AI TTS統合（日本語音声ナレーション）
- [x] Shisa AI翻訳統合（日英リアルタイム翻訳）
- [x] Shisa AI ASR統合（音声認識）
- [x] 音声Q&A機能（音声で質問→音声で回答）

### Phase 3 (予定)
- [ ] PDF/画像からのOCR自動抽出
- [ ] 複数検査結果の推移グラフ
- [ ] ユーザー認証・データ保存
- [ ] トーキングアバター (D-ID/Runway)
- [ ] 動画ダウンロード機能
- [ ] 音声を動画に統合（ffmpeg）

### Phase 4 (予定)
- [ ] B2B SaaS機能
- [ ] 企業向け管理画面
- [ ] API/SDK提供
- [ ] 多言語対応（中国語、韓国語など）

## トラブルシューティング / Troubleshooting

### エラー: "OpenAI API key is required"

**原因**: OPENAI_API_KEYが設定されていない、または読み込まれていない

**解決方法**:
1. `.env.local`ファイルがプロジェクトルートに存在することを確認
2. ファイル内に`OPENAI_API_KEY=sk-proj-xxx`が正しく記載されているか確認
3. 開発サーバーを再起動（Ctrl+C → `npm run dev`）

### エラー: "動画生成に失敗しました"

**原因**:
- mulmocastのインストール不完全
- ffmpegがインストールされていない
- OpenAI APIの制限

**解決方法**:

```bash
# 1. ffmpegがインストールされているか確認
ffmpeg -version

# 2. mulmocastを再インストール
npm install mulmocast@latest

# 3. キャッシュをクリア
rm -rf .next node_modules/.cache
npm run dev
```

### 動画生成が遅い、またはタイムアウト

**原因**: mulmocastは初回生成時に時間がかかります（15-60秒）

**対策**:
- `route.ts`の`timeout`を増やす（現在60秒）
- OpenAI APIのレート制限を確認
- より高速なプランにアップグレード

### 音声が生成されない

**原因**: SHISA_API_KEYが設定されていない（オプション機能）

**解決方法**:
- Shisa AIの音声機能は**オプション**です
- 設定しなくても動画は生成されます（音声なし）
- 高品質な日本語音声が必要な場合のみ、[Shisa Talk](https://talk.shisa.ai/ja)からAPIキーを取得

### mulmocastのバージョン確認

```bash
# インストール済みバージョンを確認
npx mulmo --version

# 最新版へアップデート
npm install mulmocast@latest
```

## 免責事項 / Disclaimer

⚠️ **重要**: 本サービスは医師の診断に代わるものではありません。健康上の懸念がある場合は、必ず医療専門家にご相談ください。

This service does not replace professional medical diagnosis. Please consult healthcare professionals for any medical concerns.

## ライセンス / License

MIT License

## お問い合わせ / Contact

質問や提案がある場合は、GitHubのIssuesでお知らせください。

---

**VitalVid** - 動画をプリミティブとして使う、新しい健康体験 🩺✨
