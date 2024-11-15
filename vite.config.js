import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // build: {
  //   rollupOptions: {
  //     external: new RegExp("/(vue_tmp|vanilla_tmp|react_umi_tmp)/.*"),
  //   },
  // },
  build: {
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: "assets/[name].js",
        // 块文件名
        chunkFileNames: "assets/[name]-[hash].js",
        // 资源文件名 css 图片等等
        assetFileNames: "assets/[name]-[hash]-style.[ext]",
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 两种方式都可以
        // additionalData: '@import "./src/assets/main.scss";',
        // additionalData: '@use "@/assets/scss/global.scss" as *;'
      },
    },
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
