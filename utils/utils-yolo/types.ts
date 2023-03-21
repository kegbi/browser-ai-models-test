import { InferenceSession } from "onnxruntime-web";

export interface YoloSession {
  model: InferenceSession;
  nms: InferenceSession;
}
