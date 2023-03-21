import { ModelData, PRECISION } from "@/components/SelectorComponent/types";
import { isCertainPrecisionLevelPresented } from "@/configs/utils/precision/isCertainPrecisionLevelPresented";

export function getDefaultPrecisionLevel(modelList: Record<string, ModelData>) {
  if (isCertainPrecisionLevelPresented(modelList, PRECISION.FP32)) {
    return PRECISION.FP32;
  } else if (isCertainPrecisionLevelPresented(modelList, PRECISION.FP16)) {
    return PRECISION.FP16;
  } else if (isCertainPrecisionLevelPresented(modelList, PRECISION.INT8)) {
    return PRECISION.INT8;
  } else {
    return PRECISION.FP32;
  }
}
