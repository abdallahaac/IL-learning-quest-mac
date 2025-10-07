// src/pages/activities/Activity04.jsx
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

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

	// Local notes, synced with prop (prevents premature “started”)
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => {
		setLocalNotes(notes ?? "");
	}, [notes]);

	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	// Compute “started” from freshest value
	const started = hasActivityStarted(localNotes ?? notes, "notes");

	const reduceMotion = useReducedMotion();

	// --- animations (same rhythm as Activity 01) ---
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

	// Resources to export as bullet hyperlinks (no table)
	const pageLinks = [
		{
			label: "Global map of Indigenous Peoples (PDF)",
			url: "https://newshour-classroom-tc.digi-producers.pbs.org/uploads/app/uploads/2014/11/A-global-map-of-indigenous-peoples.pdf",
		},
		{
			label: "Mapped: The world’s Indigenous Peoples",
			url: "https://www.visualcapitalist.com/cp/mapped-the-worlds-indigenous-peoples/",
		},
	];

	// Tip text included at top of export
	const tipText =
		"Discover some interesting facts about an Indigenous population outside Canada. What stood out to you?";

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
								{content?.title || "Indigenous Peoples Outside Canada"}
							</h1>
							<Globe2
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
									Discover some interesting facts about an Indigenous population
									outside Canada.
									<br />
									<strong>Describe the things you learned about. </strong>
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Link cards ===== */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid  gap-4 place-content-center w-full">
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
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* ===== Notes (hex-accent aware NoteComposer) ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "04"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${content?.id || "04"}-Reflection.docx`}
					/* Exported title becomes: "Activity 4: Indigenous Peoples Outside Canada" */
					docTitle={content?.title || "Indigenous Peoples Outside Canada"}
					docSubtitle={content?.subtitle}
					activityNumber={activityNumber}
					/* Include the on-page tip in the exported document */
					docIntro={tipText}
					/* Export resources as a header + bullet list of hyperlink labels (no table) */
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Indigo headings in the exported DOCX/HTML to match page accent */
					headingColor={accent}
				/>

				{/* ===== Complete toggle ===== */}
				<div className="flex justify-end">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>
				</div>
			</div>
		</motion.div>
	);
}
