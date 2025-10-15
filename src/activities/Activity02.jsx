// src/pages/activities/Activity02.jsx
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ExternalLink } from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITY_UI } from "../constants/content.js";

/* Tailwind emerald hexes */
const EMERALD_50 = "#ECFDF5"; // bg-emerald-50
const EMERALD_700 = "#047857"; // text/ring default

/* #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

/* Tiny HTML-to-text fallback for .doc intro */
function stripHtml(html = "") {
	return String(html)
		.replace(/<[^>]*>/g, "")
		.replace(/\s+\n/g, "\n")
		.trim();
}

/* Normalize resources from content.js (links[] or resources[]) */
function normalizeResources(c) {
	if (Array.isArray(c?.links) && c.links.length) {
		return { linkItems: c.links, stringItems: [] };
	}
	const stringItems = Array.isArray(c?.resources) ? c.resources : [];
	return { linkItems: [], stringItems };
}

/* Language sniff (same as Activity01) */
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

export default function Activity02({
	content, // pass ACTIVITIES_CONTENT.a2[lang]
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = EMERALD_700,
}) {
	// language + localized UI labels
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const L = ACTIVITY_UI[lang] || ACTIVITY_UI.en;

	// prefer richer content.cdata
	const cdata = content?.cdata || {};
	const title =
		cdata.title ||
		content?.title ||
		(lang === "fr"
			? "Plantes médicinales autochtones"
			: "Indigenous Medicinal Plants");

	const instructionsHtml =
		cdata.instructionsHtml ||
		(content?.prompt ? `<p>${content.prompt}</p>` : "");

	// tip for export if HTML exists
	const tipText =
		content?.tip || content?.prompt || stripHtml(instructionsHtml) || "";

	const placeholder =
		content?.notePlaceholder || "Plants, uses, teachings you discovered…";

	const activityNumber =
		Number.isFinite(content?.number) && content?.number > 0
			? content.number
			: 2;

	const { linkItems, stringItems } = normalizeResources(content);
	const hasRealLinks = linkItems.length > 0;

	// French-only suffix request
	const enOnlySuffix = lang === "fr" ? " (en anglais seulement)" : "";

	// notes state
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// animations
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
				delayChildren: reduceMotion ? 0 : 0.1,
				staggerChildren: reduceMotion ? 0 : 0.14,
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

	// shared classes
	const linkCardBase =
		"group block max-w-lg w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

	const staticCardBase =
		"max-w-lg w-full border border-gray-200 bg-white p-6 sm:p-7 shadow-sm";

	// fixed-size badge that never squashes
	const badgeBase =
		"flex-none shrink-0 w-10 h-10 min-w-[40px] min-h-[40px] aspect-square rounded-xl grid place-items-center";

	const linkFooterBase =
		"mt-3 flex items-center justify-center gap-1 text-sm font-medium";

	const started = hasActivityStarted(localNotes ?? notes, "notes");

	// Localized heading for export
	const exportLinksHeading =
		content?.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	// download
	const handleDownload = () => {
		const html =
			typeof localNotes === "string" ? localNotes : localNotes?.text || "";
		downloadNotesAsWord({
			html,
			downloadFileName: `Activity-${
				content?.id || String(activityNumber).padStart(2, "0")
			}-Reflection.doc`,
			docTitle: title,
			docSubtitle: content?.subtitle,
			activityNumber,
			docIntro: tipText,
			includeLinks: hasRealLinks,
			linksHeading: exportLinksHeading,
			// keep original labels in the exported DOC unless you want the suffix there too
			pageLinks: linkItems,
			headingColor: accent,
			accent,
		});
	};

	return (
		<motion.div
			className="relative bg-transparent min-h-[100svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* background gradient */}
			<motion.div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(to bottom, ${withAlpha(
						EMERALD_50,
						"B3"
					)} 0%, rgba(255,255,255,0) 45%, rgba(248,250,252,0) 100%)`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
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
							{`${L.label} ${activityNumber}`}
						</p>

						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{title}
							</h1>
							<Leaf
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title={L.iconTitle}
							/>
						</div>

						<aside
							role="note"
							aria-label={L.tipAria}
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
									{L.instructions}
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
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{/* resources */}
				{(hasRealLinks || stringItems.length > 0) && (
					<motion.section
						className="flex justify-center"
						variants={gridStagger}
						initial="hidden"
						animate="show"
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 place-content-center">
							{hasRealLinks
								? linkItems.map((lnk, i) => {
										const labelForAria = `${lnk.label}${enOnlySuffix}`;
										return (
											<motion.a
												key={`${lnk.url || lnk.label}-${i}`}
												href={lnk.url}
												target="_blank"
												rel="noreferrer"
												className={linkCardBase}
												style={{ outlineColor: accent }}
												title={`${L.openLink}: ${labelForAria}`}
												aria-label={`${L.openLink} ${labelForAria}`}
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
														<Leaf
															className="w-5 h-5 shrink-0"
															aria-hidden="true"
														/>
													</div>

													{/* Only the main label underlines on hover; suffix never does */}
													<div className="font-medium text-gray-800">
														<span className="group-hover:underline">
															{lnk.label}
														</span>
														{enOnlySuffix && (
															<span
																className="ml-1 no-underline"
																style={{ color: EMERALD_700 }}
															>
																{enOnlySuffix}
															</span>
														)}
													</div>
												</div>

												<div
													className={linkFooterBase}
													style={{ color: accent }}
												>
													<ExternalLink
														className="w-4 h-4"
														aria-hidden="true"
													/>
													<span>{L.openLink}</span>
												</div>
											</motion.a>
										);
								  })
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
													<Leaf
														className="w-5 h-5 shrink-0"
														aria-hidden="true"
													/>
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
					storageKey={`notes-${content?.id || "02"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={EMERALD_700}
					downloadFileName={`Activity-${
						content?.id || String(activityNumber).padStart(2, "0")
					}-Reflection.doc`}
					docTitle={title}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={hasRealLinks}
					linksHeading={exportLinksHeading}
					pageLinks={linkItems}
					headingColor={EMERALD_700}
					showDownloadButton={false}
				/>

				{/* actions */}
				<div className="flex justify-end gap-2">
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
						title={L.downloadDoc}
					>
						{L.downloadDoc}
					</button>
				</div>
			</div>
		</motion.div>
	);
}
