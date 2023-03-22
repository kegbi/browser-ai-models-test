## Launching project in dev mode

To launch a project:

```bash
$ git clone
$ cd project
$ pnpm install
$ pnpm load:wasm # may not be required
$ pnpm dev
```

## How to use

Models and their configs could be specified in configs/config.ts file

In web version you could select desired model and load it. For now TensorflowJS and different precision options are not implemented, only WASM ONNX.

You could check detection time by loading test image or by selecting image from your device. Loaded device image will be resized to model input size.
