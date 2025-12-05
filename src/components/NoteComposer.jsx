import React from "react";
import { motion } from "framer-motion";
import Quill from "quill"; // v2
import "quill/dist/quill.snow.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* ---------- small utils ---------- */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const hexToRgb = (hex) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
};
const shadeHex = (hex, amt) => {
	const { r, g, b } = hexToRgb(hex);
	const t = amt < 0 ? 0 : 255;
	const p = Math.abs(amt);
	const to2 = (n) => n.toString(16).padStart(2, "0");
	return `#${to2(Math.round((t - r) * p + r))}${to2(
		Math.round((t - g) * p + g)
	)}${to2(Math.round((t - b) * p + b))}`;
};

// Force heading color inline for Word (.doc) export
const colorizeHeadings = (html, hex) => {
	if (!hex) return html || "";
	return (html || "").replace(
		/<h([1-3])(\b[^>]*)?>/gi,
		(m, lvl, attrs = "") => {
			const hasColor = /style\s*=\s*["'][^"']*color\s*:/i.test(attrs);
			if (hasColor) return m;
			const styleAttr = /style\s*=\s*["'][^"']*["']/i.test(attrs)
				? attrs.replace(
						/style\s*=\s*["']([^"']*)["']/i,
						(sm, val) => `style="${val}; color: ${hex}"`
				  )
				: `${attrs} style="color: ${hex}"`;
			return `<h${lvl}${styleAttr}>`;
		}
	);
};

/* ---------- Quill modules (preserve selection + select-all) ---------- */
const makeQuillModules = (toolbarEl, savedRangeRef, onUndo, onRedo) => ({
	toolbar: {
		container: toolbarEl,
		handlers: {
			_restoreSel(q) {
				const r = savedRangeRef.current || q.getSelection();
				if (!r) return null;
				q.setSelection(r.index, r.length, "silent");
				return r;
			},
			_reselect(q, r) {
				if (!r) return;
				q.setSelection(r.index, r.length, "silent");
			},

			header(value) {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				const v =
					value === false || value === "false" || value === "" ? false : value;
				q.formatLine(r.index, Math.max(1, r.length), "header", v, "user");
				this.handlers._reselect(q, r);
			},

			bold() {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				const cur = q.getFormat(r.index, r.length).bold;
				q.format("bold", !cur, "user");
				this.handlers._reselect(q, r);
			},
			italic() {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				const cur = q.getFormat(r.index, r.length).italic;
				q.format("italic", !cur, "user");
				this.handlers._reselect(q, r);
			},
			underline() {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				const cur = q.getFormat(r.index, r.length).underline;
				q.format("underline", !cur, "user");
				this.handlers._reselect(q, r);
			},
			strike() {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				const cur = q.getFormat(r.index, r.length).strike;
				q.format("strike", !cur, "user");
				this.handlers._reselect(q, r);
			},

			list(value) {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				const cur = q.getFormat(r.index, r.length).list;
				const next = cur === value ? false : value;
				q.format("list", next, "user");
				this.handlers._reselect(q, r);
			},

			indent(value) {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				q.format("indent", value, "user");
				this.handlers._reselect(q, r);
			},

			align(value) {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				q.format("align", value || false, "user");
				this.handlers._reselect(q, r);
			},
			color(value) {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				q.format("color", value || false, "user");
				this.handlers._reselect(q, r);
			},
			background(value) {
				const q = this.quill;
				const r = this.handlers._restoreSel.call(this, q);
				if (!r) return;
				q.format("background", value || false, "user");
				this.handlers._reselect(q, r);
			},

			undo: onUndo,
			redo: onRedo,

			// Select all
			selectall() {
				const q = this.quill;
				const len = Math.max(0, (q.getLength?.() ?? 0) - 1);
				q.setSelection(0, len, "silent");
				if (savedRangeRef) savedRangeRef.current = { index: 0, length: len };
			},
		},
	},
	clipboard: { matchVisual: false },
	keyboard: {
		bindings: {
			link: { key: "K", shortKey: true, handler: () => false },
			undo: {
				key: "Z",
				shortKey: true,
				handler() {
					onUndo?.();
					return false;
				},
			},
			redoShiftZ: {
				key: "Z",
				shortKey: true,
				shiftKey: true,
				handler() {
					onRedo?.();
					return false;
				},
			},
			redoCtrlY: {
				key: "Y",
				shortKey: true,
				handler() {
					onRedo?.();
					return false;
				},
			},
			indent: {
				key: 9,
				handler(range, ctx) {
					if (ctx && (ctx.format.list || ctx.format.indent >= 0)) {
						this.quill.format("indent", "+1", "user");
						return false;
					}
					return true;
				},
			},
			outdent: {
				key: 9,
				shiftKey: true,
				handler(range, ctx) {
					if (ctx && (ctx.format.list || ctx.format.indent >= 0)) {
						this.quill.format("indent", "-1", "user");
						return false;
					}
					return true;
				},
			},
		},
	},
	history: { delay: 300, maxStack: 200, userOnly: true },
});

const QUILL_FORMATS = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"indent",
	"align",
	"color",
	"background",
];

/* ---------- i18n defaults for exports ---------- */
const DEFAULT_LOCALE_STRINGS = {
	en: {
		activityTipHeading: "Activity tip",
		savedReflectionsHeading: "Saved reflections",
		resourcesHeading: "Resources",
		downloadButton: "Download (.doc)",
		downloading: "Downloading...",
		generatedBy: "Generated by Learning Quest",
	},
	fr: {
		activityTipHeading: "Conseil d’activité",
		savedReflectionsHeading: "Réflexions enregistrées",
		resourcesHeading: "Ressources",
		downloadButton: "Télécharger (.doc)",
		downloading: "Téléchargement...",
		generatedBy: "Généré par la Quête d’apprentissage",
	},
};

/* ---------- helper to detect browser / document language ---------- */
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

/* ---------- PUBLIC EXPORT: decoupled downloader (now supports locale) ---------- */
export function downloadNotesAsWord({
	html = "",
	downloadFileName = "Reflection.doc",
	docTitle = "Activity",
	docSubtitle,
	activityNumber,
	docIntro,
	includeLinks = false,
	linksHeading,
	pageLinks = [],
	headingColor = "#0b1220",
	accent,
	locale,
	localeStrings,
}) {
	const resolvedLocale = (locale || detectLang() || "en").startsWith("fr")
		? "fr"
		: "en";
	const L = {
		...DEFAULT_LOCALE_STRINGS.en,
		...DEFAULT_LOCALE_STRINGS[resolvedLocale],
		...(localeStrings || {}),
	};

	const normalizeHexLocal = (h) => {
		if (!h) return null;
		let s = String(h).trim();
		if (s[0] !== "#") s = `#${s}`;
		return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
	};

	const safeTitle =
		typeof activityNumber === "number"
			? `${
					resolvedLocale === "fr" ? "Activité" : "Activity"
			  } ${activityNumber}: ${docTitle}`
			: docTitle;

	const exportHeadingColor =
		normalizeHexLocal(headingColor) || normalizeHexLocal(accent) || "#2563EB";

	const docCss = `
    body { background: #ffffff; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #0b1220; }
    h1, h2, h3 { margin: 0 0 8pt; }
    h1 { font-size: 20pt; }
    h2 { font-size: 14pt; }
    h3 { font-size: 12pt; }
    p { margin: 0 0 10pt; white-space: pre-wrap; }
    ul, ol { margin: 0 0 12pt 22pt; }
    li { margin: 0 0 6pt; }
    a { color: ${exportHeadingColor}; text-decoration: underline; }

    .ql-editor h1 { font-size: 20pt; }
    .ql-editor h2 { font-size: 14pt; }
    .ql-editor h3 { font-size: 12pt; }
    .ql-align-center { text-align: center; }
    .ql-align-right { text-align: right; }
    .ql-align-justify { text-align: justify; }
    .ql-indent-1 { margin-left: 2em; }
    .ql-indent-2 { margin-left: 4em; }
    .ql-indent-3 { margin-left: 6em; }
    .ql-indent-4 { margin-left: 8em; }

    .cover { margin-bottom: 12pt; }
    .section { margin: 14pt 0; }
    .small-label { font-size: 10pt; color: #475569; margin-bottom: 4pt; }
  `;

	const editorBlock = `<div class="ql-editor">${colorizeHeadings(
		html,
		exportHeadingColor
	)}</div>`;

	const safeLinksHeading = linksHeading || L.resourcesHeading;

	const body = `
    <div class="cover">
      <h1 style="color: ${exportHeadingColor}">${safeTitle}</h1>
      ${docSubtitle ? `<div class="small-label">${docSubtitle}</div>` : ""}
    </div>

    ${
			docIntro
				? `
      <div class="section">
        <h2 style="color: ${exportHeadingColor}">${L.activityTipHeading}</h2>
        <p>${String(docIntro).replace(/\n/g, "<br/>")}</p>
      </div>`
				: ""
		}

    <div class="section">
      <h2 style="color: ${exportHeadingColor}">${L.savedReflectionsHeading}</h2>
      ${editorBlock}
    </div>

    ${
			includeLinks && pageLinks?.length
				? `
      <div class="section">
        <h2 style="color: ${exportHeadingColor}">${safeLinksHeading}</h2>
        <ul>
          ${pageLinks
						.map((l) => {
							const label = (l?.label || "").toString();
							const url = (l?.url || "").toString();
							return url
								? `<li><a href="${url}">${label}</a></li>`
								: `<li>${label}</li>`;
						})
						.join("")}
        </ul>
      </div>`
				: ""
		}
  `.trim();

	const htmlDoc = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${safeTitle}</title>
          <style>${docCss}</style>
        </head>
        <body>${body}</body>
      </html>
    `.trim();

	const blob = new Blob([htmlDoc], {
		type: "application/msword",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = downloadFileName || "Reflection.doc";
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

/* ---------- Quill host ---------- */
function QuillSurface({
	value = "",
	onChange,
	placeholder,
	buildModules,
	formats,
	className,
	toolbarEl,
	ariaLabel,
}) {
	const hostRef = React.useRef(null);
	const quillRef = React.useRef(null);
	const savedRangeRef = React.useRef(null);

	React.useEffect(() => {
		if (!hostRef.current || !toolbarEl) return;

		const onUndo = () => quillRef.current?.history.undo();
		const onRedo = () => quillRef.current?.history.redo();

		quillRef.current = new Quill(hostRef.current, {
			theme: "snow",
			placeholder,
			modules: buildModules(toolbarEl, savedRangeRef, onUndo, onRedo),
			formats,
		});

		quillRef.current.root.innerHTML = value || "";
		const onText = () => onChange?.(quillRef.current.root.innerHTML);
		quillRef.current.on("text-change", onText);

		const onSelChange = (range) => {
			if (range) savedRangeRef.current = range;
		};
		quillRef.current.on("selection-change", onSelChange);

		const rememberSel = () => {
			const r = quillRef.current.getSelection();
			if (r) savedRangeRef.current = r;
		};
		toolbarEl.addEventListener("pointerdown", rememberSel, { capture: true });
		toolbarEl.addEventListener("focusin", rememberSel, { capture: true });
		const stopFocusSteal = (e) => {
			const isButton = e.target.closest?.(
				"button, .ql-selectall, .ql-bold, .ql-italic, .ql-underline, .ql-strike, .ql-list, .ql-indent, .ql-undo, .ql-redo"
			);
			const isSelect = e.target.closest?.("select, .ql-picker");
			if (isButton && !isSelect) e.preventDefault();
		};
		toolbarEl.addEventListener("mousedown", stopFocusSteal, { capture: true });
		const restoreSelOnClick = () => {
			const q = quillRef.current;
			if (!q) return;
			const r = savedRangeRef.current || q.getSelection();
			if (!r) return;
			q.setSelection(r.index, r.length, "silent");
		};
		toolbarEl.addEventListener("click", restoreSelOnClick, { capture: true });

		return () => {
			quillRef.current?.off("text-change", onText);
			quillRef.current?.off("selection-change", onSelChange);
			toolbarEl.removeEventListener("pointerdown", rememberSel, {
				capture: true,
			});
			toolbarEl.removeEventListener("focusin", rememberSel, { capture: true });
			toolbarEl.removeEventListener("mousedown", stopFocusSteal, {
				capture: true,
			});
			toolbarEl.removeEventListener("click", restoreSelOnClick, {
				capture: true,
			});
			quillRef.current = null;
		};
	}, [buildModules, toolbarEl]);

	React.useEffect(() => {
		const q = quillRef.current;
		if (!q) return;
		const next = value || "";
		if (q.root.innerHTML !== next) {
			const sel = q.getSelection();
			q.root.innerHTML = next;
			if (sel) q.setSelection(sel, "silent");
		}
	}, [value]);

	return (
		<div
			ref={hostRef}
			className={className}
			role="textbox"
			aria-label={ariaLabel}
			style={{ resize: "vertical", overflow: "auto", borderRadius: "1rem" }}
		/>
	);
}

/* ---------- Component ---------- */
export default function NoteComposer({
	value,
	onChange,
	placeholder,
	size = "md",
	minHeight = "min-h-32",
	wrapperClassName = "",
	textareaClassName = "",
	panelMinHClass = "min-h-64",
	accent,
	textColor,

	downloadFileName = "Reflection.doc",
	docTitle = "Activity",
	docSubtitle,
	activityNumber,
	docIntro,
	includeLinks = false,
	linksHeading, // no default -> allows localized default in exporter
	pageLinks = [],
	headingColor = "#0b1220",

	showDownloadButton = true,
	onRequestDownload,
}) {
	const model = React.useMemo(() => {
		if (typeof value === "string" || !value)
			return { text: value || "", bullets: [] };
		return {
			text: value.text || "",
			bullets: Array.isArray(value.bullets) ? value.bullets : [],
		};
	}, [value]);

	const [html, setHtml] = React.useState(model.text || "");
	React.useEffect(() => setHtml(model.text || ""), [model.text]);
	const emit = (nextHtml) => {
		setHtml(nextHtml);
		onChange?.({ text: nextHtml, bullets: model.bullets || [] });
	};

	const toolbarRef = React.useRef(null);
	const [toolbarEl, setToolbarEl] = React.useState(null);
	React.useEffect(() => {
		setToolbarEl(toolbarRef.current);
	}, []);

	const modulesBuilder = React.useCallback(
		(toolbarEl, savedRangeRef, undo, redo) =>
			makeQuillModules(toolbarEl, savedRangeRef, undo, redo),
		[]
	);

	const SIZES = {
		sm: { wrapper: "p-3 space-y-2", label: "text-xs", editor: "text-sm" },
		md: { wrapper: "p-4 space-y-3", label: "text-sm", editor: "text-base" },
		lg: { wrapper: "p-5 space-y-4", label: "text-sm", editor: "text-lg" },
	};
	const sz = SIZES[size] || SIZES.md;

	const accentHex = normalizeHex(accent) || "#0EA5E9";
	const btnText =
		textColor === "white" ? "#fff" : textColor === "black" ? "#0B1220" : "#fff";

	const [isDownloading, setIsDownloading] = React.useState(false);

	const lang = detectLang()?.startsWith("fr") ? "fr" : "en";
	const localizedDownloadLabel =
		DEFAULT_LOCALE_STRINGS[lang].downloadButton ||
		DEFAULT_LOCALE_STRINGS.en.downloadButton;
	const localizedDownloadingLabel =
		DEFAULT_LOCALE_STRINGS[lang].downloading ||
		DEFAULT_LOCALE_STRINGS.en.downloading;

	// Editor-specific localized strings
	const editorStrings =
		lang === "fr"
			? {
					reflectionsLabel: "Réflexions",
					placeholder: "Rédigez vos réflexions…",
					headerDropdownTitle: "Paragraphe / Titres",
					headerParagraph: "Paragraphe",
					headerH1: "Titre 1",
					headerH2: "Titre 2",
					headerH3: "Titre 3",
					headerH4: "Titre 4",
					boldTitle: "Gras (Ctrl/Cmd+B)",
					italicTitle: "Italique (Ctrl/Cmd+I)",
					underlineTitle: "Soulignement (Ctrl/Cmd+U)",
					strikeTitle: "Barré",
					numberedListTitle: "Liste numérotée",
					bulletListTitle: "Liste à puces",
					textColorTitle: "Couleur du texte",
					highlightColorTitle: "Couleur de surlignage",
					undoTitle: "Annuler (Ctrl/Cmd+Z)",
					redoTitle: "Rétablir (Ctrl+Y / Cmd+Shift+Z)",
					editorAriaLabel: "Éditeur de texte enrichi",
			  }
			: {
					reflectionsLabel: "Reflections",
					placeholder: "Type your reflections…",
					headerDropdownTitle: "Paragraph / Headings",
					headerParagraph: "Paragraph",
					headerH1: "Heading 1",
					headerH2: "Heading 2",
					headerH3: "Heading 3",
					headerH4: "Heading 4",
					boldTitle: "Bold (Ctrl/Cmd+B)",
					italicTitle: "Italic (Ctrl/Cmd+I)",
					underlineTitle: "Underline (Ctrl/Cmd+U)",
					strikeTitle: "Strikethrough",
					numberedListTitle: "Numbered list",
					bulletListTitle: "Bullet list",
					textColorTitle: "Text color",
					highlightColorTitle: "Highlight color",
					undoTitle: "Undo (Ctrl/Cmd+Z)",
					redoTitle: "Redo (Ctrl+Y / Cmd+Shift+Z)",
					editorAriaLabel: "Rich text editor",
			  };

	const effectivePlaceholder = placeholder ?? editorStrings.placeholder;

	/* ---- Download as Word-compatible HTML with sections ---- */
	const downloadWord = async () => {
		if (onRequestDownload) {
			onRequestDownload();
			return;
		}
		if (isDownloading) return;
		setIsDownloading(true);

		try {
			await Promise.resolve(
				downloadNotesAsWord({
					html,
					downloadFileName,
					docTitle,
					docSubtitle,
					activityNumber,
					docIntro,
					includeLinks,
					linksHeading,
					pageLinks,
					headingColor,
					accent,
					locale: lang,
				})
			);
		} catch (err) {
			console.error("downloadNotesAsWord failed:", err);
		} finally {
			setTimeout(() => setIsDownloading(false), 700);
		}
	};

	// CSS for header picker labels, localized
	const headerPickerLabelCss =
		lang === "fr"
			? `
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="false"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="false"]::before { content: "Paragraphe"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before { content: "Titre 1"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before { content: "Titre 2"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before { content: "Titre 3"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before { content: "Titre 4"; }
    `
			: `
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="false"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="false"]::before { content: "Paragraph"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before { content: "Heading 1"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before { content: "Heading 2"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before { content: "Heading 3"; }
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before { content: "Heading 4"; }
    `;

	return (
		<div
			className={`bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow ${sz.wrapper} ${wrapperClassName}`}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-1">
					<span className={`mr-2 font-medium text-gray-700 ${sz.label}`}>
						{editorStrings.reflectionsLabel}
					</span>

					<div
						ref={toolbarRef}
						className="flex flex-wrap items-center gap-0.5 rounded-xl bg-white/80 px-1 py-0.5 border border-gray-200"
					>
						<select
							className="ql-header rounded-lg"
							defaultValue="false"
							title={editorStrings.headerDropdownTitle}
						>
							<option value="false">{editorStrings.headerParagraph}</option>
							<option value="1">{editorStrings.headerH1}</option>
							<option value="2">{editorStrings.headerH2}</option>
							<option value="3">{editorStrings.headerH3}</option>
							<option value="4">{editorStrings.headerH4}</option>
						</select>

						<button className="ql-bold" title={editorStrings.boldTitle}>
							<i className="fa-solid fa-bold" />
						</button>
						<button className="ql-italic" title={editorStrings.italicTitle}>
							<i className="fa-solid fa-italic" />
						</button>
						<button
							className="ql-underline"
							title={editorStrings.underlineTitle}
						>
							<i className="fa-solid fa-underline" />
						</button>
						<button className="ql-strike" title={editorStrings.strikeTitle}>
							<i className="fa-solid fa-strikethrough" />
						</button>

						<span className="mx-1 h-4 w-px bg-gray-200 rounded" aria-hidden />

						<button
							className="ql-list"
							value="ordered"
							title={editorStrings.numberedListTitle}
						>
							<i className="fa-solid fa-list-ol" />
						</button>
						<button
							className="ql-list"
							value="bullet"
							title={editorStrings.bulletListTitle}
						>
							<i className="fa-solid fa-list-ul" />
						</button>

						<span className="mx-1 h-4 w-px bg-gray-200 rounded" aria-hidden />

						<select
							className="ql-color rounded-lg"
							title={editorStrings.textColorTitle}
						/>
						<select
							className="ql-background rounded-lg"
							title={editorStrings.highlightColorTitle}
						/>

						<span className="mx-1 h-4 w-px bg-gray-200 rounded" aria-hidden />

						<button className="ql-undo" title={editorStrings.undoTitle}>
							<i className="fa-solid fa-rotate-left" />
						</button>
						<button className="ql-redo" title={editorStrings.redoTitle}>
							<i className="fa-solid fa-rotate-right" />
						</button>
					</div>
				</div>

				{showDownloadButton && (
					<button
						type="button"
						onClick={downloadWord}
						className="rounded-xl px-2.5 py-1.5 text-sm shadow-sm transition-colors inline-flex items-center"
						style={{ backgroundColor: accentHex, color: btnText }}
						onMouseEnter={(e) =>
							(e.currentTarget.style.backgroundColor = shadeHex(
								accentHex,
								-0.08
							))
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.backgroundColor = accentHex)
						}
						aria-busy={isDownloading}
						disabled={isDownloading}
					>
						{isDownloading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
									role="img"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
									/>
								</svg>
								{localizedDownloadingLabel}
							</>
						) : (
							localizedDownloadLabel
						)}
					</button>
				)}
			</div>

			<div className={panelMinHClass}>
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.16 }}
				>
					<div
						className={`w-full ${minHeight} bg-gray-50 border border-gray-200 rounded-2xl ${sz.editor} ${textareaClassName}`}
						style={{ overflow: "hidden" }}
					>
						<QuillSurface
							value={html}
							onChange={emit}
							placeholder={effectivePlaceholder}
							buildModules={modulesBuilder}
							formats={QUILL_FORMATS}
							className="h-full"
							toolbarEl={toolbarEl}
							ariaLabel={editorStrings.editorAriaLabel}
						/>
					</div>
				</motion.div>

				<style>{`
          .ql-container { min-height: 12rem; border: none; }
          .ql-toolbar { border: none; padding: 0; }
          .ql-editor { min-height: 10rem; outline: none; }
          .ql-editor ::selection { background: rgba(37,99,235,.18); }

          .ql-toolbar button, .ql-toolbar .ql-picker {
            min-height: 22px; min-width: 22px;
            border-radius: 12px;
            transition: background-color .12s ease, transform .06s ease, box-shadow .12s ease;
          }
          .ql-toolbar button i { font-size: 12px; line-height: 1; }
          .ql-toolbar .ql-picker-label, .ql-toolbar .ql-picker-item { line-height: 18px; padding: 0 8px; }

          .ql-toolbar .ql-picker-label:hover,
          .ql-toolbar button:hover { background: rgba(2,6,23,.05); }
          .ql-toolbar .ql-picker-label:focus,
          .ql-toolbar button:focus { outline: none; }
          .ql-toolbar button:active { transform: translateY(.5px); }

          .ql-snow .ql-picker.ql-header { min-width: 160px; }
          .ql-snow .ql-picker.ql-header .ql-picker-label { padding: 0 10px; border-radius: 10px; }
          .ql-snow .ql-picker.ql-expanded .ql-picker-options {
            border-radius: 12px; box-shadow: 0 10px 28px rgba(2,6,23,.14);
          }

          ${headerPickerLabelCss}
        `}</style>
			</div>
		</div>
	);
}
