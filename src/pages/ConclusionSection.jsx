// src/pages/ConclusionSection.jsx
import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons"; // outlined chat bubble

/* helpers */
const withAlpha = (hex, aa) => `${hex}${aa}`;
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const hexToRgb = (hex) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
};
const shadeHex = (hex, amt /* -1..1 */) => {
	const { r, g, b } = hexToRgb(hex);
	const t = amt < 0 ? 0 : 255;
	const p = Math.abs(amt);
	const nr = Math.round((t - r) * p + r);
	const ng = Math.round((t - g) * p + g);
	const nb = Math.round((t - b) * p + b);
	const to2 = (n) => n.toString(16).padStart(2, "0");
	return `#${to2(nr)}${to2(ng)}${to2(nb)}`;
};

export default function ConclusionSection({
	content = {},
	accent = "#8B5CF6",
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
	const highlights = [paragraphs[0], paragraphs[1], paragraphs[2]].filter(
		Boolean
	);
	const closing = paragraphs[3];
	const coda = paragraphs[4];

	const reduceMotion = useReducedMotion();

	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};

	const card = "rounded-2xl border border-gray-200 bg-white shadow-sm";
	const ringAccent =
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

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

				{/* Highlights */}
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

				{/* Closing paragraph */}
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

				{/* █████ Feedback — single pill, WHITE background, darker on hover, more circular █████ */}
				<div className="py-8 flex justify-center">
					<FeedbackPill accent={accent} />
				</div>
			</div>
		</motion.div>
	);
}

/* dashed tip box */
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
					<span
						aria-hidden="true"
						className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rotate-45 bg-white"
						style={{
							borderLeft: `1px solid ${withAlpha(accent, "22")}`,
							borderTop: `1px solid ${withAlpha(accent, "22")}`,
						}}
					/>
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

/* --- WHITE pill with darker hover, extra roundness --- */
function FeedbackPill({ accent = "#8B5CF6" }) {
	const [hover, setHover] = useState(false);
	const [active, setActive] = useState(false);

	const accentHex = normalizeHex(accent) || "#8B5CF6";
	const accentDark = shadeHex(accentHex, -0.18); // darker for hover
	const accentDarker = shadeHex(accentHex, -0.28); // darker for active

	const borderColor = active
		? accentDarker
		: hover
		? accentDark
		: withAlpha(accentHex, "55");
	const iconBorder = active ? accentDarker : hover ? accentDark : accentHex;

	return (
		<a
			href="https://airtable.com/appiWB5orohCHzA35/shrfyFm9N7HuQBhe8"
			target="_blank"
			rel="noopener noreferrer"
			className="
        group inline-flex items-center gap-4
        rounded-full            /* ⟵ more circular */
        px-7 sm:px-8 py-4
        text-[18px] font-semibold
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      "
			style={{
				backgroundColor: "#FFFFFF", // ⟵ stays white always
				color: accentHex,
				border: `3px solid ${borderColor}`, // ⟵ darkens on hover/active
				boxShadow: hover
					? "0 10px 26px rgba(2,6,23,0.14)"
					: "0 8px 22px rgba(2,6,23,0.10)",
				transform: active ? "translateY(1px)" : "translateY(0)",
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => {
				setHover(false);
				setActive(false);
			}}
			onMouseDown={() => setActive(true)}
			onMouseUp={() => setActive(false)}
			aria-label="Open feedback form"
			title="Feedback"
		>
			{/* circular icon badge inside the same pill */}
			<span
				className="grid place-items-center rounded-full shrink-0 transition-all duration-200"
				style={{
					width: 52, // bigger
					height: 52, // bigger
					backgroundColor: "#FFFFFF", // stays white too
					border: `3px solid ${iconBorder}`, // darkens on hover/active
					color: active ? accentDarker : hover ? accentDark : accentHex,
				}}
				aria-hidden="true"
			>
				<FontAwesomeIcon className="text-[22px]" icon={faMessage} />
			</span>

			<span className="whitespace-nowrap text-2xl">Feedback</span>
		</a>
	);
}
