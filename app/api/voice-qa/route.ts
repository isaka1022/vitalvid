import { NextRequest, NextResponse } from "next/server";
import { generateShisaTTS } from "@/lib/shisa-tts";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const context = formData.get("context") as string | null;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Step 1: Transcribe audio using Shisa AI ASR
    console.log("Transcribing audio with Shisa AI ASR...");

    const apiKey = process.env.SHISA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "SHISA_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Convert File to FormData for Shisa AI
    const asrFormData = new FormData();
    asrFormData.append("file", audioFile);
    asrFormData.append("model", "whisper-1");
    asrFormData.append("language", "ja");

    const asrResponse = await fetch(
      "https://api.shisa.ai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: asrFormData,
      }
    );

    if (!asrResponse.ok) {
      const errorText = await asrResponse.text();
      console.error("ASR error:", errorText);
      return NextResponse.json(
        { success: false, error: "音声認識に失敗しました" },
        { status: 500 }
      );
    }

    const asrResult = await asrResponse.json();
    const transcribedText = asrResult.text;

    console.log("Transcribed text:", transcribedText);

    // Step 2: Generate answer using GPT-4
    console.log("Generating answer with GPT-4...");

    const openai = getOpenAIClient();

    const systemPrompt = `あなたは精密栄養学の専門家です。
血液検査や健康に関する質問に、優しく分かりやすく答えます。
${context ? `\n\n現在のコンテキスト:\n${context}` : ""}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: transcribedText,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const answerText = completion.choices[0].message.content || "";

    console.log("Generated answer:", answerText);

    // Step 3: Convert answer to speech using Shisa AI TTS
    console.log("Generating speech with Shisa AI TTS...");

    const ttsResult = await generateShisaTTS({
      text: answerText,
      voice: "ja-JP-1",
      speed: 1.0,
      pitch: 1.0,
    });

    let answerAudioUrl: string | null = null;

    if (ttsResult.success && ttsResult.audioBuffer) {
      // Save audio file
      const timestamp = Date.now();
      const audioFileName = `qa-answer-${timestamp}.mp3`;
      const audioPath = path.join(
        process.cwd(),
        "public",
        "videos",
        audioFileName
      );

      // Ensure directory exists
      await fs.mkdir(path.join(process.cwd(), "public", "videos"), {
        recursive: true,
      });

      await fs.writeFile(audioPath, ttsResult.audioBuffer);
      answerAudioUrl = `/videos/${audioFileName}`;

      console.log("Answer audio saved:", audioPath);
    } else {
      console.warn("TTS generation failed:", ttsResult.error);
    }

    return NextResponse.json({
      success: true,
      question: transcribedText,
      answer: answerText,
      answerAudioUrl,
    });
  } catch (error: any) {
    console.error("Voice Q&A error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "音声Q&Aの処理に失敗しました",
      },
      { status: 500 }
    );
  }
}
