// src/pages/activities/Activity04.jsx
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, ExternalLink } from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import DownloadButton from "../components/DownloadButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITIES_CONTENT, ACTIVITY_UI } from "../constants/content.js";

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
	const L = ACTIVITY_UI[lang] || ACTIVITY_UI.en;

	// authoritative content pulled from constants/content.js
	const a4Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a4 &&
			(ACTIVITIES_CONTENT.a4[lang] || ACTIVITIES_CONTENT.a4.en)) ||
		{};

	// prefer cdata.title if provided
	const cdata = a4Content?.cdata || {};
	const title =
		cdata.title ||
		a4Content?.title ||
		(lang === "fr"
			? "Apprenez des faits intéressants sur un peuple autochtone d’ailleurs"
			: "Indigenous Peoples Outside Canada");

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
			? "Cliquez ici pour saisir du texte."
			: "Which community? What you learned…");

	const exportLinksHeading =
		a4Content?.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	const activityNumber =
		Number.isFinite(a4Content?.number) && a4Content.number > 0
			? a4Content.number
			: 4;

	// normalize resource list
	const { linkItems, stringItems } = normalizeResources(a4Content);
	const pageLinks = linkItems;
	const hasLinks = pageLinks && pageLinks.length > 0;

	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const started = hasActivityStarted(localNotes ?? notes, "notes");

	const [isDownloading, setIsDownloading] = useState(false);

	const docLocale = {
		en: { suffix: "Reflection", downloadingLabel: "Downloading..." },
		fr: { suffix: "Réflexion", downloadingLabel: "Téléchargement..." },
	}[lang];

	const handleDownload = async () => {
		if (!started || isDownloading) return;

		setIsDownloading(true);

		try {
			const html =
				typeof localNotes === "string" ? localNotes : localNotes?.text || "";
			const suffix = (docLocale?.suffix || "Reflection").replace(/\s+/g, "-");
			const filename = `Activity-${
				a4Content?.id || String(activityNumber).padStart(2, "0")
			}-${suffix}.doc`;

			await Promise.resolve(
				downloadNotesAsWord({
					html,
					downloadFileName: filename,
					docTitle: title,
					docSubtitle: a4Content?.subtitle,
					activityNumber,
					docIntro: tipText,
					includeLinks: hasLinks,
					linksHeading: exportLinksHeading,
					pageLinks,
					headingColor: accent,
					accent,
					locale: lang,
				})
			);
		} catch (err) {
			console.error("downloadNotesAsWord failed:", err);
		} finally {
			setTimeout(() => setIsDownloading(false), 700);
		}
	};

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

	// ---- same card dimensions as Activity01 ----
	const linkCardBase =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col justify-center min-h-[110px]";

	const staticCardBase =
		"max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-center min-h-[110px]";

	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";
	// Center a single card like Activity03, use 2-col layout for multiple
	const totalCards = hasLinks ? pageLinks.length : stringItems.length;

	const linkGridClasses =
		totalCards === 1
			? "grid grid-cols-1 gap-4 place-content-center justify-items-center max-w-3xl w-full mx-auto"
			: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 place-content-center max-w-3xl w-full mx-auto";

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
										{lang === "fr"
											? "Décrivez les choses que vous avez apprises."
											: "Describe the things you learned."}
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{/* resources/cards — styled like Activity01 */}
				{(hasLinks || stringItems.length > 0) && (
					<motion.section
						className="flex justify-center"
						variants={gridStagger}
						initial="hidden"
						animate="show"
					>
						<div className={linkGridClasses}>
							{hasLinks
								? pageLinks.map((lnk, i) => (
										<motion.a
											key={`${lnk.url || lnk.label}-${i}`}
											href={lnk.url}
											target="_blank"
											rel="noreferrer"
											className={linkCardBase}
											style={{ outlineColor: accent }}
											variants={cardPop}
											title={`${L.openLink}: ${lnk.label}`}
											aria-label={`${L.openLink} ${lnk.label}`}
										>
											{/* icon on the left, text centered */}
											<div className="relative flex items-center h-12">
												{/* icon container pinned to the left */}
												<div className="absolute inset-y-0 left-0 flex items-center pl-3">
													<div
														className={badgeBase}
														style={{
															backgroundColor: withAlpha(accent, "1A"),
															color: accent,
														}}
													>
														<Globe2 className="w-5 h-5" aria-hidden="true" />
													</div>
												</div>

												{/* label centered horizontally in the card */}
												<div className="flex-1 text-center font-medium text-slate-900">
													{lnk.label}
												</div>
											</div>

											<div className={linkFooterBase} style={{ color: accent }}>
												<ExternalLink className="w-4 h-4" aria-hidden="true" />
												<span>{L.openLink}</span>
											</div>
										</motion.a>
								  ))
								: stringItems.map((label, i) => (
										<motion.div
											key={`${label}-${i}`}
											className={staticCardBase}
											style={{ borderColor: withAlpha(accent, "22") }}
											variants={cardPop}
										>
											<div className="flex items-center gap-3">
												<div
													className={badgeBase}
													style={{
														backgroundColor: withAlpha(accent, "1A"),
														color: accent,
													}}
												>
													<Globe2 className="w-5 h-5" aria-hidden="true" />
												</div>
												<div className="font-medium text-slate-900">
													{label}
												</div>
											</div>
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
					onRequestDownload={handleDownload}
				/>

				{/* actions */}
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
