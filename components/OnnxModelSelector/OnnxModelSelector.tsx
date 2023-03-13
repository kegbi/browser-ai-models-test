import React from "react";
import {
  ExecutionProviders,
  ModelData,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";
import { ModelPicker } from "@/components/ModelPicker/ModelPicker";

interface OnnxModelSelectorProps {
  selectedModel: ModelData | null;
  loadedModelInfo: ModelData | null;
  setSelectedModelHandler: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  modelList: Record<string, ModelData>;
}
export function OnnxModelSelector({
  selectedModel,
  loadedModelInfo,
  setSelectedModelHandler,
  modelList,
}: OnnxModelSelectorProps) {
  return (
    <ModelPicker
      selectedModel={selectedModel}
      loadedModelInfo={loadedModelInfo}
      setSelectedModelHandler={setSelectedModelHandler}
      modelList={modelList}
    />
  );
}
