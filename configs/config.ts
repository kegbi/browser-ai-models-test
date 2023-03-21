import {
  ExecutionProviders,
  ModelData,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";
import { isCertainModelTypePresented } from "@/configs/utils/modelTypes/isCertainModelTypePresented";
import { getDefaultModelType } from "@/configs/utils/modelTypes/getDefaultModelType";
import { isCertainPrecisionLevelPresented } from "@/configs/utils/precision/isCertainPrecisionLevelPresented";
import { getDefaultPrecisionLevel } from "@/configs/utils/precision/getDefaultPrecisionLevel";

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
export function getFeatureConfig(
  modelList: Record<string, ModelData>
): FeatureConfig {
  const defaultModelType = getDefaultModelType(modelList);

  return {
    buttons: {
      modelTypes: {
        [ModelType.ONNX]: {
          isDisabled: false,
          isHidden: !isCertainModelTypePresented(modelList, ModelType.ONNX),
          isDefault: defaultModelType === ModelType.ONNX,
        },
        [ModelType.TENSORFLOWJS]: {
          isDisabled: true,
          isHidden: !isCertainModelTypePresented(
            modelList,
            ModelType.TENSORFLOWJS
          ),
          isDefault: defaultModelType === ModelType.TENSORFLOWJS,
        },
      },
      precision: {
        [PRECISION.FP32]: {
          isDisabled: false,
          isHidden: !isCertainPrecisionLevelPresented(
            modelList,
            PRECISION.FP32
          ),
          isDefault: getDefaultPrecisionLevel(modelList) === PRECISION.FP32,
        },
        [PRECISION.FP16]: {
          isDisabled: true,
          isHidden: isCertainPrecisionLevelPresented(modelList, PRECISION.FP16),
          isDefault: getDefaultPrecisionLevel(modelList) === PRECISION.FP16,
        },
        [PRECISION.INT8]: {
          isDisabled: true,
          isHidden: !isCertainPrecisionLevelPresented(
            modelList,
            PRECISION.INT8
          ),
          isDefault: getDefaultPrecisionLevel(modelList) === PRECISION.INT8,
        },
      },
      executionProviders: {
        [ExecutionProviders.WASM]: {
          isDisabled: false,
          isHidden: false,
          isDefault: true,
        },
        [ExecutionProviders.WEBGL]: {
          isDisabled: false,
          isHidden: false,
          isDefault: false,
        },
      },
    },
  };
}
