// Utility functions shared across the recipe activity
// These helpers were originally defined inline in Activity03.jsx
// and have been extracted here to make the codebase more modular.

/**
 * Append an alpha channel to a hex colour. The `aa` argument should be a
 * two-character hex string representing the desired opacity.
 *
 * Example: `withAlpha("#b45309", "26")` → `#b4530926`
 */
export const withAlpha = (hex, aa) => `${hex}${aa}`;

/**
 * Normalise and format an ingredient into a single string. The input can be
 * either a plain string or an object with `item`, `qty` and `unit` fields.
 */
export const formatIngredient = (it) => {
	if (typeof it === "string") return it;
	if (!it || typeof it !== "object") return "";
	const qty = it.qty ? String(it.qty).trim() : "";
	const unit = it.unit || "";
	const name = it.item || "";
	return [qty, unit, name].filter(Boolean).join(" ");
};

/**
 * Turn an array of step strings into a numbered, newline-separated block of text.
 */
export const formatDirectionsText = (steps = []) =>
	steps.map((s, i) => `${i + 1}. ${s}`).join("\n");

/**
 * Human-friendly labels for the three recipe groups.
 * Accepts an optional `lang` parameter ('fr'|'en'), defaults to 'en'.
 * Falls back to the provided id if no match is found.
 */
export function labelForGroup(id, lang = "en") {
	const isFr =
		String(lang || "")
			.toLowerCase()
			.slice(0, 2) === "fr";
	switch (id) {
		case "firstNations":
			// Standard French label: "Premières Nations"
			return isFr ? "Premières Nations" : "First Nations";
		case "inuit":
			return isFr ? "Inuit" : "Inuit";
		case "metis":
			// Métis should keep accent in French
			return isFr ? "Métis" : "Métis";
		default:
			return id;
	}
}

/**
 * Sanitize a string for use as a filename by replacing non-alphanumeric
 * characters with underscores and truncating to a sensible length.
 */
export function safe(s) {
	return String(s)
		.replace(/[^\w\-]+/g, "_")
		.slice(0, 60);
}

/**
 * Initiate a download of plain text content in the browser. Creates a
 * temporary anchor element and cleans up afterwards. This utility is used
 * when exporting a single recipe as a `.txt` file.
 */
export function downloadBlob(text, filename) {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
