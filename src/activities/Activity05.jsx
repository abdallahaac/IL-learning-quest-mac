// src/pages/activities/Activity05.jsx
import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Film, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity05({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#be123c", // Rose-700-ish; change to re-skin this activity
}) {
	const placeholder =
		content?.notePlaceholder || "Title, creator(s), insights…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// --- animations (consistent with Activity 01) ---
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

	// shared classes (rings via outline so we can set color inline)
	const linkCardBase =
		"group block mx-auto max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer " +
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const activityNumber = 5;

	// Exportable resources as bullet hyperlinks (no table)
	const pageLinks = [
		{
			label: "National Film Board — Indigenous cinema",
			url: "https://www.nfb.ca/indigenous-cinema/?&film_lang=en&sort=year:desc,title&year_min=1939&year_max=2022",
		},
		{
			label: "CBC Gem — Indigenous stories",
			url: "https://gem.cbc.ca/section/indigenous-stories",
		},
	];

	// Tip to include at top of export
	const tipText =
		"Watch an Indigenous movie or TV show or listen to an Indigenous-focused podcast. What did you learn?";

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient (mirrors Activity 01 technique) */}
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

			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* ===== HEADER (same styling as Activity 01) ===== */}
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

						{/* Title row: center the H1 with icon immediately after */}
						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{content?.title || "Film, TV, or Podcast"}
							</h1>
							<Film
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout (mirrors Activity 01) */}
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
									className="text-slate-800 max-w-2xl"
									style={{ color: accent }}
								>
									Watch an Indigenous film/TV show or listen to an
									Indigenous-focused podcast.
									<br />
									<strong>What did you learn?</strong>
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resource links ===== */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						{/* Card 1: NFB Indigenous Cinema */}
						<motion.a
							href="https://www.nfb.ca/indigenous-cinema/?&film_lang=en&sort=year:desc,title&year_min=1939&year_max=2022"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: National Film Board — Indigenous cinema (new tab)"
							aria-label="Open: National Film Board — Indigenous cinema in a new tab"
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
									<Film className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									National Film Board — Indigenous cinema
								</div>
							</div>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						{/* Card 2: CBC Gem Indigenous Stories */}
						<motion.a
							href="https://gem.cbc.ca/section/indigenous-stories"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: CBC Gem — Indigenous stories (new tab)"
							aria-label="Open: CBC Gem — Indigenous stories in a new tab"
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
									<Film className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									CBC Gem — Indigenous stories
								</div>
							</div>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* ===== Notes (hex-accent) ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "05"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent} // hex-aware NoteComposer
					downloadFileName={`Activity-${content?.id || "05"}-Reflection.docx`}
					/* Exported title becomes: "Activity 5: Film, TV, or Podcast" */
					docTitle={content?.title || "Film, TV, or Podcast"}
					docSubtitle={content?.subtitle}
					/* Make activity number part of exported title */
					activityNumber={activityNumber}
					/* Include on-page tip in exported document */
					docIntro={tipText}
					/* Export resources as header + bullet list of hyperlink labels (no table) */
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Use accent for exported headings too */
					headingColor={accent}
				/>

				{/* ===== Complete toggle (kept consistent with other activities) ===== */}
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onToggleComplete}
						aria-pressed={!!completed}
						className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
							completed
								? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
								: "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100"
						}`}
					>
						{completed ? "Marked Complete" : "Mark Complete"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}
