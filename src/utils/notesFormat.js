import { looksLikeHtml, sanitizeBasic } from "./htmlSanitize.js";

// Shared source of truth for "does this note contain meaningful content?"
export const hasNoteContent = (val) => {
	if (!val) return false;
	if (typeof val === "string") return val.trim().length > 0;
	if (typeof val === "object") {
		if (typeof val.text === "string" && val.text.trim()) return true;
		if (Array.isArray(val.bullets) && val.bullets.some(Boolean)) return true;
		if (Array.isArray(val.cards) && val.cards.some((c) => c?.front || c?.back))
			return true;
		if (Array.isArray(val.recipes) && val.recipes.length > 0) return true; // Activity 3 model
		const squished = JSON.stringify(val).replace(/[\s{}\[\]":,]/g, "");
		return squished.length > 0;
	}
	return false;
};

// Shared note formatter (HTML) for exports
export const formatNoteHtml = (val) => {
	if (!val) return "";
	const escape = (s = "") =>
		String(s)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");

	// Plain-string notes
	if (typeof val === "string") {
		const s = val.trim();
		return looksLikeHtml(s)
			? sanitizeBasic(s)
			: `<p>${escape(s).replace(/\n/g, "<br/>")}</p>`;
	}

	const parts = [];

	// Quill HTML body
	if (val.text) {
		const s = String(val.text);
		parts.push(
			looksLikeHtml(s)
				? sanitizeBasic(s)
				: `<p>${escape(s).replace(/\n/g, "<br/>")}</p>`
		);
	}

	// Bullets
	if (Array.isArray(val.bullets) && val.bullets.length) {
		parts.push(
			`<ul>${val.bullets
				.filter(Boolean)
				.map((b) => `<li>${escape(String(b))}</li>`)
				.join("")}</ul>`
		);
	}

	// Flashcards
	if (Array.isArray(val.cards) && val.cards.length) {
		const rows = val.cards
			.map(
				(c) =>
					`<tr><td>${escape(String(c?.front || ""))}</td><td>${escape(
						String(c?.back || "")
					)}</td></tr>`
			)
			.join("");
		parts.push(
			`<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;margin:6pt 0;">
         <thead><tr><th>Front</th><th>Back</th></tr></thead><tbody>${rows}</tbody>
       </table>`
		);
	}

	// Activity 3 recipes
	if (Array.isArray(val.recipes) && val.recipes.length) {
		const groupLabel = (id) =>
			id === "firstNations"
				? "First Nations"
				: id === "inuit"
				? "Inuit"
				: id === "metis"
				? "Métis"
				: String(id || "");
		const blocks = val.recipes
			.map((r) => {
				const title = escape(r?.name || "Untitled recipe");
				const group = escape(groupLabel(r?.group));
				const when = r?.createdAt ? new Date(r.createdAt).toLocaleString() : "";
				const ings = (Array.isArray(r?.ingredients) ? r.ingredients : [])
					.map((it) => `<li>${escape(String(it))}</li>`)
					.join("");
				return `
          <h3 style="font-size:12pt; margin:10pt 0 4pt;">${title}</h3>
          <p style="margin:0 0 6pt; color:#6B7280;">${group}${
					when ? " • " + escape(when) : ""
				}</p>
          <ul style="margin:0 0 10pt 18pt;">${ings}</ul>
        `;
			})
			.join("");
		parts.push(blocks);
	}

	return parts.join("") || `<p><em>No reflection saved.</em></p>`;
};
