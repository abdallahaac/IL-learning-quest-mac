// Single source of truth for activity accent colors + helpers
export const ACTIVITY_ACCENTS = {
	1: "#2563EB",
	2: "#047857",
	3: "#B45309",
	4: "#4338CA",
	5: "#BE123C",
	6: "#0891B2",
	7: "#0D9488",
	8: "#E11D48",
	9: "#934D6C",
	10: "#DB5A42",
};

export const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};

export const accentForActivityIndex = (idx /* 0-based */) =>
	normalizeHex(ACTIVITY_ACCENTS[idx + 1]) || "#67AAF9";
