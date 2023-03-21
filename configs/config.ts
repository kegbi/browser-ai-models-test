import {
  ExecutionProviders,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";

type ButtonInterface = {
  isDisabled: boolean;
  isHidden: boolean;
  isDefault?: boolean;
};

interface FeatureConfig {
  buttons: {
    modelTypes: {
      [ModelType.ONNX]: ButtonInterface;
      [ModelType.TENSORFLOWJS]: ButtonInterface;
    };
    precision: {
      [PRECISION.FP32]: ButtonInterface;
      [PRECISION.FP16]: ButtonInterface;
      [PRECISION.INT8]: ButtonInterface;
    };
    executionProviders: {
      [ExecutionProviders.WASM]: ButtonInterface;
      [ExecutionProviders.WEBGL]: ButtonInterface;
    };
  };
}

// TODO: env vars solution
export const featureConfig: FeatureConfig = {
  buttons: {
    modelTypes: {
      [ModelType.ONNX]: {
        isDisabled: false,
        isHidden: true,
        isDefault: true,
      },
      [ModelType.TENSORFLOWJS]: {
        isDisabled: true,
        isHidden: true,
        isDefault: false,
      },
    },
    precision: {
      [PRECISION.FP32]: {
        isDisabled: false,
        isHidden: false,
        isDefault: true,
      },
      [PRECISION.FP16]: {
        isDisabled: true,
        isHidden: true,
        isDefault: false,
      },
      [PRECISION.INT8]: {
        isDisabled: true,
        isHidden: true,
        isDefault: false,
      },
    },
    executionProviders: {
      [ExecutionProviders.WASM]: {
        isDisabled: false,
        isHidden: false,
        isDefault: true,
      },
      [ExecutionProviders.WEBGL]: {
        isDisabled: true,
        isHidden: true,
        isDefault: false,
      },
    },
  },
};
