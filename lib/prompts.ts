import { BloodTestData } from "@/types/blood-test";
import { RiskEvaluation } from "@/types/blood-test";

export function generateMulmoScriptPrompt(
  evaluation: RiskEvaluation,
  bloodData: BloodTestData
): string {
  return `あなたは精密栄養学の専門家として、血液検査結果を解説する動画スクリプトをmulmocast形式で生成します。

【対象指標】
${evaluation.metric_name}: ${evaluation.metric_value}

【リスクレベル】
${evaluation.risk_level === "normal" ? "正常範囲" : evaluation.risk_level === "warning" ? "注意が必要" : "要改善"}

【目標値】
${evaluation.target_value}

【改善アクション】
${evaluation.recommendations.join("\n")}

【全体の血液検査データ】
- LDL: ${bloodData.ldl} mg/dL
- HDL: ${bloodData.hdl} mg/dL
- LH比: ${bloodData.lh_ratio.toFixed(2)}
- 血糖値: ${bloodData.glucose} mg/dL
- 中性脂肪: ${bloodData.triglyceride} mg/dL

以下のmulmocast JSONフォーマットで、60秒程度の解説動画スクリプトを生成してください。

要件:
1. 日本語で優しく、分かりやすく説明
2. 数値の意味と健康への影響を明確に
3. 具体的な改善アクションを提示
4. 視覚的な要素(グラフ、数値強調)を含む
5. 前向きで励ますトーン

mulmocast JSONフォーマット例:
{
  "version": "1.0",
  "title": "${evaluation.metric_name}の解説",
  "scenes": [
    {
      "duration": 5,
      "narration": "こんにちは。今日はあなたの${evaluation.metric_name}について解説します。",
      "visuals": {
        "type": "title",
        "text": "${evaluation.metric_name}の解説",
        "subtitle": "あなたの健康データを理解しましょう"
      }
    },
    {
      "duration": 8,
      "narration": "あなたの${evaluation.metric_name}は${evaluation.metric_value}です。",
      "visuals": {
        "type": "metric_display",
        "value": ${evaluation.metric_value},
        "label": "${evaluation.metric_name}",
        "riskLevel": "${evaluation.risk_level}"
      }
    }
  ],
  "voice": {
    "language": "ja",
    "style": "friendly"
  }
}

上記の形式で、4-6個のシーンを含む完全なJSONを生成してください。JSONのみを返し、他の説明は不要です。`;
}

export function generateSimpleScriptPrompt(
  evaluation: RiskEvaluation
): string {
  return `あなたの${evaluation.metric_name}は${evaluation.metric_value}です。

${
  evaluation.risk_level === "normal"
    ? "これは正常範囲内です。素晴らしい状態を維持していますね。"
    : evaluation.risk_level === "warning"
    ? "これは少し注意が必要なレベルです。改善の余地があります。"
    : "これは要改善のレベルです。健康リスクが高まっている可能性があります。"
}

目標値は${evaluation.target_value}です。

改善のためのアクションとして、以下をお勧めします:
${evaluation.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join("\n")}

これらを実践することで、健康状態の改善が期待できます。一緒に頑張りましょう!`;
}
