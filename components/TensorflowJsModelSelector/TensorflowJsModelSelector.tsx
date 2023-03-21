import React from "react";
import {
  ModelData,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";
import { ModelPicker } from "@/components/ModelPicker/ModelPicker";

interface TensorflowJsModelSelectorProps {
  selectedModel: ModelData | null;
  setSelectedModelHandler: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  modelList: Record<string, ModelData>;
  loadModelHandler: () => Promise<void>;
}

export function TensorflowJsModelSelector({
  selectedModel,
  setSelectedModelHandler,
  modelList,
  loadModelHandler,
}: TensorflowJsModelSelectorProps) {
  return (
    <ModelPicker
      selectedModel={selectedModel}
      setSelectedModelHandler={setSelectedModelHandler}
      modelList={modelList}
      loadModelHandler={loadModelHandler}
    />
  );
}
