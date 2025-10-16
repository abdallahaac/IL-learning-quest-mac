// src/utils/downloadRecipes.js
import {
	formatIngredient,
	labelForGroup,
	downloadBlob,
	safe,
} from "./recipeUtils.js";

/**
 * downloadAllDocx(params)
 * - items: array of recipe objects
 * - strings: localized strings
 * - activityNumber: number
 * - accent: hex color
 * - referenceLink: { label, url }
 */
export async function downloadAllDocx({
	items,
	strings = {},
	activityNumber = 3,
	accent = "#b45309",
	referenceLink = { label: "", url: "" },
}) {
	if (!Array.isArray(items) || items.length === 0) return;

	const activityLabel = strings.activityLabel || "Activity";
	const baseTitle = strings.title || "Make a Traditional Recipe";
	const title = `${activityLabel} ${activityNumber}: ${baseTitle}`;
	const fileName = `activity-${activityNumber}-recipes.docx`;

	const ingredientsHeading = strings.ingredientsHeading || "Ingredients";
	const directionsHeading = strings.directionsLabel || "Directions";
	const resourcesHeading = strings.resourcesHeading || "Resources";

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
					text: strings.tip || "Try your hand at making a traditional recipe.",
					italics: true,
					font: "Arial",
					size: 24,
				}),
			],
		});

		const resourceHeading = new Paragraph({
			spacing: { before: 80, after: 120 },
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

		const resourceLine = new Paragraph({
			spacing: { before: 0, after: 280 },
			children: [
				new TextRun({
					text: `${referenceLink.label} — `,
					font: "Arial",
					size: 24,
				}),
				new TextRun({
					text: referenceLink.url,
					font: "Arial",
					size: 24,
					underline: {},
					color: "1155CC",
				}),
			],
		});

		const sections = [H1, tip1, resourceHeading, resourceLine];

		items
			.slice()
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.forEach((r, idx) => {
				const header = new Paragraph({
					spacing: { before: idx === 0 ? 200 : 300, after: 120 },
					children: [
						new TextRun({
							text: r.name || "Untitled recipe",
							bold: true,
							font: "Arial",
							size: 32,
							color: accent,
						}),
						new TextRun({ text: "  •  ", font: "Arial", size: 24 }),
						new TextRun({
							text: labelForGroup(r.group),
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
							text: new Date(r.createdAt).toLocaleString(),
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
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	} catch (err) {
		// fallback to Word-compatible HTML (keeps behaviour from original)
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
					)}; margin:18pt 0 6pt;">${esc(r.name || "Untitled recipe")}</h2>
          <p style="margin:0 0 6pt; color:#6B7280;">${esc(
						labelForGroup(r.group)
					)} • ${esc(new Date(r.createdAt).toLocaleString())}</p>
          <h3 style="font-size:13pt; color:${esc(
						accent
					)}; margin:10pt 0 6pt;">${esc(ingredientsHeading)}</h3>
          <ul style="margin:0 0 12pt 18pt; font-size:12pt;">${ings}</ul>
          ${dir}
        `;
			})
			.join("");

		const title = `${activityLabel} ${activityNumber}: ${esc(
			strings.title || "Make a Traditional Recipe"
		)}`;
		const html = `
      <html>
        <head><meta charset="utf-8"><title>${esc(title)}</title></head>
        <body style="font-family:Arial; line-height:1.5;">
          <h1 style="font-size:24pt; color:${esc(
						accent
					)}; margin:0 0 12pt;">${esc(title)}</h1>
          <p style="font-size:12pt; font-style:italic; margin:0 0 6pt;">${esc(
						strings.tip || ""
					)}</p>
          <h2 style="font-size:16pt; color:${esc(
						accent
					)}; margin:12pt 0 8pt;">${esc(resourcesHeading)}</h2>
          <p style="font-size:12pt; margin:0 0 18pt;">${esc(
						referenceLink.label
					)} —
            <a href="${esc(
							referenceLink.url
						)}" style="color:#1155CC; text-decoration:underline;">${esc(
			referenceLink.url
		)}</a>
          </p>
          ${rows}
        </body>
      </html>
    `.trim();

		const blob = new Blob([html], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `activity-${activityNumber}-recipes.doc`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}
}

/**
 * downloadOne(r, strings, activityNumber, accent, referenceLink)
 * Writes a simple text blob (plain text) and downloads it
 */
export function downloadOne(
	r,
	strings = {},
	activityNumber = 3,
	accent = "#b45309",
	referenceLink = { url: "" }
) {
	const activityLabel = strings.activityLabel || "Activity";
	const ingredientsHeading = strings.ingredientsHeading || "Ingredients";
	const directionsHeading = strings.directionsLabel || "Directions";

	const body = [
		`${activityLabel} ${activityNumber}: ${
			strings.title || "Make a Traditional Recipe"
		}`,
		`Group: ${labelForGroup(r.group)}`,
		`Name: ${r.name}`,
		"",
		`${ingredientsHeading}:`,
		...(r.ingredients || []).map((x) => `- ${formatIngredient(x)}`),
		"",
		(r.directions || []).length
			? `${directionsHeading}:\n` +
			  (r.directions || []).map((s, i) => `${i + 1}. ${s}`).join("\n") +
			  "\n"
			: "",
		`Saved: ${new Date(r.createdAt).toLocaleString()}`,
		`Source: ${referenceLink.url}`,
	].join("\n");

	downloadBlob(body, `Recipe-${safe(r.name)}.txt`);
}
