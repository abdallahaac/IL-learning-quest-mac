import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ExternalLink, BookOpen } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* Tailwind emerald hexes */
const EMERALD_50 = "#ECFDF5"; // bg-emerald-50
const EMERALD_200 = "#A7F3D0"; // border-emerald-200
const EMERALD_700 = "#047857"; // text/ring default

/* #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity02({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = EMERALD_700, // change to re-skin the whole activity
}) {
	const placeholder =
		content?.notePlaceholder || "Plants, uses, teachings you discovered…";
	const [localNotes, setLocalNotes] = useState(notes);
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
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer " +
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	// NoteComposer palette (for on-page UI only)
	const notePalette = {
		text: "text-emerald-700",
		ring: "focus-visible:ring-emerald-700",
		btn: "bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900",
		badgeBg: "bg-emerald-50",
		border: "border-emerald-100",
	};

	const activityNumber = 2;

	// Resources for export (bulleted hyperlinks in DOCX)
	const pageLinks = [
		{
			label: "Métis traditional uses for plants (PDF)",
			url: "https://www.metismuseum.ca/media/document.php/148985.La%20Michinn%20revised%20and%20catalogued.pdf",
		},
		{
			label: "Traditional plant foods of Indigenous Peoples in Canada (book)",
			url: "https://openknowledge.fao.org/server/api/core/bitstreams/02134cf4-156b-47c7-972d-cf2690df1b55/content",
		},
	];

	// Tip text for export (will be split into sentences)
	const tipText =
		"Explore traditional plant knowledge and medicinal uses. Note teachings, sources, and how they connect to your context.";

	return (
		<motion.div
			className="relative bg-transparent min-h-[100svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* Full-window gradient so it reaches the footer area */}
			<motion.div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none"
				style={{
					backgroundImage: `
            linear-gradient(
              to bottom,
              ${withAlpha(EMERALD_50, "B3")} 0%,
              rgba(255,255,255,0.0) 45%,
              rgba(248,250,252,0) 100%
            )
          `,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
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
							Indigenous Medicinal Plants
						</h1>
						<Leaf
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					{/* Tip card */}
					<TipCard accent={accent}>
						Explore traditional plant knowledge and medicinal uses.
						<br />
						Note teachings, sources, and how they connect to your context.
					</TipCard>
				</motion.header>

				{/* Links */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 place-content-center">
						<motion.a
							href="https://www.metismuseum.ca/media/document.php/148985.La%20Michinn%20revised%20and%20catalogued.pdf"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open PDF: La Michinn – Revised and Catalogued (new tab)"
							aria-label="Open PDF: La Michinn – Revised and Catalogued in a new tab"
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
								<div className="font-medium text-gray-800 group-hover:underline">
									Métis traditional uses for plants (PDF)
								</div>
							</div>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://openknowledge.fao.org/server/api/core/bitstreams/02134cf4-156b-47c7-972d-cf2690df1b55/content"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Traditional plant foods of Indigenous Peoples in Canada (new tab)"
							aria-label="Open: Traditional plant foods of Indigenous Peoples in Canada in a new tab"
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
								<div className="font-medium text-gray-800 group-hover:underline">
									Traditional plant foods of Indigenous Peoples in Canada (book)
								</div>
							</div>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* Notes */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "03"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent="#047857"
					downloadFileName={`Activity-${content?.id || "03"}-Reflection.docx`}
					/* Exported title becomes: "Activity 2: Indigenous Medicinal Plants" */
					docTitle={content?.title || "Indigenous Medicinal Plants"}
					/* Add activity number so it's prepended to the title in the export */
					activityNumber={activityNumber}
					/* Include the tip text at the top of the export, split into sentences */
					docIntro={tipText}
					/* Export resources as a header + bullet list of hyperlink labels */
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Emerald headings in the exported DOCX/HTML */
					headingColor={EMERALD_700}
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

/* Reusable dashed/translucent tip card (exact style parity) */
function TipCard({ accent = EMERALD_700, children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
			style={{
				borderColor: EMERALD_200, // light emerald border
				backgroundColor: withAlpha(EMERALD_50, "66"), // emerald-50 at ~40% transparency
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);
}
