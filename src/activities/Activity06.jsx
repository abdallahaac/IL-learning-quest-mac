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
							Read a Book
						</h1>
						<BookOpen
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					<TipCard accent={accent}>
						Read a book by a First Nations, Inuit, or Métis author.
						<br />
						<strong>What did you think?</strong>
					</TipCard>
				</motion.header>

				{/* Resource + Tip */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						{/* Link card */}
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
										backgroundColor: withAlpha(accent, "1A"), // ~10%
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

						{/* Tip card with icon */}
						<motion.div
							className="mx-auto max-w-md w-full rounded-2xl border border-dashed p-4 shadow-sm text-center bg-white"
							role="note"
							aria-label="Tip: Ask your library"
							style={{
								borderColor: withAlpha(accent, "33"), // ~20%
								backgroundColor: withAlpha(accent, "0F"), // subtle tint
							}}
							variants={cardPop}
						>
							<div className="flex flex-col items-center gap-2">
								<div
									className="w-10 h-10 rounded-xl grid place-items-center border"
									style={{
										backgroundColor: "#fff",
										color: accent,
										borderColor: withAlpha(accent, "33"),
									}}
								>
									<Library className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900">
									Ask your local library for suggestions
								</div>
							</div>
						</motion.div>
					</div>
				</motion.section>

				{/* Notes (hex-accent NoteComposer) */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "06"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent} // ← uses hex-aware NoteComposer
					// textColor="white"              // ← optional override for button text
					downloadFileName={`Activity-${content?.id || "06"}-Reflection.docx`}
					docTitle={content?.title || "Reflection"}
				/>

				{/* Complete toggle */}
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

/* Accent-aware, dashed/translucent tip */
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
