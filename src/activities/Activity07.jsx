// src/pages/activities/Activity07.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Feather, BookOpen, ExternalLink } from "lucide-react";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITIES_CONTENT } from "../constants/content.js";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

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

export default function Activity07({
	content, // still accepted but we prefer ACTIVITIES_CONTENT source
	notes,
	onNotes,
	completed,
	onToggleComplete,
	accent = "#0D9488",
}) {
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const reduceMotion = useReducedMotion();

	// canonical source: ACTIVITIES_CONTENT.a7[lang] or fallback to provided prop
	const a7Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a7 &&
			(ACTIVITIES_CONTENT.a7[lang] || ACTIVITIES_CONTENT.a7.en)) ||
		content ||
		{};

	// UI strings grouped under a7Content.ui
	const ui = a7Content.ui || {};
	const uiSafe = {
		instructionsPill:
			ui.instructionsPill || (lang === "fr" ? "Consignes" : "Instructions"),
		editorHeading:
			ui.editorHeading ||
			(lang === "fr"
				? "Ajoutez vos mots (cartes à retourner)"
				: "Add your words (Flip Cards)"),
		editorTip:
			ui.editorTip ||
			(lang === "fr"
				? "Astuce : appuyez sur Entrée dans le champ « Retour » pour ajouter rapidement."
				: "Tip: press Enter in the Back field to add quickly."),
		frontPlaceholder:
			ui.frontPlaceholder ||
			(lang === "fr" ? "Recto (mot / expression)" : "Front (word / phrase)"),
		backPlaceholder:
			ui.backPlaceholder ||
			(lang === "fr"
				? "Verso (sens / traduction)"
				: "Back (meaning / translation)"),
		addCardButton:
			ui.addCardButton || (lang === "fr" ? "Ajouter la carte" : "Add card"),
		removeButton: ui.removeButton || (lang === "fr" ? "Supprimer" : "Remove"),
		cardsCountSuffix:
			ui.cardsCountSuffix || (lang === "fr" ? "cartes" : "cards"),
		noCardsPrimary:
			ui.noCardsPrimary ||
			(lang === "fr"
				? "Aucune carte pour l’instant — ajoutez la première au-dessus."
				: "No cards yet — add your first above."),
		noCardsSecondary:
			ui.noCardsSecondary ||
			(lang === "fr"
				? "Ajoutez des cartes-mots ci-dessous (mot au recto, sens au verso). Cliquez sur une carte pour la retourner et vous entraîner."
				: "Add word cards below (word on the front, meaning on the back). Click a card to flip it and practice anytime."),
		newWordLabel:
			ui.newWordLabel || (lang === "fr" ? "Nouveau mot" : "New word"),
		meaningLabel:
			ui.meaningLabel ||
			(lang === "fr" ? "Sens / Traduction" : "Meaning / Translation"),
		openLinkLabel:
			ui.openLinkLabel || (lang === "fr" ? "Ouvrir le lien" : "Open link"),
		downloadButton:
			ui.downloadButton ||
			(lang === "fr" ? "Télécharger (.docx)" : "Download (.docx)"),
		downloadCardsIntro:
			ui.downloadCardsIntro ||
			(lang === "fr" ? "Nouveau mot → Sens" : "New word → Meaning"),
		doc: ui.doc || {
			activityTipHeader: lang === "fr" ? "Conseil d’activité" : "Activity tip",
			resourcesHeader: lang === "fr" ? "Ressources" : "Resources",
			savedResponseHeader:
				lang === "fr" ? "Réponse enregistrée" : "Saved response",
			bulletPointsHeader: lang === "fr" ? "Points clés" : "Bullet points",
			wordCardsHeader: lang === "fr" ? "Cartes-mots" : "Word cards",
			wordColumn: lang === "fr" ? "Mot" : "Word",
			meaningColumn: lang === "fr" ? "Sens" : "Meaning",
		},
		celebrateTitle:
			ui.celebrateTitle ||
			(lang === "fr"
				? "Bravo ! Vous avez ajouté 3 mots 🎉"
				: "Nice! You added 3 words 🎉"),
		celebrateBody:
			ui.celebrateBody ||
			(lang === "fr"
				? "Continuez — ajoutez-en davantage et entraînez-vous en retournant les cartes."
				: "Keep going—add more and practice by flipping the cards."),
	};

	const activityNumber = Number.isFinite(a7Content?.number)
		? a7Content.number
		: 7;
	const pageTitle =
		a7Content?.title ||
		(lang === "fr" ? "Apprenez à prononcer trois mots" : "Learn Three Words");
	const tipText =
		a7Content?.tip ||
		(lang === "fr"
			? "Apprenez à prononcer trois mots..."
			: "Learn to say three words...");
	const placeholder =
		a7Content?.notePlaceholder ||
		(lang === "fr"
			? "Cliquez ou tapez ici pour saisir du texte."
			: "Words/phrases and where they’re used…");
	const instructionsHtml = a7Content?.instructionsHtml ?? null;

	// normalize notes -> object with cards
	const initialModel = useMemo(() => {
		if (typeof notes === "string" || !notes) {
			return { text: notes || "", bullets: [], cards: [] };
		}
		return {
			text: notes.text || "",
			bullets: Array.isArray(notes.bullets) ? notes.bullets : [],
			cards: Array.isArray(notes.cards) ? notes.cards : [],
		};
	}, [notes]);

	const [model, setModel] = useState(initialModel);
	const saveNotes = (next) => {
		setModel(next);
		onNotes?.(next);
	};

	useEffect(() => {
		if (!notes) {
			setModel({ text: "", bullets: [], cards: [] });
			return;
		}
		if (typeof notes === "string") {
			setModel({ text: notes, bullets: [], cards: [] });
			return;
		}
		setModel({
			text: notes.text || "",
			bullets: Array.isArray(notes.bullets) ? notes.bullets : [],
			cards: Array.isArray(notes.cards) ? notes.cards : [],
		});
	}, [notes]);

	/* ------- download cards (table) ------- */
	const downloadCardsDocx = async () => {
		const cards = Array.isArray(model.cards)
			? model.cards.filter((c) => c?.front?.trim() && c?.back?.trim())
			: [];
		if (!cards.length) return;

		const baseTitle = pageTitle;
		const fileName = `${(baseTitle || "activity-words")
			.toLowerCase()
			.replace(/\s+/g, "-")}-cards.docx`;
		const wordHeader = uiSafe.doc.wordColumn;
		const meaningHeader = uiSafe.doc.meaningColumn;
		const introText = uiSafe.downloadCardsIntro;

		try {
			const {
				Document,
				Packer,
				Paragraph,
				Table,
				TableRow,
				TableCell,
				WidthType,
				TextRun,
				AlignmentType,
				BorderStyle,
			} = await import("docx");

			const heading = new Paragraph({
				children: [
					new TextRun({ text: baseTitle, bold: true, size: 48, font: "Arial" }),
				],
				spacing: { after: 300 },
			});

			const intro = new Paragraph({
				children: [
					new TextRun({
						text: introText,
						italics: true,
						font: "Arial",
						size: 24,
					}),
				],
				spacing: { after: 200 },
			});

			const headerRow = new TableRow({
				children: [
					new TableCell({
						children: [
							new Paragraph({
								children: [
									new TextRun({
										text: wordHeader,
										bold: true,
										font: "Arial",
										size: 24,
									}),
								],
							}),
						],
					}),
					new TableCell({
						children: [
							new Paragraph({
								children: [
									new TextRun({
										text: meaningHeader,
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

			const bodyRows = cards.map(
				({ front, back }) =>
					new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph({
										children: [
											new TextRun({
												text: String(front),
												font: "Arial",
												size: 24,
											}),
										],
									}),
								],
							}),
							new TableCell({
								children: [
									new Paragraph({
										children: [
											new TextRun({
												text: String(back),
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

			const table = new Table({
				width: { size: 100, type: WidthType.PERCENTAGE },
				rows: [headerRow, ...bodyRows],
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

			const doc = new Document({
				styles: { default: { document: { run: { font: "Arial", size: 24 } } } },
				sections: [{ properties: {}, children: [heading, intro, table] }],
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
			// fallback HTML
			const esc = (s = "") =>
				String(s)
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
			const rowsHtml = (Array.isArray(model.cards) ? model.cards : [])
				.filter((c) => c?.front?.trim() && c?.back?.trim())
				.map((c) => `<tr><td>${esc(c.front)}</td><td>${esc(c.back)}</td></tr>`)
				.join("");
			const html = `
        <html>
          <head><meta charset="utf-8"><title>${esc(baseTitle)}</title></head>
          <body style="font-family:Arial;">
            <h1>${esc(baseTitle)}</h1>
            <p><em>${esc(introText)}</em></p>
            <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
              <thead><tr><th>${esc(wordHeader)}</th><th>${esc(
				meaningHeader
			)}</th></tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </body>
        </html>`.trim();
			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName.replace(/\.docx$/i, ".doc");
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	const downloadOneCardDocx = async (i) => {
		const c = model.cards?.[i];
		if (!c?.front?.trim() || !c?.back?.trim()) return;
		const original = Array.isArray(model.cards) ? [...model.cards] : [];
		saveNotes({ ...model, cards: [c] });
		await downloadCardsDocx();
		saveNotes({ ...model, cards: original });
	};

	/* ------- full page export (docx) ------- */
	const downloadPageDocx = async () => {
		const baseTitle = pageTitle;
		const title = `Activity ${activityNumber}: ${baseTitle}`;
		const subtitle = a7Content?.subtitle || "";
		const headingHex = accent;

		// use content.links for resources
		const resources = Array.isArray(a7Content?.links) ? a7Content.links : [];

		const bullets = (model.bullets || []).filter(Boolean);
		const cards = (model.cards || []).filter(
			(c) => c?.front?.trim() || c?.back?.trim()
		);
		const fileName = `activity-a${activityNumber}-reflection.docx`;

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
				ExternalHyperlink,
			} = await import("docx");

			// helpers
			const Title = (t) =>
				new Paragraph({
					alignment: AlignmentType.LEFT,
					spacing: { before: 0, after: 300 },
					children: [
						new TextRun({
							text: t,
							bold: true,
							size: 48,
							font: "Arial",
							color: headingHex,
						}),
					],
				});

			const SubtitleP = (t) =>
				new Paragraph({
					spacing: { before: 0, after: 240 },
					children: [
						new TextRun({ text: t, italics: true, size: 28, font: "Arial" }),
					],
				});

			const H2 = (t) =>
				new Paragraph({
					spacing: { before: 280, after: 160 },
					children: [
						new TextRun({
							text: t,
							bold: true,
							size: 32,
							font: "Arial",
							color: headingHex,
						}),
					],
				});

			const Body = (t) =>
				new Paragraph({
					spacing: { before: 0, after: 120, line: 360 },
					children: [new TextRun({ text: t, size: 24, font: "Arial" })],
				});

			const BulletP = (t) =>
				new Paragraph({
					spacing: { before: 0, after: 60 },
					bullet: { level: 0 },
					children: [new TextRun({ text: t, size: 24, font: "Arial" })],
				});

			const BulletLink = (label, url) =>
				new Paragraph({
					spacing: { before: 0, after: 60 },
					bullet: { level: 0 },
					children: [
						url
							? new ExternalHyperlink({
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
							  })
							: new TextRun({ text: label || "-", font: "Arial", size: 24 }),
					],
				});

			const children = [];
			children.push(Title(title));
			if (subtitle) children.push(SubtitleP(subtitle));

			// Activity tip (from content)
			children.push(H2(uiSafe.doc.activityTipHeader));
			children.push(Body(tipText));

			// Resources
			if (resources.length) {
				children.push(H2(uiSafe.doc.resourcesHeader));
				resources.forEach((r) =>
					children.push(BulletLink(r.label || r, r.url || r.href || ""))
				);
			}

			// Saved response
			if (model.text?.trim()) {
				children.push(H2(uiSafe.doc.savedResponseHeader));
				model.text
					.split(/\n{2,}/)
					.map((p) => p.trim())
					.filter(Boolean)
					.forEach((p) => children.push(Body(p)));
			}

			// Bullets
			if (bullets.length) {
				children.push(H2(uiSafe.doc.bulletPointsHeader));
				bullets.forEach((b) => children.push(BulletP(b)));
			}

			// Cards table
			if (cards.length) {
				children.push(H2(uiSafe.doc.wordCardsHeader));
				const headerRow = new TableRow({
					children: [
						new TableCell({ children: [Body(uiSafe.doc.wordColumn)] }),
						new TableCell({ children: [Body(uiSafe.doc.meaningColumn)] }),
					],
					tableHeader: true,
				});

				const bodyRows = cards.map((c) => {
					const f = (c?.front || "").trim();
					const b = (c?.back || "").trim();
					return new TableRow({
						children: [
							new TableCell({ children: [Body(f || "")] }),
							new TableCell({ children: [Body(b || "")] }),
						],
					});
				});

				const table = new Table({
					width: { size: 100, type: WidthType.PERCENTAGE },
					rows: [headerRow, ...bodyRows],
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

				children.push(table);
			}

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
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			// fallback HTML (keeps same order and headings)
			const esc = (s = "") =>
				String(s)
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
			const resHtml = (Array.isArray(a7Content?.links) ? a7Content.links : [])
				.map(
					(r) =>
						`<li><a href="${
							r.url || r.href || "#"
						}" style="text-decoration:underline; color:#0563C1;">${esc(
							r.label || r
						)}</a></li>`
				)
				.join("");
			const bulletsHtml = (model.bullets || [])
				.filter(Boolean)
				.map((b) => `<li>${esc(b)}</li>`)
				.join("");
			const cardsHtml = (model.cards || [])
				.filter((c) => c?.front?.trim() || c?.back?.trim())
				.map(
					(c) =>
						`<tr><td>${esc(c?.front || "")}</td><td>${esc(
							c?.back || ""
						)}</td></tr>`
				)
				.join("");
			const html = `
        <html>
          <head><meta charset="utf-8"><title>${esc(title)}</title></head>
          <body style="font-family:Arial; line-height:1.5;">
            ${
							subtitle
								? `<p style="font-style:italic">${esc(subtitle)}</p>`
								: ""
						}
            <h2 style="color:${esc(accent)}">${esc(
				uiSafe.doc.activityTipHeader
			)}</h2>
            <p>${esc(tipText)}</p>
            ${
							resHtml
								? `<h2 style="color:${esc(accent)}">${esc(
										uiSafe.doc.resourcesHeader
								  )}</h2><ul>${resHtml}</ul>`
								: ""
						}
            ${
							model.text?.trim()
								? `<h2 style="color:${esc(accent)}">${esc(
										uiSafe.doc.savedResponseHeader
								  )}</h2><p>${esc(model.text).replace(/\n/g, "<br/>")}</p>`
								: ""
						}
            ${
							bulletsHtml
								? `<h2 style="color:${esc(accent)}">${esc(
										uiSafe.doc.bulletPointsHeader
								  )}</h2><ul>${bulletsHtml}</ul>`
								: ""
						}
            ${
							cardsHtml
								? `<h2 style="color:${esc(accent)}">${esc(
										uiSafe.doc.wordCardsHeader
								  )}</h2><table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;"><thead><tr><th>${esc(
										uiSafe.doc.wordColumn
								  )}</th><th>${esc(
										uiSafe.doc.meaningColumn
								  )}</th></tr></thead><tbody>${cardsHtml}</tbody></table>`
								: ""
						}
          </body>
        </html>`.trim();
			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName.replace(/\.docx$/i, ".doc");
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	/* ----- flashcard editor state ----- */
	const [newFront, setNewFront] = useState("");
	const [newBack, setNewBack] = useState("");

	const addCard = () => {
		const f = newFront.trim();
		const b = newBack.trim();
		if (!f || !b) return;
		const next = {
			...model,
			cards: [...(model.cards || []), { front: f, back: b }],
		};
		saveNotes(next);
		setNewFront("");
		setNewBack("");
	};

	const updateCard = (i, field, val) => {
		const list = Array.isArray(model.cards) ? [...model.cards] : [];
		if (!list[i]) return;
		list[i] = { ...list[i], [field]: val };
		saveNotes({ ...model, cards: list });
	};

	const removeCard = (i) => {
		const list = Array.isArray(model.cards) ? [...model.cards] : [];
		list.splice(i, 1);
		saveNotes({ ...model, cards: list });
	};

	const handleNewKey = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addCard();
		}
	};

	const validCount = (model.cards || []).filter(
		(c) => c?.front?.trim() && c?.back?.trim()
	).length;

	const [celebrate, setCelebrate] = useState(false);
	const prevValidRef = useRef(validCount);
	useEffect(() => {
		const prev = prevValidRef.current;
		if (prev < 3 && validCount >= 3) setCelebrate(true);
		prevValidRef.current = validCount;
	}, [validCount]);

	// determine started based on cards (same gating as before)
	const started = hasActivityStarted(model, "cards");

	// shared style classes
	const linkCardBase =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div
				className={badgeBase + " absolute left-0 top-1/2 -translate-y-1/2"}
				style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
			>
				<Icon className="w-5 h-5" />
			</div>
			<div className="w-full text-center font-medium text-slate-900 group-hover:underline">
				{children}
			</div>
		</div>
	);

	// outlets for UI from a7Content.outlets
	const outletTiles = Array.isArray(a7Content?.outlets)
		? a7Content.outlets
		: [];

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={{
				hidden: { opacity: 0 },
				show: { opacity: 1, transition: { duration: 0.35 } },
			}}
			initial="hidden"
			animate="show"
		>
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b via-white/65 to-slate-50/80"
				style={{
					backgroundImage: `linear-gradient(to bottom, ${withAlpha(
						accent,
						"3D"
					)}, rgba(255,255,255,0.65), rgba(248,250,252,0.8))`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.35 }}
				transition={{ duration: 0.6 }}
			/>

			<AnimatePresence initial={false} mode="wait">
				{celebrate && (
					<Celebration
						accent={accent}
						onClose={() => setCelebrate(false)}
						title={uiSafe.celebrateTitle}
						body={uiSafe.celebrateBody}
					/>
				)}
			</AnimatePresence>

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				<motion.header
					className="text-center"
					variants={{
						hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
						show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
					}}
					initial="hidden"
					animate="show"
				>
					<div className="mx-auto space-y-4 sm:space-y-5">
						<p
							className="font-semibold uppercase tracking-wider text-2xl sm:text-3xl"
							style={{ color: accent }}
						>
							{`${lang === "fr" ? "Activité" : "Activity"} ${activityNumber}`}
						</p>

						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{pageTitle}
							</h1>
							<Feather
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						<aside
							role="note"
							aria-label="Activity instructions"
							className="mx-auto max-w-3xl rounded-2xl border bg-white/85 backdrop-blur-sm px-5 py-4 text-base sm:text-lg leading-relaxed shadow-[0_1px_0_rgba(0,0,0,0.05)]"
							style={{ borderColor: withAlpha(accent, "33") }}
						>
							<div className="flex flex-col items-center gap-3 text-center">
								<div
									className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold"
									style={{
										backgroundColor: withAlpha(accent, "15"),
										color: accent,
									}}
									aria-hidden="true"
								>
									{uiSafe.instructionsPill}
								</div>

								{instructionsHtml ? (
									<div
										className="text-slate-800 max-w-3xl"
										style={{ color: accent }}
										dangerouslySetInnerHTML={{ __html: instructionsHtml }}
									/>
								) : (
									<p
										className="text-slate-800 max-w-3xl"
										style={{ color: accent }}
									>
										{tipText}
										<br />
										<strong>{uiSafe.editorTip}</strong>
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				<motion.section
					className="grid grid-cols-1 sm:grid-cols-2 gap-6"
					initial="hidden"
					animate="show"
					variants={{
						hidden: {},
						show: {
							transition: {
								delayChildren: reduceMotion ? 0 : 0.1,
								staggerChildren: reduceMotion ? 0 : 0.14,
							},
						},
					}}
				>
					{outletTiles.map((o, idx) => (
						<motion.a
							key={o.href || idx}
							href={o.href}
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title={`Open: ${o.title}`}
							aria-label={`Open ${o.title} in a new tab`}
							variants={{
								hidden: { opacity: 0, y: 8 },
								show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
							}}
						>
							<TitleRow Icon={BookOpen}>{o.title}</TitleRow>
							{o.desc ? (
								<p className="mt-2 text-sm text-gray-600 text-center max-w-sm mx-auto">
									{o.desc}
								</p>
							) : null}
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>{uiSafe.openLinkLabel}</span>
							</div>
						</motion.a>
					))}
				</motion.section>

				<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow p-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-slate-900">
								{uiSafe.editorHeading}
							</h3>
							<span className="text-sm text-slate-500">
								{validCount} {uiSafe.cardsCountSuffix}
							</span>
						</div>
						<p className="text-sm text-slate-600 mt-1">{uiSafe.editorTip}</p>

						<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
							<input
								value={newFront}
								onChange={(e) => setNewFront(e.target.value)}
								placeholder={uiSafe.frontPlaceholder}
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2"
								style={{ outlineColor: accent }}
							/>
							<input
								value={newBack}
								onChange={(e) => setNewBack(e.target.value)}
								onKeyDown={handleNewKey}
								placeholder={uiSafe.backPlaceholder}
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2"
								style={{ outlineColor: accent }}
							/>
						</div>

						<div className="mt-3 flex justify-center">
							<button
								type="button"
								onClick={addCard}
								disabled={!newFront.trim() || !newBack.trim()}
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
								style={{ backgroundColor: accent, outlineColor: accent }}
							>
								{uiSafe.addCardButton}
							</button>
						</div>

						<div className="mt-4">
							{model.cards?.length ? (
								<ul className="space-y-2">
									{model.cards.map((c, i) => (
										<li
											key={i}
											className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center"
										>
											<input
												value={c.front}
												onChange={(e) => updateCard(i, "front", e.target.value)}
												aria-label={`Front ${i + 1}`}
												className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2"
												style={{ outlineColor: accent }}
												placeholder={uiSafe.frontPlaceholder}
											/>
											<span className="hidden sm:block text-xs text-slate-500 px-1 text-center">
												↔
											</span>
											<input
												value={c.back}
												onChange={(e) => updateCard(i, "back", e.target.value)}
												aria-label={`Back ${i + 1}`}
												className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2"
												style={{ outlineColor: accent }}
												placeholder={uiSafe.backPlaceholder}
											/>
											<div className="flex items-center gap-2 sm:ml-2">
												<button
													type="button"
													onClick={() => removeCard(i)}
													className="text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
													title={uiSafe.removeButton}
												>
													{uiSafe.removeButton}
												</button>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-slate-500">
									{uiSafe.noCardsPrimary}
									<br />
									{uiSafe.noCardsSecondary}
								</p>
							)}
						</div>
					</div>

					<div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow p-4 flex items-center justify-center">
						<Flashcards
							cards={model.cards || []}
							accent={accent}
							uiSafe={uiSafe}
						/>
					</div>
				</section>

				<div
					className="mt-6 pt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-2 sm:justify-end"
					style={{ borderColor: "rgba(203,213,225,0.8)" }}
				>
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>

					<button
						type="button"
						onClick={downloadPageDocx}
						className="px-4 py-2 rounded-lg text-white"
						style={{ backgroundColor: accent }}
						title={uiSafe.downloadButton}
					>
						{uiSafe.downloadButton}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

/* ----- Flashcards ----- */
function Flashcards({ cards = [], accent = "#0D9488", uiSafe = {} }) {
	const safeCards = Array.isArray(cards) ? cards : [];
	const [i, setI] = useState(0);
	const [flipped, setFlipped] = useState(false);

	const count = safeCards.length;
	const curr = count ? safeCards[Math.max(0, Math.min(i, count - 1))] : null;

	const next = () => {
		if (!count) return;
		setFlipped(false);
		setI((v) => (v + 1) % count);
	};
	const prev = () => {
		if (!count) return;
		setFlipped(false);
		setI((v) => (v - 1 + count) % count);
	};

	return (
		<div className="grid gap-4 place-items-center w-full">
			<div className="text-sm text-gray-600">
				{count ? `${i + 1} / ${count}` : uiSafe.noCardsPrimary}
			</div>

			<button
				disabled={!curr}
				onClick={() => curr && setFlipped(!flipped)}
				className={`relative w-full aspect-[4/3] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
					curr ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
				}`}
				style={{ perspective: 1000 }}
				title={curr ? uiSafe.newWordLabel : undefined}
				type="button"
			>
				<motion.div
					animate={{ rotateY: flipped ? 180 : 0 }}
					transition={{ duration: 0.45 }}
					style={{
						transformStyle: "preserve-3d",
						width: "100%",
						height: "100%",
						willChange: "transform",
					}}
					className="relative"
				>
					<div
						className="absolute inset-0 grid place-items-center"
						style={{
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
						}}
					>
						<div
							className="absolute top-0 left-0 right-0 px-3 py-1.5 text-[11px] font-medium"
							style={{ color: accent }}
						>
							{uiSafe.newWordLabel}
						</div>
						<div className="h-full w-full grid place-items-center px-6 pt-8">
							<div className="text-2xl font-semibold text-gray-800 text-center">
								{curr ? curr.front : uiSafe.noCardsPrimary}
							</div>
						</div>
					</div>

					<div
						className="absolute inset-0 grid place-items-center"
						style={{
							transform: "rotateY(180deg)",
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
						}}
					>
						<div
							className="absolute top-0 left-0 right-0 px-3 py-1.5 text-[11px] font-medium"
							style={{ color: accent }}
						>
							{uiSafe.meaningLabel}
						</div>
						<div className="h-full w-full grid place-items-center px-6 pt-8">
							<div className="text-2xl font-semibold text-gray-800 text-center">
								{curr ? curr.back : ""}
							</div>
						</div>
					</div>
				</motion.div>
			</button>

			<div className="flex gap-2 justify-center">
				<button
					onClick={prev}
					disabled={!count}
					className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
				>
					{langLabel("Back")}
				</button>
				<button
					onClick={next}
					disabled={!count}
					className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
					style={{ backgroundColor: accent }}
				>
					{langLabel("Next")}
				</button>
			</div>
		</div>
	);
}

// small i18n helper for Back/Next (keeps small UI localized)
function langLabel(key) {
	if (typeof key !== "string") return key;
	// only Back/Next localized here; other text comes from content
	const map = {
		Back: { en: "Back", fr: "Précédent" },
		Next: { en: "Next", fr: "Suivant" },
	};
	const lang =
		(typeof document !== "undefined" &&
			document.documentElement?.getAttribute("lang")) ||
		navigator?.language ||
		navigator?.languages?.[0] ||
		"en";
	const short = lang.toLowerCase().slice(0, 2) === "fr" ? "fr" : "en";
	return map[key] ? map[key][short] : key;
}

/* ---- Celebration overlay ---- */
function Celebration({
	onClose,
	accent = "#0D9488",
	title = "Nice! You added 3 words 🎉",
	body = "Keep going—add more and practice by flipping the cards.",
}) {
	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		window.addEventListener("keydown", onEsc);
		const t = window.setTimeout(() => onClose?.(), 1600);
		return () => {
			window.removeEventListener("keydown", onEsc);
			window.clearTimeout(t);
		};
	}, [onClose]);

	return (
		<motion.div
			onClick={onClose}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.35 }}
			className="fixed inset-0 z-50 grid place-items-center"
			style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
		>
			<motion.div
				initial={{ scale: 0.9, rotate: -6, opacity: 0 }}
				animate={{ scale: 1.05, rotate: 0, opacity: 1 }}
				exit={{ scale: 0.96, opacity: 0 }}
				transition={{ type: "spring", stiffness: 220, damping: 16 }}
				className="rounded-2xl border shadow-xl px-6 py-4"
				style={{
					backgroundColor: "rgba(255,255,255,0.95)",
					borderColor: withAlpha(accent, "33"),
				}}
			>
				<div className="flex items-center gap-3" style={{ color: accent }}>
					<Feather className="w-6 h-6" />
					<p className="text-lg font-semibold">{title}</p>
				</div>
				<p className="text-sm text-slate-700 text-center mt-1">{body}</p>
			</motion.div>

			{[...Array(18)].map((_, i) => (
				<ConfettiDot key={i} accent={accent} />
			))}
		</motion.div>
	);
}

/* tiny confetti dots */
function ConfettiDot({ accent = "#0D9488" }) {
	const x = Math.random() * 100;
	const y = Math.random() * 100;
	const s = 6 + Math.random() * 10;
	const dur = 0.8 + Math.random() * 0.8;
	const colors = [accent, "#14b8a6", "#99f6e4", "#34d399", "#fcd34d"];
	return (
		<motion.span
			initial={{ opacity: 0, scale: 0.6, x: "0vw", y: "0vh" }}
			animate={{ opacity: 1, scale: 1, x: `${x - 50}vw`, y: `${y - 50}vh` }}
			exit={{ opacity: 0 }}
			transition={{ duration: dur, ease: "easeOut" }}
			className="pointer-events-none fixed z-50 rounded-full"
			style={{
				width: s,
				height: s,
				background: colors[Math.floor(Math.random() * colors.length)],
			}}
		/>
	);
}
