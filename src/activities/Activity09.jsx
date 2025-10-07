// src/pages/activities/Activity09.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Newspaper, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity09({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#934D6C", // theming control
}) {
	const placeholder =
		content?.notePlaceholder ||
		"Story link; your summary and reflections on framing, voices, and biases…";

	// keep local state in sync with incoming prop (prevents premature “started”)
	const [localNotes, setLocalNotes] = useState(notes);
	useEffect(() => {
		setLocalNotes(notes);
	}, [notes]);

	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	// compute “started” using shared utility (works with string or object notes)
	const started = hasActivityStarted(localNotes);

	const reduceMotion = useReducedMotion();

	// --- animations (homogeneous with other activities) ---
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

	// --- shared classes (mirrors other pages) ---
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
		"Uncover a news story with an Indigenous focus and reflect on the scope of the story.";

	// Links list (exported to doc; no table) — memoized
	const pageLinks = useMemo(
		() => [
			{ label: "APTN", url: "https://www.aptntv.ca/" },
			{
				label: "The Turtle Island News",
				url: "https://theturtleislandnews.com/",
			},
			{ label: "Ku'ku'kwes News", url: "https://kukukwes.com/" },
			{ label: "IndigiNews", url: "https://indiginews.com/" },
			{ label: "Ha-Shilth-Sa", url: "https://hashilthsa.com/" },
			{ label: "Windspeaker", url: "https://windspeaker.com/" },
		],
		[]
	);

	// Also memoize the outlet tiles (so the JSX isn’t rebuilt on every keystroke)
	const outletTiles = useMemo(
		() => [
			{
				href: "https://www.aptntv.ca/",
				title: "APTN",
				desc: "National Indigenous television network with news coverage.",
			},
			{
				href: "https://theturtleislandnews.com/",
				title: "The Turtle Island News",
				desc: "Community-focused reporting across Turtle Island.",
			},
			{
				href: "https://kukukwes.com/",
				title: "Ku'ku'kwes News",
				desc: "Independent Atlantic Canada Indigenous news.",
			},
			{
				href: "https://indiginews.com/",
				title: "IndigiNews",
				desc: "Local Indigenous voices and investigative features.",
			},
			{
				href: "https://hashilthsa.com/",
				title: "Ha-Shilth-Sa",
				desc: "Nuu-chah-nulth Tribal Council newspaper.",
			},
			{
				href: "https://windspeaker.com/",
				title: "Windspeaker",
				desc: "Independent Indigenous news and opinion.",
			},
		],
		[]
	);

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient (matches A01/A08 style) */}
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

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* ===== HEADER (homogeneous with Activity 01) ===== */}
				<motion.header
					className="text-center"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="mx-auto space-y-4 sm:space-y-5">
						{/* Activity number (big, uppercase) */}
						<p
							className="font-semibold uppercase tracking-wider text-2xl sm:text-3xl"
							style={{ color: accent }}
						>
							Activity {activityNumber}
						</p>

						{/* H1 + icon row */}
						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{pageTitle}
							</h1>
							<Newspaper
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout with pill header */}
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
									{tipText}
									<br />
									<strong>
										Share your thoughts and perspectives on what you learned—for
										example, challenges people face or biases the story reveals.
									</strong>{" "}
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Outlets ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{outletTiles.map(({ href, title, desc }) => (
							<motion.a
								key={href}
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
									style={{
										backgroundColor: withAlpha(accent, "1A"),
										color: accent,
									}}
								>
									<Newspaper className="w-5 h-5" />
								</div>

								{/* centered content */}
								<div className="min-h-[108px] flex flex-col items-center justify-center text-center">
									<div className="font-medium text-slate-900 group-hover:underline">
										{title}
									</div>
									{desc ? (
										<p className="mt-1 text-sm text-gray-600 max-w-sm">
											{desc}
										</p>
									) : null}
									<div className={linkFooterBase} style={{ color: accent }}>
										<ExternalLink className="w-4 h-4" aria-hidden="true" />
										<span>Open link</span>
									</div>
								</div>
							</motion.a>
						))}
					</div>
				</motion.section>

				{/* ===== Notes (NoteComposer) ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "09"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${content?.id || "09"}-Reflection.docx`}
					/* Exported title becomes: "Activity 9: {pageTitle}" */
					docTitle={pageTitle}
					docSubtitle={content?.subtitle}
					activityNumber={activityNumber}
					/* Include the on-page tip in export */
					docIntro={tipText}
					/* Export resources as header + bullet list of hyperlink labels */
					includeLinks={true}
					linksHeading="Suggested Indigenous-Led Outlets"
					pageLinks={pageLinks}
					/* Use accent for exported headings */
					headingColor={accent}
				/>

				{/* ===== Complete toggle (shared component) ===== */}
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

/* (kept for parity, but not used in the header anymore) */
function TipCard({ accent = "#934D6C", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
			style={{
				borderColor: withAlpha(accent, "33"),
				backgroundColor: withAlpha(accent, "14"),
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);
}
