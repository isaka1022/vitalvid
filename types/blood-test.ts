export interface BloodTestData {
  ldl: number;         // LDLコレステロール (mg/dL)
  hdl: number;         // HDLコレステロール (mg/dL)
  lh_ratio: number;    // LH比
  glucose: number;     // 血糖値 (mg/dL)
  triglyceride: number; // 中性脂肪 (mg/dL)
}

export type RiskLevel = "normal" | "warning" | "danger";

export interface RiskEvaluation {
  metric_name: string;
  metric_value: number;
  risk_level: RiskLevel;
  target_value: number;
  recommendations: string[];
}

export interface VideoExplanation {
  metric_name: string;        // "LH比 (LH Ratio)"
  metric_value: number;       // 実測値
  mulmo_script: object;       // mulmoスクリプト（JSON）
  video_path: string;         // 生成動画パス
  risk_evaluation: RiskEvaluation;
}
