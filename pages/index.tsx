import React, { useEffect, useState } from "react";
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

interface SessionData {
  model: InferenceSession;
  nms: InferenceSession;
}

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
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [executionProvider, setExecutionProvider] = useState<
    ExecutionProviders[]
  >([ExecutionProviders.WASM]);
  const [modelList, setModelList] =
    useState<Record<string, ModelData>>(modelListMock);

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

  // TODO: extract to hook or other func to reduce lines of code in the main component
  async function loadModel() {
    try {
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
        <ButtonSelector
          selectedValue={modelType}
          setSelectHandler={setModelTypeHandler}
          options={modelTypeOptions}
        />
        <ButtonSelector
          selectedValue={precision}
          setSelectHandler={setPrecisionHandler}
          options={precisionTypeOptions}
        />
        {modelType === ModelType.ONNX && (
          <ButtonSelector
            selectedValue={executionProvider[0]}
            setSelectHandler={setExecutionProvidersHandler}
            options={executionProvidersOptions}
          />
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

        <button className={styles.loadModelButton} onClick={() => loadModel()}>
          Load model
        </button>

        {error && <div style={{ color: "red" }}>{error}</div>}
        {/*<YoloModel imageUrl={}*/}
      </main>
    </>
  );
}
