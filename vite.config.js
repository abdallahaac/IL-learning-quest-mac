import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), svgr(), tailwind()],
	optimizeDeps: {
		include: [
			"@tiptap/react",
			"@tiptap/starter-kit",
			"@tiptap/extension-underline",
			"@tiptap/extension-link",
			"@tiptap/extension-placeholder",
			"@tiptap/extension-text-align",
			"@tiptap/extension-highlight",
			"@tiptap/extension-image",
			"@tiptap/extension-youtube",
			"@tiptap/extension-text-style",
			"@tiptap/extension-color",
			"@tiptap/extension-table",
			"@tiptap/extension-table-row",
			"@tiptap/extension-table-header",
			"@tiptap/extension-table-cell",
		],
	},
	build: {
		rollupOptions: {
			output: {
				entryFileNames: "index.js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},
		// If you truly want all assets at the root of outDir, prefer empty string:
		// assetsDir: "",
		assetsDir: "./", // (your original)
	},
	base: "./",
});
