// src/pages/activities/Activity06.jsx
import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, ExternalLink, Library } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity06({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#0891B2", // cyan-600; change to re-skin this activity
}) {
	const placeholder =
		content?.notePlaceholder || "Author, title, key takeaways…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// --- animations (same rhythm as the other redesigned pages) ---
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

	const activityNumber = 6;

	// Exportable resources as bullet hyperlinks (no table)
	const pageLinks = [
		{
			label: "#IndigenousReads (Government of Canada)",
			url: "https://www.rcaanc-cirnac.gc.ca/eng/1496255894592/1557840487211",
		},
	];

	// Tip to include at top of export (split into sentences)
	const tipText =
		"Read a book by a First Nations, Inuit, or Métis author. What did you think?";

	// Build a “local library” search URL that opens in a new tab.
	// (Targets general library domains and reading-list phrasing.)
	const libraryQuery = encodeURIComponent('Local public Library"');
	const librarySearchUrl = `https://www.google.com/search?q=${libraryQuery}`;

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft gradient (accent → clear) */}
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
								{content?.title || "Read a Book"}
							</h1>
							<BookOpen
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout (same component structure as Activity 01) */}
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
									Read a book by a First Nations, Inuit, or Métis author.
									<br />
									<strong>What did you think?</strong>
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resource + Library link ===== */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						{/* Link card: #IndigenousReads */}
						<motion.a
							href="https://www.rcaanc-cirnac.gc.ca/eng/1496255894592/1557840487211"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: #IndigenousReads (new tab)"
							aria-label="Open: #IndigenousReads in a new tab"
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
									<BookOpen className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									#IndigenousReads (Government of Canada)
								</div>
							</div>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						{/* Link card: Ask your local library (opens search) */}
						<motion.a
							href={librarySearchUrl}
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Search the web: Ask your local library for suggestions (new tab)"
							aria-label="Search the web in a new tab for: Ask your local library for suggestions"
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
									<Library className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									Ask your local library for suggestions
								</div>
							</div>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Search the web</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* ===== Notes (hex-accent NoteComposer) ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "06"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${content?.id || "06"}-Reflection.docx`}
					/* Exported title becomes: "Activity 6: Read a Book" */
					docTitle={content?.title || "Read a Book"}
					docSubtitle={content?.subtitle}
					/* Include activity number in exported title */
					activityNumber={activityNumber}
					/* Include on-page tip in exported document */
					docIntro={tipText}
					/* Export resources as header + bullet list of hyperlink labels (no table) */
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Use accent for exported headings */
					headingColor={accent}
				/>

				{/* ===== Complete toggle ===== */}
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

/* Accent-aware, dashed/translucent tip (kept for reuse if needed elsewhere) */
function TipCard({ accent = "#0891B2", children }) {
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
