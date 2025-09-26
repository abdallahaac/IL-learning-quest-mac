import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	HeartHandshake,
	Link2,
	BookOpen,
	Bookmark,
	ExternalLink,
	Users,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

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

	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();

	// --- animations (same rhythm as other redesigned pages) ---
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

	// Left-badge, centered title
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
			{/* soft accent gradient */}
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
							2SLGBTQQIA+ / Two-Spirit &amp; Indigiqueer Communities
						</h1>
						<HeartHandshake
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					<TipCard accent={accent}>
						Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous
						2SLGBTQQIA+ communities and their histories.
					</TipCard>
				</motion.header>

				{/* Resources + Advocates tip */}
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
							<TitleRow Icon={Link2}>
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
							<TitleRow Icon={BookOpen}>Two-Spirit Library (W2SA)</TitleRow>
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
								<Bookmark className="w-5 h-5" />
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

				{/* Notes — hex-accent NoteComposer, homogeneous with other pages */}
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

				{/* Complete toggle (kept like other activities) */}
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

/* Accent-aware dashed tip (homogenous with other pages) */
function TipCard({ accent = "#E11D48", children }) {
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

/* Advocates list with pills, accent-aware */
function AdvocatesTip({
	accent = "#E11D48",
	icon: Icon = Users,
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
