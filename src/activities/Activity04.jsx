import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity04({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#4338CA", // INDIGO (change to re-skin this page)
}) {
	const placeholder =
		content?.notePlaceholder || "Which community? What you learned…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// --- animations (same rhythm as other pages) ---
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

	// shared classes (ring via outline so color can be inline)
	const linkCardBase =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer " +
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const activityNumber = 4;

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
            ${withAlpha(accent, "26")} 0%,   /* ~15% */
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
							Indigenous Peoples Outside Canada
						</h1>
						<Globe2
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					{/* dashed, translucent tip (consistent) */}
					<TipCard accent={accent}>
						Discover facts about an Indigenous population outside Canada.
						<br />
						<strong>What stood out to you?</strong>
					</TipCard>
				</motion.header>

				{/* Link cards */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						{/* Card 1 */}
						<motion.a
							href="https://newshour-classroom-tc.digi-producers.pbs.org/uploads/app/uploads/2014/11/A-global-map-of-indigenous-peoples.pdf"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: A global map of Indigenous peoples (PDF) — new tab"
							aria-label="Open: A global map of Indigenous peoples (PDF) in a new tab"
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
								<div className="font-medium text-slate-900 group-hover:underline">
									Global map of Indigenous Peoples (PDF)
								</div>
							</div>
							<div className={`${linkFooterBase} text-slate-800`}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						{/* Card 2 */}
						<motion.a
							href="https://www.visualcapitalist.com/cp/mapped-the-worlds-indigenous-peoples/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Mapped — The world's Indigenous Peoples (Visual Capitalist) — new tab"
							aria-label="Open: Mapped — The world's Indigenous Peoples (Visual Capitalist) in a new tab"
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
								<div className="font-medium text-slate-900 group-hover:underline">
									Mapped: The world’s Indigenous Peoples
								</div>
							</div>
							<div className={`${linkFooterBase} text-slate-800`}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* Notes (hex-accent aware NoteComposer) */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "04"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent="#4F46E5" // indigo-600 for rings/buttons (feel free to use {accent})
					downloadFileName={`Activity-${content?.id || "04"}-Reflection.docx`}
					docTitle={content?.title || "Reflection"}
				/>

				{/* Complete toggle (same as others) */}
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

/* ---------- Reusable dashed/translucent tip (accent aware) ---------- */
function TipCard({ accent = "#4338CA", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
			style={{
				borderColor: withAlpha(accent, "33"), // ~20%
				backgroundColor: withAlpha(accent, "13"), // ~8% tint
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);
}
