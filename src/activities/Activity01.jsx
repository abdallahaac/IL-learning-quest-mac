// src/pages/Activity01.jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	Palette,
	Image as ImageIcon,
	Music4,
	ExternalLink,
} from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import ScribbleUnderline from "../components/ScribbleUnderline.jsx";
import { ACTIVITY_UI } from "../constants/content.js";

// helper: add alpha to a hex color (#RRGGBB + "AA")
function withAlpha(hex, alphaHex) {
	if (!/^#([0-9a-f]{6})$/i.test(hex)) return hex;
	return `${hex}${alphaHex}`;
}

const ICONS = { image: ImageIcon, music: Music4 };

// tiny HTML-to-text fallback for .doc intro
function stripHtml(html = "") {
	return String(html)
		.replace(/<[^>]*>/g, "")
		.replace(/\s+\n/g, "\n")
		.trim();
}

// normalize resources from QuestData (strings) or richer link objects
function normalizeResources(content) {
	if (Array.isArray(content?.links) && content.links.length) {
		return { linkItems: content.links, stringItems: [] };
	}
	const stringItems = Array.isArray(content?.resources)
		? content.resources
		: [];
	return { linkItems: [], stringItems };
}

// tiny i18n selector (same behavior as AppShell)
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

export default function Activity01({
	content, // from ACTIVITIES_CONTENT[...] or legacy QuestData
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#4380d6",
}) {
	// language + localized UI labels
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const L = ACTIVITY_UI[lang] || ACTIVITY_UI.en;

	// Prefer richer content (from ACTIVITIES_CONTENT) when present
	const cdata = content?.cdata || {};
	const title = cdata.title || content?.title || "Activity";
	const instructionsHtml =
		cdata.instructionsHtml ||
		(content?.prompt ? `<p>${content.prompt}</p>` : "");
	const tipText =
		content?.tip || content?.prompt || stripHtml(instructionsHtml) || "";

	const placeholder =
		content?.notePlaceholder || cdata.notePlaceholder || "Your reflections…";

	// activity number: use provided, else parse from id like "a1"
	const activityNumber =
		Number.isFinite(content?.number) && content?.number > 0
			? content.number
			: parseInt(String(content?.id || "").replace(/\D/g, ""), 10) || 1;

	const { linkItems, stringItems } = normalizeResources(content);
	const hasRealLinks = linkItems.length > 0;

	// keep local for responsiveness; sync when prop changes
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => {
		setLocalNotes(notes ?? "");
	}, [notes]);

	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// --- Animations
	const STAGGER = 0.14,
		DELAY_CHILDREN = 0.1;
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

	// shared classes
	const linkCardBase =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const staticCardBase =
		"max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	// === Measure title row so the instructions start exactly at H1's left ===
	const titleRowRef = useRef(null);
	const [titleRowWidth, setTitleRowWidth] = useState(null);

	useLayoutEffect(() => {
		const el = titleRowRef.current;
		if (!el) return;
		const update = () => setTitleRowWidth(el.getBoundingClientRect().width);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		window.addEventListener("resize", update);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", update);
		};
	}, []);

	// ✅ compute from freshest value
	const started = hasActivityStarted(localNotes ?? notes, "notes");

	// Localized heading for resources in export
	const exportLinksHeading =
		content?.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	// ---- Decoupled download handler (uses current notes + page metadata) ----
	const handleDownload = () => {
		const html =
			typeof localNotes === "string" ? localNotes : localNotes?.text || "";
		const includeLinks = hasRealLinks;
		downloadNotesAsWord({
			html,
			downloadFileName: `Activity-${
				content?.id || String(activityNumber).padStart(2, "0")
			}-Reflection.doc`,
			docTitle: title,
			docSubtitle: content?.subtitle,
			activityNumber,
			docIntro: tipText,
			includeLinks,
			linksHeading: exportLinksHeading,
			pageLinks: linkItems,
			headingColor: accent,
			accent,
		});
	};

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
				{/* ===== HEADER ===== */}
				<motion.header
					className="text-center"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="mx-auto space-y-4 sm:space-y-5">
						{/* Activity number (localized) */}
						<p
							className="font-semibold uppercase tracking-wider text-2xl sm:text-3xl"
							style={{ color: accent }}
						>
							{`${L.label} ${activityNumber}`}
						</p>

						{/* Title row */}
						<div
							className="inline-flex items-center justify-center gap-3"
							ref={titleRowRef}
						>
							<div className="relative inline-block">
								<h1 className="text-4xl font-bold text-slate-900 leading-tight">
									{title}
								</h1>
							</div>

							<Palette
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title={L.iconTitle}
							/>
						</div>

						{/* Instructions */}
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

				{/* Resources grid */}
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
										const Icon = ICONS[lnk.icon] ?? ImageIcon;
										return (
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
												<div className="flex items-center gap-3">
													<div
														className={badgeBase}
														style={{
															backgroundColor: withAlpha(accent, "1A"),
															color: accent,
														}}
													>
														<Icon className="w-5 h-5" aria-hidden="true" />
													</div>
													<div className="font-medium text-slate-900 group-hover:underline">
														{lnk.label}
													</div>
												</div>
												<div
													className={`${linkFooterBase} text-slate-800`}
													style={{ color: "#4380d6" }}
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
													<ImageIcon className="w-5 h-5" aria-hidden="true" />
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

				{/* Notes */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					placeholder={placeholder}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${
						content?.id || String(activityNumber).padStart(2, "0")
					}-Reflection.doc`}
					docTitle={title}
					docSubtitle={content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={hasRealLinks}
					linksHeading={exportLinksHeading}
					pageLinks={linkItems}
					showDownloadButton={false}
				/>

				{/* Bottom action row */}
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
