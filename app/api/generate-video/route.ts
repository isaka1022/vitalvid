import { NextRequest, NextResponse } from "next/server";
import { BloodTestData } from "@/types/blood-test";
import { evaluateMetric } from "@/lib/risk-evaluator";
import { generateSimpleScriptPrompt } from "@/lib/prompts";
import OpenAI from "openai";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

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
    const body = await request.json();
    const { metricType, value, bloodData } = body as {
      metricType: keyof BloodTestData;
      value: number;
      bloodData: BloodTestData;
    };

    // Evaluate the metric
    const evaluation = evaluateMetric(metricType, value);

    // Generate script using GPT-4
    const scriptPrompt = generateSimpleScriptPrompt(evaluation);

    console.log("Generating script with OpenAI...");

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "あなたは精密栄養学の専門家として、血液検査結果を優しく分かりやすく解説します。",
        },
        {
          role: "user",
          content: scriptPrompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const narrationText = completion.choices[0].message.content || "";

    console.log("Generated narration:", narrationText);

    // Create mulmo script JSON
    const mulmoScript = {
      $mulmocast: {
        version: "1.0",
      },
      title: `${evaluation.metric_name}の解説`,
      beats: [
        {
          text: `こんにちは。今日はあなたの${evaluation.metric_name}について解説します。`,
        },
        {
          text: `あなたの${evaluation.metric_name}は${evaluation.metric_value}です。目標値は${evaluation.target_value}です。`,
        },
        {
          text: narrationText,
        },
      ],
    };

    // Save mulmo script to file
    const timestamp = Date.now();
    const scriptFileName = `mulmo-${metricType}-${timestamp}.json`;
    const scriptPath = path.join(process.cwd(), "public", "videos", scriptFileName);

    // Ensure videos directory exists
    await fs.mkdir(path.join(process.cwd(), "public", "videos"), {
      recursive: true,
    });

    await fs.writeFile(scriptPath, JSON.stringify(mulmoScript, null, 2));

    console.log("Mulmo script saved:", scriptPath);

    // Generate video using mulmocast CLI
    const videoFileName = `video-${metricType}-${timestamp}.mp4`;
    const videoPath = path.join(process.cwd(), "public", "videos", videoFileName);

    console.log("Generating video with mulmocast...");

    try {
      // Try to run mulmocast command (audio only until OpenAI org is verified for images)
      const mulmoCommand = `npx mulmo audio "${scriptPath}" -o "${videoPath}"`;
      console.log("Running command:", mulmoCommand);

      const { stdout, stderr } = await execAsync(mulmoCommand, {
        timeout: 60000, // 60 second timeout
      });

      console.log("Mulmo stdout:", stdout);
      if (stderr) console.log("Mulmo stderr:", stderr);

      // mulmo audio creates a directory, find the MP3 file inside
      const audioFileName = `${scriptFileName.replace('.json', '')}_en.mp3`;
      const audioPath = path.join(process.cwd(), "public", "videos", videoFileName, audioFileName);

      // Check if audio file was created
      try {
        await fs.access(audioPath);
        console.log("Audio created successfully:", audioPath);
      } catch {
        throw new Error("Audio file was not created");
      }

      return NextResponse.json({
        success: true,
        videoUrl: `/videos/${videoFileName}/${audioFileName}`,
        evaluation,
      });
    } catch (execError: any) {
      console.error("Mulmocast execution error:", execError);

      // Fallback: Create a simple text-based response
      console.log("Falling back to text-only response");

      return NextResponse.json({
        success: true,
        videoUrl: null,
        fallbackText: narrationText,
        evaluation,
        error: "動画生成は現在利用できません。テキスト解説をご覧ください。",
      });
    }
  } catch (error: any) {
    console.error("Video generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "動画生成に失敗しました",
      },
      { status: 500 }
    );
  }
}
