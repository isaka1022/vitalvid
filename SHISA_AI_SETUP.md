# Shisa AI TTS セットアップガイド 🎙️

このガイドでは、VitalVidにShisa AIの音声合成（TTS）機能を統合する手順を説明します。

## 📋 必要なもの

- Shisa AI アカウント
- Shisa AI APIキー

## 🚀 セットアップ手順

### 1. Shisa AI アカウント作成

1. [Shisa Talk](https://talk.shisa.ai/ja) にアクセス
2. アカウントを作成（無料トライアルあり）
3. ダッシュボードでAPIキーを生成

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下を追加：

```bash
# 必須: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# オプション: Shisa AI API Key
SHISA_API_KEY=shisa-your-api-key
```

> ⚠️ **注意**: `.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. 動作確認

1. ブラウザで [http://localhost:3000](http://localhost:3000) を開く
2. 血液検査データを入力
3. いずれかの指標の「動画を見る」ボタンをクリック
4. 動画と共に **AI音声ナレーション** セクションが表示されれば成功！

## 🎯 実装された機能

### バックエンド（API）

- **`lib/shisa-tts.ts`**: Shisa AI TTS統合ユーティリティ
  - `generateShisaTTS()`: テキストから音声を生成
  - `generateMultipleShisaTTS()`: 複数テキストの音声生成
  - `saveAudioToFile()`: 音声ファイルの保存

- **`app/api/generate-video/route.ts`**: 動画生成APIに音声生成を統合
  - GPT-4でナレーションテキスト生成
  - Shisa AI TTSで音声ファイル生成
  - MP3形式で保存（`public/videos/audio-*.mp3`）

### フロントエンド（UI）

- **`app/page.tsx`**: 音声プレーヤーの追加
  - 動画プレーヤーの下に音声プレーヤーを表示
  - "Powered by Shisa AI" バッジ表示
  - 音声が生成されない場合は非表示

## 🎨 UI スクリーンショット

音声ナレーションが有効な場合、以下のように表示されます：

```
🎙️ AI音声ナレーション / AI Voice Narration [Powered by Shisa AI]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[▶️ 再生 ⏸️ 一時停止] 0:00 / 0:45
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔧 カスタマイズ

### 音声設定の変更

`app/api/generate-video/route.ts` の以下の部分を編集：

```typescript
const ttsResult = await generateShisaTTS({
  text: narrationText,
  voice: "ja-JP-1",     // 音声タイプを変更
  speed: 1.0,           // 速度（0.5-2.0）
  pitch: 1.0,           // ピッチ（0.5-2.0）
});
```

### 利用可能な音声タイプ

Shisa AI APIのドキュメントを参照して、利用可能な音声タイプを確認してください：
- `ja-JP-1`: 日本語音声（標準）
- `ja-JP-2`: 日本語音声（女性）
- その他: APIドキュメント参照

## 🐛 トラブルシューティング

### 音声が生成されない

**症状**: 動画は生成されるが、音声プレーヤーが表示されない

**解決策**:
1. `.env.local` に `SHISA_API_KEY` が設定されているか確認
2. APIキーが正しいか確認
3. ターミナルのログで "Shisa AI TTS skipped" メッセージを確認
4. 開発サーバーを再起動（環境変数の変更後）

```bash
# サーバーを停止 (Ctrl+C)
# 再起動
npm run dev
```

### APIエラー

**症状**: "TTS API error: 401 Unauthorized"

**解決策**:
- APIキーが有効か確認
- Shisa AI のダッシュボードでクレジットが残っているか確認
- APIキーの権限を確認

### ネットワークエラー

**症状**: "Failed to fetch" エラー

**解決策**:
- インターネット接続を確認
- ファイアウォール設定を確認
- プロキシ設定を確認

## 📊 パフォーマンス

- **音声生成時間**: 通常 2-5秒（テキスト長による）
- **ファイルサイズ**: 平均 50-200KB（30-60秒の音声）
- **対応形式**: MP3（デフォルト）、AAC、OGG、FLAC

## 💰 コスト

Shisa AI TTSの料金については、[公式ウェブサイト](https://talk.shisa.ai/ja)をご確認ください。

- 無料トライアルあり
- 従量課金制
- エンタープライズプランあり

## 📚 参考資料

- [Shisa AI 公式サイト](https://talk.shisa.ai/ja)
- [Shisa AI APIドキュメント](https://talk.shisa.ai/ja/docs)
- [VitalVid README](./README.md)

## ✅ チェックリスト

統合が完了したら、以下を確認してください：

- [ ] Shisa AI アカウントを作成した
- [ ] APIキーを取得した
- [ ] `.env.local` に `SHISA_API_KEY` を設定した
- [ ] 開発サーバーを再起動した
- [ ] 動画生成時に音声プレーヤーが表示される
- [ ] 音声が正常に再生される

---

🎉 **おめでとうございます！** Shisa AI TTSの統合が完了しました。

高品質な日本語音声で、より分かりやすい健康情報を提供できるようになりました。
