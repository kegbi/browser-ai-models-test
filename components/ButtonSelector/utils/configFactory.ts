import { ButtonSelectorButtonConfig } from "@/components/ButtonSelector/types";
import React from "react";
import {
  ExecutionProviders,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";
import { featureConfig } from "@/configs/config";

type ButtonHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export function getModelTypesButtonsConfig(
  handler: ButtonHandler
): ButtonSelectorButtonConfig[] {
  return [
    {
      label: ModelType.ONNX,
      value: ModelType.ONNX,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.modelTypes[ModelType.ONNX],
    },
    {
      label: ModelType.TENSORFLOWJS,
      value: ModelType.TENSORFLOWJS,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.modelTypes[ModelType.TENSORFLOWJS],
    },
  ];
}

export function getPrecisionButtonsConfig(
  handler: ButtonHandler
): ButtonSelectorButtonConfig[] {
  return [
    {
      label: PRECISION.FP32,
      value: PRECISION.FP32,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.precision[PRECISION.FP32],
    },
    {
      label: PRECISION.FP16,
      value: PRECISION.FP16,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.precision[PRECISION.FP16],
    },
    {
      label: PRECISION.INT8,
      value: PRECISION.INT8,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.precision[PRECISION.INT8],
    },
  ];
}

export function getExecutionProvidersButtonsConfig(
  handler: ButtonHandler
): ButtonSelectorButtonConfig[] {
  return [
    {
      label: ExecutionProviders.WASM,
      value: ExecutionProviders.WASM,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.executionProviders[ExecutionProviders.WASM],
    },
    {
      label: ExecutionProviders.WEBGL,
      value: ExecutionProviders.WEBGL,
      action: (event) => {
        handler(event);
      },
      ...featureConfig.buttons.executionProviders[ExecutionProviders.WEBGL],
    },
  ];
}
