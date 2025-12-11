// set-manifest-default.js
// Post-build step: adjust imsmanifest titles, resource href,
// and index.html <html lang>/<title> based on BUILD_LANG.

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

// Course titles
const TITLE_EN = "Learning Quest on Indigenous Cultures";
const TITLE_FR = "Quête d’apprentissage sur les cultures autochtones";
const courseTitle = isFR ? TITLE_FR : TITLE_EN;
const langCode = isFR ? "fr" : "en";

// Utility: safe read/write
const readText = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
const writeText = (p, s) => fs.writeFileSync(p, s, "utf8");

// ---- Manifest updater ----
function updateManifestAt(manifestPath) {
	const xml = readText(manifestPath);
	if (!xml) return false;

	let out = xml;

	// <organization> <title> → language-specific title
	out = out.replace(
		/(<organization[^>]*>\s*(?:<!--[\s\S]*?-->\s*)*?<title>)([\s\S]*?)(<\/title>)/,
		`$1${courseTitle}$3`
	);

	// First <item> <title> under that organization → same title
	out = out.replace(
		/(<item[^>]*>\s*(?:<!--[\s\S]*?-->\s*)*?<title>)([\s\S]*?)(<\/title>)/,
		`$1${courseTitle}$3`
	);

	// Ensure resource href points to index.html
	out = out.replace(/(<resource[^>]*\bhref=")[^"]*(")/, `$1index.html$2`);

	// Ensure a <file href="index.html"/> exists
	const fileTag = `<file href="index.html"/>`;
	if (!new RegExp(`<file\\s+href="index\\.html"\\s*/>`).test(out)) {
		out = out.replace(/(<resource[^>]*>)/, `$1\n      ${fileTag}`);
	}

	writeText(manifestPath, out);
	console.log(`✅ Updated manifest: ${manifestPath} — title "${courseTitle}"`);
	return true;
}

// ---- HTML updater ----
function updateHtmlAt(htmlPath) {
	const html = readText(htmlPath);
	if (!html) return false;

	let out = html;

	// <html lang="en|fr"> (add if missing, replace if present)
	if (/\blang="(en|fr)"/i.test(out)) {
		out = out.replace(
			/<html([^>]*\blang=")(en|fr)(")([^>]*)>/i,
			`<html$1${langCode}$3$4>`
		);
	} else {
		// no lang attribute: insert one
		out = out.replace(/<html([^>]*)>/i, `<html lang="${langCode}"$1>`);
	}

	// <title>…</title> → language-specific course title
	out = out.replace(
		/<title>[\s\S]*?<\/title>/i,
		`<title>${courseTitle}</title>`
	);

	writeText(htmlPath, out);
	console.log(
		`✅ Updated HTML: ${htmlPath} — lang="${langCode}", title="${courseTitle}"`
	);
	return true;
}

// ---- Apply to all relevant locations ----

// Manifests we care about
const manifestCandidates = [
	path.join(__dirname, "dist", "imsmanifest.xml"),
	path.join(__dirname, "public", "imsmanifest.xml"),
];

// HTML entry files we care about
const htmlCandidates = [
	path.join(__dirname, "dist", "index.html"),
	path.join(__dirname, "public", "index.html"),
	path.join(__dirname, "index.html"), // root, in case Vite uses this
];

let touchedAnyManifest = false;
for (const p of manifestCandidates) {
	if (updateManifestAt(p)) {
		touchedAnyManifest = true;
	}
}
if (!touchedAnyManifest) {
	console.warn("⚠️ No imsmanifest.xml found in dist/ or public/");
}

let touchedAnyHtml = false;
for (const p of htmlCandidates) {
	if (updateHtmlAt(p)) {
		touchedAnyHtml = true;
	}
}
if (!touchedAnyHtml) {
	console.warn("⚠️ No index.html found in dist/, public/, or project root");
}

console.log(
	`🎯 Completed manifest + HTML updates for BUILD_LANG="${BUILD_LANG}" (${langCode})`
);
