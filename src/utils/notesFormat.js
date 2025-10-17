// src/utils/notesFormat.js
// Utilities to check and render saved notes to HTML for downloads / previews.
// Exports named functions: hasNoteContent, formatNoteHtml

function escapeHtml(s = "") {
	return String(s)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Return true when the note has visible content we can render.
 * Accepts:
 * - string (plain text)
 * - { html: "<p>...</p>" }
 * - { text: "..." }
 * - null/undefined/empty -> false
 */
export function hasNoteContent(note) {
	if (!note) return false;
	if (typeof note === "string") return note.trim().length > 0;
	if (typeof note === "object") {
		if (typeof note.html === "string" && note.html.trim().length > 0)
			return true;
		if (typeof note.text === "string" && note.text.trim().length > 0)
			return true;
		// if note might be a Quill delta-like object, check for ops
		if (Array.isArray(note.ops) && note.ops.length > 0) return true;
	}
	return false;
}

/**
 * Render a note into HTML. Prefer preformatted HTML if provided;
 * otherwise convert plain text safely into <p> blocks, preserving newlines.
 *
 * Note: this is intentionally conservative and doesn't attempt to
 * convert Quill delta -> HTML. If you store Quill deltas and want
 * rich rendering, plug in a proper converter (quill-delta-to-html).
 */
export function formatNoteHtml(note) {
	if (!note) return "<p><em>No content</em></p>";

	// If the caller provided pre-rendered HTML, assume it's safe (it usually is),
	// but still coerce to string.
	if (typeof note === "object" && typeof note.html === "string") {
		return String(note.html || "").trim() || "<p><em>No content</em></p>";
	}

	// If note is a string, escape and preserve line breaks
	if (typeof note === "string") {
		const trimmed = note.trim();
		if (!trimmed) return "<p><em>No content</em></p>";
		// split into paragraphs on double newlines, single newline -> <br>
		const paras = trimmed
			.split(/\n{2,}/)
			.map((p) => "<p>" + escapeHtml(p).replace(/\n/g, "<br>") + "</p>")
			.join("\n");
		return paras;
	}

	// If note object has plain text
	if (typeof note === "object" && typeof note.text === "string") {
		const txt = note.text.trim();
		if (!txt) return "<p><em>No content</em></p>";
		const paras = txt
			.split(/\n{2,}/)
			.map((p) => "<p>" + escapeHtml(p).replace(/\n/g, "<br>") + "</p>")
			.join("\n");
		return paras;
	}

	// If it's a Quill delta-like object with ops, try a naive conversion:
	if (typeof note === "object" && Array.isArray(note.ops)) {
		// naive: join insert values, preserve newlines -> paragraphs
		const text = note.ops
			.map((op) => {
				if (typeof op.insert === "string") return op.insert;
				return "";
			})
			.join("");
		const t = text.trim();
		if (!t) return "<p><em>No content</em></p>";
		return t
			.split(/\n{2,}/)
			.map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
			.join("\n");
	}

	// fallback
	return "<p><em>No content</em></p>";
}
