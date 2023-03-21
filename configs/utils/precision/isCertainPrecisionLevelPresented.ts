import { ModelData, PRECISION } from "@/components/SelectorComponent/types";

export function isCertainPrecisionLevelPresented(
  modelList: Record<string, ModelData>,
  precisionToCheck: PRECISION
): boolean {
  return Object.values(modelList).some(
    (modelData) => modelData.precision === precisionToCheck
  );
}
