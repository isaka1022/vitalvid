"use client";

import { useState } from "react";
import { BloodTestData } from "@/types/blood-test";
import { DataInputForm } from "@/components/DataInputForm";
import { MetricCard } from "@/components/MetricCard";
import { VoiceQA } from "@/components/VoiceQA";
import { evaluateMetric } from "@/lib/risk-evaluator";

export default function Home() {
  const [bloodData, setBloodData] = useState<BloodTestData | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [narrationText, setNarrationText] = useState<string | null>(null);
  const [narrationTextEn, setNarrationTextEn] = useState<string | null>(null);
  const [currentMetric, setCurrentMetric] = useState<keyof BloodTestData | null>(null);

  const handleDataSubmit = (data: BloodTestData) => {
    setBloodData(data);
    setVideoUrl(null);
    setAudioUrl(null);
    setNarrationText(null);
    setNarrationTextEn(null);
    setCurrentMetric(null);
  };

  const handleWatchVideo = async (metricType: keyof BloodTestData) => {
    if (!bloodData) return;

    setGeneratingVideo(metricType);
    setCurrentMetric(metricType);
    setVideoUrl(null);
    setAudioUrl(null);
    setNarrationText(null);
    setNarrationTextEn(null);

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metricType,
          value: bloodData[metricType],
          bloodData,
        }),
      });

      if (!response.ok) {
        throw new Error("動画生成に失敗しました");
      }

      const result = await response.json();
      setVideoUrl(result.videoUrl);
      setAudioUrl(result.audioUrl);
      setNarrationText(result.narrationText);
      setNarrationTextEn(result.narrationTextEn);
    } catch (error) {
      console.error("Video generation error:", error);
      alert("動画の生成に失敗しました。もう一度お試しください。");
    } finally {
      setGeneratingVideo(null);
    }
  };

  const handleBack = () => {
    setVideoUrl(null);
    setAudioUrl(null);
    setNarrationText(null);
    setNarrationTextEn(null);
    setCurrentMetric(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            🩺 VitalVid
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Your Health, Explained in Seconds
          </p>
          <p className="text-gray-600 mt-2">
            血液検査結果を動画で理解する次世代健康ダッシュボード
          </p>
        </div>

        {/* Video Player Modal */}
        {videoUrl && currentMetric && bloodData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← 戻る Back
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {evaluateMetric(currentMetric, bloodData[currentMetric]).metric_name}
              </h2>

              <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                >
                  お使いのブラウザは動画タグをサポートしていません。
                </video>
              </div>

              {/* Audio Player (if TTS is available) */}
              {audioUrl && (
                <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    🎙️ AI音声ナレーション / AI Voice Narration
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Powered by Shisa AI
                    </span>
                  </h3>
                  <audio
                    src={audioUrl}
                    controls
                    className="w-full"
                  >
                    お使いのブラウザは音声タグをサポートしていません。
                  </audio>
                </div>
              )}

              {/* Narration Text (Japanese & English) */}
              {(narrationText || narrationTextEn) && (
                <div className="mb-6 space-y-4">
                  {narrationText && (
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        📝 解説テキスト (日本語)
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {narrationText}
                      </p>
                    </div>
                  )}
                  
                  {narrationTextEn && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        🌐 Explanation Text (English)
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          Translated by Shisa AI
                        </span>
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {narrationTextEn}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">📊 分析結果 / Analysis</h3>
                  <p className="text-gray-700">
                    あなたの数値 / Your Value:{" "}
                    <span className="font-bold text-2xl">
                      {bloodData[currentMetric]}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    🎯 目標数値 / Target:{" "}
                    <span className="font-bold">
                      {evaluateMetric(currentMetric, bloodData[currentMetric]).target_value}
                    </span>
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">
                    💡 改善アクション / Actions
                  </h3>
                  <ul className="space-y-2">
                    {evaluateMetric(
                      currentMetric,
                      bloodData[currentMetric]
                    ).recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Q&A Section */}
        <div className="mb-12">
          <VoiceQA
            context={
              bloodData
                ? `現在の血液検査データ: LH比=${bloodData.lh_ratio}, 血糖値=${bloodData.glucose}, HDL=${bloodData.hdl}, 中性脂肪=${bloodData.triglyceride}`
                : undefined
            }
          />
        </div>

        {/* Input Form or Dashboard */}
        {!bloodData ? (
          <DataInputForm onSubmit={handleDataSubmit} />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                血液検査結果分析 / Blood Test Analysis
              </h2>
              <button
                onClick={() => setBloodData(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold"
              >
                データを変更 / Change Data
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="LH比"
                titleEn="LH Ratio"
                value={parseFloat(bloodData.lh_ratio.toFixed(2))}
                unit=""
                riskLevel={evaluateMetric("lh_ratio", bloodData.lh_ratio).risk_level}
                onWatch={() => handleWatchVideo("lh_ratio")}
                isGenerating={generatingVideo === "lh_ratio"}
              />

              <MetricCard
                title="血糖値"
                titleEn="Glucose"
                value={bloodData.glucose}
                unit="mg/dL"
                riskLevel={evaluateMetric("glucose", bloodData.glucose).risk_level}
                onWatch={() => handleWatchVideo("glucose")}
                isGenerating={generatingVideo === "glucose"}
              />

              <MetricCard
                title="HDLコレステロール"
                titleEn="HDL-C"
                value={bloodData.hdl}
                unit="mg/dL"
                riskLevel={evaluateMetric("hdl", bloodData.hdl).risk_level}
                onWatch={() => handleWatchVideo("hdl")}
                isGenerating={generatingVideo === "hdl"}
              />

              <MetricCard
                title="中性脂肪"
                titleEn="Triglyceride"
                value={bloodData.triglyceride}
                unit="mg/dL"
                riskLevel={evaluateMetric("triglyceride", bloodData.triglyceride).risk_level}
                onWatch={() => handleWatchVideo("triglyceride")}
                isGenerating={generatingVideo === "triglyceride"}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 text-sm">
          <p className="mb-2">
            ⚠️ 本サービスは医師の診断に代わるものではありません
          </p>
          <p>
            This service does not replace professional medical diagnosis
          </p>
        </footer>
      </div>
    </main>
  );
}
