import { BloodTestData, RiskLevel, RiskEvaluation } from "@/types/blood-test";

export function evaluateLHRatio(value: number): RiskEvaluation {
  let risk_level: RiskLevel;
  let recommendations: string[];

  if (value <= 2.0) {
    risk_level = "normal";
    recommendations = [
      "現在の食生活を維持してください",
      "定期的な運動を続けましょう",
      "年1回の健康診断を受けましょう",
    ];
  } else if (value <= 2.5) {
    risk_level = "warning";
    recommendations = [
      "青魚(サバ、イワシ)を週3回食べる",
      "トランス脂肪酸を避ける",
      "有酸素運動を週150分実施",
      "ストレス管理を心がける",
    ];
  } else {
    risk_level = "danger";
    recommendations = [
      "医師に相談してください",
      "飽和脂肪酸の摂取を減らす",
      "オメガ3脂肪酸を積極的に摂取",
      "毎日30分以上の有酸素運動",
      "禁煙・節酒",
    ];
  }

  return {
    metric_name: "LH比 (LH Ratio)",
    metric_value: value,
    risk_level,
    target_value: 2.0,
    recommendations,
  };
}

export function evaluateGlucose(value: number): RiskEvaluation {
  let risk_level: RiskLevel;
  let recommendations: string[];

  if (value < 100) {
    risk_level = "normal";
    recommendations = [
      "現在の食生活を維持してください",
      "定期的な運動を続けましょう",
    ];
  } else if (value < 126) {
    risk_level = "warning";
    recommendations = [
      "糖質の摂取タイミングを見直す",
      "食物繊維を先に食べる(ベジファースト)",
      "食後30分以内に軽い運動",
      "精製糖質を減らす",
    ];
  } else {
    risk_level = "danger";
    recommendations = [
      "すぐに医師に相談してください",
      "糖質制限を検討",
      "毎食後の血糖値測定",
      "薬物療法の可能性について医師と相談",
    ];
  }

  return {
    metric_name: "血糖値 (Glucose)",
    metric_value: value,
    risk_level,
    target_value: 100,
    recommendations,
  };
}

export function evaluateHDL(value: number): RiskEvaluation {
  let risk_level: RiskLevel;
  let recommendations: string[];

  if (value >= 60) {
    risk_level = "normal";
    recommendations = [
      "良好な状態です。現在の生活習慣を維持しましょう",
    ];
  } else if (value >= 40) {
    risk_level = "warning";
    recommendations = [
      "有酸素運動を増やす",
      "オリーブオイルなど良質な脂質を摂取",
      "禁煙(喫煙者の場合)",
    ];
  } else {
    risk_level = "danger";
    recommendations = [
      "医師に相談してください",
      "運動習慣の確立",
      "食事療法の見直し",
      "薬物療法の検討",
    ];
  }

  return {
    metric_name: "HDLコレステロール (HDL-C)",
    metric_value: value,
    risk_level,
    target_value: 60,
    recommendations,
  };
}

export function evaluateTriglyceride(value: number): RiskEvaluation {
  let risk_level: RiskLevel;
  let recommendations: string[];

  if (value < 150) {
    risk_level = "normal";
    recommendations = [
      "現在の食生活を維持してください",
    ];
  } else if (value < 200) {
    risk_level = "warning";
    recommendations = [
      "アルコール摂取を減らす",
      "糖質・脂質の過剰摂取を避ける",
      "オメガ3脂肪酸を摂取",
      "定期的な運動",
    ];
  } else {
    risk_level = "danger";
    recommendations = [
      "医師に相談してください",
      "アルコール制限",
      "糖質制限食の検討",
      "運動療法の開始",
      "薬物療法の検討",
    ];
  }

  return {
    metric_name: "中性脂肪 (Triglyceride)",
    metric_value: value,
    risk_level,
    target_value: 150,
    recommendations,
  };
}

export function evaluateMetric(
  metricType: keyof BloodTestData,
  value: number
): RiskEvaluation {
  switch (metricType) {
    case "lh_ratio":
      return evaluateLHRatio(value);
    case "glucose":
      return evaluateGlucose(value);
    case "hdl":
      return evaluateHDL(value);
    case "triglyceride":
      return evaluateTriglyceride(value);
    default:
      throw new Error(`Unknown metric type: ${metricType}`);
  }
}
