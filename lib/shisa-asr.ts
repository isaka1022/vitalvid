/**
 * Shisa AI ASR (Automatic Speech Recognition) Integration
 * https://talk.shisa.ai/ja
 */

export interface ShisaASROptions {
  audioFile: File | Blob;
  language?: string; // デフォルト: "ja" (日本語)
}

export interface ShisaASRResponse {
  success: boolean;
  transcribedText?: string;
  error?: string;
  language?: string;
}

/**
 * Shisa AI ASR APIを使用して音声をテキストに変換
 */
export async function transcribeWithShisa(
  options: ShisaASROptions
): Promise<ShisaASRResponse> {
  const apiKey = process.env.NEXT_PUBLIC_SHISA_API_KEY || process.env.SHISA_API_KEY;

  if (!apiKey) {
    console.warn("SHISA_API_KEY が設定されていません。ASR機能はスキップされます。");
    return {
      success: false,
      error: "SHISA_API_KEY not configured",
    };
  }

  try {
    const { audioFile, language = "ja" } = options;

    // Shisa AI ASR APIエンドポイント
    const apiUrl = "https://api.shisa.ai/v1/audio/transcriptions";

    // FormDataを使用して音声ファイルを送信
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");
    formData.append("language", language);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shisa ASR API Error:", errorText);
      return {
        success: false,
        error: `ASR API error: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      transcribedText: result.text,
      language,
    };
  } catch (error: any) {
    console.error("Shisa ASR error:", error);
    return {
      success: false,
      error: error.message || "Unknown ASR error",
    };
  }
}

/**
 * ブラウザのMediaRecorder APIを使用して音声を録音
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("MediaRecorder not initialized"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      console.log("Recording stopped");
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}
