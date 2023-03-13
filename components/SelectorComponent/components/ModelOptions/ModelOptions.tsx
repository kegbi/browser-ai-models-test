import React from "react";
import { modelListMock } from "@/components/SelectorComponent/types";

interface ModelOptionsProps {
  modelList: typeof modelListMock;
}

export function ModelOptions({ modelList }: ModelOptionsProps) {
  return (
    <>
      {Object.keys(modelList).map((key) => {
        return (
          <option
            key={key}
            value={modelList[key as keyof typeof modelList].value}
          >
            {modelList[key as keyof typeof modelList].name}
          </option>
        );
      })}
    </>
  );
}
