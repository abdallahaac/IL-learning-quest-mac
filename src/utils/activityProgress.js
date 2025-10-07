// src/pages/utils/activityProgress.js
const EMPTY_HTML_RX = /^(?:\s|<br\s*\/?>|&nbsp;|<p>\s*<\/p>)*$/i;

function isNonEmptyStringLike(v) {
	if (typeof v !== "string") return false;
	const s = v.trim();
	if (!s) return false;
	if (s[0] === "<") {
		const stripped = s.replace(/<\/?p>|<br\s*\/?>/gi, "").trim();
		if (EMPTY_HTML_RX.test(stripped)) return false;
	}
	const noNbsp = s.replace(/&nbsp;/gi, "").trim();
	return noNbsp.length > 0;
}

export function hasNoteContent(val) {
	if (!val) return false;

	if (isNonEmptyStringLike(val)) return true;

	if (typeof val === "object") {
		if (isNonEmptyStringLike(val.text || "")) return true;

		if (
			Array.isArray(val.bullets) &&
			val.bullets.some((b) => isNonEmptyStringLike(String(b || "")))
		)
			return true;

		if (
			Array.isArray(val.cards) &&
			val.cards.some(
				(c) =>
					isNonEmptyStringLike(String(c?.front || "")) ||
					isNonEmptyStringLike(String(c?.back || ""))
			)
		)
			return true;

		if (Array.isArray(val.recipes) && val.recipes.length > 0) return true;

		return false;
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

export function hasActivityStarted(model, type = "notes") {
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
