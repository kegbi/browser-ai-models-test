import { ModelData, ModelType } from "@/components/SelectorComponent/types";

export function isCertainModelTypePresented(
  modelList: Record<string, ModelData>,
  modelTypeToCheck: ModelType
): boolean {
  return Object.values(modelList).some(
    (modelData) => modelData.type === modelTypeToCheck
  );
}
