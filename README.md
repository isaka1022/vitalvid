# VitalVid 🩺

**Your Health, Explained in Seconds**

血液検査結果を動画で解説する次世代健康ダッシュボード

## 概要 / Overview

VitalVidは、血液検査の数値を誰でも理解できるように、AI生成動画で解説する健康管理システムです。

- 🎥 **動画をUIとして使用** - クリックするだけで即座に解説動画を生成
- 🧪 **精密栄養学に基づく解説** - LH比、血糖値、HDL/LDLなど主要指標を分析
- 💡 **具体的なアクションプラン** - 改善のための実践的なアドバイスを提供
- 🌐 **日英併記UI** - グローバル対応

## 技術スタック / Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **AI**: OpenAI GPT-4 (スクリプト生成)
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
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI APIキーは[OpenAI Platform](https://platform.openai.com/)から取得してください。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

### 4. mulmocastの設定 (動画生成用)

```bash
# mulmocastをグローバルインストール (オプション)
npm install -g mulmocast

# ffmpegのインストール (macOS)
brew install ffmpeg

# または公式サイトからダウンロード
# https://ffmpeg.org/download.html
```

## 使い方 / Usage

1. **データ入力**: 血液検査の数値を入力するか、サンプルデータを選択
2. **分析**: 「分析開始」ボタンをクリック
3. **ダッシュボード**: 各指標のリスクレベルが色分けされて表示
4. **動画視聴**: 気になる指標の「動画を見る」ボタンをクリック
5. **改善アクション**: 動画と共に具体的な改善方法を確認

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
│   │   └── generate-video/
│   │       └── route.ts          # 動画生成API
│   ├── globals.css                # グローバルスタイル
│   ├── layout.tsx                 # ルートレイアウト
│   └── page.tsx                   # メインページ
├── components/
│   ├── DataInputForm.tsx          # データ入力フォーム
│   └── MetricCard.tsx             # 指標カード
├── lib/
│   ├── prompts.ts                 # GPT-4プロンプト
│   ├── risk-evaluator.ts          # リスク評価ロジック
│   ├── sample-data.ts             # サンプルデータ
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

### Phase 2 (予定)
- [ ] PDF/画像からのOCR自動抽出
- [ ] 複数検査結果の推移グラフ
- [ ] ユーザー認証・データ保存
- [ ] トーキングアバター (D-ID/Runway)
- [ ] 動画ダウンロード機能

### Phase 3 (予定)
- [ ] B2B SaaS機能
- [ ] 企業向け管理画面
- [ ] API/SDK提供
- [ ] 多言語対応

## 免責事項 / Disclaimer

⚠️ **重要**: 本サービスは医師の診断に代わるものではありません。健康上の懸念がある場合は、必ず医療専門家にご相談ください。

This service does not replace professional medical diagnosis. Please consult healthcare professionals for any medical concerns.

## ライセンス / License

MIT License

## お問い合わせ / Contact

質問や提案がある場合は、GitHubのIssuesでお知らせください。

---

**VitalVid** - 動画をプリミティブとして使う、新しい健康体験 🩺✨
