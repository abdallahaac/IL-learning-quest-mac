// set-manifest-default.js
// Post-build step: adjust imsmanifest titles, resource href,
// and entry HTML <html lang>/<title> based on BUILD_LANG.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language selection (arg beats env; default en)
const argLang = (process.argv[2] || "").toLowerCase();
const envLang = (process.env.BUILD_LANG || "").toLowerCase();
const BUILD_LANG = argLang || envLang || "en";
const isFR = BUILD_LANG === "fr";

// Paths inside /dist
const distDir = path.join(__dirname, "dist");
const manifestPath = path.join(distDir, "imsmanifest.xml");

// We’ll support both index.html (EN) and index.html (FR) – same file,
// but lang + title will be updated for each package.
const entryEn = "index.html";
const entryFr = "index.html";
const entryFile = isFR ? entryFr : entryEn;
const entryPath = path.join(distDir, entryFile);

// Course Titles
const TITLE_EN = "Learning Quest on Indigenous Cultures";
const TITLE_FR = "Quête d’apprentissage sur les cultures autochtones";
const courseTitle = isFR ? TITLE_FR : TITLE_EN;

// Utility: safe read/write
const readText = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
const writeText = (p, s) => fs.writeFileSync(p, s, "utf8");

// 1) Update imsmanifest.xml
(function updateManifest() {
	const xml = readText(manifestPath);
	if (!xml) {
		console.warn("⚠️ imsmanifest.xml not found in dist/");
		return;
	}
	let out = xml;

	// a) If you ever use ORG_EN / ORG_FR, switch default accordingly (no-op otherwise).
	out = out.replace(
		/(<organizations[^>]*\sdefault=")(ORG_EN|ORG_FR)(")/,
		`$1${isFR ? "ORG_FR" : "ORG_EN"}$3`
	);

	// b) Organization <title> → language-specific title
	out = out.replace(
		/(<organization[^>]*>[\s\S]*?<title>)([\s\S]*?)(<\/title>)/,
		`$1${courseTitle}$3`
	);

	// c) First <item> <title> under that organization → same title
	out = out.replace(
		/(<item[^>]*>[\s\S]*?<title>)([\s\S]*?)(<\/title>)/,
		`$1${courseTitle}$3`
	);

	// d) Resource href -> entry file (index.html)
	out = out.replace(/(<resource[^>]*\bhref=")[^"]*(")/, `$1${entryFile}$2`);

	// e) Ensure a <file href="..."> exists for the entry file
	const fileTag = `<file href="${entryFile}"/>`;
	if (!new RegExp(`<file\\s+href="${entryFile}"\\s*/>`).test(out)) {
		out = out.replace(/(<resource[^>]*>)/, `$1\n      ${fileTag}`);
	}

	writeText(manifestPath, out);
})();

// 2) Update entry HTML lang + title
(function updateEntryHTML() {
	const html = readText(entryPath);
	if (!html) {
		console.warn(`⚠️ ${entryFile} not found in dist/`);
		return;
	}
	let out = html;

	// <html lang="en|fr"> (add if missing, replace if present)
	if (/\blang="(en|fr)"/i.test(out)) {
		out = out.replace(
			/<html[^>]*\blang="(en|fr)"/i,
			`<html lang="${isFR ? "fr" : "en"}"`
		);
	} else {
		out = out.replace(
			/<html([^>]*)>/i,
			`<html lang="${isFR ? "fr" : "en"}"$1>`
		);
	}

	// <title>…</title>
	out = out.replace(
		/<title>[\s\S]*?<\/title>/i,
		`<title>${courseTitle}</title>`
	);

	writeText(entryPath, out);
})();

console.log(
	`✅ Updated SCORM manifest & entry for "${BUILD_LANG}" — title: "${courseTitle}" | entry: ${entryFile}`
);
