// src/pages/activities/Activity05.jsx
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Film } from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import LinkCard from "../components/LinkCard.jsx";
import DownloadButton from "../components/DownloadButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITIES_CONTENT, ACTIVITY_UI } from "../constants/content.js";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

/* naive HTML detector for small CMS strings */
const isHtml = (s) => typeof s === "string" && /<[^>]+>/.test(s);

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

export default function Activity05({
	// content prop intentionally ignored — content comes from ACTIVITIES_CONTENT
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#be123c",
}) {
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const reduceMotion = useReducedMotion();
	const L = ACTIVITY_UI[lang] || ACTIVITY_UI.en;

	const a5Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a5 &&
			(ACTIVITIES_CONTENT.a5[lang] || ACTIVITIES_CONTENT.a5.en)) ||
		{};

	const cdata = a5Content?.cdata || {};
	const title = cdata.title || a5Content?.title || "Film, TV, or Podcast";

	// Prefer any provided HTML, otherwise fall back to text
	const rawTip = a5Content?.tip || a5Content?.prompt || "";
	const instructionsHtml =
		cdata.instructionsHtml ||
		a5Content?.instructionsHtml ||
		(isHtml(rawTip) ? rawTip : "") ||
		(a5Content?.prompt ? `<p>${a5Content.prompt}</p>` : "");

	// Plain-text version for export/placeholders
	const tipText =
		(instructionsHtml
			? instructionsHtml.replace(/<[^>]*>/g, "").trim()
			: String(rawTip || "").trim()) || "";

	const placeholder =
		a5Content?.notePlaceholder ||
		(lang === "fr"
			? "Cliquez ici pour saisir du texte."
			: "Title, creator(s), insights…");

	const exportLinksHeading =
		a5Content?.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	const activityNumber =
		Number.isFinite(a5Content?.number) && a5Content.number > 0
			? a5Content.number
			: 5;

	const { linkItems } = normalizeResources(a5Content);
	const pageLinks = linkItems;
	const hasLinks = pageLinks && pageLinks.length > 0;

	// local notes state
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const started = hasActivityStarted(localNotes ?? notes, "notes");

	// download state (same pattern as Activity 02/04)
	const [isDownloading, setIsDownloading] = useState(false);

	// localized labels for the document
	const docLocale = {
		en: { suffix: "Reflection", downloadingLabel: "Downloading..." },
		fr: { suffix: "Réflexion", downloadingLabel: "Téléchargement..." },
	}[lang];

	// async download handler with guard + cooldown
	const handleDownload = async () => {
		if (!started || isDownloading) return;

		setIsDownloading(true);

		try {
			const html =
				typeof localNotes === "string" ? localNotes : localNotes?.text || "";
			const suffix = (docLocale?.suffix || "Reflection").replace(/\s+/g, "-");
			const filename = `Activity-${
				a5Content?.id || String(activityNumber).padStart(2, "0")
			}-${suffix}.doc`;

			await Promise.resolve(
				downloadNotesAsWord({
					html,
					downloadFileName: filename,
					docTitle: title,
					docSubtitle: a5Content?.subtitle,
					activityNumber,
					docIntro: tipText, // use plain text in the document intro
					includeLinks: hasLinks,
					linksHeading: exportLinksHeading,
					pageLinks,
					headingColor: accent,
					accent,
					locale: lang,
				})
			);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error("downloadNotesAsWord failed:", err);
		} finally {
			setTimeout(() => setIsDownloading(false), 700);
		}
	};

	// animations
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

	const linkGridCols =
		"grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center";

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
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

			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
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
							<Film
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
									{lang === "fr" ? "Consignes" : "Instructions"}
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
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{hasLinks && (
					<motion.section
						className="flex justify-center"
						variants={gridStagger}
						initial="hidden"
						animate="show"
					>
						<div className={linkGridCols}>
							{pageLinks.map((lnk, i) => {
								// compute suffix shown on French pages when link is English-only
								const enOnlySuffix =
									lang === "fr" && lnk.enOnly ? " (en anglais seulement)" : "";
								return (
									<motion.div
										key={`${lnk.url || lnk.label}-${i}`}
										variants={cardPop}
									>
										<LinkCard
											link={lnk}
											accent={accent}
											Icon={Film}
											enOnlySuffix={enOnlySuffix}
											variants={cardPop}
											cardHeight={"120px"}
										/>
									</motion.div>
								);
							})}
						</div>
					</motion.section>
				)}

				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${
						a5Content?.id || String(activityNumber).padStart(2, "0")
					}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${
						a5Content?.id || String(activityNumber).padStart(2, "0")
					}-Reflection.doc`}
					docTitle={title}
					docSubtitle={a5Content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={hasLinks}
					linksHeading={exportLinksHeading}
					pageLinks={pageLinks}
					headingColor={accent}
					showDownloadButton={false}
					onRequestDownload={handleDownload}
				/>

				<div className="flex gap-2 justify-center sm:justify-end mb-20 sm:mb-4">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>

					<DownloadButton
						onClick={handleDownload}
						disabled={!started || isDownloading}
						isDownloading={isDownloading}
						accent={accent}
						label={L.downloadDoc}
						downloadingLabel={docLocale.downloadingLabel}
						ariaLabel={L.downloadDoc}
					/>
				</div>
			</div>
		</motion.div>
	);
}
