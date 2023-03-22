import { Tensor } from "onnxruntime-web";
import { renderBoxes } from "./renderBox";
import cv from "@techstark/opencv-js";
import { YoloSession } from "@/utils/utils-yolo/types";

interface DetectionConfig {
  topk: number;
  iouThreshold: number;
  confThreshold: number;
  classThreshold: number;
  inputShape: [number, number, number, number];
}

export const detectImage = async (
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  session: YoloSession,
  detectionConfig: DetectionConfig
) => {
  if (!image || !canvas) return;
  const { topk, iouThreshold, confThreshold, classThreshold, inputShape } =
    detectionConfig;

  // detect time start
  const start = performance.now();

  const [modelWidth, modelHeight] = inputShape.slice(2);

  const mat = cv.imread(image); // read from img tag
  const matC3 = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3); // new image matrix
  cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR

  // padding image to [n x n] dim
  const maxSize = Math.max(matC3.rows, matC3.cols); // get max size from width and height
  const xPad = maxSize - matC3.cols, // set xPadding
    xRatio = maxSize / matC3.cols; // set xRatio
  const yPad = maxSize - matC3.rows, // set yPadding
    yRatio = maxSize / matC3.rows; // set yRatio
  const matPad = new cv.Mat(); // new mat for padded image
  cv.copyMakeBorder(
    matC3,
    matPad,
    0,
    yPad,
    0,
    xPad,
    cv.BORDER_CONSTANT,
    [0, 0, 0, 255]
  ); // padding black

  const input = cv.blobFromImage(
    matPad,
    1 / 255.0, // normalize
    new cv.Size(modelWidth, modelHeight), // resize to model input size
    new cv.Scalar(0, 0, 0),
    true, // swapRB
    false // crop
  ); // preprocessing image matrix

  const tensor = new Tensor("float32", input.data32F, inputShape); // to ort.Tensor
  const config = new Tensor(
    "float32",
    new Float32Array([topk, iouThreshold, confThreshold])
  ); // nms config tensor
  const { output0 } = await session.model.run({ images: tensor }); // run session and get output layer
  const { selected_idx } = await session.nms.run({
    detection: output0,
    config: config,
  }); // get selected idx from nms

  const boxes = [];

  // detect time end
  const end = performance.now();

  const totalCalculateTime = end - start;
  // looping through output
  for (let idx = 0; idx < output0.dims[1]; idx++) {
    if (!(selected_idx.data as unknown as number[]).includes(idx)) continue; // skip if index isn't selected

    const data = output0.data.slice(
      idx * output0.dims[2],
      (idx + 1) * output0.dims[2]
    ); // get rows
    const [x, y, w, h] = data.slice(0, 4) as Float32Array;
    const confidence = data[4]; // detection confidence
    const scores = data.slice(5); // classes probability scores
    let score = Math.max(...(scores as unknown as number[])); // maximum probability scores
    const label = (scores as unknown as number[]).indexOf(score); // class id of maximum probability scores
    score *= confidence as number; // multiply score by conf

    // filtering by score thresholds
    if (score >= classThreshold)
      boxes.push({
        label: label,
        probability: score,
        bounding: [
          Math.floor((x - 0.5 * w) * xRatio), // left
          Math.floor((y - 0.5 * h) * yRatio), //top
          Math.floor(w * xRatio), // width
          Math.floor(h * yRatio), // height
        ].map((num) => {
          if (num < 0) return 0;
          return num;
        }) as [number, number, number, number],
        totalCalculateTime: totalCalculateTime,
      });
  }

  console.log(boxes)

  renderBoxes(canvas, boxes);

  // release mat opencv
  mat.delete();
  matC3.delete();
  matPad.delete();
  input.delete();
};
