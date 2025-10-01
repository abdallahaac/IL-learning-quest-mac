// src/pages/ConclusionPage.jsx
import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLink,
	faCircleCheck,
	faFileArrowDown,
	faArrowRight,
	faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";

/* #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

const PAGE_TITLE = "Conclusion";

export default function ConclusionPage({
	content = {},
	accent = "#10B981", // emerald-500 (kept from the rest of the site)
}) {
	const defaultContent = {
		title: "Conclusion",
		paragraphs: [
			"As your team wraps up the Learning Quest on Indigenous Cultures, take a moment to recognize the learning, reflection, and conversations you’ve shared. Each activity was an opportunity to explore new perspectives, challenge assumptions, and grow together.",
			"This quest was designed to be flexible and personal. Whether you completed every step or focused on a few, what matters most is the awareness and understanding you’ve built along the way.",
			"Your team discussions helped bring the learning to life through open dialogue, shared insights, and thoughtful questions. These conversations are just the beginning.",
			"As you move forward, think about how you can carry this learning into your daily work. What actions will you take? What commitments will you make?",
			"Reconciliation is an ongoing journey. Thank you for taking these important steps together and with openness, respect, and intention.",
		],
	};

	const { title, paragraphs = [] } = { ...defaultContent, ...content };

	// Slice into highlights (first 3), closing (4th), and coda (5th)
	const highlights = useMemo(
		() => [paragraphs[0], paragraphs[1], paragraphs[2]].filter(Boolean),
		[paragraphs]
	);
	const closing = paragraphs[3];
	const coda = paragraphs[4];

	const reduceMotion = useReducedMotion();

	// Animations (match site subtlety)
	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};

	// Shared styles/tokens (mirrors Resources)
	const brandDark = "#064E3B";
	const iconSize = 18;

	const TipCard = ({ children }) => (
		<section
			className="mx-auto max-w-3xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Usage tip"
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

	return (
		<motion.div
			className="relative bg-transparent min-h-[70svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* Keep the site’s soft emerald gradient overlay */}
			<motion.div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha("#10B981", "1F")} 0%,
            rgba(255,255,255,0) 40%,
            rgba(248,250,252,0) 100%
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.25 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
				{/* Header (homogenous with Resources: semibold title, link icon) */}
				<motion.header
					className="text-center space-y-4"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
							{PAGE_TITLE}
						</h1>
						<FontAwesomeIcon
							icon={faLink}
							className="shrink-0"
							style={{ color: accent, width: iconSize, height: iconSize }}
							aria-hidden="true"
							title="Conclusion"
						/>
					</div>

					<TipCard>Browse, reflect, then continue with next steps.</TipCard>
				</motion.header>

				{/* Three highlight cards (match card style from Resources) */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{highlights.map((h, i) => (
						<article
							key={i}
							className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
						>
							<div className="flex items-start gap-3">
								<span
									className="inline-grid h-10 w-10 place-items-center rounded-xl"
									style={{
										backgroundColor: withAlpha(accent, "14"),
										color: accent,
									}}
									aria-hidden="true"
								>
									<FontAwesomeIcon
										icon={faCircleCheck}
										className="shrink-0"
										style={{ width: iconSize, height: iconSize }}
									/>
								</span>
								<p className="text-[15px] leading-6 text-slate-800">{h}</p>
							</div>
						</article>
					))}
				</section>

				{/* Closing paragraph */}
				{closing ? (
					<p className="text-center text-slate-700 leading-relaxed max-w-3xl mx-auto">
						{closing}
					</p>
				) : null}

				{/* Callout coda (soft gradient + icon, like Resources pill/badge language) */}
				{coda ? (
					<div
						className="mx-auto max-w-3xl rounded-xl p-4 sm:p-5 text-center"
						style={{
							background: `linear-gradient(135deg, ${withAlpha(
								accent,
								"12"
							)} 0%, ${withAlpha(accent, "08")} 100%)`,
							border: `1px solid ${withAlpha(accent, "2e")}`,
						}}
					>
						<div
							className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full"
							style={{
								backgroundColor: withAlpha(accent, "1A"),
								border: `1px solid ${withAlpha(accent, "33")}`,
								color: accent,
							}}
						>
							<FontAwesomeIcon
								icon={faHandshakeAngle}
								style={{ width: 16, height: 16 }}
							/>
						</div>
						<p className="text-[15px] leading-6 text-slate-800">{coda}</p>
					</div>
				) : null}

				{/* Next steps (clearly connect to Resources page) */}
				<section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
					<div className="text-center mb-3">
						<span className="inline-block text-sm font-semibold text-slate-900">
							Next steps
						</span>
					</div>

					{/* Action chips (homogenous styling) */}
					<div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:flex-wrap">
						{[
							"Share one takeaway with your team this week.",
							"Pick a small action to try in your next sprint or meeting.",
						].map((n, i) => (
							<span
								key={i}
								className="inline-flex items-center rounded-full px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
								style={{
									color: brandDark,
									backgroundColor: withAlpha(accent, "0D"),
									border: `1px solid ${withAlpha(accent, "33")}`,
								}}
							>
								{n}
							</span>
						))}
					</div>

					{/* Bridge CTAs: clearly link to the Resources page (and optional overview) */}
					<div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
						<a
							href="/resources"
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-medium transition hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
							style={{ borderColor: withAlpha(accent, "66"), color: brandDark }}
							title="Browse Resources"
						>
							<FontAwesomeIcon
								icon={faLink}
								className="shrink-0"
								style={{ color: accent, width: iconSize, height: iconSize }}
								aria-hidden="true"
							/>
							<span>Browse Resources</span>
							<FontAwesomeIcon
								icon={faArrowRight}
								className="shrink-0 opacity-80"
								style={{ width: 14, height: 14 }}
								aria-hidden="true"
							/>
						</a>

						<a
							href="/"
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-medium transition hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
							style={{ borderColor: withAlpha(accent, "33"), color: "#0f172a" }}
							title="Return to Overview"
						>
							<span>Return to Overview</span>
						</a>
					</div>
				</section>
			</div>
		</motion.div>
	);
}
