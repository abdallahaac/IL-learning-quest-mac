// set-manifest-default.js
// Post-build step: adjust imsmanifest default org, titles, resource href,
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

// We’ll support both index.html (EN) and index_fr.html (FR)
const entryEn = "index.html";
const entryFr = "index_fr.html";
const entryPath = path.join(distDir, isFR ? entryFr : entryEn);

// Course Titles
const TITLE_EN = "Learning Quest on Indigenous Cultures";
const TITLE_FR = "Parcours d’apprentissage sur les cultures autochtones";

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

	// a) Ensure <organizations default="..."> points at an existing org.
	//    If your org IDs are fixed (e.g., ORGC256PESLE), we keep them.
	//    Otherwise, if you use ORG_EN/ORG_FR, we switch between them.
	//    We'll try both patterns safely.

	// Pattern 1: ORG_EN / ORG_FR style
	out = out.replace(
		/(<organizations[^>]*\sdefault=")(ORG_EN|ORG_FR)(")/,
		`$1${isFR ? "ORG_FR" : "ORG_EN"}$3`
	);

	// Pattern 2: preserve a fixed default (like ORGC256PESLE) if present — no change needed.
	// (No-op if not matching Pattern 1—keeps your existing default identifier.)

	// b) Organization and item titles -> set to our bilingual course title
	const title = isFR ? TITLE_FR : TITLE_EN;

	// Replace any <organization> <title> ... </title>
	out = out.replace(
		/(<organization[^>]*>\s*<!--[\s\S]*?-->\s*)?<title>[\s\S]*?<\/title>/,
		(m) => m.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
	);

	// Replace first <item> <title> ... </title> under that organization
	out = out.replace(
		/(<item[^>]*>\s*)<title>[\s\S]*?<\/title>/,
		`$1<title>${title}</title>`
	);

	// c) Resource href -> index.html (EN) or index_fr.html (FR)
	out = out.replace(
		/(<resource[^>]*\bhref=")[^"]*(")/,
		`$1${isFR ? entryFr : entryEn}$2`
	);

	// d) Ensure the <file href="..."> includes the selected entry file
	//    If there is a <file href="index.html"/>, keep it AND also ensure the FR file exists in output folder,
	//    but we won’t touch file list aggressively; we at least ensure our chosen one is listed.
	if (
		!new RegExp(`<file\\s+href="${isFR ? entryFr : entryEn}"\\s*/>`).test(out)
	) {
		// insert right after the first <resource> opening tag
		out = out.replace(
			/(<resource[^>]*>)/,
			`$1\n      <file href="${isFR ? entryFr : entryEn}"/>`
		);
	}

	writeText(manifestPath, out);
})();

// 2) Update entry HTML lang + title
(function updateEntryHTML() {
	const html = readText(entryPath);
	if (!html) {
		console.warn(`⚠️ ${isFR ? entryFr : entryEn} not found in dist/`);
		return;
	}
	let out = html;

	// <html lang="en|fr">
	out = out.replace(
		/<html[^>]*\blang="(en|fr)"/i,
		`<html lang="${isFR ? "fr" : "en"}"`
	);

	// <title>…</title>
	out = out.replace(
		/<title>[\s\S]*?<\/title>/i,
		`<title>${isFR ? TITLE_FR : TITLE_EN}</title>`
	);

	writeText(entryPath, out);
})();

console.log(
	`✅ Updated SCORM manifest & entry for "${BUILD_LANG}" — title: ${
		isFR ? TITLE_FR : TITLE_EN
	} | entry: ${isFR ? entryFr : entryEn}`
);
