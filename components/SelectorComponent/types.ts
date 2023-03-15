export interface ModelData {
  name: string;
  value: string;
  modelUrl: string;
  precision: PRECISION;
  type: ModelType;
}

export enum PRECISION {
  FP32 = "FP32",
  FP16 = "FP16",
  INT8 = "INT8",
}

export enum ModelType {
  ONNX = "onnx",
  TENSORFLOWJS = "tensorflowjs",
}

export enum ExecutionProviders {
  WASM = "wasm",
  WEBGL = "webgl",
}

export const modelListMock: Record<string, ModelData> = {
  yolov5s32: {
    name: "YOLOv5-s 32fp",
    value: "yolov5s32",
    modelUrl: "/models/yolov5s-32.onnx",
    precision: PRECISION.FP32,
    type: ModelType.ONNX,
  },
  yolov432: {
    name: "YOLOv4 32fp",
    value: "yolov432",
    modelUrl: "/models/yolov4.onnx",
    precision: PRECISION.FP32,
    type: ModelType.ONNX,
  },
  yolov5s16: {
    name: "YOLOv5s 16fp",
    value: "yolov5s16",
    modelUrl: "/models/yolov5s-16.onnx",
    precision: PRECISION.FP16,
    type: ModelType.ONNX,
  },
};
