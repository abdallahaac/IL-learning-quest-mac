// NEW helpers
const EMPTY_HTML_RX = /^(?:\s|<br\s*\/?>|&nbsp;|<p>\s*<\/p>)*$/i;

function isNonEmptyStringLike(v) {
	if (typeof v !== "string") return false;
	const s = v.trim();
	if (!s) return false;
	// treat quill/rtf-ish or html wrappers with no real text as empty
	if (
		s[0] === "<" &&
		EMPTY_HTML_RX.test(s.replace(/<\/?p>|<br\s*\/?>/gi, "").trim())
	) {
		return false;
	}
	// collapse &nbsp; too
	const noNbsp = s.replace(/&nbsp;/gi, "").trim();
	return noNbsp.length > 0;
}

function arrayHasMeaningful(arr, depth = 0) {
	if (!Array.isArray(arr) || !arr.length) return false;
	return arr.some((item) => hasMeaningfulValue(item, depth + 1));
}

function objectHasMeaningful(obj, depth = 0) {
	if (!obj || typeof obj !== "object") return false;
	// guard against runaway recursion
	if (depth > 4) return false;
	return Object.values(obj).some((v) => hasMeaningfulValue(v, depth + 1));
}

function hasMeaningfulValue(v, depth = 0) {
	if (isNonEmptyStringLike(v)) return true;
	if (Array.isArray(v)) return arrayHasMeaningful(v, depth + 1);
	if (v && typeof v === "object") return objectHasMeaningful(v, depth + 1);
	return false;
}

// UPDATED: strict, value-only checks
export function hasNoteContent(val) {
	if (!val) return false;

	// plain string notes
	if (isNonEmptyStringLike(val)) return true;

	// structured models
	if (typeof val === "object") {
		// Rich text
		if (isNonEmptyStringLike(val.text)) return true;

		// Bullets
		if (
			Array.isArray(val.bullets) &&
			val.bullets.some((b) => isNonEmptyStringLike(String(b)))
		)
			return true;

		// Cards
		if (
			Array.isArray(val.cards) &&
			val.cards.some(
				(c) =>
					isNonEmptyStringLike(String(c?.front || "")) ||
					isNonEmptyStringLike(String(c?.back || ""))
			)
		)
			return true;

		// Recipes
		if (Array.isArray(val.recipes) && val.recipes.length > 0) return true;

		// Fallback: look through *values* only (not keys)
		return objectHasMeaningful(val);
	}

	return false;
}

export function hasCardsStarted(model) {
	const cards = Array.isArray(model?.cards) ? model.cards : [];
	return cards.some(
		(c) =>
			isNonEmptyStringLike(String(c?.front || "")) ||
			isNonEmptyStringLike(String(c?.back || ""))
	);
}

export function hasRecipesStarted(model) {
	return Array.isArray(model?.recipes) && model.recipes.length > 0;
}

export function hasActivityStarted(model, type) {
	switch (type) {
		case "notes":
			return hasNoteContent(model);
		case "cards":
			return hasCardsStarted(model);
		case "recipes":
			return hasRecipesStarted(model);
		default:
			if (Array.isArray(model?.cards)) return hasCardsStarted(model);
			if (Array.isArray(model?.recipes)) return hasRecipesStarted(model);
			return hasNoteContent(model);
	}
}
