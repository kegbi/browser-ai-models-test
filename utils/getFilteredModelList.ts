import {
  ModelData,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";

export function getFilteredModelList(
  modelList: Record<string, ModelData>,
  precision: PRECISION,
  modelType: ModelType
): Record<string, ModelData> {
  return Object.keys(modelList)
    .filter((key) => {
      return (
        modelList[key as keyof typeof modelList].precision === precision &&
        modelList[key as keyof typeof modelList].type === modelType
      );
    })
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: modelList[key as keyof typeof modelList],
      }),
      {}
    );
}
