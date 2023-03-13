import React from "react";
import { ModelData } from "@/components/SelectorComponent/types";
import { SelectorComponent } from "@/components/SelectorComponent/SelectorComponent";
import { ModelOptions } from "@/components/SelectorComponent/components/ModelOptions/ModelOptions";
import styles from "@/components/ModelPicker/ModelPicker.module.css";

interface ModelPickerProps {
  selectedModel: ModelData | null;
  loadedModelInfo: ModelData | null;
  setSelectedModelHandler: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  modelList: Record<string, ModelData>;
}

export function ModelPicker({
  selectedModel,
  loadedModelInfo,
  setSelectedModelHandler,
  modelList,
}: ModelPickerProps) {
  if (selectedModel && modelList) {
    return (
      <>
        <div>Pick model and experiment with it:</div>
        <SelectorComponent
          selectedValue={selectedModel.value}
          setSelectHandler={setSelectedModelHandler}
        >
          <ModelOptions modelList={modelList} />
        </SelectorComponent>
        <p className={styles.modelInformation}>
          Selected model: {selectedModel.name} (Precision:{" "}
          {selectedModel.precision}
          {selectedModel.type ? `, Provider: ${selectedModel.type}` : ""})
        </p>
        {loadedModelInfo && (
          <p className={styles.modelInformation}>
            Loaded model: {loadedModelInfo.name} (Precision:{" "}
            {loadedModelInfo.precision}
            {loadedModelInfo.type ? `, Provider: ${loadedModelInfo.type}` : ""})
          </p>
        )}
      </>
    );
  } else {
    return null;
  }
}
