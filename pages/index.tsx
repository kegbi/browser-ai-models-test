import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { InferenceSession, Tensor } from "onnxruntime-web";
import {
  ExecutionProviders,
  ModelData,
  modelListMock,
  ModelType,
  PRECISION,
} from "@/components/SelectorComponent/types";
import { OnnxModelSelector } from "@/components/OnnxModelSelector/OnnxModelSelector";
import { TensorflowJsModelSelector } from "@/components/TensorflowJsModelSelector/TensorflowJsModelSelector";
import { ButtonSelector } from "@/components/ButtonSelector/ButtonSelector";
import { getFilteredModelList } from "@/utils/getFilteredModelList";
import { YoloSession } from "@/utils/utils-yolo/types";
import { detectImage } from "@/utils/utils-yolo/detect";

// const imageUrls = YOLO_IMAGE_URLS;

const nmsModelName = "nms-yolov5.onnx";

const modelInputShape = [1, 3, 640, 640];
const topk = 100;
const iouThreshold = 0.45;
const confThreshold = 0.2;
const classThreshold = 0.2;

const modelTypeOptions: ModelType[] = [ModelType.ONNX, ModelType.TENSORFLOWJS];

const precisionTypeOptions: PRECISION[] = [
  PRECISION.FP32,
  PRECISION.FP16,
  PRECISION.INT8,
];

const executionProvidersOptions: ExecutionProviders[] = [
  ExecutionProviders.WASM,
  ExecutionProviders.WEBGL,
];

export default function Home() {
  const [modelType, setModelType] = useState<ModelType>(ModelType.ONNX);
  const [precision, setPrecision] = useState<PRECISION>(PRECISION.FP32);
  const [selectedModel, setSelectedModel] = useState<ModelData>(
    modelListMock.yolov5s32
  );
  const [loadedModelInfo, setLoadedModelInfo] = useState<ModelData | null>(
    null
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<YoloSession | null>(null);
  const [executionProvider, setExecutionProvider] = useState<
    ExecutionProviders[]
  >([ExecutionProviders.WASM]);
  const [modelList, setModelList] =
    useState<Record<string, ModelData>>(modelListMock);

  const inputImage = useRef(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef(null);

  function setSelectedModelHandler(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const model = modelListMock[event.target.value];
    resetFlags();

    setSelectedModel(model);
  }

  function setModelTypeHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const modelType = event.currentTarget.value as ModelType;

    setModelType(modelType);
  }

  function setPrecisionHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const precision = event.currentTarget.value as PRECISION;

    setPrecision(precision);
  }

  function setExecutionProvidersHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const executionProvider = event.currentTarget.value as ExecutionProviders;

    setExecutionProvider([executionProvider]);
  }

  function resetFlags() {
    setLoading(null);
    setError(null);
  }

  function loadTestLocalImage() {
    if (image) {
      URL.revokeObjectURL(image);
      setImage(null);
    }

    const tempImageUrl =
      "/pictures_examples/Alpine_School_District_school_bus.jpg";

    if (imageRef.current) {
      imageRef.current.src = tempImageUrl;
      setImage(tempImageUrl);
    }
  }

  // TODO: extract to hook or other func to reduce lines of code in the main component
  async function loadModel() {
    try {
      setError(null);
      setLoading("Loading model...");
      setLoadedModelInfo(null);
      const model = await InferenceSession.create(selectedModel.modelUrl, {
        executionProviders: executionProvider,
      });
      const nms = await InferenceSession.create(`/models/${nmsModelName}`, {
        executionProviders: executionProvider,
      });

      const tensor = new Tensor(
        "float32",
        new Float32Array(modelInputShape.reduce((a, b) => a * b)),
        modelInputShape
      );
      setLoading("Warming up model...");

      const config = new Tensor(
        "float32",
        new Float32Array([topk, iouThreshold, confThreshold])
      );
      const { output0 } = await model.run({ images: tensor });
      await nms.run({ detection: output0, config: config });

      setSessionData({ model: model, nms: nms });
      setLoadedModelInfo(selectedModel);
    } catch (error) {
      console.error("Error loading models", error);
      setError("Error loading models");
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    const filteredModelList = getFilteredModelList(
      modelListMock,
      precision,
      modelType
    );

    if (!selectedModel || !filteredModelList[selectedModel.value]) {
      setSelectedModel(filteredModelList[Object.keys(filteredModelList)[0]]);
    }

    setModelList(filteredModelList);
  }, [modelType, precision, executionProvider]);

  return (
    <>
      <Head>
        <title>AI browser model test</title>
        <meta
          name="description"
          content="Testing of AI models in the browser"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2 className={styles.buttonHeader}>Provider:</h2>
        <ButtonSelector
          selectedValue={modelType}
          setSelectHandler={setModelTypeHandler}
          options={modelTypeOptions}
        />
        <h2 className={styles.buttonHeader}>Precision:</h2>
        <ButtonSelector
          selectedValue={precision}
          setSelectHandler={setPrecisionHandler}
          options={precisionTypeOptions}
        />
        {modelType === ModelType.ONNX && (
          <>
            <h2 className={styles.buttonHeader}>Engine:</h2>
            <ButtonSelector
              selectedValue={executionProvider[0]}
              setSelectHandler={setExecutionProvidersHandler}
              options={executionProvidersOptions}
            />
          </>
        )}

        {loading ? (
          <div>{loading}</div>
        ) : modelType === ModelType.ONNX ? (
          <OnnxModelSelector
            selectedModel={selectedModel}
            loadedModelInfo={loadedModelInfo}
            setSelectedModelHandler={setSelectedModelHandler}
            modelList={modelList}
          />
        ) : (
          <TensorflowJsModelSelector
            selectedModel={selectedModel}
            loadedModelInfo={loadedModelInfo}
            setSelectedModelHandler={setSelectedModelHandler}
            modelList={modelList}
          />
        )}

        <button className={styles.button} onClick={() => loadModel()}>
          Load model
        </button>

        <h2 className={styles.buttonHeader}>Image testing:</h2>

        <div style={{ position: "relative" }}>
          <img
            ref={imageRef}
            src="#"
            alt=""
            style={{ display: image ? "block" : "none" }}
            onLoad={() => {
              detectImage(imageRef.current, canvasRef.current, sessionData, {
                topk,
                iouThreshold,
                confThreshold,
                classThreshold,
                inputShape: modelInputShape,
              });
            }}
          />
          <canvas
            id="canvas"
            className={styles.imageCanvas}
            width={modelInputShape[2]}
            height={modelInputShape[3]}
            style={{ display: image ? "block" : "none" }}
            ref={canvasRef}
          />
        </div>

        <input
          type="file"
          ref={inputImage}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            // handle next image to detect
            if (image) {
              URL.revokeObjectURL(image);
              setImage(null);
            }

            if (!e.target.files || !e.target.files[0] || !imageRef.current)
              return;

            const url = URL.createObjectURL(e.target.files[0]); // create image url
            imageRef.current.src = url; // set image source
            setImage(url);
          }}
        />
        <button
          className={styles.button}
          onClick={() => {
            if (inputImage?.current) {
              // @ts-ignore
              inputImage.current?.click();
            }
          }}
        >
          Open local image
        </button>
        {image && (
          /* show close btn when there is image */
          <button
            className={styles.button}
            onClick={() => {
              if (!inputImage.current || !imageRef.current) return;
              // @ts-ignore
              inputImage.current.value = "";
              imageRef.current.src = "#";
              URL.revokeObjectURL(image);
              setImage(null);
            }}
          >
            Close image
          </button>
        )}
        <button className={styles.button} onClick={() => loadTestLocalImage()}>
          Load test Image
        </button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </main>
    </>
  );
}
