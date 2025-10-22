// src/pages/ContentsPage.jsx
import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

import { buildTocItems } from "../utils/tocItems.js";
import { hslToHex } from "../utils/color.js";
import { useRailPositions } from "../hooks/useRailPositions.js";
import { useGatedProgress } from "../hooks/useGatedProgress.js";

import {
	TOC_ANIM,
	DEFAULT_CARD_OFFSETS,
	NODE_RADIUS,
	CARD_GAP_Y,
	SVG_VIEWBOX,
	UI_STRINGS,
} from "../constants/content.js";

import TocRail from "../components/toc/TocRail.jsx";
import TocItem from "../components/toc/TocItem.jsx";
import DownloadsPanel from "../components/toc/DownloadsPanel.jsx";

// tiny helper to avoid threading lang everywhere if caller forgets
function detectLang() {
	try {
		const qs = new URLSearchParams(window.location.search);
		if (qs.get("lang")) return qs.get("lang").toLowerCase().slice(0, 2);
		const html = document.documentElement?.getAttribute("lang");
		if (html) return html.toLowerCase().slice(0, 2);
		const nav = navigator?.language || navigator?.languages?.[0];
		if (nav) return nav.toLowerCase().slice(0, 2);
	} catch {}
	return "en";
}

export default function ContentsPage({
	onNavigate,
	progress = 0,
	prefillStart = 0.06,
	tocTargets = {
		introIndex: 2,
		preparationIndex: 3,
		activitiesIndex: 4,
		teamIndex: -1,
		reflectionIndex: -1,
		conclusionIndex: -1,
		resourcesIndex: -1,
	},
	// visited for nodes
	visitedIndices = [],

	// Activities
	activitiesVisitedCount = 0,
	activitiesTotal = 10,
	allActivitiesCompleted = false,

	// Layout / positioning
	cardPosOverrides,
	cardWidth = 210,
	autoScaleCards = true,
	clampCards = false,
	clampMargin = 12,
	nodeXOffsetOverrides = [],
	nodeYOffsetOverrides = [],

	// Downloads
	onDownloadAllReflections,
	reflectionsReady = false,

	// Optional labels injected by caller (AppShell). If missing, we auto-pick from UI_STRINGS.
	labels,
}) {
	const lang =
		(labels && (labels.__lang || null)) ||
		(detectLang() === "fr" ? "fr" : "en");
	const STR = labels || UI_STRINGS[lang]?.toc || UI_STRINGS.en.toc;

	const visitedSet = useMemo(
		() => new Set(visitedIndices || []),
		[visitedIndices]
	);
	const items = useMemo(() => buildTocItems(tocTargets), [tocTargets]);
	const prefersReduced = useReducedMotion();

	const offsets = useMemo(() => {
		const src = Array.isArray(cardPosOverrides)
			? cardPosOverrides
			: DEFAULT_CARD_OFFSETS;
		return items.map((_, i) => {
			const o = src?.[i] || { x: 0, y: 0 };
			return { x: Number(o.x) || 0, y: Number(o.y) || 0 };
		});
	}, [cardPosOverrides, items]);

	const nodeX = useMemo(
		() => items.map((_, i) => Number(nodeXOffsetOverrides?.[i]) || 0),
		[items, nodeXOffsetOverrides]
	);
	const nodeY = useMemo(
		() => items.map((_, i) => Number(nodeYOffsetOverrides?.[i]) || 0),
		[items, nodeYOffsetOverrides]
	);

	// Measure path & positions
	const { railRef, measurePathRef, nodePos, d } = useRailPositions(
		items.length
	);

	// Progress gating
	const { gatedAdjusted, gatedClamped, prevProgOffsetRef } = useGatedProgress({
		prefersReduced,
		progress,
		prefillStart,
		items,
		activitiesVisitedCount,
		activitiesTotal,
	});

	// Accent for header chip
	const introHue = 215;
	const introHex = hslToHex(introHue, 85, 56);

	// Derived: all activities visited?
	const allActivitiesVisited =
		activitiesTotal > 0 && activitiesVisitedCount >= activitiesTotal;

	// Keyboard focus cycling (kept)
	const cycleFocus = (current, dir) => {
		const n = items.length;
		const next = (current + dir + n) % n;
		document.getElementById(`toc-node-${next}`)?.focus();
	};

	return (
		<div
			className="flex-1 flex flex-col items-center px-4"
			style={{ paddingTop: "8vh", paddingBottom: "5vh" }}
		>
			<nav
				aria-labelledby="tocTitle"
				className="w-full max-w-[84rem] mx-auto rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_10px_40px_rgba(2,6,23,0.08)]"
			>
				<div className="pt-8 px-6">
					<div className="w-full flex justify-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/70 bg-white/85 backdrop-blur shadow-sm">
							<h2
								id="tocTitle"
								className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900"
							>
								{STR.title}{" "}
								<FontAwesomeIcon
									icon={faHouse}
									className="inline-block align-[-2px]"
									style={{ color: introHex }}
								/>
							</h2>
						</div>
					</div>

					{/* accessible progressbar */}
					<div
						role="progressbar"
						aria-label={STR.ariaCourseProgress}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(
							(prefersReduced ? gatedClamped : gatedAdjusted) * 100
						)}
						className="sr-only"
					/>
					<p id="tocHelp" className="sr-only">
						{STR.srHelp}
					</p>
					<div
						className="mx-auto mt-4 h-px w-3/4"
						style={{
							backgroundImage: `linear-gradient(to right, transparent, ${introHex}B3, transparent)`,
						}}
					/>
				</div>

				<div className="relative px-6 pt-8 pb-10">
					<div className="relative w-full" style={{ minHeight: 360 }}>
						<svg
							ref={railRef}
							className="block w-full"
							width="100%"
							height="230"
							viewBox={SVG_VIEWBOX}
							aria-hidden="true"
							focusable="false"
							style={{
								overflow: "visible",
								colorInterpolation: "sRGB",
								colorInterpolationFilters: "sRGB",
							}}
						>
							<path
								ref={measurePathRef}
								d={d}
								fill="none"
								stroke="none"
								style={{ opacity: 0, pointerEvents: "none" }}
							/>
							<TocRail
								d={d}
								prevProgOffsetRef={prevProgOffsetRef}
								prefersReduced={prefersReduced}
								gatedClamped={gatedClamped}
								gatedAdjusted={gatedAdjusted}
							/>
						</svg>

						<ul
							className="absolute inset-0"
							role="list"
							aria-label={STR.sectionsAriaLabel}
						>
							{items.map((it, i) => {
								const pos = nodePos[i] || { x: 0, y: 0, deg: 0, t: 0 };
								const isVisited = visitedSet.has(it.index);

								// lane sizing
								const lanes = items.length;
								const laneW = 1200 / lanes;
								const laneCenterX = laneW * (i + 0.5);
								const lanePadding = 24;

								const maxCardW = Math.max(140, laneW - lanePadding * 2);
								const scale = autoScaleCards
									? Math.min(1, maxCardW / cardWidth)
									: 1;

								// card position
								const dx = offsets[i]?.x || 0;
								const dy = offsets[i]?.y || 0;
								let cardLeft = laneCenterX + dx;
								const cardTop = pos.y + NODE_RADIUS + CARD_GAP_Y + dy;

								if (clampCards) {
									const halfW = (cardWidth * scale) / 2;
									const minCenter = clampMargin + halfW;
									const maxCenter = 1200 - (clampMargin + halfW);
									cardLeft = Math.min(Math.max(cardLeft, minCenter), maxCenter);
								}

								// identify Activities without relying on English label only
								const isActivities =
									it.key === "activities" ||
									it.slug === "activities" ||
									it.type === "activities" ||
									it.label === STR.activities;

								return (
									<TocItem
										key={`${it.label}-${i}`}
										i={i}
										item={{
											...it,
											ariaActivities: allActivitiesCompleted
												? `${STR.activities} (${STR.completed})`
												: allActivitiesVisited
												? `${STR.activities} (${STR.visited})`
												: `${STR.activities} (${activitiesVisitedCount}/${activitiesTotal})`,
											activitiesVisitedCount,
											activitiesTotal,
											activitiesAllVisited: allActivitiesVisited,
											allActivitiesCompleted,
										}}
										pos={pos}
										nodeOffsetX={nodeX[i] || 0}
										nodeOffsetY={nodeY[i] || 0}
										isVisited={isVisited}
										isActivities={isActivities}
										cardLeft={cardLeft}
										cardTop={cardTop}
										cardWidth={cardWidth}
										onClick={() => onNavigate?.(it.index)}
										labels={STR}
									/>
								);
							})}
						</ul>
					</div>

					<div className="mt-6 text-center">
						<motion.div
							className="text-slate-600 text-xs md:text-sm"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay:
									TOC_ANIM.cardDelay0 + items.length * TOC_ANIM.cardStagger,
							}}
							aria-hidden="true"
						>
							{STR.moveHint}
						</motion.div>
					</div>
				</div>
			</nav>
			<section className="px-10">
				<DownloadsPanel
					reflectionsReady={reflectionsReady}
					onDownloadAllReflections={onDownloadAllReflections}
				/>
			</section>
		</div>
	);
}
