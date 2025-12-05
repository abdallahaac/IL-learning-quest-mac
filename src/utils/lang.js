// src/utils/lang.js

/**
 * Detect the page/lang setting in a consistent way.
 * Returns a 2-letter code like "en" or "fr".
 */
export function detectLang() {
	try {
		const qs = new URLSearchParams(window.location.search);
		const fromQuery = qs.get("lang");
		if (fromQuery) return fromQuery.toLowerCase().slice(0, 2);

		const html = document.documentElement?.getAttribute("lang");
		if (html) return html.toLowerCase().slice(0, 2);

		const nav =
			navigator?.language || (navigator?.languages && navigator.languages[0]);
		if (nav) return nav.toLowerCase().slice(0, 2);
	} catch (e) {
		// ignore and fall back
	}
	return "en";
}

/**
 * Shared helper for Word/Doc/Docx export filenames:
 * - "Activity-XX-..." in English
 * - "Activité-XX-..." in French (with accent)
 */
export function getActivityFilePrefix(langOverride) {
	const base = (langOverride || detectLang() || "en").toLowerCase();
	return base.startsWith("fr") ? "Activité" : "Activity";
}
