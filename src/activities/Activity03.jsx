import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Utensils, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

/* Tailwind amber hex (approx): #b45309 (amber-500) */
export default function Activity03({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#b45309", // change this to re-skin the page
}) {
	const placeholder =
		content?.notePlaceholder || "Recipe, process, who you shared it with…";
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

	// --- shared classes (rings via outline so we can set color inline) ---
	const linkCardBase =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer " +
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const activityNumber = 3;

	// Export resources as bullet hyperlinks
	const pageLinks = [
		{
			label: "Native/Indigenous recipes (First Nations Development Institute)",
			url: "https://www.firstnations.org/knowledge-center/recipes/",
		},
	];

	// Tip text for export (will be split into sentences)
	const tipText =
		"Try making a traditional First Nations, Inuit or Métis recipe. Share your experience (potluck optional!).";

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient (accent → white) */}
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
							Make a Traditional Recipe
						</h1>
						<Utensils
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					{/* dashed, translucent tip (consistent with other pages) */}
					<TipCard accent={accent}>
						Try making a traditional First Nations, Inuit or Métis recipe.
						<br />
						Share your experience (potluck optional!)
					</TipCard>
				</motion.header>

				{/* Single centered link card */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 place-items-center gap-4 w-full">
						<motion.a
							href="https://www.firstnations.org/knowledge-center/recipes/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: First Nations Development Institute – Recipes (new tab)"
							aria-label="Open First Nations Development Institute – Recipes in a new tab"
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
									<Utensils className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									Native/Indigenous recipes (First Nations Development
									Institute)
								</div>
							</div>
							<div
								className={`${linkFooterBase} text-slate-800`}
								style={{ color: "#b45309" }}
							>
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
					accent={accent}
					downloadFileName={`Activity-${content?.id || "03"}-Reflection.docx`}
					/* Exported title becomes: "Activity 3: Make a Traditional Recipe" */
					docTitle={content?.title || "Make a Traditional Recipe"}
					docSubtitle={content?.subtitle}
					/* Make the activity number part of the exported title */
					activityNumber={activityNumber}
					/* Include the tip text at the top of the export */
					docIntro={tipText}
					/* Export resources as a header + bullet list of hyperlink labels */
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Amber headings in the exported DOCX/HTML */
					headingColor={accent}
				/>

				{/* Complete toggle (kept consistent with other pages) */}
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
function TipCard({ accent = "#b45309", children }) {
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
