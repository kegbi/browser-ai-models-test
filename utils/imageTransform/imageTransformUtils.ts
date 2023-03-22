export async function cropImageFromFile(
  file: File,
  width: number = 640,
  height: number = 640
): Promise<Blob> {
  const { readAndCompressImage } = (await import("browser-image-resizer"));
  const config = {
    quality: 1,
    maxWidth: width,
    maxHeight: height,
    debug: false,
  };

  const compressedImage = await readAndCompressImage(file, config);

  return compressedImage;
}
