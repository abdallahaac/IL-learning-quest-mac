// src/pages/activities/Activity02.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ExternalLink } from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

/* Tailwind emerald hexes */
const EMERALD_50 = "#ECFDF5"; // bg-emerald-50
const EMERALD_700 = "#047857"; // text/ring default

/* #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity02({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = EMERALD_700, // theme color
}) {
	const placeholder =
		content?.notePlaceholder || "Plants, uses, teachings you discovered…";

	// Local state + sync from prop
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => {
		setLocalNotes(notes ?? "");
	}, [notes]);

	// Track if the learner actually edited in THIS session
	const initialHasContentRef = useRef(hasActivityStarted(notes ?? "", "notes"));
	const [touched, setTouched] = useState(false);
	const firstChangeIgnoredRef = useRef(false);

	const saveNotes = (next) => {
		setLocalNotes(next);

		// Only mark as "touched" when a real user edit happens.
		// We ignore a single initial onChange echo that some editors fire on mount.
		if (!firstChangeIgnoredRef.current) {
			firstChangeIgnoredRef.current = true;

			// If the first change is identical to initial value, don't count it as a user edit.
			const sameAsInitial =
				(typeof next === "string" &&
					typeof (notes ?? "") === "string" &&
					next === (notes ?? "")) ||
				(typeof next === "object" &&
					typeof (notes ?? "") === "object" &&
					JSON.stringify(next) === JSON.stringify(notes ?? ""));
			if (!sameAsInitial) setTouched(true);
		} else {
			setTouched(true);
		}

		onNotes?.(next);
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

	// Tip text for export (and to mirror in the on-page callout)
	const tipText =
		"Discover the Indigenous medicinal uses for plants in your area. Describe the things you learned about";

	/**
	 * STARTED RULE:
	 * - If this activity already had content (from props/localStorage), allow enabling immediately (return true)
	 * - Otherwise, require the user to actually type (touched) AND have non-empty content now.
	 */
	const hasContentNow = hasActivityStarted(localNotes ?? "", "notes");
	const started = initialHasContentRef.current
		? true
		: touched && hasContentNow;

	// ---- Decoupled download handler (uses current notes + page metadata) ----
	const handleDownload = () => {
		const html =
			typeof localNotes === "string" ? localNotes : localNotes?.text || "";
		downloadNotesAsWord({
			html,
			downloadFileName: `Activity-${content?.id || "02"}-Reflection.doc`,
			docTitle: content?.title || "Indigenous Medicinal Plants",
			docSubtitle: content?.subtitle,
			activityNumber,
			docIntro: tipText,
			includeLinks: true,
			linksHeading: "Resources",
			pageLinks,
			headingColor: accent, // use activity accent for headings in export
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
				{/* ===== HEADER ===== */}
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

						{/* Title row */}
						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								Indigenous Medicinal Plants
							</h1>
							<Leaf
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout */}
						<aside
							role="note"
							aria-label="Activity tip"
							className="mx-auto max-w-3xl rounded-2xl border bg-white/85 backdrop-blur-sm
                 px-5 py-4 text-base sm:text-lg leading-relaxed shadow-[0_1px_0_rgba(0,0,0,0.05)]"
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
									Discover the Indigenous medicinal uses for plants in your
									area. <br />{" "}
									<strong> Describe the things you learned about.</strong>
								</p>
							</div>
						</aside>
					</div>
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
									<Leaf className="w-5 h-5" aria-hidden="true" />
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
									<Leaf className="w-5 h-5" aria-hidden="true" />
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

				{/* Notes (hide internal download button; use external one below) */}
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
					downloadFileName={`Activity-${content?.id || "02"}-Reflection.doc`}
					/* Exported title becomes: "Activity 2: Indigenous Medicinal Plants" */
					docTitle={content?.title || "Indigenous Medicinal Plants"}
					/* Add activity number so it's prepended to the title in the export */
					activityNumber={activityNumber}
					/* Include the EXACT same tip text at the top of the export */
					docIntro={tipText}
					/* Export resources as a header + bullet list of hyperlink labels */
					includeLinks
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Emerald headings in the exported DOCX/HTML (export-only) */
					headingColor={EMERALD_700}
					showDownloadButton={false}
				/>

				{/* Bottom action row: Complete + external Download */}
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
						title="Download your reflections as a Word-compatible .doc file"
					>
						Download (.doc)
					</button>
				</div>
			</div>
		</motion.div>
	);
}
