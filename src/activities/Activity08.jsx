// src/pages/activities/Activity08.jsx
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	HeartHandshake,
	Link2,
	BookOpen,
	Bookmark,
	ExternalLink,
	Users,
	Rainbow,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity08({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#E11D48", // rose-600 — change this to re-skin
}) {
	const placeholder =
		content?.notePlaceholder || "Voices you followed; what you learned…";

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

	// --- shared classes (use outline for focus so we can color via inline) ---
	const linkCardBase =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const activityNumber = 8;

	// Title & tip (used both in UI and export)
	const pageTitle =
		content?.title || "2SLGBTQQIA+ / Two-Spirit & Indigiqueer Communities";

	const tipText =
		"Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.";

	// Exportable resources as bullet hyperlinks (no table)
	const pageLinks = [
		{
			label:
				"Indigenous knowledge & Two-Spirit leadership (Native Governance Center)",
			url: "https://nativegov.org/resources/indigenous-knowledge-and-two-spirit-leadership/",
		},
		{
			label: "Two-Spirit Library (W2SA)",
			url: "https://w2sa.ca/two-spirit-library",
		},
		{
			label: "Two Spirits, One Voice (Egale)",
			url: "https://egale.ca/awareness/two-spirits-one-voice/",
		},
	];

	// Left-badge, centered title (for resource cards)
	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div
				className={badgeBase + " absolute left-0 top-1/2 -translate-y-1/2"}
				style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
			>
				<Icon className="w-5 h-5" />
			</div>
			<div className="w-full text-center font-medium text-slate-900 group-hover:underline">
				{children}
			</div>
		</div>
	);

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient (match Activity 01) */}
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
								{pageTitle}
							</h1>
							<Rainbow
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout (same pattern as A01) */}
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
									Enrich your understanding of Two-Spirit, Indigiqueer and
									Indigenous 2SLGBTQQIA+ communities and their histories.
									<br />
									<strong>Share what you learned with your team.</strong>
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resources + Advocates tip ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<motion.a
							href="https://nativegov.org/resources/indigenous-knowledge-and-two-spirit-leadership/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Indigenous knowledge & Two-Spirit leadership (new tab)"
							aria-label="Open Indigenous knowledge & Two-Spirit leadership in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={Rainbow}>
								Indigenous knowledge &amp; Two-Spirit leadership
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://w2sa.ca/two-spirit-library"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Two-Spirit Library (new tab)"
							aria-label="Open Two-Spirit Library in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={Rainbow}>Two-Spirit Library (W2SA)</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://egale.ca/awareness/two-spirits-one-voice/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase + " relative"}
							style={{ outlineColor: accent }}
							title="Open: Two Spirits, One Voice (new tab)"
							aria-label="Open Two Spirits, One Voice in a new tab"
							variants={cardPop}
						>
							{/* floating badge inside the card */}
							<div
								className={badgeBase + " absolute left-4 top-4"}
								style={{
									backgroundColor: withAlpha(accent, "1A"),
									color: accent,
								}}
							>
								<Rainbow className="w-5 h-5" />
							</div>

							<div className="w-full text-center font-medium text-slate-900 group-hover:underline pt-10">
								Two Spirits, One Voice (Egale)
							</div>

							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<AdvocatesTip
							accent={accent}
							title="Advocates to explore"
							subtitle="Follow and learn from these voices"
							items={[
								"Dr. James Makokis",
								"Jaris Swidrovich",
								"Raven Davis",
								"TJ Cuthand",
								"Alexa Keleutak",
								"Chelsea Vowel",
							]}
						/>
					</div>
				</motion.section>

				{/* ===== Notes — hex-accent NoteComposer ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "08"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${content?.id || "08"}-Reflection.docx`}
					/* Exported title becomes: "Activity 8: {pageTitle}" */
					docTitle={pageTitle}
					docSubtitle={content?.subtitle}
					/* Include activity number in exported title header */
					activityNumber={activityNumber}
					/* Include on-page tip in exported document (split into sentences) */
					docIntro={tipText}
					/* Export resources as header + bullet list of hyperlink labels (no table) */
					includeLinks={true}
					linksHeading="Resources"
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

/* Advocates list with pills, accent-aware */
function AdvocatesTip({
	accent = "#E11D48",
	icon: Icon = Rainbow,
	title = "Advocates to explore",
	subtitle,
	items = [],
}) {
	return (
		<motion.section
			className="w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label={title}
			style={{
				borderColor: withAlpha(accent, "33"),
				backgroundColor: withAlpha(accent, "14"),
			}}
			variants={{
				hidden: { opacity: 0, y: 8, scale: 0.99 },
				show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
			}}
		>
			<header className="flex items-start gap-3">
				<div
					className="shrink-0 w-10 h-10 rounded-xl grid place-items-center border"
					style={{
						backgroundColor: "#fff",
						color: accent,
						borderColor: withAlpha(accent, "33"),
					}}
				>
					<Icon className="w-5 h-5" aria-hidden="true" />
				</div>
				<div className="min-w-0">
					<h3 className="font-semibold text-slate-900">{title}</h3>
					{subtitle ? (
						<p className="text-sm text-slate-600">{subtitle}</p>
					) : null}
				</div>
			</header>

			<ul className="mt-3 flex flex-wrap gap-2" aria-label={`${title} list`}>
				{items.map((it) => (
					<li key={it}>
						<span
							className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-sm"
							style={{
								borderColor: withAlpha(accent, "33"),
								backgroundColor: "rgba(255,255,255,0.7)",
								color: "#7f1d1d",
							}}
						>
							<span
								className="inline-block h-1.5 w-1.5 rounded-full"
								style={{ backgroundColor: accent }}
							/>
							{it}
						</span>
					</li>
				))}
			</ul>
		</motion.section>
	);
}
