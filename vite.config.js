import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwind()],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: "index.js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},
		assetsDir: "./",
	},
	base: "./",
});
