import React from "react";
import { ModelData } from "@/components/SelectorComponent/types";
import { SelectorComponent } from "@/components/SelectorComponent/SelectorComponent";
import { ModelOptions } from "@/components/SelectorComponent/components/ModelOptions/ModelOptions";
import styles from "@/components/ModelPicker/ModelPicker.module.css";
import homeStyles from "@/styles/Home.module.css";

interface ModelPickerProps {
  selectedModel: ModelData | null;
  setSelectedModelHandler: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  modelList: Record<string, ModelData>;
  loadModelHandler: () => Promise<void>;
}

export function ModelPicker({
  selectedModel,
  setSelectedModelHandler,
  modelList,
  loadModelHandler,
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
        <button
          className={homeStyles.button}
          onClick={() => loadModelHandler()}
        >
          Load model
        </button>
      </>
    );
  } else {
    return null;
  }
}
