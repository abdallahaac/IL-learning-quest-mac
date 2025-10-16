// src/pages/activities/Activity09.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Newspaper, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITIES_CONTENT } from "../constants/content.js";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
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

export default function Activity09({
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#934D6C", // theming control
}) {
	// language (mirror pattern used in other activities)
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const reduceMotion = useReducedMotion();

	// pick activity content from ACTIVITIES_CONTENT (lang-aware)
	const a9Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a9 &&
			(ACTIVITIES_CONTENT.a9[lang] || ACTIVITIES_CONTENT.a9.en)) ||
		{};

	// small helpers / fallbacks pulled from content
	const activityNumber = Number.isFinite(a9Content?.number)
		? a9Content.number
		: 9;
	const pageTitle = a9Content?.title || "Indigenous-Focused News Story";
	const tipText =
		a9Content?.tip ||
		(lang === "fr"
			? "Découvrez un reportage axé sur les réalités autochtones et réfléchissez à sa portée."
			: "Uncover a news story with an Indigenous focus and reflect on the scope of the story.");
	const placeholder =
		a9Content?.notePlaceholder ||
		(lang === "fr"
			? "Lien vers l’article, vos réflexions…"
			: "Story link; your reflections…");
	const linksHeading =
		a9Content?.resourcesHeading ||
		(lang === "fr" ? "Ressources" : "Suggested Indigenous-Led Outlets");

	// instructionsHtml (support formatted instructions from content)
	const instructionsHtml =
		a9Content?.instructionsHtml ||
		(a9Content?.cdata && a9Content.cdata.instructionsHtml) ||
		null;

	// keep local state in sync with incoming prop
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const started = hasActivityStarted(localNotes);

	// --- animations (same pattern) ---
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

	// --- shared classes (mirrors other pages) ---
	const linkCardBase =
		"group relative block w-full rounded-2xl border border-gray-200 bg-white p-5 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase =
		"absolute left-5 top-5 w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	// pageLinks for exports — prefer content.links, fallback to sensible defaults
	const pageLinks = useMemo(() => {
		if (Array.isArray(a9Content?.links) && a9Content.links.length > 0) {
			return a9Content.links.map((l) =>
				typeof l === "string"
					? { label: l, url: "" }
					: { label: l.label || l.title || "", url: l.url || l.href || "" }
			);
		}
		// fallback list (keeps previous UX if content not provided)
		return [
			{ label: "APTN", url: "https://www.aptntv.ca/" },
			{
				label: "The Turtle Island News",
				url: "https://theturtleislandnews.com/",
			},
			{ label: "Ku'ku'kwes News", url: "https://kukukwes.com/" },
			{ label: "IndigiNews", url: "https://indiginews.com/" },
			{ label: "Ha-Shilth-Sa", url: "https://hashilthsa.com/" },
			{ label: "Windspeaker", url: "https://windspeaker.com/" },
		];
	}, [a9Content]);

	// outlet tiles (UI) — prefer content.outlets, else derive from links or use fallback
	const outletTiles = useMemo(() => {
		if (Array.isArray(a9Content?.outlets) && a9Content.outlets.length > 0) {
			return a9Content.outlets.map((o) => ({
				href: o.href || o.url || o.link || "",
				title: o.title || o.label || "",
				desc: o.desc || o.description || "",
			}));
		}
		if (Array.isArray(a9Content?.links) && a9Content.links.length > 0) {
			return a9Content.links.map((l) => ({
				href: l.url || l.href || "",
				title: l.label || l.title || l.url || "",
				desc: l.desc || "",
			}));
		}
		// fallback
		return [
			{
				href: "https://www.aptntv.ca/",
				title: "APTN",
				desc: "National Indigenous television network with news coverage.",
			},
			{
				href: "https://theturtleislandnews.com/",
				title: "The Turtle Island News",
				desc: "Community-focused reporting across Turtle Island.",
			},
			{
				href: "https://kukukwes.com/",
				title: "Ku'ku'kwes News",
				desc: "Independent Atlantic Canada Indigenous news.",
			},
			{
				href: "https://indiginews.com/",
				title: "IndigiNews",
				desc: "Local Indigenous voices and investigative features.",
			},
			{
				href: "https://hashilthsa.com/",
				title: "Ha-Shilth-Sa",
				desc: "Nuu-chah-nulth Tribal Council newspaper.",
			},
			{
				href: "https://windspeaker.com/",
				title: "Windspeaker",
				desc: "Independent Indigenous news and opinion.",
			},
		];
	}, [a9Content]);

	/* ------- External Download (.docx) — always enabled, next to Complete ------- */
	const downloadPageDocx = async () => {
		const title = `Activity ${activityNumber}: ${pageTitle}`;
		const fileName = `activity-a${activityNumber}-reflection.docx`;

		try {
			const {
				Document,
				Packer,
				Paragraph,
				TextRun,
				AlignmentType,
				ExternalHyperlink,
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

			const Intro = new Paragraph({
				spacing: { before: 0, after: 240 },
				children: [
					new TextRun({
						text: tipText,
						italics: true,
						size: 28,
						font: "Arial",
					}),
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
							color: accent,
						}),
					],
				});

			const Body = (t) =>
				new Paragraph({
					spacing: { before: 0, after: 120, line: 360 },
					children: [new TextRun({ text: t, size: 24, font: "Arial" })],
				});

			const LinkBullet = (label, url) =>
				new Paragraph({
					bullet: { level: 0 },
					spacing: { before: 0, after: 60 },
					children: [
						new ExternalHyperlink({
							link: url,
							children: [
								new TextRun({
									text: label,
									font: "Arial",
									size: 24,
									underline: {},
									color: "0563C1",
								}),
							],
						}),
					],
				});

			const children = [H1, Intro, H2(linksHeading)];
			pageLinks.forEach((l) => children.push(LinkBullet(l.label, l.url)));

			if (typeof localNotes === "string" && localNotes?.trim()) {
				children.push(
					H2(lang === "fr" ? "Réponse enregistrée" : "Saved response")
				);
				localNotes
					.split(/\n{2,}/)
					.map((p) => p.trim())
					.filter(Boolean)
					.forEach((p) => children.push(Body(p)));
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
			// HTML fallback
			const esc = (s = "") =>
				String(s)
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
			const links = pageLinks
				.map(
					(l) =>
						`<li><a href="${esc(
							l.url
						)}" style="color:#0563C1;text-decoration:underline;">${esc(
							l.label
						)}</a></li>`
				)
				.join("");
			const body =
				typeof localNotes === "string" && localNotes?.trim()
					? `<h2 style="font-size:16pt;color:${esc(
							accent
					  )};margin:24pt 0 12pt;">${esc(
							lang === "fr" ? "Réponse enregistrée" : "Saved response"
					  )}</h2>
             <p style="font-size:12pt;margin:0 0 9pt;">${esc(
								localNotes
							).replace(/\n/g, "<br/>")}</p>`
					: "";
			const html = `
        <html>
          <head><meta charset="utf-8"><title>${esc(title)}</title></head>
          <body style="font-family:Arial;line-height:1.5;">
            <h1 style="font-size:24pt;color:${esc(
							accent
						)};margin:0 0 12pt;">${esc(title)}</h1>
            <p style="font-size:14pt;font-style:italic;margin:0 0 12pt;">${esc(
							tipText
						)}</p>
            <h2 style="font-size:16pt;color:${esc(
							accent
						)};margin:24pt 0 12pt;">${esc(linksHeading)}</h2>
            <ul style="margin:0 0 12pt 18pt;font-size:12pt;">${links}</ul>
            ${body}
          </body>
        </html>
      `.trim();

			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `activity-a${activityNumber}-reflection.doc`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient (matches A01/A08 style) */}
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

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* ===== HEADER (homogeneous with other activities) ===== */}
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

						{/* H1 + icon row */}
						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{pageTitle}
							</h1>
							<Newspaper
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout (use content.instructionsHtml if present) */}
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

								{instructionsHtml ? (
									<div
										className="text-slate-800 max-w-2xl"
										style={{ color: accent }}
										dangerouslySetInnerHTML={{ __html: instructionsHtml }}
									/>
								) : (
									<p
										className="text-slate-800 max-w-2xl"
										style={{ color: accent }}
									>
										{tipText}
										<br />
										<strong>
											{lang === "fr"
												? "Partagez vos remarques : quels défis la communauté rencontre-t-elle ? Quels biais émergent ?"
												: "Share your thoughts and perspectives on what you learned — for example, challenges people face or biases the story reveals."}
										</strong>
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Outlets (cards) ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{outletTiles.map(({ href, title, desc }) => (
							<motion.a
								key={href || title}
								href={href || "#"}
								target="_blank"
								rel="noreferrer"
								className={linkCardBase}
								style={{ outlineColor: accent }}
								title={`Open: ${title} (new tab)`}
								aria-label={`Open ${title} in a new tab`}
								variants={cardPop}
							>
								{/* top-left icon badge (accent tint) */}
								<div
									className={badgeBase}
									aria-hidden="true"
									style={{
										backgroundColor: withAlpha(accent, "1A"),
										color: accent,
									}}
								>
									<Newspaper className="w-5 h-5" />
								</div>

								{/* centered content */}
								<div className="min-h-[108px] flex flex-col items-center justify-center text-center">
									<div className="font-medium text-slate-900 group-hover:underline">
										{title}
									</div>
									{desc ? (
										<p className="mt-1 text-sm text-gray-600 max-w-sm">
											{desc}
										</p>
									) : null}
									<div className={linkFooterBase} style={{ color: accent }}>
										<ExternalLink className="w-4 h-4" aria-hidden="true" />
										<span>
											{lang === "fr" ? "Ouvrir le lien" : "Open link"}
										</span>
									</div>
								</div>
							</motion.a>
						))}
					</div>
				</motion.section>

				{/* ===== Notes (NoteComposer) ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${a9Content?.id || String(activityNumber)}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${
						a9Content?.id || String(activityNumber)
					}-Reflection.docx`}
					docTitle={pageTitle}
					docSubtitle={a9Content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={true}
					linksHeading={linksHeading}
					pageLinks={pageLinks}
					headingColor={accent}
					showDownloadButton={false}
				/>

				{/* ===== Complete + Download (always enabled) ===== */}
				<div className="flex justify-end gap-2">
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
						title={
							lang === "fr"
								? "Télécharger vos notes et ressources en .docx"
								: "Download your notes and resources as .docx"
						}
					>
						{lang === "fr" ? "Télécharger (.docx)" : "Download (.docx)"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

/* kept for parity, but not used in the header anymore */
function TipCard({ accent = "#934D6C", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
			style={{
				borderColor: withAlpha(accent, "33"),
				backgroundColor: withAlpha(accent, "14"),
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);
}
