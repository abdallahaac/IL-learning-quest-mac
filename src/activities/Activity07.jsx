// src/pages/activities/Activity07.jsx
// activity7 (homogenized header/instructions to match Activity 01)
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
	Feather,
	Link2,
	BookText,
	BookOpen,
	Bookmark,
	ExternalLink,
} from "lucide-react";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity07({
	content,
	notes,
	onNotes,
	completed,
	onToggleComplete,
	accent = "#0D9488",
}) {
	const placeholder =
		content?.notePlaceholder || "Words/phrases and where they’re used…";

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

	/* -------------------------------------------------------------
     DOWNLOAD #1: CARDS ONLY
  -------------------------------------------------------------- */
	const downloadCardsDocx = async () => {
		const cards = Array.isArray(model.cards)
			? model.cards.filter((c) => c?.front?.trim() && c?.back?.trim())
			: [];
		if (!cards.length) return;

		const baseTitle = content?.title || "Learn Three Words";
		const fileName = `${(baseTitle || "activity-words")
			.toLowerCase()
			.replace(/\s+/g, "-")}-cards.docx`;

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
						text: "New word → Meaning",
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
										text: "Word",
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
										text: "Meaning",
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
            <p><em>New word → Meaning</em></p>
            <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
              <thead><tr><th>Word</th><th>Meaning</th></tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </body>
        </html>`.trim();
			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = (fileName || "cards.docx").replace(/\.docx$/i, ".doc");
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	// Optional one-card export
	const downloadOneCardDocx = async (i) => {
		const c = model.cards?.[i];
		if (!c?.front?.trim() || !c?.back?.trim()) return;
		const original = Array.isArray(model.cards) ? [...model.cards] : [];
		saveNotes({ ...model, cards: [c] });
		await downloadCardsDocx();
		saveNotes({ ...model, cards: original });
	};

	/* -------------------------------------------------------------
     DOWNLOAD #2: FULL PAGE SNAPSHOT — NoteComposer style
  -------------------------------------------------------------- */
	const activityNumber = 7;
	const downloadPageDocx = async () => {
		const baseTitle = content?.title || "Learn Three Words";
		const title = `Activity ${activityNumber}: ${baseTitle}`;
		const subtitle =
			content?.subtitle ||
			"Learn to say three words in an Indigenous language.";

		const headingHex = accent; // align heading color with page accent

		// page resources
		const resources = [
			{ label: "FirstVoices", href: "https://www.firstvoices.com/" },
			{
				label: "Inuktut glossary (Inuktut Tusaalanga)",
				href: "https://tusaalanga.ca/glossary",
			},
			{
				label: "Michif Language Revitalization Circle (resources)",
				href: "https://speakmichif.ca/learn/resources",
			},
			{
				label: "Métis languages resources (Louis Riel Institute)",
				href: "https://www.louisrielinstitute.ca/metis-languages-learning-resources",
			},
		];

		const bullets = (model.bullets || []).filter(Boolean);
		const cards = (model.cards || []).filter(
			(c) => c?.front?.trim() || c?.back?.trim()
		);

		const fileName = "activity-a7-reflection.docx";

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

			// Styled helpers (match NoteComposer)
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

			// Title / Subtitle
			children.push(Title(title));
			if (subtitle) children.push(SubtitleP(subtitle));

			// Activity tip (matches on-page copy)
			children.push(H2("Activity tip"));
			children.push(
				Body(
					"Share the words you learned with your team, and use them as often as possible."
				)
			);
			children.push(Body("Share them with your team and use them often."));

			// Resources — header + bullet hyperlinks
			if (resources.length) {
				children.push(H2("Resources"));
				resources.forEach((r) => children.push(BulletLink(r.label, r.href)));
			}

			// Saved response
			if (model.text?.trim()) {
				children.push(H2("Saved response"));
				model.text
					.split(/\n{2,}/)
					.map((p) => p.trim())
					.filter(Boolean)
					.forEach((p) => children.push(Body(p)));
			}

			// Saved bullets
			if (bullets.length) {
				children.push(H2("Bullet points"));
				bullets.forEach((b) => children.push(BulletP(b)));
			}

			// Cards table
			if (cards.length) {
				children.push(H2("Word cards"));

				const headerRow = new TableRow({
					children: [
						new TableCell({ children: [Body("Word")] }),
						new TableCell({ children: [Body("Meaning")] }),
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
		} catch {
			// HTML fallback (bullet hyperlinks + same section order)
			const esc = (s = "") =>
				String(s)
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
			const tip = [
				"Share the words you learned with your team, and use them as often as possible.",
				"Share them with your team and use them often.",
			];

			const resHtml = [
				{ label: "FirstVoices", href: "https://www.firstvoices.com/" },
				{
					label: "Inuktut glossary (Inuktut Tusaalanga)",
					href: "https://tusaalanga.ca/glossary",
				},
				{
					label: "Michif Language Revitalization Circle (resources)",
					href: "https://speakmichif.ca/learn/resources",
				},
				{
					label: "Métis languages resources (Louis Riel Institute)",
					href: "https://www.louisrielinstitute.ca/metis-languages-learning-resources",
				},
			]
				.map(
					(r) =>
						`<li><a href="${
							r.href
						}" style="text-decoration:underline; color:#0563C1;">${esc(
							r.label
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
            <h1 style="font-size:24pt; color:${esc(
							accent
						)}; margin:0 0 15pt;">${esc(title)}</h1>
            ${
							subtitle
								? `<p style="font-size:14pt; font-style:italic; margin:0 0 12pt;">${esc(
										subtitle
								  )}</p>`
								: ""
						}
            <h2 style="font-size:16pt; color:${esc(
							accent
						)}; margin:24pt 0 12pt;">Activity tip</h2>
            ${tip
							.map(
								(t) =>
									`<p style="font-size:12pt; margin:0 0 9pt;">${esc(t)}</p>`
							)
							.join("")}
            <h2 style="font-size:16pt; color:${esc(
							accent
						)}; margin:24pt 0 12pt;">Resources</h2>
            <ul style="margin:0 0 12pt 18pt; font-size:12pt;">${resHtml}</ul>
            ${
							model.text?.trim()
								? `<h2 style="font-size:16pt; color:${esc(
										accent
								  )}; margin:24pt 0 12pt;">Saved response</h2>
                   <p style="font-size:12pt; margin:0 0 9pt;">${esc(
											model.text
										).replace(/\n/g, "<br/>")}</p>`
								: ""
						}
            ${
							bulletsHtml
								? `<h2 style="font-size:16pt; color:${esc(
										accent
								  )}; margin:24pt 0 12pt;">Bullet points</h2><ul style="margin:0 0 12pt 18pt; font-size:12pt;">${bulletsHtml}</ul>`
								: ""
						}
            ${
							cardsHtml
								? `<h2 style="font-size:16pt; color:${esc(
										accent
								  )}; margin:24pt 0 12pt;">Word cards</h2>
                   <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
                     <thead><tr><th>Word</th><th>Meaning</th></tr></thead>
                     <tbody>${cardsHtml}</tbody>
                   </table>`
								: ""
						}
          </body>
        </html>`.trim();

			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = (fileName || "page.docx").replace(/\.docx$/i, ".doc");
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	/* ----- FLASHCARD EDITOR STATE ----- */
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

	// celebration when reaching 3+ valid cards
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

	// --- animations (single definition; matches other activities) ---
	const reduceMotion = useReducedMotion();
	const STAGGER = 0.14;
	const DELAY_CHILDREN = 0.1;

	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};
	const gridStagger = {
		hidden: {},
		show: {
			transition: {
				delayChildren: reduceMotion ? 0 : DELAY_CHILDREN,
				staggerChildren: reduceMotion ? 0 : STAGGER,
			},
		},
	};
	const cardPop = {
		hidden: {
			opacity: 0,
			y: reduceMotion ? 0 : 8,
			scale: reduceMotion ? 1 : 0.99,
		},
		show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
	};

	// shared classes (accent via outlineColor inline)
	const linkCardBase =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
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

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft accent gradient (match A01 style) */}
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b via-white/65 to-slate-50/80"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha(accent, "3D")},
            rgba(255,255,255,0.65),
            rgba(248,250,252,0.8)
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.35 }}
				transition={{ duration: 0.6 }}
			/>

			{/* celebration overlay */}
			<AnimatePresence initial={false} mode="wait">
				{celebrate && (
					<Celebration accent={accent} onClose={() => setCelebrate(false)} />
				)}
			</AnimatePresence>

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* ===== HEADER (matches Activity 01) ===== */}
				<motion.header
					className="text-center"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="mx-auto space-y-4 sm:space-y-5">
						{/* Activity number */}
						<p
							className="font-semibold uppercase tracking-wider text-2xl sm:text-3xl"
							style={{ color: accent }}
						>
							Activity {activityNumber}
						</p>

						{/* Title row: H1 + icon */}
						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{content?.title || "Learn Three Words"}
							</h1>
							<Feather
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout (same pattern as Activity 01) */}
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
									Instructions
								</div>
								<p
									className="text-slate-800 max-w-3xl"
									style={{ color: accent }}
								>
									Learn to say three words in an Indigenous language.
									<br />
									<strong>
										Share the words you learned with your team, and use them as
										often as possible.
									</strong>
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resources ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<motion.a
							href="https://www.firstvoices.com/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: FirstVoices (new tab)"
							aria-label="Open FirstVoices in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={BookOpen}>FirstVoices</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://tusaalanga.ca/glossary"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Inuktut glossary (new tab)"
							aria-label="Open Inuktut glossary in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={BookOpen}>
								Inuktut glossary (Inuktut Tusaalanga)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://speakmichif.ca/learn/resources"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Michif Language Revitalization Circle resources (new tab)"
							aria-label="Open Michif Language Revitalization Circle resources in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={BookOpen}>
								Michif Language Revitalization Circle (resources)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://www.louisrielinstitute.ca/metis-languages-learning-resources"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Métis languages resources — Louis Riel Institute (new tab)"
							aria-label="Open Métis languages resources in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={BookOpen}>
								Métis languages resources (Louis Riel Institute)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* ===== Editor LEFT · Flip preview RIGHT ===== */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* LEFT: Editor card */}
					<div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow p-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-slate-900">
								Add your words (Flip Cards)
							</h3>
							<span className="text-sm text-slate-500">{validCount} cards</span>
						</div>
						<p className="text-sm text-slate-600 mt-1">
							Tip: press <kbd>Enter</kbd> in the “Back” field to add quickly.
						</p>

						{/* input row */}
						<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
							<input
								value={newFront}
								onChange={(e) => setNewFront(e.target.value)}
								placeholder="Front (word / phrase)"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                           focus:outline-none focus-visible:ring-2"
								style={{ outlineColor: accent }}
							/>
							<input
								value={newBack}
								onChange={(e) => setNewBack(e.target.value)}
								onKeyDown={handleNewKey}
								placeholder="Back (meaning / translation)"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                           focus:outline-none focus-visible:ring-2"
								style={{ outlineColor: accent }}
							/>
						</div>

						<div className="mt-3 flex justify-center">
							<button
								type="button"
								onClick={addCard}
								disabled={!newFront.trim() || !newBack.trim()}
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white disabled:opacity-50
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
								style={{ backgroundColor: accent, outlineColor: accent }}
							>
								Add card
							</button>
						</div>

						{/* Editable list */}
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
												className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                                   focus:outline-none focus-visible:ring-2"
												style={{ outlineColor: accent }}
												placeholder="Front"
											/>
											<span className="hidden sm:block text-xs text-slate-500 px-1 text-center">
												↔
											</span>
											<input
												value={c.back}
												onChange={(e) => updateCard(i, "back", e.target.value)}
												aria-label={`Back ${i + 1}`}
												className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                                   focus:outline-none focus-visible:ring-2"
												style={{ outlineColor: accent }}
												placeholder="Back"
											/>

											<div className="flex items-center gap-2 sm:ml-2">
												<button
													type="button"
													onClick={() => removeCard(i)}
													className="text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
													title="Remove"
												>
													Remove
												</button>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-slate-500">
									No cards yet — add your first above.
									<br />
									Add word cards below (word on the front, meaning on the back).
									<br />
									Click a card to flip it and practice anytime.
								</p>
							)}
						</div>
					</div>

					{/* RIGHT: Flip preview wrapped in a matching card */}
					<div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow p-4 flex items-center justify-center">
						<Flashcards cards={model.cards || []} accent={accent} />
					</div>
				</section>

				{/* ------- Bottom action bar ------- */}
				<div
					className="mt-6 pt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-2 sm:justify-end"
					style={{ borderColor: "rgba(203,213,225,0.8)" }}
				>
					<button
						type="button"
						onClick={onToggleComplete}
						aria-pressed={!!completed}
						className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
							completed
								? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
								: "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100"
						}`}
						title={completed ? "Marked Complete" : "Mark Complete"}
					>
						{completed ? "Marked Complete" : "Mark Complete"}
					</button>

					<button
						type="button"
						onClick={downloadPageDocx}
						className="px-4 py-2 rounded-lg text-white"
						style={{ backgroundColor: accent }}
						title="Export page (title, tip, resources, saved response, bullets, and cards) as .docx"
					>
						Download (.docx)
					</button>
				</div>
			</div>
		</motion.div>
	);
}

/* ----- Flashcards ----- */
function Flashcards({ cards = [], accent = "#0D9488" }) {
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
				{count ? `${i + 1} / ${count}` : "No cards yet"}
			</div>

			{/* Outer shell */}
			<button
				disabled={!curr}
				onClick={() => curr && setFlipped(!flipped)}
				className={`relative w-full aspect-[4/3] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden
          ${curr ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
				style={{ perspective: 1000 }}
				title={curr ? "Click to flip" : undefined}
				type="button"
			>
				{/* Inner flipper */}
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
					{/* FRONT */}
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
							New word
						</div>
						<div className="h-full w-full grid place-items-center px-6 pt-8">
							<div className="text-2xl font-semibold text-gray-800 text-center">
								{curr ? curr.front : "Add cards to get started"}
							</div>
						</div>
					</div>

					{/* BACK */}
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
							Meaning / Translation
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
					Back
				</button>
				<button
					onClick={next}
					disabled={!count}
					className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
					style={{ backgroundColor: accent }}
				>
					Next
				</button>
			</div>
		</div>
	);
}

/* ---- Celebration overlay ---- */
function Celebration({ onClose, accent = "#0D9488" }) {
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
					<p className="text-lg font-semibold">Nice! You added 3 words 🎉</p>
				</div>
				<p className="text-sm text-slate-700 text-center mt-1">
					Keep going—add more and practice by flipping the cards.
				</p>
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
