"use client";

import { BloodTestData } from "@/types/blood-test";
import { samplePresets } from "@/lib/sample-data";
import { useState } from "react";

interface DataInputFormProps {
  onSubmit: (data: BloodTestData) => void;
}

export function DataInputForm({ onSubmit }: DataInputFormProps) {
  const [formData, setFormData] = useState<BloodTestData>({
    ldl: 120,
    hdl: 55,
    lh_ratio: 2.2,
    glucose: 100,
    triglyceride: 150,
  });

  const handleChange = (field: keyof BloodTestData, value: string) => {
    const numValue = parseFloat(value) || 0;

    if (field === "lh_ratio") {
      setFormData((prev) => ({ ...prev, lh_ratio: numValue }));
    } else if (field === "ldl" || field === "hdl") {
      const newData = { ...formData, [field]: numValue };
      newData.lh_ratio = newData.hdl > 0 ? newData.ldl / newData.hdl : 0;
      setFormData(newData);
    } else {
      setFormData((prev) => ({ ...prev, [field]: numValue }));
    }
  };

  const loadPreset = (presetName: keyof typeof samplePresets) => {
    setFormData(samplePresets[presetName]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        血液検査データ入力 / Blood Test Data Input
      </h2>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => loadPreset("healthy")}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm font-semibold"
        >
          健康 Healthy
        </button>
        <button
          type="button"
          onClick={() => loadPreset("warning")}
          className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 text-sm font-semibold"
        >
          注意 Warning
        </button>
        <button
          type="button"
          onClick={() => loadPreset("danger")}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-sm font-semibold"
        >
          要改善 Danger
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              LDLコレステロール / LDL (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.ldl}
              onChange={(e) => handleChange("ldl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              HDLコレステロール / HDL (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.hdl}
              onChange={(e) => handleChange("hdl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              LH比 / LH Ratio
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.lh_ratio.toFixed(2)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">自動計算 (LDL ÷ HDL)</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              血糖値 / Glucose (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.glucose}
              onChange={(e) => handleChange("glucose", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              中性脂肪 / Triglyceride (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.triglyceride}
              onChange={(e) => handleChange("triglyceride", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors"
        >
          分析開始 / Analyze
        </button>
      </form>
    </div>
  );
}
