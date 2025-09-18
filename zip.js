// zip.js
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read lang (default en)
const BUILD_LANG = (process.env.BUILD_LANG || "en").toLowerCase();
const isFR = BUILD_LANG === "fr";

// Date -> MM-DD-YY
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const mm = pad(now.getMonth() + 1);
const dd = pad(now.getDate());
const yy = String(now.getFullYear()).slice(-2);
const datePart = `${mm}-${dd}-${yy}`;

// File names requested
const fileBase = isFR ? "FR-IRA1-110" : "EN-IRA1-110";
const fileName = `${fileBase}-${datePart}.zip`;
const outPath = path.join(__dirname, fileName);

// Ensure dist exists
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
	console.error("❌ dist/ not found. Did you run the build first?");
	process.exit(1);
}

// Clean up old zips (from past days), but keep today's EN + FR
try {
	const files = fs.readdirSync(__dirname);
	files.forEach((f) => {
		// Match both EN and FR formats, plus legacy names
		const match =
			/^EN-IRA1-(\d{2}-\d{2}-\d{2})\.zip$/i.exec(f) ||
			/^FR-IRA1--(\d{2}-\d{2}-\d{2})\.zip$/i.exec(f) ||
			/^en-indigenous-languages-act-.*\.zip$/i.exec(f) ||
			/^fr-indigenous-languages-act-.*\.zip$/i.exec(f);

		if (match) {
			const fileDate = match[1]; // capture date if available
			// If file date is not today, delete it
			if (fileDate && fileDate !== datePart) {
				try {
					fs.unlinkSync(path.join(__dirname, f));
				} catch {}
			}
		}
	});
} catch {}

// Create (overwrite) the new zip
const output = fs.createWriteStream(outPath, { flags: "w" });
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
	console.log(`✅ Zip file created: ${fileName}`);
	console.log(`${archive.pointer()} total bytes`);
});
archive.on("error", (err) => {
	throw err;
});

archive.pipe(output);
// Put dist/ contents at zip root
archive.directory(distDir + "/", false);
archive.finalize();
