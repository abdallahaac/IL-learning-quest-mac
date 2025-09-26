import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

/* --- tiny utils --- */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const withAlpha = (hex, aa /* "14" */) => `${hex}${aa}`;

export default function DownloadCommitmentsButton({
	commitments = [],
	reflectionText = "", // ← NEW
	accent = "#67AAF9",
	title = "Team Commitments",
	docName = "Team-Commitments.docx",
	className = "",
}) {
	const accentHex = normalizeHex(accent) || "#2563EB";
	const ringAccent = `focus:outline-none focus-visible:ring-2 focus-visible:ring-[${accentHex}] focus-visible:ring-offset-2`;

	const handleDownload = async () => {
		const today = new Date().toLocaleDateString();
		try {
			const {
				Document,
				Packer,
				Paragraph,
				TextRun,
				HeadingLevel,
				AlignmentType,
			} = await import("docx");
			const { saveAs } = await import("file-saver");

			const children = [];

			// Cover
			children.push(
				new Paragraph({
					alignment: AlignmentType.CENTER,
					spacing: { after: 300 },
					children: [
						new TextRun({
							text: title,
							bold: true,
							size: 56, // ~28pt
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
							size: 24, // ~12pt
							font: "Arial",
						}),
					],
				})
			);

			// --- Team Reflection (if any text) ---
			const trimmed = String(reflectionText || "").trim();
			if (trimmed) {
				children.push(
					new Paragraph({
						text: "Team Reflection",
						heading: HeadingLevel.HEADING_1,
						spacing: { before: 240, after: 160 },
					})
				);

				// Split by blank lines and render paragraphs
				trimmed
					.split(/\n{2,}/)
					.map((p) => p.trim())
					.filter(Boolean)
					.forEach((p) => {
						children.push(
							new Paragraph({
								spacing: { after: 120 },
								children: [
									new TextRun({
										text: p.replace(/\n/g, " "),
										font: "Arial",
										size: 24, // ~12pt
									}),
								],
							})
						);
					});
			}

			// Commitments
			children.push(
				new Paragraph({
					text: "Commitments",
					heading: HeadingLevel.HEADING_1,
					spacing: { before: 240, after: 160 },
				})
			);

			if (Array.isArray(commitments) && commitments.length) {
				commitments.forEach((c) => {
					const t = String(c || "").trim();
					if (!t) return;
					children.push(
						new Paragraph({
							bullet: { level: 0 },
							spacing: { after: 60 },
							children: [new TextRun({ text: t, font: "Arial", size: 24 })],
						})
					);
				});
			} else {
				children.push(
					new Paragraph({
						children: [
							new TextRun({
								text: "No commitments yet.",
								font: "Arial",
								size: 24,
							}),
						],
					})
				);
			}

			const doc = new Document({
				styles: {
					default: {
						document: {
							run: { font: "Arial", size: 24 }, // ~12pt
							paragraph: { spacing: { line: 360 } }, // 1.5 line
						},
					},
				},
				sections: [{ properties: {}, children }],
			});

			const blob = await Packer.toBlob(doc);
			saveAs(blob, docName);
		} catch {
			alert("Unable to generate DOCX in this environment.");
		}
	};

	return (
		<motion.button
			type="button"
			onClick={handleDownload}
			className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-sm font-semibold shadow-sm border ${ringAccent} ${className}`}
			style={{
				backgroundColor: withAlpha(accentHex, "14"),
				color: accentHex,
				borderColor: withAlpha(accentHex, "33"),
			}}
			whileHover={{
				backgroundColor: withAlpha(accentHex, "20"),
				boxShadow: `0 6px 18px ${withAlpha(accentHex, "1A")}`,
			}}
			whileTap={{
				backgroundColor: withAlpha(accentHex, "26"),
				scale: 0.98,
				boxShadow: `0 2px 10px ${withAlpha(accentHex, "1A")}`,
			}}
			transition={{ duration: 0.15, ease: "easeOut" }}
			aria-label="Download team commitments (.docx)"
			title="Download team commitments (.docx)"
		>
			<Download className="w-4 h-4" aria-hidden="true" />
			<span>Download Commitments (.docx)</span>
		</motion.button>
	);
}
