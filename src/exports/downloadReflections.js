// src/exports/downloadReflections.js
import { hasNoteContent, formatNoteHtml } from "../utils/notesFormat.js";
import {
	ACTIVITIES_CONTENT,
	TEAM_CONTENT,
	TEAM_CONTENT_FR,
	UI_STRINGS,
} from "../constants/content.js";

const baseCss = `
  body { font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #0b1220; }
  h1 { font-size: 18pt; margin: 0 0 10pt; }
  h2 { font-size: 14pt; margin: 14pt 0 6pt; color: #0b1220; }
  h3 { font-size: 12pt; margin: 10pt 0 4pt; color: #0b1220; }
  p { margin: 0 0 10pt; white-space: pre-wrap; }
  ul, ol { margin: 0 0 12pt 22pt; }
  li { margin: 0 0 6pt; }
  table { border-collapse: collapse; width: auto; margin: 4pt 0 10pt; }
  th, td { vertical-align: top; border: 1px solid #cbd5e1; padding: 4pt 6pt; }
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-justify { text-align: justify; }
  .ql-indent-1 { margin-left: 2em; }
  .ql-indent-2 { margin-left: 4em; }
  .ql-indent-3 { margin-left: 6em; }
  .ql-indent-4 { margin-left: 8em; }
`;

// ------------- lang + utils -------------
function detectLang() {
	try {
		const qs = new URLSearchParams(window.location.search);
		if (qs.get("lang")) return qs.get("lang").toLowerCase().slice(0, 2);
		const html = document.documentElement?.getAttribute("lang");
		if (html) return html.toLowerCase().slice(0, 2);
		const nav = navigator?.language || navigator?.languages?.[0];
		if (nav) return nav.toLowerCase().slice(0, 2);
	} catch {}
	return "en";
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

// Decode basic entities so "&lt;p&gt;" becomes "<p>"
function decodeEntities(s) {
	try {
		const ta = document.createElement("textarea");
		ta.innerHTML = String(s);
		return ta.value;
	} catch {
		return String(s)
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'");
	}
}

// Collapse any HTML-ish string into clean paragraphs
function htmlStringToParagraphs(htmlish) {
	if (!htmlish) return "";
	let s = decodeEntities(String(htmlish));
	s = s
		.replace(/<\/p\s*>/gi, "\n\n")
		.replace(/<\s*br\s*\/?>/gi, "\n")
		.replace(/<\/li\s*>/gi, "\n")
		.replace(/<\/h[1-6]\s*>/gi, "\n\n");
	s = s.replace(/<[^>]+>/g, "");
	s = s.replace(/[ \t]+\n/g, "\n").trim();
	const parts = s
		.split(/\n{2,}/)
		.map((x) => x.trim())
		.filter(Boolean);
	if (!parts.length) return "";
	return parts.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}

// Try multiple keys to find a note object for a given activity
function getNoteFor(notes, id, number) {
	if (!notes) return undefined;
	const n = Number(number);
	const num2 = Number.isFinite(n) ? String(n) : null;
	const num2p = Number.isFinite(n) ? String(n).padStart(2, "0") : null;

	const candidates = [
		id,
		String(id || "").toLowerCase(),
		// common aliases
		num2 ? `a${num2}` : null,
		num2p ? `a${num2p}` : null,
		num2 ? `activity${num2}` : null,
		num2p ? `activity${num2p}` : null,
		// sometimes content keys look like "a7"
		num2 ? `A${num2}` : null,
		num2p ? `A${num2p}` : null,
	].filter(Boolean);

	for (const k of candidates) {
		if (k in notes) return notes[k];
	}
	// last chance: direct id if we didn't hit "in" but value exists
	return notes[id];
}

// ------------- special renderers for activity-specific models -------------

// Activity 03: recipes model { recipes: [{name, ingredients:[{qty,unit,item}], directions:[...]}] }
function renderActivity03(note, lang) {
	const recipes = Array.isArray(note?.recipes) ? note.recipes : [];
	if (!recipes.length) return null;

	const L = {
		recipe: lang === "fr" ? "Recette" : "Recipe",
		ingredients: lang === "fr" ? "Ingrédients" : "Ingredients",
		steps: lang === "fr" ? "Étapes" : "Steps",
	};

	const blocks = recipes.map((r, i) => {
		const name = escapeHtml(r?.name || `${L.recipe} ${i + 1}`);
		const ings = Array.isArray(r?.ingredients) ? r.ingredients : [];
		const dirs = Array.isArray(r?.directions) ? r.directions : [];

		const ingList = ings
			.map((it) => {
				const qty = [it?.qty, it?.unit].filter(Boolean).join(" ");
				const item = it?.item || "";
				const line = [qty, item].filter(Boolean).join(" ").trim();
				return line ? `<li>${escapeHtml(line)}</li>` : "";
			})
			.filter(Boolean)
			.join("");

		const dirList = dirs
			.map((step) =>
				step && String(step).trim() ? `<li>${escapeHtml(step)}</li>` : ""
			)
			.filter(Boolean)
			.join("");

		return `
      <h3>${name}</h3>
      ${
				ingList
					? `<p><strong>${L.ingredients}</strong></p><ul>${ingList}</ul>`
					: ""
			}
      ${dirList ? `<p><strong>${L.steps}</strong></p><ol>${dirList}</ol>` : ""}
    `;
	});

	return blocks.join("\n");
}

// Activity 07: cards/bullets/text model { text, bullets:[], cards:[{front,back}] }
function renderActivity07(note, lang) {
	const text = note?.text ? String(note.text) : "";
	const bullets = Array.isArray(note?.bullets)
		? note.bullets.filter(Boolean)
		: [];
	const cards = Array.isArray(note?.cards)
		? note.cards.filter((c) => c?.front?.trim() || c?.back?.trim())
		: [];

	if (!text && !bullets.length && !cards.length) return null;

	const L = {
		saved: lang === "fr" ? "Réponse enregistrée" : "Saved response",
		points: lang === "fr" ? "Points clés" : "Bullet points",
		words: lang === "fr" ? "Cartes-mots" : "Word cards",
		word: lang === "fr" ? "Mot" : "Word",
		meaning: lang === "fr" ? "Sens" : "Meaning",
	};

	const parts = [];
	if (text.trim()) {
		const paras = htmlStringToParagraphs(text);
		parts.push(`<h3>${escapeHtml(L.saved)}</h3>`, paras);
	}

	if (bullets.length) {
		const li = bullets.map((b) => `<li>${escapeHtml(String(b))}</li>`).join("");
		parts.push(`<h3>${escapeHtml(L.points)}</h3>`, `<ul>${li}</ul>`);
	}

	if (cards.length) {
		const rows = cards
			.map(
				(c) =>
					`<tr><td>${escapeHtml(c.front || "")}</td><td>${escapeHtml(
						c.back || ""
					)}</td></tr>`
			)
			.join("");
		parts.push(
			`<h3>${escapeHtml(L.words)}</h3>`,
			`<table><thead><tr><th>${escapeHtml(L.word)}</th><th>${escapeHtml(
				L.meaning
			)}</th></tr></thead><tbody>${rows}</tbody></table>`
		);
	}

	return parts.join("\n");
}

// ------------- generic note normalization -------------
function noteToHtmlGeneric(note, lang) {
	if (!hasNoteContent(note)) {
		return lang === "fr"
			? `<p><em>Aucune réflexion enregistrée.</em></p>`
			: `<p><em>No reflection saved.</em></p>`;
	}

	// Quill/delta-like → to HTML via formatter, then flatten to paragraphs
	if (
		note?.ops ||
		note?.delta ||
		Array.isArray(note?.insert) ||
		Array.isArray(note?.ops)
	) {
		try {
			const html = formatNoteHtml(note);
			const safe = htmlStringToParagraphs(html);
			if (safe) return safe;
		} catch {
			// fall through
		}
	}

	// Object with text field
	if (typeof note === "object" && typeof note.text === "string") {
		const safe = htmlStringToParagraphs(note.text);
		return (
			safe ||
			(lang === "fr"
				? `<p><em>Aucune réflexion enregistrée.</em></p>`
				: `<p><em>No reflection saved.</em></p>`)
		);
	}

	// STRING: always normalize (handles plain text, raw HTML, entity-escaped HTML)
	if (typeof note === "string") {
		const safe = htmlStringToParagraphs(note);
		return (
			safe ||
			(lang === "fr"
				? `<p><em>Aucune réflexion enregistrée.</em></p>`
				: `<p><em>No reflection saved.</em></p>`)
		);
	}

	// Fallback
	return lang === "fr"
		? `<p><em>Aucune réflexion enregistrée.</em></p>`
		: `<p><em>No reflection saved.</em></p>`;
}

// route by activity number to special renderers where applicable
function noteToHtmlByActivity(note, lang, number) {
	const n = Number(number);
	// A3 custom renderer
	if (n === 3) {
		const r = renderActivity03(note, lang);
		if (r) return r;
	}
	// A7 custom renderer
	if (n === 7) {
		const r = renderActivity07(note, lang);
		if (r) return r;
	}
	// fallback to generic normalization
	return noteToHtmlGeneric(note, lang);
}

// localized activity title from constants with fallback
function resolveActivityTitle(id, fallbackTitle, lang) {
	const pack = ACTIVITIES_CONTENT?.[id];
	if (!pack) return fallbackTitle || "";
	const node = lang === "fr" ? pack.fr || pack.en : pack.en || pack.fr;
	return node?.title || fallbackTitle || "";
}

/**
 * Export reflections to a Word-compatible HTML .doc, FR/EN aware.
 *
 * @param {{
 *  activityMeta: Array<{id:string,title?:string,number?:number}>,
 *  notes: Record<string, any>,
 *  fileName?: string,
 *  docTitle?: string,
 *  includeTeam?: boolean,
 *  includeOptionalReflection?: boolean,
 *  locale?: 'en'|'fr'
 * }} params
 */
export function downloadAllReflections({
	activityMeta,
	notes,
	fileName,
	docTitle,
	includeTeam = true,
	includeOptionalReflection = true,
	locale,
}) {
	const lang = (locale || detectLang()) === "fr" ? "fr" : "en";

	const STR = {
		docTitle: docTitle || (lang === "fr" ? "Mes réflexions" : "My Reflections"),
		defaultFile:
			fileName || (lang === "fr" ? "mes-reflexions.doc" : "my-reflections.doc"),
		activityLabel: lang === "fr" ? "Activité" : "Activity",
		teamTitle:
			lang === "fr"
				? TEAM_CONTENT_FR?.title || "Réunion d’équipe"
				: TEAM_CONTENT?.title || "Team Reflection",
		optionalReflectionTitle:
			UI_STRINGS?.[lang]?.toc?.reflection ||
			(lang === "fr" ? "Question de réflexion facultative" : "Reflection"),
		exportedPrefix: lang === "fr" ? "Exporté le" : "Exported",
	};

	const sections = [];

	// Activities
	activityMeta.forEach(({ number, title, id }) => {
		const localizedTitle = resolveActivityTitle(id, title, lang);
		const note = getNoteFor(notes, id, number);
		const body = noteToHtmlByActivity(note, lang, number);
		const num = Number(number) || "";
		sections.push(`
      <h2 style="font-size:14pt; margin:14pt 0 6pt;">${
				STR.activityLabel
			} ${num}: ${escapeHtml(localizedTitle)}</h2>
      ${body}
    `);
	});

	// Team Reflection
	if (includeTeam) {
		sections.push(`
      <h2 style="font-size:14pt; margin:14pt 0 6pt;">${escapeHtml(
				STR.teamTitle
			)}</h2>
      ${noteToHtmlGeneric(notes?.team, lang)}
    `);
	}

	// Optional Reflection
	if (includeOptionalReflection && "reflect" in (notes || {})) {
		sections.push(`
      <h2 style="font-size:14pt; margin:14pt 0 6pt;">${escapeHtml(
				STR.optionalReflectionTitle
			)}</h2>
      ${noteToHtmlGeneric(notes?.reflect, lang)}
    `);
	}

	const today = new Date().toLocaleDateString(
		lang === "fr" ? "fr-CA" : "en-CA"
	);
	const header = `
    <h1>${escapeHtml(STR.docTitle)}</h1>
    <p style="margin: 0 0 14pt; color:#475569;"><em>${
			STR.exportedPrefix
		} ${today}</em></p>
  `;

	// Office-friendly wrapper encourages Word to render nicely
	const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(STR.docTitle)}</title>
        <style>${baseCss}</style>
        <!--[if gte mso 9]><xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml><![endif]-->
      </head>
      <body>
        ${header}
        ${sections.join("\n")}
      </body>
    </html>
  `.trim();

	const blob = new Blob([html], { type: "application/msword" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = STR.defaultFile;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
