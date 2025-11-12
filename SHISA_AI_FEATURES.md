# Shisa AI 統合機能ガイド 🚀

このドキュメントでは、VitalVidに統合されたShisa AIの全機能について説明します。

## 📋 目次

1. [TTS（音声合成）](#1-tts音声合成)
2. [翻訳（日英翻訳）](#2-翻訳日英翻訳)
3. [ASR（音声認識）](#3-asr音声認識)
4. [音声Q&A](#4-音声qa)

---

## 1. TTS（音声合成）

### 概要
日本語のテキストを高品質な音声に変換します。

### 使用箇所
- 動画生成時のナレーション音声
- 音声Q&Aの回答音声

### 実装ファイル
- `lib/shisa-tts.ts`
- `app/api/generate-video/route.ts`

### API仕様

```typescript
generateShisaTTS({
  text: string,        // 変換するテキスト
  voice?: string,      // 音声タイプ（デフォルト: "ja-JP-1"）
  speed?: number,      // 速度（0.5-2.0、デフォルト: 1.0）
  pitch?: number,      // ピッチ（0.5-2.0、デフォルト: 1.0）
})
```

### 使用例

```typescript
const result = await generateShisaTTS({
  text: "あなたのLH比は2.5です。",
  voice: "ja-JP-1",
  speed: 1.0,
});

if (result.success) {
  // 音声ファイルを保存
  await fs.writeFile("audio.mp3", result.audioBuffer);
}
```

---

## 2. 翻訳（日英翻訳）

### 概要
日本語のテキストを英語に、または英語を日本語に翻訳します。

### 使用箇所
- 動画生成時の解説テキストの英語翻訳
- UIでの英語版表示

### 実装ファイル
- `lib/shisa-translation.ts`
- `app/api/generate-video/route.ts`

### API仕様

```typescript
translateWithShisa({
  text: string,           // 翻訳するテキスト
  sourceLang?: string,    // 元の言語（デフォルト: "ja"）
  targetLang?: string,    // 翻訳先の言語（デフォルト: "en"）
})
```

### 使用例

```typescript
// 日本語→英語
const result = await translateJaToEn("LH比は動脈硬化のリスク指標です。");

if (result.success) {
  console.log(result.translatedText);
  // "The LH ratio is a risk indicator for arteriosclerosis."
}

// 英語→日本語
const result2 = await translateEnToJa("What is LH ratio?");
```

---

## 3. ASR（音声認識）

### 概要
音声ファイルをテキストに変換します。日本語に特化した高精度な認識。

### 使用箇所
- 音声Q&A機能での質問の認識

### 実装ファイル
- `lib/shisa-asr.ts`
- `app/api/voice-qa/route.ts`

### API仕様

```typescript
transcribeWithShisa({
  audioFile: File | Blob,  // 音声ファイル
  language?: string,       // 言語（デフォルト: "ja"）
})
```

### 使用例

```typescript
// ブラウザで録音
const recorder = new AudioRecorder();
await recorder.startRecording();
// ... ユーザーが話す
const audioBlob = await recorder.stopRecording();

// 音声をテキストに変換
const result = await transcribeWithShisa({
  audioFile: audioBlob,
  language: "ja",
});

if (result.success) {
  console.log(result.transcribedText);
  // "LH比って何ですか？"
}
```

---

## 4. 音声Q&A

### 概要
音声で質問して、音声で回答を得ることができる対話型システム。

### フロー

```
1. ユーザーが音声で質問
   ↓
2. Shisa AI ASR で音声→テキスト
   ↓
3. GPT-4 が回答を生成
   ↓
4. Shisa AI TTS でテキスト→音声
   ↓
5. ユーザーに音声で回答を返す
```

### 使用箇所
- メインページの上部に常に表示
- 血液検査データがある場合はコンテキストとして利用

### 実装ファイル
- `components/VoiceQA.tsx`
- `app/api/voice-qa/route.ts`

### コンポーネント使用例

```tsx
<VoiceQA
  context="現在の血液検査データ: LH比=2.5, 血糖値=110"
/>
```

### 使用例

1. **マイクボタンをクリック**
   - ブラウザがマイクへのアクセス許可を求める
   - 許可すると録音が開始される

2. **質問を話す**
   - 「LH比を下げるにはどうすればいいですか？」
   - 「What is a healthy glucose level?」

3. **録音停止ボタンをクリック**
   - 音声がShisa AI ASRで認識される
   - GPT-4が回答を生成
   - Shisa AI TTSが音声を生成

4. **回答が表示される**
   - テキストで表示
   - 音声プレーヤーで再生可能

---

## 🎯 実装詳細

### AudioRecorderクラス

ブラウザのMediaRecorder APIを使用して音声を録音するヘルパークラス。

```typescript
const recorder = new AudioRecorder();

// 録音開始
await recorder.startRecording();

// 録音中かチェック
if (recorder.isRecording()) {
  console.log("Recording...");
}

// 録音停止
const audioBlob = await recorder.stopRecording();
```

### エラーハンドリング

すべてのShisa AI機能は、APIキーが設定されていない場合でもエラーにならず、機能がスキップされます。

```typescript
if (!process.env.SHISA_API_KEY) {
  console.warn("SHISA_API_KEY not set, feature skipped");
  return { success: false, error: "API key not configured" };
}
```

---

## 📊 パフォーマンス

| 機能 | 平均処理時間 | ファイルサイズ |
|------|--------------|----------------|
| TTS | 2-5秒 | 50-200KB |
| 翻訳 | 1-3秒 | - |
| ASR | 3-7秒 | - |
| 音声Q&A（全体） | 10-20秒 | 50-200KB |

---

## 🔒 セキュリティ

- APIキーは環境変数で管理
- クライアント側には公開しない
- 音声データはサーバー側で処理後に削除

---

## 💰 コスト最適化

### TTS
- 短いテキストを生成（300字以内）
- 必要な場合のみ生成

### 翻訳
- キャッシュ可能な場合はキャッシュ
- 同じテキストは再翻訳しない

### ASR
- 録音時間を制限（推奨: 30秒以内）
- 音声品質を適切に設定

---

## 🐛 トラブルシューティング

### TTS音声が生成されない
- `SHISA_API_KEY`が設定されているか確認
- APIクレジットが残っているか確認
- テキストが空でないか確認

### 翻訳が表示されない
- ブラウザのコンソールでエラーを確認
- ネットワークタブで API リクエストを確認

### 音声Q&Aが動作しない
- マイクへのアクセス許可を確認
- HTTPSで接続しているか確認（MediaRecorderはHTTPSが必要）
- ブラウザが対応しているか確認（Chrome, Edge, Firefox推奨）

---

## 📚 参考資料

- [Shisa AI 公式ドキュメント](https://talk.shisa.ai/ja/docs)
- [TTS API リファレンス](https://talk.shisa.ai/ja/docs/tts)
- [Translation API リファレンス](https://talk.shisa.ai/ja/docs/translation)
- [ASR API リファレンス](https://talk.shisa.ai/ja/docs/asr)

---

## ✨ 今後の拡張案

1. **多言語対応**
   - 中国語、韓国語などの音声認識・合成

2. **音声の個性化**
   - 複数の音声タイプから選択可能に

3. **リアルタイム翻訳**
   - 音声→翻訳→音声のストリーミング処理

4. **会話履歴**
   - 過去の質問と回答を保存・検索

5. **音声感情分析**
   - ユーザーの声のトーンから感情を分析

---

🎉 **Shisa AI統合により、VitalVidはより対話的で使いやすいアプリケーションになりました！**
