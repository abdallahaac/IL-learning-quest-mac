import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, CheckCircle2, HeartHandshake } from "lucide-react";

export default function ConclusionSection({
	content = {},
	accent = "#8B5CF6", // NEW: change accent here (e.g., "#22C55E" for emerald)
}) {
	// --- CONTENT (keeps your exact wording, just structured) --------------------
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

	const { title, paragraphs = [] } = {
		...defaultContent,
		...content,
	};

	// Slice into highlights (first 3), closing (4th), and coda (5th)
	const highlights = [paragraphs[0], paragraphs[1], paragraphs[2]].filter(
		Boolean
	);
	const closing = paragraphs[3];
	const coda = paragraphs[4];

	const reduceMotion = useReducedMotion();

	// --- Animations -------------------------------------------------------------
	const STAGGER = 0.16;
	const DELAY_CHILDREN = 0.12;
	const DELAY_AFTER_HIGHLIGHTS = reduceMotion
		? 0
		: DELAY_CHILDREN + STAGGER * (highlights.length + 0.5);

	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
			y: reduceMotion ? 0 : 10,
			scale: reduceMotion ? 1 : 0.98,
		},
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.35, ease: "easeOut" },
		},
	};
	const tailReveal = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: "easeOut",
				delay: reduceMotion ? 0 : DELAY_AFTER_HIGHLIGHTS,
			},
		},
	};

	// --- Styles ----------------------------------------------------------------
	const wrap = "relative max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6";
	const card = "rounded-2xl border border-gray-200 bg-white shadow-sm";
	const ringAccent = `focus:outline-none focus-visible:ring-2 focus-visible:ring-[${accent}] focus-visible:ring-offset-2`;

	return (
		<motion.div
			className="relative bg-transparent min-h-[60svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft accent ribbon */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-48 -z-10"
				style={{
					background: `linear-gradient(180deg, ${accent}14, transparent 70%)`, // ~8% tint fade
				}}
			/>
			<div className={wrap}>
				{/* Header */}
				<motion.header
					className="text-center space-y-2"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<span
						className="inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase"
						style={{
							color: accent,
							backgroundColor: `${accent}1A`, // ~10% tint
							border: `1px solid ${accent}33`, // ~20% tint
						}}
					>
						Wrap-Up
					</span>
					<div className="flex items-center justify-center gap-3">
						<h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
							{title}
						</h2>
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						A quick wrap-up and a couple of gentle next steps.
					</p>
				</motion.header>

				{/* Highlights */}
				<motion.section
					className="grid grid-cols-1 md:grid-cols-3 gap-4"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					{highlights.map((h, i) => (
						<motion.article
							key={i}
							className={`${card} p-4`}
							variants={cardPop}
						>
							<div className="flex items-start gap-3">
								<span
									className="mt-0.5 inline-flex h-8 w-8 items-center justify-center "
									style={{
										color: accent,
										borderColor: `${accent}33`,
									}}
									aria-hidden="true"
								>
									<CheckCircle2 className="h-4 w-4" />
								</span>
								<p className="text-[15px] leading-6 text-slate-800">{h}</p>
							</div>
						</motion.article>
					))}
				</motion.section>

				{/* Closing paragraph */}
				{closing && (
					<motion.p
						className="text-center text-slate-700 leading-relaxed max-w-3xl mx-auto"
						variants={tailReveal}
						initial="hidden"
						animate="show"
					>
						{closing}
					</motion.p>
				)}

				{/* Callout coda */}
				{coda && (
					<motion.div
						className="mt-2"
						variants={tailReveal}
						initial="hidden"
						animate="show"
					>
						<div
							className="mx-auto max-w-3xl rounded-xl p-4 sm:p-5 text-center"
							style={{
								background: `linear-gradient(135deg, ${accent}12 0%, ${accent}08 100%)`,
								border: `1px solid ${accent}2e`,
							}}
						>
							<div
								className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full"
								style={{
									backgroundColor: `${accent}1A`,
									border: `1px solid ${accent}33`,
									color: accent,
								}}
							>
								<HeartHandshake className="w-4 h-4" />
							</div>
							<p className="text-[15px] leading-6 text-slate-800">{coda}</p>
						</div>
					</motion.div>
				)}

				{/* Next steps chips */}
				<motion.section
					className={`${card} p-4 sm:p-5`}
					variants={tailReveal}
					initial="hidden"
					animate="show"
				>
					<div className="text-center mb-3">
						<span className="inline-block text-sm font-semibold text-slate-900">
							Next steps
						</span>
					</div>
					<div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:flex-wrap">
						{[
							"Share one takeaway with your team this week.",
							"Pick a small action to try in your next sprint or meeting.",
						].map((n, i) => (
							<span
								key={i}
								className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm ${ringAccent}`}
								style={{
									color: accent,
									backgroundColor: `${accent}0D`, // ~5% tint
									border: `1px solid ${accent}33`,
								}}
							>
								{n}
							</span>
						))}
					</div>
				</motion.section>
			</div>
		</motion.div>
	);
}
