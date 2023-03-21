import { ModelData, ModelType } from "@/components/SelectorComponent/types";
import { isCertainModelTypePresented } from "@/configs/utils/modelTypes/isCertainModelTypePresented";

export function getDefaultModelType(
  modelList: Record<string, ModelData>
): ModelType {
  if (isCertainModelTypePresented(modelList, ModelType.ONNX)) {
    return ModelType.ONNX;
  } else if (isCertainModelTypePresented(modelList, ModelType.TENSORFLOWJS)) {
    return ModelType.TENSORFLOWJS;
  } else {
    return ModelType.ONNX;
  }
}
