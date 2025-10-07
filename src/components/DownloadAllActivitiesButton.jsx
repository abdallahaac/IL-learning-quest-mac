// src/components/DownloadAllActivitiesButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import activitiesData from "../constants/activities_overview.json";

/** utils */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function DownloadAllActivitiesButton({
	accent = "#67AAF9",
	docName = "Activities-Overview.docx",
	coverTitle = "Activities Overview",
	className = "",
}) {
	const accentHex = normalizeHex(accent) || "#2563EB";
	const ringAccent = `focus:outline-none focus-visible:ring-2 focus-visible:ring-[${accentHex}] focus-visible:ring-offset-2`;

	const [busy, setBusy] = React.useState(false);

	const handleDownload = async () => {
		if (busy) return;
		setBusy(true);
		const items = Array.isArray(activitiesData?.activities)
			? activitiesData.activities
			: [];
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

			const today = new Date().toLocaleDateString();
			const children = [];

			// Cover
			children.push(
				new Paragraph({
					alignment: AlignmentType.CENTER,
					spacing: { after: 300 },
					children: [
						new TextRun({
							text: coverTitle,
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
							text: `Exported ${today}`,
							italics: true,
							size: 24,
							font: "Arial",
						}),
					],
				})
			);

			// Activities
			items.forEach((a, idx) => {
				const heading = a?.title || `Activity ${a?.id ?? idx + 1}`;

				children.push(
					new Paragraph({
						text: `${idx + 1}. ${heading}`,
						heading: HeadingLevel.HEADING_1,
						spacing: { before: 480, after: 200 },
					})
				);

				if (a?.subtitle) {
					children.push(
						new Paragraph({
							children: [
								new TextRun({
									text: a.subtitle,
									italics: true,
									font: "Arial",
									size: 24,
								}),
							],
							spacing: { after: 160 },
						})
					);
				}

				const links = Array.isArray(a?.resources) ? a.resources : [];
				if (links.length) {
					children.push(
						new Paragraph({
							text: "Resources",
							heading: HeadingLevel.HEADING_2,
							spacing: { before: 200, after: 120 },
						})
					);
					links.forEach((l) => {
						const label = String(l?.label || l?.title || l?.url || "").trim();
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

			const blob = await Packer.toBlob(doc);
			saveAs(blob, docName);
		} catch {
			alert("Unable to generate DOCX in this environment.");
		} finally {
			// cooldown protects against rapid double-clicks
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
			aria-label="Download all activities overview"
			title="Download all activities overview"
		>
			<Download className="w-4 h-4" />
			<span>{busy ? "Preparing…" : "Download All Activities (.docx)"}</span>
		</motion.button>
	);
}
