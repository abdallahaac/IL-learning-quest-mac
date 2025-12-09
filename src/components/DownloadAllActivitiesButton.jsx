// src/components/DownloadAllActivitiesButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import activitiesData from "../constants/activities_overview.json";
import { ACTIVITIES_CONTENT } from "../constants/content.js";

/** utils */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const withAlpha = (hex, aa) => `${hex}${aa}`;

/** tiny lang sniff */
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

/** pick bilingual fields: field_fr, fr.field, i18n?.fr?.field */
function pickLocalized(obj, field, lang) {
	if (!obj || typeof obj !== "object") return "";
	if (lang === "fr") {
		if (obj[`${field}_fr`]) return String(obj[`${field}_fr`]);
		if (obj.fr && typeof obj.fr === "object" && obj.fr[field])
			return String(obj.fr[field]);
		if (obj.i18n && obj.i18n.fr && obj.i18n.fr[field])
			return String(obj.i18n.fr[field]);
	}
	if (obj[field]) return String(obj[field]);
	if (obj.en && typeof obj.en === "object" && obj.en[field])
		return String(obj.en[field]);
	if (obj.i18n && obj.i18n.en && obj.i18n.en[field])
		return String(obj.i18n.en[field]);
	return "";
}

/** brutally simple HTML stripper for docx text runs */
function stripHtml(html) {
	if (!html) return "";
	return String(html)
		.replace(/<[^>]+>/g, "")
		.replace(/\s+\n/g, "\n")
		.replace(/\s{2,}/g, " ")
		.trim();
}

/** normalize activity list from ACTIVITIES_CONTENT or JSON fallback */
function buildActivities(lang) {
	// Prefer ACTIVITIES_CONTENT if present and iterable
	const keys = ACTIVITIES_CONTENT ? Object.keys(ACTIVITIES_CONTENT) : [];
	if (keys.length) {
		return keys
			.sort((a, b) => {
				const na =
					ACTIVITIES_CONTENT[a]?.en?.number ??
					ACTIVITIES_CONTENT[a]?.fr?.number ??
					0;
				const nb =
					ACTIVITIES_CONTENT[b]?.en?.number ??
					ACTIVITIES_CONTENT[b]?.fr?.number ??
					0;
				return na - nb;
			})
			.map((k, idx) => {
				const pack = ACTIVITIES_CONTENT[k];
				const node =
					lang === "fr" ? pack.fr || pack.en : pack.en || pack.fr || {};

				// Always strip HTML, whether it comes from tip or instructionsHtml
				const rawTip =
					node.tip ||
					node?.cdata?.instructionsHtml ||
					node?.instructionsHtml ||
					"";

				return {
					id: node.id || k,
					number: node.number ?? idx + 1,
					title: node.title || "",
					subtitle: pickLocalized(node, "subtitle", lang),
					tip: stripHtml(rawTip),
					resourcesHeading:
						node.resourcesHeading ||
						(lang === "fr" ? "Ressources" : "Resources"),
					links: Array.isArray(node.links) ? node.links : [],
				};
			});
	}

	// Fallback to JSON file shape { activities: [...] }
	const items = Array.isArray(activitiesData?.activities)
		? activitiesData.activities
		: [];
	return items.map((a, idx) => {
		const rawTip = pickLocalized(a, "tip", lang);

		return {
			id: a.id || String(idx + 1),
			number: a.number ?? idx + 1,
			title:
				pickLocalized(a, "title", lang) ||
				(lang === "fr" ? `Activité ${idx + 1}` : `Activity ${idx + 1}`),
			subtitle: pickLocalized(a, "subtitle", lang),
			tip: stripHtml(rawTip),
			resourcesHeading:
				pickLocalized(a, "resourcesHeading", lang) ||
				(lang === "fr" ? "Ressources" : "Resources"),
			links: Array.isArray(a.resources)
				? a.resources
				: Array.isArray(a.links)
				? a.links
				: [],
		};
	});
}

export default function DownloadAllActivitiesButton({
	accent = "#67AAF9",
	// if caller passes docName/coverTitle we respect them; otherwise we localize
	docName,
	coverTitle,
	className = "",
	locale, // optional explicit 'en' | 'fr'
}) {
	const lang = (locale || detectLang()) === "fr" ? "fr" : "en";

	// localized UI strings
	const STR = {
		btnIdle:
			lang === "fr"
				? "Télécharger la liste des activités (.docx)"
				: "Download All Activities (.docx)",
		btnPrep: lang === "fr" ? "Préparation…" : "Preparing…",
		aria:
			lang === "fr"
				? "Télécharger la liste des activités"
				: "Download all activities overview",
		tooltip:
			lang === "fr"
				? "Télécharger la liste de toutes les activités"
				: "Download all activities overview",
		resources: lang === "fr" ? "Ressources" : "Resources",
		tipHeader: lang === "fr" ? "Consignes" : "Instructions",
		exportedPrefix: lang === "fr" ? "Exporté le" : "Exported",
		defaultCover:
			lang === "fr" ? "Aperçu des activités" : "Activities Overview",
		defaultName:
			lang === "fr" ? "Aperçu-des-activités.docx" : "Activities-Overview.docx",
	};

	const accentHex = normalizeHex(accent) || "#2563EB";
	const ringAccent = `focus:outline-none focus-visible:ring-2 focus-visible:ring-[${accentHex}] focus-visible:ring-offset-2`;

	const [busy, setBusy] = React.useState(false);

	const handleDownload = async () => {
		if (busy) return;
		setBusy(true);

		const items = buildActivities(lang);

		try {
			const {
				Document,
				Packer,
				Paragraph,
				TextRun,
				HeadingLevel,
				ExternalHyperlink,
				AlignmentType,
			} = await import("docx");
			const { saveAs } = await import("file-saver");

			const today = new Date().toLocaleDateString(
				lang === "fr" ? "fr-CA" : "en-CA"
			);
			const children = [];

			// Cover
			const coverText = coverTitle || STR.defaultCover;
			children.push(
				new Paragraph({
					alignment: AlignmentType.CENTER,
					spacing: { after: 300 },
					children: [
						new TextRun({
							text: coverText,
							bold: true,
							size: 56,
							font: "Arial",
							color: accentHex.replace("#", ""),
						}),
					],
				})
			);
			children.push(
				new Paragraph({
					alignment: AlignmentType.CENTER,
					spacing: { after: 400 },
					children: [
						new TextRun({
							text: `${STR.exportedPrefix} ${today}`,
							italics: true,
							size: 24,
							font: "Arial",
						}),
					],
				})
			);

			// Activities
			items.forEach((a, idx) => {
				const indexLabel = `${idx + 1}. ${
					a.title ||
					(lang === "fr"
						? `Activité ${a.number ?? idx + 1}`
						: `Activity ${a.number ?? idx + 1}`)
				}`;

				// Title
				children.push(
					new Paragraph({
						text: indexLabel,
						heading: HeadingLevel.HEADING_1,
						spacing: { before: 480, after: 200 },
					})
				);

				// Subtitle (optional)
				if (a.subtitle) {
					children.push(
						new Paragraph({
							spacing: { after: 160 },
							children: [
								new TextRun({
									text: a.subtitle,
									italics: true,
									font: "Arial",
									size: 24,
								}),
							],
						})
					);
				}

				// Tip/Instructions
				if (a.tip) {
					children.push(
						new Paragraph({
							text: STR.tipHeader,
							heading: HeadingLevel.HEADING_2,
							spacing: { before: 160, after: 80 },
						})
					);
					children.push(
						new Paragraph({
							spacing: { after: 160 },
							children: [
								new TextRun({
									text: a.tip,
									font: "Arial",
									size: 24,
								}),
							],
						})
					);
				}

				// Resources
				const links = Array.isArray(a.links) ? a.links : [];
				if (links.length) {
					const resHeading = a.resourcesHeading || STR.resources;
					children.push(
						new Paragraph({
							text: resHeading,
							heading: HeadingLevel.HEADING_2,
							spacing: { before: 200, after: 120 },
						})
					);
					links.forEach((l) => {
						const label =
							pickLocalized(l, "label", lang).trim() ||
							pickLocalized(l, "title", lang).trim() ||
							String(l?.url || "").trim();
						const url = String(l?.url || "").trim();
						children.push(
							new Paragraph({
								bullet: { level: 0 },
								spacing: { after: 60 },
								children: url
									? [
											new ExternalHyperlink({
												link: url,
												children: [
													new TextRun({
														text: label || url,
														font: "Arial",
														size: 24,
														underline: {},
														color: "0563C1",
													}),
												],
											}),
									  ]
									: [new TextRun({ text: label, font: "Arial", size: 24 })],
							})
						);
					});
				}
			});

			const doc = new Document({
				styles: {
					default: {
						document: {
							run: { font: "Arial", size: 24 },
							paragraph: { spacing: { line: 360 } },
						},
					},
				},
				sections: [{ properties: {}, children }],
			});

			const finalName = docName || STR.defaultName;
			const blob = await Packer.toBlob(doc);
			saveAs(blob, finalName);
		} catch {
			alert(
				lang === "fr"
					? "Impossible de générer le DOCX dans cet environnement."
					: "Unable to generate DOCX in this environment."
			);
		} finally {
			setTimeout(() => setBusy(false), 900);
		}
	};

	return (
		<motion.button
			type="button"
			onClick={handleDownload}
			disabled={busy}
			aria-disabled={busy}
			className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-sm font-semibold border shadow-sm ${ringAccent} ${className} ${
				busy ? "opacity-60 cursor-not-allowed" : ""
			}`}
			style={{
				backgroundColor: withAlpha(accentHex, "14"),
				color: accentHex,
				borderColor: withAlpha(accentHex, "33"),
			}}
			whileHover={
				!busy
					? {
							backgroundColor: withAlpha(accentHex, "20"),
							boxShadow: `0 6px 18px ${withAlpha(accentHex, "1A")}`,
					  }
					: {}
			}
			whileTap={
				!busy
					? {
							backgroundColor: withAlpha(accentHex, "26"),
							scale: 0.98,
							boxShadow: `0 2px 10px ${withAlpha(accentHex, "1A")}`,
					  }
					: {}
			}
			transition={{ duration: 0.15, ease: "easeOut" }}
			aria-label={STR.aria}
			title={STR.tooltip}
		>
			<Download className="w-4 h-4" />
			<span>{busy ? STR.btnPrep : STR.btnIdle}</span>
		</motion.button>
	);
}
