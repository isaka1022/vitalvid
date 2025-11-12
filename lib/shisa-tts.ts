/**
 * Shisa AI TTS (Text-to-Speech) Integration
 * https://talk.shisa.ai/ja
 */

export interface ShisaTTSOptions {
  text: string;
  voice?: string; // 音声ID（デフォルト: "ja-JP-1"）
  speed?: number; // 速度（0.5-2.0、デフォルト: 1.0）
  pitch?: number; // ピッチ（0.5-2.0、デフォルト: 1.0）
}

export interface ShisaTTSResponse {
  success: boolean;
  audioUrl?: string;
  audioBuffer?: Buffer;
  error?: string;
}

/**
 * Shisa AI TTS APIを使用して音声を生成
 */
export async function generateShisaTTS(
  options: ShisaTTSOptions
): Promise<ShisaTTSResponse> {
  const apiKey = process.env.SHISA_API_KEY;

  if (!apiKey) {
    console.warn("SHISA_API_KEY が設定されていません。TTS機能はスキップされます。");
    return {
      success: false,
      error: "SHISA_API_KEY not configured",
    };
  }

  try {
    const { text, voice = "ja-JP-1", speed = 1.0, pitch = 1.0 } = options;

    // Shisa AI TTS APIエンドポイント
    const apiUrl = "https://api.shisa.ai/v1/audio/speech";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "tts-1", // または "tts-1-hd" for higher quality
        input: text,
        voice: voice,
        speed: speed,
        // response_format: "mp3", // mp3, opus, aac, flac
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shisa TTS API Error:", errorText);
      return {
        success: false,
        error: `TTS API error: ${response.status} ${response.statusText}`,
      };
    }

    // 音声データをBufferとして取得
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    return {
      success: true,
      audioBuffer,
    };
  } catch (error: any) {
    console.error("Shisa TTS generation error:", error);
    return {
      success: false,
      error: error.message || "Unknown TTS error",
    };
  }
}

/**
 * テキストを分割して複数の音声ファイルを生成
 * （長文の場合に使用）
 */
export async function generateMultipleShisaTTS(
  texts: string[],
  options?: Omit<ShisaTTSOptions, "text">
): Promise<ShisaTTSResponse[]> {
  const promises = texts.map((text) =>
    generateShisaTTS({
      text,
      ...options,
    })
  );

  return Promise.all(promises);
}

/**
 * 音声ファイルをファイルシステムに保存
 */
export async function saveAudioToFile(
  audioBuffer: Buffer,
  filePath: string
): Promise<void> {
  const fs = await import("fs/promises");
  await fs.writeFile(filePath, audioBuffer);
}
