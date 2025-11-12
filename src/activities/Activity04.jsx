// src/pages/activities/Activity04.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2 } from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import LinkCard from "../components/LinkCard.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITIES_CONTENT } from "../constants/content.js";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

/* tiny i18n selector (same behaviour as other activities) */
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

/* Normalize resources from content.js (links[] or resources[]) */
function normalizeResources(c) {
	if (Array.isArray(c?.links) && c.links.length) {
		return { linkItems: c.links, stringItems: [] };
	}
	const stringItems = Array.isArray(c?.resources) ? c.resources : [];
	return { linkItems: [], stringItems };
}

export default function Activity04({
	// content prop intentionally ignored — we pull from ACTIVITIES_CONTENT to match other activities
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#4338CA",
}) {
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const reduceMotion = useReducedMotion();

	// authoritative content pulled from constants/content.js
	const a4Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a4 &&
			(ACTIVITIES_CONTENT.a4[lang] || ACTIVITIES_CONTENT.a4.en)) ||
		{};

	// prefer cdata.title if provided (keeps linguistics-approved sentence in cdata)
	const cdata = a4Content?.cdata || {};
	const title =
		cdata.title ||
		a4Content?.title ||
		(lang === "fr"
			? "Apprenez des faits intéressants sur un peuple autochtone d’ailleurs"
			: "Indigenous Peoples Outside Canada");

	// instructions: prefer rich HTML (cdata), otherwise render tip/prompt
	const instructionsHtml =
		cdata.instructionsHtml ||
		(a4Content?.prompt ? `<p>${a4Content.prompt}</p>` : "");
	const tipText =
		a4Content?.tip ||
		a4Content?.prompt ||
		(instructionsHtml ? instructionsHtml.replace(/<[^>]*>/g, "").trim() : "");

	const placeholder =
		a4Content?.notePlaceholder ||
		(lang === "fr"
			? "Cliquez ou tapez ici pour saisir du texte."
			: "Which community? What you learned…");

	const exportLinksHeading =
		a4Content?.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	const activityNumber =
		Number.isFinite(a4Content?.number) && a4Content.number > 0
			? a4Content.number
			: 4;

	// normalize resource list
	const { linkItems, stringItems } = normalizeResources(a4Content);
	const pageLinks = linkItems; // authoritative links from content.js
	const hasLinks = pageLinks && pageLinks.length > 0;

	// french-only suffix (string, because LinkCard expects text to render)
	const enOnlySuffix = lang === "fr" ? " (en anglais seulement)" : "";

	// local notes state (prevents premature "started")
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const started = hasActivityStarted(localNotes ?? notes, "notes");

	// animations — match rhythm used across other activities
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

	const linkGridCols = "grid grid-cols-1  place-content-center";

	// download handler
	const handleDownload = useCallback(() => {
		const html =
			typeof localNotes === "string" ? localNotes : localNotes?.text || "";
		downloadNotesAsWord({
			html,
			downloadFileName: `Activity-${
				a4Content?.id || String(activityNumber).padStart(2, "0")
			}-Reflection.doc`,
			docTitle: title,
			docSubtitle: a4Content?.subtitle,
			activityNumber,
			docIntro: tipText,
			includeLinks: hasLinks,
			linksHeading: exportLinksHeading,
			pageLinks,
			headingColor: accent,
			accent,
		});
	}, [
		localNotes,
		a4Content,
		activityNumber,
		pageLinks,
		exportLinksHeading,
		title,
		tipText,
		accent,
	]);

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient */}
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

			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* header */}
				<motion.header
					className="text-center"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="mx-auto space-y-4 sm:space-y-5">
						<p
							className="font-semibold uppercase tracking-wider text-2xl sm:text-3xl"
							style={{ color: accent }}
						>
							{lang === "fr" ? "Activité" : "Activity"} {activityNumber}
						</p>

						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{title}
							</h1>
							<Globe2
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						<aside
							role="note"
							aria-label={
								lang === "fr"
									? "Instructions de l'activité"
									: "Activity instructions"
							}
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
									{lang === "fr" ? "Instructions" : "Instructions"}
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
												? "Décrivez les choses que vous avez apprises."
												: "Describe the things you learned about."}
										</strong>
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{/* resources/cards — sourced from ACTIVITIES_CONTENT.a4 */}
				{hasLinks && (
					<motion.section
						className="flex justify-center"
						variants={gridStagger}
						initial="hidden"
						animate="show"
					>
						<div className={linkGridCols}>
							{pageLinks.map((lnk, i) => (
								<motion.div
									key={`${lnk.url || lnk.label}-${i}`}
									variants={cardPop}
								>
									<LinkCard
										link={lnk}
										accent={accent}
										Icon={Globe2}
										enOnlySuffix={enOnlySuffix}
										variants={cardPop}
										cardHeight={"140px"}
									/>
								</motion.div>
							))}
						</div>
					</motion.section>
				)}

				{/* notes */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${
						a4Content?.id || String(activityNumber).padStart(2, "0")
					}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${
						a4Content?.id || String(activityNumber).padStart(2, "0")
					}-Reflection.doc`}
					docTitle={title}
					docSubtitle={a4Content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={hasLinks}
					linksHeading={exportLinksHeading}
					pageLinks={pageLinks}
					headingColor={accent}
					showDownloadButton={false}
				/>

				{/* actions */}
				<div className="flex gap-2 justify-center sm:justify-end mb-20 sm:mb-4">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>
					<button
						type="button"
						onClick={handleDownload}
						className="px-4 py-2 rounded-lg text-white"
						style={{ backgroundColor: accent }}
						title={
							lang === "fr"
								? "Télécharger vos réflexions (.doc)"
								: "Download your reflections as a Word-compatible .doc file"
						}
					>
						{lang === "fr" ? "Télécharger (.doc)" : "Download (.doc)"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}
