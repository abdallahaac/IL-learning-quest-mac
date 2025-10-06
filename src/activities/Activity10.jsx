// src/pages/activities/Activity10.jsx
import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	Store, // header icon
	ShoppingBag, // Shop First Nations
	Newspaper, // roundup/article
	Landmark, // government directory
	ExternalLink,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity10({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#DB5A42", // keep your color
}) {
	const placeholder =
		content?.notePlaceholder || "Business, offerings, how you’ll support…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const reduceMotion = useReducedMotion();
	const activityNumber = 10;

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

	// --- shared classes (matches other pages) ---
	const linkCardBase =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	// Title & tip (used both in UI and export)
	const pageTitle = content?.title || "Indigenous-Owned Business";
	const tipText =
		"Explore a First Nations, Inuit or Métis-owned business (in person or online). What products/services spoke to you and why?";

	// Exportable resources (no table)
	const pageLinks = [
		{ label: "Shop First Nations", url: "https://shopfirstnations.com/" },
		{
			label: "17 Canadian Indigenous-Owned Businesses (2025)",
			url: "https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/",
		},
		{
			label: "Indigenous Business Directory (ISC)",
			url: "https://www.sac-isc.gc.ca/rea-ibd",
		},
	];

	// helper row with left badge icon + centered title
	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div
				className={`${badgeBase} absolute left-0 top-1/2 -translate-y-1/2`}
				style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
			>
				<Icon className="w-5 h-5" aria-hidden="true" />
			</div>
			<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
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
							<Store
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
								</p>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resource links ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<motion.a
							href="https://shopfirstnations.com/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Shop First Nations (new tab)"
							aria-label="Open Shop First Nations in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={ShoppingBag}>Shop First Nations</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: 17 Canadian Indigenous-Owned Businesses (new tab)"
							aria-label="Open 17 Canadian Indigenous-Owned Businesses in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={Newspaper}>
								17 Canadian Indigenous-Owned Businesses (2025)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://www.sac-isc.gc.ca/rea-ibd"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Indigenous Business Directory (new tab)"
							aria-label="Open Indigenous Business Directory in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={Landmark}>Indigenous Business Directory</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* ===== Notes (NoteComposer) ===== */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "10"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${content?.id || "10"}-Reflection.docx`}
					/* Exported title becomes: "Activity 10: {pageTitle}" */
					docTitle={pageTitle}
					docSubtitle={content?.subtitle}
					activityNumber={activityNumber}
					/* Include the on-page tip in export */
					docIntro={tipText}
					/* Export resources as header + bullet list of hyperlink labels */
					includeLinks={true}
					linksHeading="Resources"
					pageLinks={pageLinks}
					/* Use accent for exported headings */
					headingColor={accent}
				/>

				{/* ===== Complete toggle ===== */}
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

/* Accent-aware dashed tip — same component style pattern */
function TipCard({ accent = "#DB5A42", children }) {
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
