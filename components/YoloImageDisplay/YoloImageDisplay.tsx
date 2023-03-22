import React, { useRef, useState } from "react";
import { YoloSession } from "@/utils/utils-yolo/types";
import { detectImage } from "@/utils/utils-yolo/detect";
import styles from "@/styles/Home.module.css";
import { cropImageFromFile } from "@/utils/imageTransform/imageTransformUtils";

interface YoloImageDisplayProps {
  sessionData: YoloSession;
  modelInputShape: [number, number, number, number];
  topk: number;
  iouThreshold: number;
  confThreshold: number;
  classThreshold: number;
}

export function YoloImageDisplay({
  sessionData,
  modelInputShape,
  topk,
  iouThreshold,
  confThreshold,
  classThreshold,
}: YoloImageDisplayProps) {
  const [image, setImage] = useState<string | null>(null);

  const inputImage = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef(null);

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

  function setImageHandler(imageUrl: string | null) {
    if (!imageUrl) {
      return setImage(null);
    }

    if (image) {
      URL.revokeObjectURL(image);
      setImage(null);
    }

    setImage(imageUrl);
  }

  return (
    <>
      <h2 className={styles.buttonHeader} style={{ marginTop: "2rem" }}>
        Image testing:
      </h2>
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
        onChange={async (e) => {
          // handle next image to detect
          if (image) {
            URL.revokeObjectURL(image);
            setImageHandler(null);
          }

          if (!e.target.files || !e.target.files[0] || !imageRef?.current)
            return;

          const croppedImage = await cropImageFromFile(
            e.target.files[0],
            modelInputShape[2],
            modelInputShape[3]
          );

          const url = URL.createObjectURL(croppedImage); // create image url
          imageRef.current.src = url; // set image source
          setImageHandler(url);
        }}
      />
      <button
        className={styles.button}
        onClick={() => {
          if (inputImage?.current) {
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
            inputImage.current.value = "";
            imageRef.current.src = "#";
            URL.revokeObjectURL(image);
            setImageHandler(null);
          }}
        >
          Close image
        </button>
      )}
      <button className={styles.button} onClick={() => loadTestLocalImage()}>
        Load test Image
      </button>
    </>
  );
}
