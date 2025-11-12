"use client";

import { RiskLevel } from "@/types/blood-test";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface MetricCardProps {
  title: string;
  titleEn: string;
  value: number;
  unit: string;
  riskLevel: RiskLevel;
  onWatch: () => void;
  isGenerating?: boolean;
}

const riskConfig = {
  normal: {
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-800",
    text: "正常範囲",
    textEn: "Normal",
    icon: "✅",
  },
  warning: {
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
    text: "注意",
    textEn: "Warning",
    icon: "⚠️",
  },
  danger: {
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-800",
    text: "要改善",
    textEn: "Danger",
    icon: "🚨",
  },
};

export function MetricCard({
  title,
  titleEn,
  value,
  unit,
  riskLevel,
  onWatch,
  isGenerating = false,
}: MetricCardProps) {
  const config = riskConfig[riskLevel];

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-6 transition-all hover:shadow-lg",
        config.color
      )}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{titleEn}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">{value}</span>
          <span className="text-lg text-gray-600">{unit}</span>
          <span className="text-2xl ml-2">{config.icon}</span>
        </div>

        <div>
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full text-sm font-semibold",
              config.badge
            )}
          >
            {config.text} / {config.textEn}
          </span>
        </div>

        <button
          onClick={onWatch}
          disabled={isGenerating}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors",
            isGenerating
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          <Play className="w-4 h-4" />
          {isGenerating ? "生成中... Generating..." : "動画を見る Watch Video"}
        </button>
      </div>
    </div>
  );
}
