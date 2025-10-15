import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwind from "@tailwindcss/vite";

// Helpful when you want repeatable chunk names for LMS packaging
const stableChunks = {
	framer: ["framer-motion"],
	lucide: ["lucide-react"],
	tiptap: [
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
};

export default defineConfig({
	plugins: [react(), svgr(), tailwind()],

	// Pre-bundle deps that are frequently imported to speed dev server & reduce initial parse
	optimizeDeps: {
		include: [
			...stableChunks.tiptap,
			...stableChunks.framer,
			...stableChunks.lucide,
		],
	},

	build: {
		// Keep your SCORM-friendly output names
		rollupOptions: {
			output: {
				// Split big deps into named chunks so first screen isn't paying for everything
				manualChunks(id) {
					// third-party only
					if (!id.includes("node_modules")) return;
					if (stableChunks.framer.some((m) => id.includes(m))) return "framer";
					if (stableChunks.lucide.some((m) => id.includes(m))) return "lucide";
					if (stableChunks.tiptap.some((m) => id.includes(m))) return "tiptap";
					// everything else in a generic vendor bucket
					return "vendor";
				},

				// Flat, deterministic filenames that your LMS won’t choke on
				entryFileNames: "index.js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},

		// Keep assets at project root inside the zip (your original behavior)
		// If your LMS gets fussy, switch to assetsDir: "" instead of "./"
		assetsDir: "./",

		// Trim comment bloat; faster parse in ancient browsers disguising as LMS webviews
		terserOptions: {
			format: { comments: false },
		},
		// Smaller, cleaner JS
		// If you see warning about legal comments, this removes them
		// without changing runtime behavior.
		// Vite will pass this to esbuild where applicable.
		target: "es2018",
	},

	// Relative paths play nice when the SCO isn’t served from site root
	base: "./",
});
