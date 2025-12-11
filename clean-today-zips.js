// clean-today-zips.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Date helpers
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");

const yyyy = now.getFullYear();
const mm = pad(now.getMonth() + 1);
const dd = pad(now.getDate());

// Folder name: YYYY-MM-DD (matches zip.js)
const dateFolderName = `${yyyy}-${mm}-${dd}`;

// Root: <project>/scorm-zip
const scormRootDir = path.join(__dirname, "scorm-zip");
const todayDir = path.join(scormRootDir, dateFolderName);

// Ensure root folder exists
if (!fs.existsSync(scormRootDir)) {
	fs.mkdirSync(scormRootDir, { recursive: true });
}

// If today's folder exists, delete ALL .zip files inside it
if (fs.existsSync(todayDir)) {
	const files = fs.readdirSync(todayDir);
	for (const f of files) {
		if (f.toLowerCase().endsWith(".zip")) {
			const fullPath = path.join(todayDir, f);
			try {
				fs.unlinkSync(fullPath);
				console.log(`🧹 Deleted existing zip: ${fullPath}`);
			} catch (err) {
				console.error(`⚠️ Failed to delete ${fullPath}:`, err);
			}
		}
	}
} else {
	// If it doesn't exist yet, create it
	fs.mkdirSync(todayDir, { recursive: true });
}

console.log(`📁 Ready folder for today's zips: ${todayDir}`);
