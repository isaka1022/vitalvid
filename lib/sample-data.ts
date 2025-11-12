import { BloodTestData } from "@/types/blood-test";

export const samplePresets: Record<string, BloodTestData> = {
  healthy: {
    ldl: 100,
    hdl: 65,
    lh_ratio: 1.5,
    glucose: 90,
    triglyceride: 100,
  },
  warning: {
    ldl: 140,
    hdl: 50,
    lh_ratio: 2.8,
    glucose: 110,
    triglyceride: 180,
  },
  danger: {
    ldl: 180,
    hdl: 35,
    lh_ratio: 5.1,
    glucose: 140,
    triglyceride: 250,
  },
};
