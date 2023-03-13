/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, {}) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort.min.js",
            to: "static/chunks/pages",
          },
          {
            from: "./public/models",
            to: "static/chunks/pages",
          },
        ],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
