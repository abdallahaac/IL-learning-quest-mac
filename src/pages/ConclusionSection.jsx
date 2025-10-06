// src/pages/ConclusionSection.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, HeartHandshake, MessageSquareHeart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function ConclusionSection({
	content = {},
	accent = "#8B5CF6", // keep the purple theme
}) {
	// copy (unchanged)
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
	const highlights = [paragraphs[0], paragraphs[1], paragraphs[2]].filter(
		Boolean
	);
	const closing = paragraphs[3];
	const coda = paragraphs[4];

	const reduceMotion = useReducedMotion();

	// animations (subtle)
	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};

	// shared styles
	const card = "rounded-2xl border border-gray-200 bg-white shadow-sm";
	const ringAccent =
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

	// perfectly centered badge for icons
	const Badge = ({ children }) => (
		<div
			className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
			style={{
				backgroundColor: withAlpha(accent, "1A"),
				color: accent,
				border: `1px solid ${withAlpha(accent, "33")}`,
			}}
			aria-hidden="true"
		>
			{children}
		</div>
	);

	return (
		<motion.div
			className="relative bg-transparent min-h-[70svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
			role="main"
			aria-labelledby="conclusion-title"
		>
			{/* Original purple gradient overlay */}
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha(accent, "26")} 0%,
            rgba(255,255,255,0) 45%,
            rgba(248,250,252,0) 100%
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.2 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 space-y-10">
				{/* Header */}
				<motion.header
					className="text-center space-y-4"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="flex items-center justify-center gap-3">
						<h1
							id="conclusion-title"
							className="text-3xl sm:text-4xl font-bold text-slate-900"
						>
							{title}
						</h1>

						{/* Accent-matched FA flag badge */}
						<span
							className="inline-flex items-center justify-center w-9 h-9 rounded-lg"
							style={{
								backgroundColor: withAlpha(accent, "14"),
								border: `1px solid ${withAlpha(accent, "33")}`,
								color: accent,
							}}
							aria-hidden="true"
							title="Conclusion"
						>
							<FontAwesomeIcon icon={faFlagCheckered} className="w-4 h-4" />
						</span>
					</div>
				</motion.header>

				{/* Highlights — equal heights */}
				<section aria-label="Key takeaways">
					<ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{highlights.map((h, i) => (
							<li key={i} className={`${card} p-6 flex`}>
								<div className="flex flex-col items-center text-center gap-3 w-full">
									<Badge>
										<CheckCircle2
											className="w-[20px] h-[20px]"
											strokeWidth={2.2}
										/>
									</Badge>
									<p className="text-[15px] leading-6 text-slate-800 max-w-[36ch]">
										{h}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>

				{/* Closing paragraph — speech-bubble band */}
				{closing && <ClosingCallout accent={accent} text={closing} />}

				{/* Coda */}
				{coda && (
					<section aria-label="Final note">
						<div
							className="mx-auto max-w-3xl rounded-2xl p-6 text-center border shadow-sm"
							style={{
								background: `linear-gradient(135deg, ${withAlpha(
									accent,
									"12"
								)} 0%, ${withAlpha(accent, "08")} 100%)`,
								borderColor: withAlpha(accent, "2E"),
							}}
						>
							<div
								className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
								style={{
									backgroundColor: withAlpha(accent, "1A"),
									border: `1px solid ${withAlpha(accent, "33")}`,
									color: accent,
								}}
								aria-hidden="true"
							>
								<HeartHandshake
									className="w-[20px] h-[20px]"
									strokeWidth={2.2}
								/>
							</div>
							<p className="text-[15px] leading-6 text-slate-800">{coda}</p>
						</div>
					</section>
				)}

				{/* █████ Feedback (centered, no background) █████ */}
				<div className="py-6 flex flex-col items-center text-center gap-3">
					<a
						href="https://airtable.com/appiWB5orohCHzA35/shrfyFm9N7HuQBhe8"
						target="_blank"
						rel="noopener noreferrer"
						className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${ringAccent}`}
						style={{
							color: "white",
							backgroundColor: accent,
							outlineColor: accent,
							boxShadow: `0 8px 20px ${withAlpha(accent, "33")}`,
						}}
					>
						<MessageSquareHeart className="w-4 h-4" strokeWidth={2.4} />
						Open feedback form
					</a>
				</div>
			</div>
		</motion.div>
	);
}

/* dashed tip box — same style language as Activities */
function TipCard({ accent = "#8B5CF6", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Tip"
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

/* Closing paragraph callout — speech-bubble with notch + measured text */
function ClosingCallout({ text, accent }) {
	return (
		<section aria-label="Closing reflection" className="px-0">
			<div className="mx-auto max-w-4xl">
				<div
					className="relative rounded-2xl border bg-white/90 shadow-sm"
					style={{
						borderColor: withAlpha(accent, "22"),
						boxShadow:
							"0 1px 2px rgba(2,6,23,.04), 0 8px 24px rgba(2,6,23,.06)",
					}}
				>
					{/* speech-bubble notch */}
					<span
						aria-hidden="true"
						className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rotate-45 bg-white"
						style={{
							borderLeft: `1px solid ${withAlpha(accent, "22")}`,
							borderTop: `1px solid ${withAlpha(accent, "22")}`,
						}}
					/>
					{/* accent rail (subtle) */}
					<span
						aria-hidden="true"
						className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl"
						style={{ backgroundColor: withAlpha(accent, "7F") }}
					/>
					<p className="px-5 sm:px-6 py-5 max-w-prose mx-auto text-[15.5px] leading-7 text-slate-800 text-left">
						{text}
					</p>
				</div>
			</div>
		</section>
	);
}
