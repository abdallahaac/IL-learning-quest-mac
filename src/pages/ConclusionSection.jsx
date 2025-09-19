import React from "react";
import { motion, useReducedMotion } from "framer-motion";

function CheckIcon(props) {
	return (
		<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path
				fillRule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export default function ConclusionSection({ content = {} }) {
	const { title, paragraphs = [] } = content;
	const reduceMotion = useReducedMotion();

	const highlights = [
		paragraphs[0] ??
			"You explored new perspectives, shared reflections, and grew together.",
		paragraphs[1] ??
			"Whether you completed every step or a few, awareness and understanding are what matter.",
		paragraphs[2] ??
			"Carry this learning into your daily work—small actions build momentum.",
	].slice(0, 3);

	const closing = paragraphs[3];
	const nextSteps = [
		"Share one takeaway with your team this week.",
		"Pick a small action to try in your next sprint or meeting.",
	];

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

	const card =
		"rounded-xl border border-gray-200 bg-white/95 shadow-sm p-4 text-left";

	return (
		<motion.div
			className="relative flex-1 px-4 py-12 bg-transparent"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft gradient overlay */}
			<div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none
                   bg-gradient-to-b from-emerald-50/80 via-white/60 to-slate-50/80"
			/>
			<div className="relative z-10 max-w-4xl mx-auto">
				{/* Header */}
				<motion.header
					className="text-center space-y-2"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
						{title || "Conclusion"}
					</h2>
					<p className="text-gray-600">
						A quick wrap-up and a couple of gentle next steps.
					</p>
				</motion.header>

				{/* Highlights */}
				<motion.section
					className="mt-8 grid md:grid-cols-3 gap-4"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					{highlights.map((h, i) => (
						<motion.article key={i} className={card} variants={cardPop}>
							<div className="flex items-start gap-3">
								<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-700">
									<CheckIcon className="h-4 w-4" />
								</span>
								<p className="text-[15px] leading-6 text-gray-800">{h}</p>
							</div>
						</motion.article>
					))}
				</motion.section>

				{/* Closing */}
				{closing && (
					<motion.p
						className="mt-8 text-center text-gray-700 leading-relaxed max-w-3xl mx-auto"
						variants={tailReveal}
						initial="hidden"
						animate="show"
					>
						{closing}
					</motion.p>
				)}

				{/* Next steps */}
				<motion.section
					className="mt-10"
					variants={tailReveal}
					initial="hidden"
					animate="show"
				>
					<div className="text-center mb-3">
						<span className="inline-block text-sm font-medium text-gray-800">
							Next steps
						</span>
					</div>
					<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
						{[
							"Share one takeaway with your team this week.",
							"Pick a small action to try in your next sprint or meeting.",
						].map((n, i) => (
							<span
								key={i}
								className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm"
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
