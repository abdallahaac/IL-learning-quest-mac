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

// Date / time helpers
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");

const yyyy = now.getFullYear();
const mm = pad(now.getMonth() + 1); // 01–12
const dd = pad(now.getDate()); // 01–31
const hh = pad(now.getHours()); // 00–23
const min = pad(now.getMinutes()); // 00–59

// Folder name: YYYY-MM-DD for organization
const dateFolderName = `${yyyy}-${mm}-${dd}`;

// Filename date part: MM-DD-HH-MM  → e.g. 12-11-10-26
const datePart = `${mm}-${dd}-${hh}-${min}`;

// File base per language
const fileBase = isFR ? "FR-IRA1-J26" : "EN-IRA1-J26";
const fileName = `${fileBase}-${datePart}.zip`;

// Output folder structure:
//   scorm-zip/YYYY-MM-DD/EN-IRA1-J26-12-11-10-26.zip
//   scorm-zip/YYYY-MM-DD/FR-IRA1-J26-12-11-10-26.zip
const scormRootDir = path.join(__dirname, "scorm-zip");
const targetDir = path.join(scormRootDir, dateFolderName);
fs.mkdirSync(targetDir, { recursive: true });

const outPath = path.join(targetDir, fileName);

// Ensure dist exists
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
	console.error("❌ dist/ not found. Did you run the build first?");
	process.exit(1);
}

// Create zip
const output = fs.createWriteStream(outPath, { flags: "w" });
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
	console.log(`✅ Zip file created: ${outPath}`);
	console.log(`${archive.pointer()} total bytes`);
});

archive.on("error", (err) => {
	throw err;
});

archive.pipe(output);

// Put dist/ contents at zip root
archive.directory(distDir + "/", false);
archive.finalize();
