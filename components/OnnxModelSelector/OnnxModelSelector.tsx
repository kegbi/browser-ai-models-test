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
  setSelectedModelHandler: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  modelList: Record<string, ModelData>;
  loadModelHandler: () => Promise<void>;
}
export function OnnxModelSelector({
  selectedModel,
  setSelectedModelHandler,
  modelList,
  loadModelHandler,
}: OnnxModelSelectorProps) {
  return (
    <ModelPicker
      selectedModel={selectedModel}
      setSelectedModelHandler={setSelectedModelHandler}
      modelList={modelList}
      loadModelHandler={loadModelHandler}
    />
  );
}
