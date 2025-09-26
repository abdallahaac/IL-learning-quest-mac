import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	Palette,
	Image as ImageIcon,
	Music4,
	ExternalLink,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

// helper: add alpha to a hex color (#RRGGBB + "AA")
function withAlpha(hex, alphaHex) {
	if (!/^#([0-9a-f]{6})$/i.test(hex)) return hex;
	return `${hex}${alphaHex}`;
}

export default function Activity01({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#4380d6", // brand accent
}) {
	const placeholder =
		content?.notePlaceholder || "Your reflections on the artist…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const pageLinks = [
		{
			label: "List of important Indigenous artists in Canada",
			url: "https://www.thecanadianencyclopedia.ca/en/article/important-indigenous-artists",
		},
		{
			label: "List of influential Indigenous musicians in Canada",
			url: "https://www.thecanadianencyclopedia.ca/en/article/influential-indigenous-musicians",
		},
	];

	// Tip text to include in the Word doc (will be split into sentences)
	const tipText =
		"Explore works by an Indigenous artist that speak to you. How do you relate to this artist? How do they inspire you?";

	const reduceMotion = useReducedMotion();

	// --- Animations
	const STAGGER = 0.14,
		DELAY_CHILDREN = 0.1;
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

	// shared classes
	const linkCardBase =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer " +
		"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const activityNumber = 1;

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft, accessible gradient */}
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b via-white/65 to-slate-50/80"
				style={{
					backgroundImage: `linear-gradient(to bottom, ${withAlpha(
						accent,
						"3D"
					)}, rgba(255,255,255,0.65), rgba(248,250,252,0.8))`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.35 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
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
							Explore an Indigenous Artist
						</h1>
						<Palette
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					{/* On-page tip card (UI) */}
					<TipPrompt accent={accent} />
				</motion.header>

				{/* Links grid */}
				<motion.section
					className="flex justify-center"
					variants={gridStagger}
					initial="hidden"
					animate="show"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 place-content-center">
						<motion.a
							href="https://www.thecanadianencyclopedia.ca/en/article/important-indigenous-artists"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							variants={cardPop}
							title="Open: List of important Indigenous artists in Canada (new tab)"
							aria-label="Open list of important Indigenous artists in Canada in a new tab"
						>
							<div className="flex items-center gap-3">
								<div
									className={badgeBase}
									style={{
										backgroundColor: withAlpha(accent, "1A"),
										color: accent,
									}}
								>
									<ImageIcon className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									List of important Indigenous artists in Canada
								</div>
							</div>
							<div
								className={`${linkFooterBase} text-slate-800`}
								style={{ color: "#4380d6" }}
							>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://www.thecanadianencyclopedia.ca/en/article/influential-indigenous-musicians"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							variants={cardPop}
							title="Open: List of influential Indigenous musicians in Canada (new tab)"
							aria-label="Open list of influential Indigenous musicians in Canada in a new tab"
						>
							<div className="flex items-center gap-3">
								<div
									className={badgeBase}
									style={{
										backgroundColor: withAlpha(accent, "1A"),
										color: accent,
									}}
								>
									<Music4 className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-slate-900 group-hover:underline">
									List of influential Indigenous musicians in Canada
								</div>
							</div>
							<div
								className={`${linkFooterBase} text-slate-800`}
								style={{ color: "#4380d6" }}
							>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* Notes */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "01"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent="#4380d6"
					downloadFileName={`Activity-${content?.id || "01"}-Reflection.docx`}
					docTitle={content?.title || "Explore an Indigenous Artist"}
					docSubtitle={content?.subtitle}
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* send Tip card text to the doc (will be split into sentences) */
					docIntro={tipText}
					/* make DOCX headers blue & clear */
					headingColor="#2563eb" // blue-600
					/* NEW: show Activity number in the exported document */
					activityNumber={activityNumber}
				/>

				{/* Complete toggle */}
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onToggleComplete}
						aria-pressed={!!completed}
						className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
							completed
								? "border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
								: "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
						}`}
					>
						{completed ? "Marked Complete" : "Mark Complete"}
					</button>
				</div>
			</div>
		</motion.div>
	);

	// dashed/translucent tip (UI)
	function TipPrompt({ accent = "#4380d6" }) {
		return (
			<section
				className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
				role="note"
				aria-label="Activity reflection tip"
				style={{
					borderColor: withAlpha(accent, "33"),
					backgroundColor: withAlpha(accent, "14"),
				}}
			>
				<p className="text-base sm:text-lg text-center text-slate-900">
					Explore works by an Indigenous artist that speak to you.
					<br />
					How do you relate to this artist? How do they inspire you?
				</p>
			</section>
		);
	}
}
