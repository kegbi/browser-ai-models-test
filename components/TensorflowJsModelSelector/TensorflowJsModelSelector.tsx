import React from "react";
import {
  ModelData,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";
import { ModelPicker } from "@/components/ModelPicker/ModelPicker";

interface TensorflowJsModelSelectorProps {
  selectedModel: ModelData | null;
  loadedModelInfo: ModelData | null;
  setSelectedModelHandler: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  modelList: Record<string, ModelData>;
}

export function TensorflowJsModelSelector({
  selectedModel,
  loadedModelInfo,
  setSelectedModelHandler,
  modelList,
}: TensorflowJsModelSelectorProps) {
  return (
    <ModelPicker
      selectedModel={selectedModel}
      loadedModelInfo={loadedModelInfo}
      setSelectedModelHandler={setSelectedModelHandler}
      modelList={modelList}
    />
  );
}
