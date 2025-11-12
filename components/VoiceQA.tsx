"use client";

import { useState, useRef } from "react";
import { AudioRecorder } from "@/lib/shisa-asr";

interface VoiceQAProps {
  context?: string; // 現在の血液検査データなどのコンテキスト
}

export function VoiceQA({ context }: VoiceQAProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [answerAudioUrl, setAnswerAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  const handleStartRecording = async () => {
    try {
      setError(null);
      audioRecorderRef.current = new AudioRecorder();
      await audioRecorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err: any) {
      console.error("Recording error:", err);
      setError("マイクへのアクセスに失敗しました。ブラウザの設定を確認してください。");
    }
  };

  const handleStopRecording = async () => {
    try {
      if (!audioRecorderRef.current) return;

      setIsRecording(false);
      setIsProcessing(true);

      const audioBlob = await audioRecorderRef.current.stopRecording();

      // Send audio to API
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      if (context) {
        formData.append("context", context);
      }

      const response = await fetch("/api/voice-qa", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("音声Q&Aの処理に失敗しました");
      }

      const result = await response.json();

      setQuestion(result.question);
      setAnswer(result.answer);
      setAnswerAudioUrl(result.answerAudioUrl);
    } catch (err: any) {
      console.error("Processing error:", err);
      setError(err.message || "処理中にエラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setQuestion(null);
    setAnswer(null);
    setAnswerAudioUrl(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          🎤 音声Q&A / Voice Q&A
        </h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Powered by Shisa AI
        </span>
      </div>

      <p className="text-gray-600 mb-6">
        健康や血液検査について質問してください。音声で答えます！
        <br />
        Ask questions about health and blood tests. Get voice answers!
      </p>

      {/* Recording Controls */}
      <div className="flex gap-3 mb-6">
        {!isRecording && !isProcessing && (
          <button
            onClick={handleStartRecording}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🎤</span>
            録音開始 / Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={handleStopRecording}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 animate-pulse"
          >
            <span className="text-2xl">⏹️</span>
            録音停止 / Stop Recording
          </button>
        )}

        {isProcessing && (
          <div className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2">
            <span className="animate-spin text-2xl">⚙️</span>
            処理中... / Processing...
          </div>
        )}

        {(question || answer) && !isRecording && !isProcessing && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            クリア / Clear
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 font-semibold">❌ エラー / Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Question & Answer */}
      {question && (
        <div className="space-y-4">
          {/* Question */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-blue-900">
              💬 あなたの質問 / Your Question
            </h3>
            <p className="text-gray-700">{question}</p>
          </div>

          {/* Answer */}
          {answer && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-green-900">
                💡 回答 / Answer
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">
                {answer}
              </p>

              {/* Answer Audio Player */}
              {answerAudioUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    🔊 音声で聞く / Listen to Audio
                  </p>
                  <audio src={answerAudioUrl} controls className="w-full">
                    お使いのブラウザは音声タグをサポートしていません。
                  </audio>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Usage Tips */}
      {!question && !isRecording && !isProcessing && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-sm text-gray-700 mb-2">
            💡 使い方のヒント / Usage Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 「LH比って何ですか？」</li>
            <li>• 「血糖値を下げるにはどうすれば良いですか？」</li>
            <li>• 「HDLコレステロールを増やす方法は？」</li>
            <li>• 「What is LH ratio?」</li>
          </ul>
        </div>
      )}
    </div>
  );
}
