// src/utils/downloadRecipes.js
import {
	formatIngredient,
	labelForGroup,
	downloadBlob,
	safe,
} from "./recipeUtils.js";

/* sanitize filename: keep accents, remove only illegal filename chars, normalize spacing */
function sanitizeFilename(input = "") {
	return (
		String(input || "")
			// remove characters that are invalid or risky in filenames
			.replace(/[\/\\?%*:|"<>]+/g, "")
			.replace(/\s+/g, " ") // collapse whitespace first
			.trim()
			.replace(/\s+/g, "-") // spaces -> dashes
			.replace(/-+/g, "-") // collapse repeated dashes
			.replace(/^-+|-+$/g, "")
	); // trim leading/trailing dash
}

function ensureExtension(filename = "", ext = ".docx") {
	if (!filename) return `download${ext}`;
	const hasExt = /\.[A-Za-z0-9]+$/.test(filename);
	return hasExt ? filename : `${filename}${ext}`;
}

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

/* strip basic HTML tags from strings (for DOCX/plain exports) */
function stripHtml(input = "") {
	return String(input || "").replace(/<[^>]*>/g, "");
}

/**
 * downloadAllDocx(params)
 * - items: array of recipe objects
 * - strings: localized strings (optional)
 * - activityNumber, accent (optional)
 * - referenceLinks: array of { label, url }
 * - referenceLink: legacy single { label, url } (optional, for backward compat)
 * - filename: provided filename to use-as-is (optional)
 * - locale: explicit locale tag ('en'|'fr', etc.) (optional) — THIS OVERRIDES auto-detect
 */
export async function downloadAllDocx({
	items,
	strings = {},
	activityNumber = 3,
	accent = "#b45309",
	referenceLinks,
	referenceLink,
	filename: providedFilename,
	locale,
} = {}) {
	if (!Array.isArray(items) || items.length === 0) return;

	const lang = (locale || strings.lang || detectLang() || "en").toLowerCase();

	const activityLabel =
		strings.activityLabel || (lang === "fr" ? "Activité" : "Activity");

	const baseTitle =
		strings.title ||
		(lang === "fr"
			? "Préparez une recette traditionnelle"
			: "Make a Traditional Recipe");
	const title = `${activityLabel} ${activityNumber}: ${baseTitle}`;

	const ingredientsHeading =
		strings.ingredientsHeading ||
		(lang === "fr" ? "Ingrédients" : "Ingredients");
	const directionsHeading =
		strings.directionsLabel || (lang === "fr" ? "Étapes" : "Directions");
	const resourcesHeading =
		strings.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	// saved recipes header text (localized)
	const savedHeading =
		strings.savedRecipesHeading ||
		(lang === "fr" ? "Recettes enregistrées" : "Saved recipes");

	// Only use dedicated suffix keys for filename
	const defaultAllSuffix =
		strings.downloadAllSuffix || (lang === "fr" ? "Recettes" : "Recipes");

	const activityTag =
		sanitizeFilename(activityLabel).toLowerCase() || "activity";
	const suffixTag =
		sanitizeFilename(defaultAllSuffix).toLowerCase() ||
		(lang === "fr" ? "recettes" : "recipes");

	let fileName;
	if (providedFilename) {
		let candidate = String(providedFilename || "").trim();
		const parts = candidate.split(".");
		if (parts.length > 1) parts.pop();
		const base =
			sanitizeFilename(parts.join(".")).toLowerCase() ||
			`${activityTag}-${String(activityNumber).padStart(2, "0")}-${suffixTag}`;
		fileName = ensureExtension(base, ".docx");
	} else {
		fileName = `${activityTag}-${String(activityNumber).padStart(
			2,
			"0"
		)}-${suffixTag}.docx`;
	}

	// tip text, stripped of HTML (e.g., <strong>)
	const tipDefault =
		lang === "fr"
			? "Essayez de préparer une recette traditionnelle."
			: "Try your hand at making a traditional recipe.";
	const tipRaw = strings.tip || tipDefault;
	const tipPlain = stripHtml(tipRaw);

	// normalize links (support both array + single legacy referenceLink)
	const rawLinks =
		Array.isArray(referenceLinks) && referenceLinks.length
			? referenceLinks
			: referenceLink
			? [referenceLink]
			: [];
	const normalizedLinks = rawLinks.filter(
		(lnk) => lnk && (lnk.label || lnk.url)
	);

	try {
		const {
			Document,
			Packer,
			Paragraph,
			TextRun,
			AlignmentType,
			Table,
			TableRow,
			TableCell,
			WidthType,
			BorderStyle,
		} = await import("docx");

		const H1 = new Paragraph({
			alignment: AlignmentType.LEFT,
			spacing: { before: 0, after: 300 },
			children: [
				new TextRun({
					text: title,
					bold: true,
					size: 48,
					font: "Arial",
					color: accent,
				}),
			],
		});

		const tip1 = new Paragraph({
			spacing: { before: 0, after: 160 },
			children: [
				new TextRun({
					text: tipPlain,
					italics: true,
					font: "Arial",
					size: 24,
				}),
			],
		});

		const resourceHeading = new Paragraph({
			spacing: { before: 80, after: 80 },
			children: [
				new TextRun({
					text: resourcesHeading,
					bold: true,
					font: "Arial",
					size: 32,
					color: accent,
				}),
			],
		});

		const resourceParas =
			normalizedLinks.length === 0
				? []
				: normalizedLinks.map(
						(lnk) =>
							new Paragraph({
								spacing: { before: 0, after: 80 },
								children: [
									new TextRun({
										text: `${lnk.label || ""}${lnk.url ? " — " : ""}`,
										font: "Arial",
										size: 24,
									}),
									lnk.url
										? new TextRun({
												text: lnk.url,
												font: "Arial",
												size: 24,
												underline: {},
												color: "1155CC",
										  })
										: null,
								].filter(Boolean),
							})
				  );

		// saved recipes heading AFTER listing resources
		const savedHeader = new Paragraph({
			spacing: { before: 60, after: 120 },
			children: [
				new TextRun({
					text: savedHeading,
					bold: true,
					font: "Arial",
					size: 32,
					color: accent,
				}),
			],
		});

		const sections = [H1, tip1];

		if (normalizedLinks.length) {
			sections.push(resourceHeading, ...resourceParas);
		}

		sections.push(savedHeader);

		items
			.slice()
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.forEach((r, idx) => {
				const header = new Paragraph({
					spacing: { before: idx === 0 ? 200 : 300, after: 120 },
					children: [
						new TextRun({
							text:
								r.name ||
								(lang === "fr" ? "Recette sans titre" : "Untitled recipe"),
							bold: true,
							font: "Arial",
							size: 32,
							color: accent,
						}),
						new TextRun({ text: "  •  ", font: "Arial", size: 24 }),
						new TextRun({
							// use localized group label now
							text: labelForGroup(r.group, lang),
							font: "Arial",
							size: 24,
							italics: true,
						}),
					],
				});

				const when = new Paragraph({
					spacing: { before: 0, after: 120 },
					children: [
						new TextRun({
							text: new Date(r.createdAt).toLocaleString(
								lang === "fr" ? "fr-CA" : "en-CA"
							),
							font: "Arial",
							size: 20,
							color: "6B7280",
						}),
					],
				});

				const ingHeaderRow = new TableRow({
					children: [
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: ingredientsHeading,
											bold: true,
											font: "Arial",
											size: 24,
										}),
									],
								}),
							],
						}),
					],
					tableHeader: true,
				});

				const ingRows = (r.ingredients || []).map(
					(it) =>
						new TableRow({
							children: [
								new TableCell({
									children: [
										new Paragraph({
											children: [
												new TextRun({
													text: formatIngredient(it),
													font: "Arial",
													size: 24,
												}),
											],
										}),
									],
								}),
							],
						})
				);

				const ingTable = new Table({
					width: { size: 100, type: WidthType.PERCENTAGE },
					rows: [ingHeaderRow, ...ingRows],
					borders: {
						top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
						bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
						left: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
						right: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
						insideHorizontal: {
							style: BorderStyle.SINGLE,
							size: 1,
							color: "E5E7EB",
						},
						insideVertical: {
							style: BorderStyle.SINGLE,
							size: 1,
							color: "E5E7EB",
						},
					},
				});

				sections.push(header, when, ingTable);

				if ((r.directions || []).length > 0) {
					sections.push(
						new Paragraph({
							spacing: { before: 160, after: 80 },
							children: [
								new TextRun({
									text: directionsHeading,
									bold: true,
									font: "Arial",
									size: 24,
									color: accent,
								}),
							],
						})
					);
					(r.directions || []).forEach((step, i) => {
						sections.push(
							new Paragraph({
								spacing: { before: 0, after: 80 },
								children: [
									new TextRun({
										text: `${i + 1}. ${step}`,
										font: "Arial",
										size: 24,
									}),
								],
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
			sections: [{ properties: {}, children: sections }],
		});

		const blob = await Packer.toBlob(doc);
		downloadBlob(blob, fileName);
	} catch (err) {
		// HTML fallback with localized filename (safer to use .doc for HTML fallback)
		console.error("Fallback to HTML download:", err);
		const esc = (s = "") =>
			String(s)
				.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;");

		const rows = (items || [])
			.map((r) => {
				const ings = (r.ingredients || [])
					.map((it) => `<li>${esc(formatIngredient(it))}</li>`)
					.join("");
				const steps = (r.directions || [])
					.map((s, i) => `<li>${esc(`${i + 1}. ${s}`)}</li>`)
					.join("");
				const dir = steps
					? `<h3 style="font-size:13pt; color:${esc(
							accent
					  )}; margin:10pt 0 6pt;">${esc(directionsHeading)}</h3>
             <ol style="margin:0 0 12pt 18pt; font-size:12pt; list-style:none; padding-left:0;">
               ${steps}
             </ol>`
					: "";
				return `
          <h2 style="font-size:16pt; color:${esc(
						accent
					)}; margin:18pt 0 6pt;">${esc(
					r.name || (lang === "fr" ? "Recette sans titre" : "Untitled recipe")
				)}</h2>
          <p style="margin:0 0 6pt; color:#6B7280;">${esc(
						labelForGroup(r.group, lang)
					)} • ${esc(new Date(r.createdAt).toLocaleString())}</p>
          <h3 style="font-size:13pt; color:${esc(
						accent
					)}; margin:10pt 0 6pt;">${esc(ingredientsHeading)}</h3>
          <ul style="margin:0 0 12pt 18pt; font-size:12pt;">${ings}</ul>
          ${dir}
        `;
			})
			.join("");

		const resourcesHtml =
			normalizedLinks.length === 0
				? ""
				: normalizedLinks
						.map(
							(lnk) => `
          <p style="font-size:12pt; margin:0 0 6pt;">
            ${esc(lnk.label || "")}${
								lnk.url
									? ` — <a href="${esc(
											lnk.url
									  )}" style="color:#1155CC; text-decoration:underline;">${esc(
											lnk.url
									  )}</a>`
									: ""
							}
          </p>`
						)
						.join("");

		const titleHtml = `${activityLabel} ${activityNumber}: ${esc(baseTitle)}`;
		const html = `
      <html>
        <head><meta charset="utf-8"><title>${titleHtml}</title></head>
        <body style="font-family:Arial; line-height:1.5;">
          <h1 style="font-size:24pt; color:${esc(
						accent
					)}; margin:0 0 12pt;">${titleHtml}</h1>
          <p style="font-size:12pt; font-style:italic; margin:0 0 6pt;">${esc(
						tipPlain
					)}</p>
          <h2 style="font-size:16pt; color:${esc(
						accent
					)}; margin:12pt 0 8pt;">${esc(resourcesHeading)}</h2>
          ${resourcesHtml}
          <h2 style="font-size:18pt; color:${esc(
						accent
					)}; margin:10pt 0 8pt;">${esc(savedHeading)}</h2>

          ${rows}
        </body>
      </html>
    `.trim();

		const blob = new Blob([html], { type: "application/msword" });
		const fallbackFileName = (
			fileName ||
			`${activityTag}-${String(activityNumber).padStart(
				2,
				"0"
			)}-${suffixTag}.docx`
		).replace(/\.docx?$/i, ".doc");
		downloadBlob(blob, fallbackFileName);
	}
}

/**
 * downloadOne(r, strings, activityNumber, accent, referenceLink, options)
 * - options: { filename?: string, locale?: 'en'|'fr' }
 *
 * Builds a DOCX for a single recipe (falls back to plain text).
 */
export async function downloadOne(
	r,
	strings = {},
	activityNumber = 3,
	accent = "#b45309",
	referenceLink = { url: "" },
	options = {}
) {
	const { filename: providedFilename, locale } = options || {};

	const lang = (locale || strings.lang || detectLang() || "en").toLowerCase();

	const activityLabel =
		strings.activityLabel || (lang === "fr" ? "Activité" : "Activity");
	const ingredientsHeading =
		strings.ingredientsHeading ||
		(lang === "fr" ? "Ingrédients" : "Ingredients");
	const directionsHeading =
		strings.directionsLabel || (lang === "fr" ? "Étapes" : "Directions");

	const defaultSingleSuffix =
		strings.downloadOneSuffix || (lang === "fr" ? "Recette" : "Recipe");

	const activityTag =
		sanitizeFilename(activityLabel).toLowerCase() || "activity";
	const singleTag =
		sanitizeFilename(defaultSingleSuffix).toLowerCase() ||
		(lang === "fr" ? "recette" : "recipe");
	const nameTag =
		sanitizeFilename(r?.name || "recipe").toLowerCase() || "recipe";

	let fileName;
	if (providedFilename) {
		const parts = String(providedFilename || "").split(".");
		if (parts.length > 1) parts.pop();
		const base =
			sanitizeFilename(parts.join(".")).toLowerCase() ||
			`${activityTag}-${String(activityNumber).padStart(
				2,
				"0"
			)}-${singleTag}-${nameTag}`;
		fileName = ensureExtension(base, ".docx");
	} else {
		fileName = `${activityTag}-${String(activityNumber).padStart(
			2,
			"0"
		)}-${singleTag}-${nameTag}.docx`;
	}

	try {
		const { Document, Packer, Paragraph, TextRun, AlignmentType } =
			await import("docx");

		const titleP = new Paragraph({
			alignment: AlignmentType.LEFT,
			spacing: { before: 0, after: 200 },
			children: [
				new TextRun({
					text: `${activityLabel} ${activityNumber}: ${
						strings.title ||
						(lang === "fr"
							? "Préparez une recette traditionnelle"
							: "Make a Traditional Recipe")
					}`,
					bold: true,
					size: 28,
					font: "Arial",
					color: accent,
				}),
			],
		});

		const nameP = new Paragraph({
			spacing: { before: 120, after: 120 },
			children: [
				new TextRun({
					text: `${lang === "fr" ? "Nom" : "Name"}: ${r.name || "Untitled"}`,
					bold: true,
					size: 24,
					font: "Arial",
				}),
			],
		});

		const groupP = new Paragraph({
			spacing: { before: 0, after: 120 },
			children: [
				new TextRun({
					text: `${lang === "fr" ? "Groupe" : "Group"}: ${labelForGroup(
						r.group,
						lang
					)}`,
					size: 20,
					font: "Arial",
				}),
			],
		});

		const ingHeader = new Paragraph({
			spacing: { before: 60, after: 60 },
			children: [
				new TextRun({
					text: ingredientsHeading,
					bold: true,
					size: 22,
					font: "Arial",
					color: accent,
				}),
			],
		});

		const ingParas = (r.ingredients || []).map(
			(it) =>
				new Paragraph({
					spacing: { before: 0, after: 40 },
					children: [
						new TextRun({
							text: `- ${formatIngredient(it)}`,
							size: 20,
							font: "Arial",
						}),
					],
				})
		);

		const dirHeader = new Paragraph({
			spacing: { before: 80, after: 60 },
			children: [
				new TextRun({
					text: directionsHeading,
					bold: true,
					size: 22,
					font: "Arial",
					color: accent,
				}),
			],
		});

		const dirParas = (r.directions || []).map(
			(s, i) =>
				new Paragraph({
					spacing: { before: 0, after: 40 },
					children: [
						new TextRun({ text: `${i + 1}. ${s}`, size: 20, font: "Arial" }),
					],
				})
		);

		const savedP = new Paragraph({
			spacing: { before: 60, after: 20 },
			children: [
				new TextRun({
					text: `${lang === "fr" ? "Enregistré le" : "Saved"}: ${new Date(
						r.createdAt
					).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA")}`,
					size: 18,
					font: "Arial",
					color: "6B7280",
				}),
			],
		});

		const srcP = new Paragraph({
			spacing: { before: 0, after: 20 },
			children: [
				new TextRun({
					text: `${lang === "fr" ? "Source" : "Source"}: ${
						referenceLink.url || ""
					}`,
					size: 18,
					font: "Arial",
				}),
			],
		});

		const children = [titleP, nameP, groupP, ingHeader, ...ingParas];
		if (dirParas.length) children.push(dirHeader, ...dirParas);
		children.push(savedP, srcP);

		const doc = new Document({ sections: [{ properties: {}, children }] });
		const blob = await Packer.toBlob(doc);
		downloadBlob(blob, fileName);
	} catch (err) {
		const body = [
			`${activityLabel} ${activityNumber}: ${
				strings.title ||
				(lang === "fr"
					? "Préparez une recette traditionnelle"
					: "Make a Traditional Recipe")
			}`,
			`${lang === "fr" ? "Groupe" : "Group"}: ${labelForGroup(r.group, lang)}`,
			`${lang === "fr" ? "Nom" : "Name"}: ${r.name}`,
			"",
			`${ingredientsHeading}:`,
			...(r.ingredients || []).map((x) => `- ${formatIngredient(x)}`),
			"",
			(r.directions || []).length
				? `${directionsHeading}:\n` +
				  (r.directions || []).map((s, i) => `${i + 1}. ${s}`).join("\n") +
				  "\n"
				: "",
			`${lang === "fr" ? "Enregistré le" : "Saved"}: ${new Date(
				r.createdAt
			).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA")}`,
			`${lang === "fr" ? "Source" : "Source"}: ${referenceLink.url || ""}`,
		].join("\n");

		const finalFileName = (
			fileName ||
			`${activityTag}-${String(activityNumber).padStart(
				2,
				"0"
			)}-${singleTag}-${nameTag}.txt`
		).replace(/\.(docx?|doc)$/i, ".txt");
		downloadBlob(body, finalFileName);
	}
}
