import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	Palette,
	Image as ImageIcon,
	Music4,
	ExternalLink,
} from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

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
	accent = "#4380d6",
}) {
	const placeholder =
		content?.notePlaceholder || "Your reflections on the artist…";

	// keep local for responsiveness; sync when prop changes
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => {
		setLocalNotes(notes ?? "");
	}, [notes]);

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

	// Tip text to include in the Word doc
	const tipText =
		"Explore works by an Indigenous artist that speak to you. Describe how you relate to this artist. How does this artist inspire you?";

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

	// === Measure title row so the instructions start exactly at H1's left ===
	const titleRowRef = useRef(null);
	const [titleRowWidth, setTitleRowWidth] = useState(null);

	useLayoutEffect(() => {
		const el = titleRowRef.current;
		if (!el) return;
		const update = () => setTitleRowWidth(el.getBoundingClientRect().width);
		update();

		const ro = new ResizeObserver(update);
		ro.observe(el);
		window.addEventListener("resize", update);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", update);
		};
	}, []);

	// ✅ compute from freshest value
	const started = hasActivityStarted(localNotes ?? notes, "notes");

	// ---- Decoupled download handler (uses current notes + page metadata) ----
	const handleDownload = () => {
		const html =
			typeof localNotes === "string" ? localNotes : localNotes?.text || "";
		downloadNotesAsWord({
			html,
			downloadFileName: `Activity-${content?.id || "01"}-Reflection.doc`,
			docTitle: content?.title || "Explore an Indigenous Artist",
			docSubtitle: content?.subtitle,
			activityNumber,
			docIntro: `Explore works by an Indigenous artist that speak to you.\nHow do you relate to this artist?\nHow do they inspire you?`,
			includeLinks: true,
			linksHeading: "Resources",
			pageLinks,
			headingColor: accent, // match page accent for exported headings
			accent,
		});
	};

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
				{/* ===== HEADER ===== */}
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

						{/* Title row */}
						<div
							className="inline-flex items-center justify-center gap-3"
							ref={titleRowRef}
						>
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								Explore an Indigenous Artist
							</h1>
							<Palette
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions */}
						<aside
							role="note"
							aria-label="Activity tip"
							className="mx-auto max-w-3xl rounded-2xl border bg-white/85 backdrop-blur-sm
                 px-5 py-4 text-base sm:text-lg leading-relaxed shadow-[0_1px_0_rgba(0,0,0,0.05)]"
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
									Explore works by an Indigenous artist that speak to you.{" "}
									<br />
									<strong>
										Describe how you relate to this artist. How does this artist
										inspire you?
									</strong>
								</p>
							</div>
						</aside>
					</div>
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
									Selection of Indigenous artists in Canada
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
							<div className="flex items-center gap-4">
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
									Selection of influential Indigenous musicians in Canada
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

				{/* Notes (Download button hidden inside composer; we'll show one below) */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					placeholder={placeholder}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent="#4380d6"
					downloadFileName={`Activity-${content?.id || "01"}-Reflection.doc`}
					docTitle={content?.title || "Explore an Indigenous Artist"}
					docSubtitle={content?.subtitle}
					activityNumber={1}
					docIntro={`Explore works by an Indigenous artist that speak to you.\nHow do you relate to this artist?\nHow do they inspire you?`}
					includeLinks
					linksHeading="Resources"
					pageLinks={pageLinks}
					showDownloadButton={false} // 👈 hide internal button
				/>

				{/* Bottom action row: external Download next to Complete */}
				<div className="flex justify-end gap-2">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981" // or use activity accent
					/>
					<button
						type="button"
						onClick={handleDownload}
						className="px-4 py-2 rounded-lg text-white"
						style={{ backgroundColor: accent }}
						title="Download your reflections as a Word-compatible .doc file"
					>
						Download (.doc)
					</button>
				</div>
			</div>
		</motion.div>
	);
}
