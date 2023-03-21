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
import { YoloSession } from "@/utils/utils-yolo/types";
import {
  getExecutionProvidersButtonsConfig,
  getModelTypesButtonsConfig,
  getPrecisionButtonsConfig,
} from "@/components/ButtonSelector/utils/configFactory";
import { YoloImageDisplay } from "@/components/YoloImageDisplay/YoloImageDisplay";
import { getDefaultModelType } from "@/configs/utils/modelTypes/getDefaultModelType";
import { getDefaultPrecisionLevel } from "@/configs/utils/precision/getDefaultPrecisionLevel";

// const imageUrls = YOLO_IMAGE_URLS;

const nmsModelName = "nms-yolov5.onnx";

const modelInputShape: [number, number, number, number] = [1, 3, 640, 640];
const topk = 100;
const iouThreshold = 0.45;
const confThreshold = 0.2;
const classThreshold = 0.2;

export default function Home() {
  const [modelType, setModelType] = useState<ModelType>(
    getDefaultModelType(modelListMock)
  );
  const [precision, setPrecision] = useState<PRECISION>(
    getDefaultPrecisionLevel(modelListMock)
  );
  const [selectedModel, setSelectedModel] = useState<ModelData>(
    modelListMock.yolov5s32
  );

  const [loadedModelInfo, setLoadedModelInfo] = useState<ModelData | null>(
    null
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<YoloSession | null>(null);
  const [executionProvider, setExecutionProvider] = useState<
    ExecutionProviders[]
  >([ExecutionProviders.WASM]);
  const [modelList, setModelList] =
    useState<Record<string, ModelData>>(modelListMock);

  const modelTypeButtonsConfig =
    getModelTypesButtonsConfig(setModelTypeHandler);

  const precisionTypeButtonsConfig =
    getPrecisionButtonsConfig(setPrecisionHandler);

  const executionProvidersButtonsConfig = getExecutionProvidersButtonsConfig(
    setExecutionProvidersHandler
  );

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
          buttonsConfig={modelTypeButtonsConfig}
        />
        <h2 className={styles.buttonHeader}>Precision:</h2>
        <ButtonSelector
          selectedValue={precision}
          buttonsConfig={precisionTypeButtonsConfig}
        />
        {modelType === ModelType.ONNX && (
          <>
            <h2 className={styles.buttonHeader}>Engine:</h2>
            <ButtonSelector
              selectedValue={executionProvider[0]}
              buttonsConfig={executionProvidersButtonsConfig}
            />
          </>
        )}

        {loading ? (
          <div>{loading}</div>
        ) : modelType === ModelType.ONNX ? (
          <OnnxModelSelector
            selectedModel={selectedModel}
            setSelectedModelHandler={setSelectedModelHandler}
            modelList={modelList}
            loadModelHandler={loadModel}
          />
        ) : (
          <TensorflowJsModelSelector
            selectedModel={selectedModel}
            setSelectedModelHandler={setSelectedModelHandler}
            modelList={modelList}
            loadModelHandler={loadModel}
          />
        )}

        {loadedModelInfo && sessionData && (
          <>
            <p className={styles.modelInformation}>
              Loaded model: {loadedModelInfo.name} (Precision:{" "}
              {loadedModelInfo.precision}
              {loadedModelInfo.type
                ? `, Provider: ${loadedModelInfo.type}`
                : ""}
              )
            </p>
            <YoloImageDisplay
              sessionData={sessionData}
              modelInputShape={modelInputShape}
              topk={topk}
              iouThreshold={iouThreshold}
              confThreshold={confThreshold}
              classThreshold={classThreshold}
            />
          </>
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}
      </main>
    </>
  );
}
