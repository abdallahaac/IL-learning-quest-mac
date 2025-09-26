import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Newspaper, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity09({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#934D6C", // rose-600 — same theming control as Activity08
}) {
	const placeholder =
		content?.notePlaceholder ||
		"Story link; your summary and reflections on framing, voices, and biases…";

	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// --- animations (same rhythm as Activity08) ---
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

	// --- shared classes (mirroring Activity08) ---
	const linkCardBase =
		"group relative block w-full rounded-2xl border border-gray-200 bg-white p-5 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase =
		"absolute left-5 top-5 w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const activityNumber = 9;

	// Title & tip (used both in UI and export)
	const pageTitle = content?.title || "Indigenous-Focused News Story";
	const tipText =
		"Choose a story from an Indigenous-led outlet. Summarize the piece and reflect on the framing, voices quoted, and possible biases.";

	// Links list (exported to doc like Activity08—no table)
	const pageLinks = [
		{ label: "APTN", url: "https://www.aptntv.ca/" },
		{
			label: "The Turtle Island News",
			url: "https://theturtleislandnews.com/",
		},
		{ label: "Ku'ku'kwes News", url: "https://kukukwes.com/" },
		{ label: "IndigiNews", url: "https://indiginews.com/" },
		{ label: "Ha-Shilth-Sa", url: "https://hashilthsa.com/" },
		{ label: "Windspeaker", url: "https://windspeaker.com/" },
	];

	const OutletTile = ({ href, title, desc }) => (
		<motion.a
			href={href}
			target="_blank"
			rel="noreferrer"
			className={linkCardBase}
			style={{ outlineColor: accent }}
			title={`Open: ${title} (new tab)`}
			aria-label={`Open ${title} in a new tab`}
			variants={cardPop}
		>
			{/* top-left icon badge (accent tint) */}
			<div
				className={badgeBase}
				aria-hidden="true"
				style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
			>
				<Newspaper className="w-5 h-5" />
			</div>

			{/* centered content */}
			<div className="min-h-[108px] flex flex-col items-center justify-center text-center">
				<div className="font-medium text-slate-900 group-hover:underline">
					{title}
				</div>
				{desc ? (
					<p className="mt-1 text-sm text-gray-600 max-w-sm">{desc}</p>
				) : null}
				<div className={linkFooterBase} style={{ color: accent }}>
					<ExternalLink className="w-4 h-4" aria-hidden="true" />
					<span>Open link</span>
				</div>
			</div>
		</motion.a>
	);

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft accent gradient (same pattern as Activity08) */}
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
				animate={{ opacity: 0.2 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
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
							{pageTitle}
						</h1>
						<HeartHandshake
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					<TipCard accent={accent}>{tipText}</TipCard>
				</motion.header>

				{/* Outlets */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<OutletTile
							href="https://www.aptntv.ca/"
							title="APTN"
							desc="National Indigenous television network with news coverage."
						/>
						<OutletTile
							href="https://theturtleislandnews.com/"
							title="The Turtle Island News"
							desc="Community-focused reporting across Turtle Island."
						/>
						<OutletTile
							href="https://kukukwes.com/"
							title="Ku'ku'kwes News"
							desc="Independent Atlantic Canada Indigenous news."
						/>
						<OutletTile
							href="https://indiginews.com/"
							title="IndigiNews"
							desc="Local Indigenous voices and investigative features."
						/>
						<OutletTile
							href="https://hashilthsa.com/"
							title="Ha-Shilth-Sa"
							desc="Nuu-chah-nulth Tribal Council newspaper."
						/>
						<OutletTile
							href="https://windspeaker.com/"
							title="Windspeaker"
							desc="Independent Indigenous news and opinion."
						/>
					</div>
				</motion.section>

				{/* Notes — identical NoteComposer pattern as Activity08 */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "09"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent} // key: uses the same hex-accent approach as Activity08
					downloadFileName={`Activity-${content?.id || "09"}-Reflection.docx`}
					/* Exported title becomes: "Activity 9: {pageTitle}" */
					docTitle={pageTitle}
					docSubtitle={content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={true}
					linksHeading="Suggested Indigenous-Led Outlets"
					pageLinks={pageLinks}
					headingColor={accent}
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

/* Accent-aware dashed tip — same component style as Activity08 */
function TipCard({ accent = "#934D6C", children }) {
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
