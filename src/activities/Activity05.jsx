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

	// --- animations (consistent with other activities) ---
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

	// --- shared classes (rings via outline so we can set color inline) ---
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

	// Tip to include at top of export (split into sentences)
	const tipText =
		"Watch an Indigenous film/TV show or listen to an Indigenous-focused podcast. What did you learn?";

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient (accent → clear) */}
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha(accent, "26")} 0%,   /* ~15% tint */
            rgba(255,255,255,0) 45%,
            rgba(248,250,252,0) 100%
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.3 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header */}
				<motion.header
					className="text-center space-y-4"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<p
						className="font-semibold uppercase tracking-wide text-sm sm:text-base"
						style={{ color: accent }}
					>
						Activity {activityNumber}
					</p>

					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Film, TV, or Podcast
						</h1>
						<Film
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					<TipCard accent={accent}>
						Watch an Indigenous film/TV show or listen to an Indigenous-focused
						podcast.
						<br />
						<strong>What did you learn?</strong>
					</TipCard>
				</motion.header>

				{/* Resource links */}
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
										backgroundColor: withAlpha(accent, "1A"), // ~10%
										color: accent,
									}}
								>
									<Film className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									National Film Board — Indigenous cinema
								</div>
							</div>
							{/* Footer uses the accent color */}
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
							{/* Footer uses the accent color */}
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* Notes (hex-accent) */}
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

				{/* Complete toggle (kept consistent with other activities) */}
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

/* Reusable dashed/translucent tip (accent-aware) */
function TipCard({ accent = "#be123c", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
			style={{
				borderColor: withAlpha(accent, "33"), // ~20%
				backgroundColor: withAlpha(accent, "14"), // ~8% tint
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);
}
