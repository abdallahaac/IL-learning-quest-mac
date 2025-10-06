// src/pages/ContentsPage.jsx
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBookOpen,
	faClipboardList,
	faListCheck,
	faUsers,
	faComments,
	faFlagCheckered,
	faFolderOpen,
	faCircleCheck,
	faHouse,
} from "@fortawesome/free-solid-svg-icons";

/* ✅ Use your existing “Download All Activities” component */
import DownloadAllActivitiesButton from "../components/DownloadAllActivitiesButton.jsx";

const DEFAULT_CARD_OFFSETS = [
	{ x: 40, y: -180 }, // Intro
	{ x: 40, y: -10 }, // Preparation
	{ x: 65, y: -185 }, // Activities
	{ x: 100, y: 10 }, // Team
	{ x: -65, y: 0 }, // Reflection (if present)
	{ x: 10, y: -170 }, // Conclusion
	{ x: -70, y: -200 }, // Resources
];

const ANIM = {
	baseDuration: 3.6,
	baseDelay: 0.0,
	progDuration: 2.6,
	progDelay: 0.45,
	nodeDelay0: 0.22,
	nodeStagger: 0.11,
	cardDelay0: 0.5,
	cardStagger: 0.09,
};

function hslToHex(h, s, l) {
	s /= 100;
	l /= 100;
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	const toHex = (x) =>
		Math.round(255 * x)
			.toString(16)
			.padStart(2, "0");
	return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
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

	// mark visited sections (array of page indices)
	visitedIndices = [],

	// Activities progress (count/total)
	activitiesVisitedCount = 0,
	activitiesTotal = 10,

	// Layout / positioning
	cardPosOverrides,
	cardWidth = 210,
	autoScaleCards = true,
	clampCards = false,
	clampMargin = 12,
	nodeXOffsetOverrides = [],
	nodeYOffsetOverrides = [],

	/* NEW: props for the two download boxes */
	onDownloadAllReflections,
	reflectionsReady = false,
}) {
	const visitedSet = useMemo(
		() => new Set(visitedIndices || []),
		[visitedIndices]
	);

	const items = useMemo(() => {
		const arr = [
			{
				label: "Introduction",
				index: tocTargets.introIndex,
				icon: faBookOpen,
				hue: 215,
			},
			{
				label: "Preparation",
				index: tocTargets.preparationIndex,
				icon: faClipboardList,
				hue: 260,
			},
			{
				label: "Activities",
				index: tocTargets.activitiesIndex,
				icon: faListCheck,
				hue: 0,
			},
			{
				label: "Team Reflection",
				index: tocTargets.teamIndex,
				icon: faUsers,
				hue: 212,
			},
		];
		if (
			typeof tocTargets.reflectionIndex === "number" &&
			tocTargets.reflectionIndex >= 0
		) {
			arr.push({
				label: "Reflection",
				index: tocTargets.reflectionIndex,
				icon: faComments,
				hue: 330,
			});
		}
		arr.push(
			{
				label: "Conclusion",
				index: tocTargets.conclusionIndex,
				icon: faFlagCheckered,
				hue: 15,
			},
			{
				label: "Resources",
				index: tocTargets.resourcesIndex,
				icon: faFolderOpen,
				hue: 145,
			}
		);
		return arr.filter((it) => typeof it.index === "number" && it.index >= 0);
	}, [tocTargets]);

	const prefersReduced = useReducedMotion();

	const NODE_R = 26;
	const CARD_GAP_Y = 40;

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

	const railRef = useRef(null);
	const measurePathRef = useRef(null);

	const [nodePos, setNodePos] = useState([]);
	const [pathLen, setPathLen] = useState(0);

	useLayoutEffect(() => {
		const svg = railRef.current;
		const measure = measurePathRef.current;
		if (!svg || !measure) return;
		const place = () => {
			const len = measure.getTotalLength?.() ?? 0;
			setPathLen(len);
			const n = items.length;
			const pos = Array.from({ length: n }).map((_, i) => {
				const t = 0.08 + (i * 0.84) / Math.max(1, n - 1);
				const p = measure.getPointAtLength(len * t);
				const p2 = measure.getPointAtLength(Math.min(len, len * t + 1));
				const deg = Math.atan2(p2.y - p.y, p2.x - p.x) * (180 / Math.PI);
				return { x: p.x, y: p.y, deg, t };
			});
			setNodePos(pos);
		};
		place();
		let ro;
		if (typeof window !== "undefined" && "ResizeObserver" in window) {
			ro = new ResizeObserver(place);
			ro.observe(svg);
		} else {
			window.addEventListener("resize", place);
		}
		return () => {
			ro?.disconnect?.();
			window.removeEventListener?.("resize", place);
		};
	}, [items.length]);

	const cycleFocus = (current, dir) => {
		const n = items.length;
		const next = (current + dir + n) % n;
		document.getElementById(`toc-node-${next}`)?.focus();
	};

	const pre = Math.max(0, Math.min(0.3, prefillStart));
	const clamped = Math.max(0, Math.min(1, progress));
	const adjusted = pre + (1 - pre) * clamped;

	// Intro blue for accents used elsewhere
	const introHue = 215;
	const introHex = hslToHex(introHue, 85, 56);

	const baseInit = 1;
	const baseTarget = 0;

	// === PROGRESS GATING LOGIC ===
	// Find Activities node "t" position on the path
	const activitiesItemIdx = items.findIndex((it) => it.label === "Activities");
	const activitiesT =
		activitiesItemIdx >= 0
			? 0.08 + (activitiesItemIdx * 0.84) / Math.max(1, items.length - 1)
			: 1;

	// Let the line progress, but gate at Activities until all done
	const activitiesComplete = activitiesVisitedCount >= activitiesTotal;
	const gatedAdjusted = activitiesComplete
		? adjusted
		: Math.min(adjusted, activitiesT);
	const gatedClamped = activitiesComplete
		? clamped
		: Math.min(clamped, activitiesT);

	const prevProgOffsetRef = useRef(null);
	useLayoutEffect(() => {
		if (prevProgOffsetRef.current == null) prevProgOffsetRef.current = 1;
	}, []);
	useLayoutEffect(() => {
		// remember last offset so the animation is smooth
		prevProgOffsetRef.current =
			1 - (prefersReduced ? gatedClamped : gatedAdjusted);
	}, [gatedAdjusted, gatedClamped, prefersReduced]);

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
								Home{" "}
								<FontAwesomeIcon
									icon={faHouse}
									className="inline-block align-[-2px]"
									style={{ color: introHex }}
								/>
							</h2>
						</div>
					</div>

					<div
						role="progressbar"
						aria-label="Course progress"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(
							(prefersReduced ? gatedClamped : gatedAdjusted) * 100
						)}
						className="sr-only"
					/>
					<p id="tocHelp" className="sr-only">
						Use Tab to move between items. Arrow keys also move between icons.
						Press Enter or Space to open a section.
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
							viewBox="0 0 1200 230"
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
								d="M0,165 C220,65 420,205 600,125 C780,45 980,205 1200,125"
								fill="none"
								stroke="none"
								style={{ opacity: 0, pointerEvents: "none" }}
							/>

							<defs aria-hidden="true">
								<linearGradient
									id="railProgress"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="0%"
									gradientUnits="userSpaceOnUse"
									style={{ colorInterpolation: "sRGB" }}
								>
									<stop offset="0%" stopColor="#25A1F4" />
									<stop offset="50%" stopColor="#4265F0" />
									<stop offset="100%" stopColor="#8951EC" />
								</linearGradient>
								<filter
									id="softDrop"
									x="-50%"
									y="-50%"
									width="200%"
									height="200%"
									colorInterpolationFilters="sRGB"
								>
									<feDropShadow
										dx="0"
										dy="8"
										stdDeviation="12"
										floodOpacity="0.14"
									/>
								</filter>
							</defs>

							{/* base rail */}
							<motion.path
								d="M0,165 C220,65 420,205 600,125 C780,45 980,205 1200,125"
								pathLength="1"
								fill="none"
								stroke="hsl(220 25% 72%)"
								strokeWidth="10"
								strokeLinecap="round"
								filter="url(#softDrop)"
								vectorEffect="non-scaling-stroke"
								style={{ strokeDasharray: "1 1" }}
								initial={{ strokeDashoffset: baseInit }}
								animate={{ strokeDashoffset: baseTarget }}
								transition={{
									duration: ANIM.baseDuration,
									ease: "easeInOut",
									delay: ANIM.baseDelay,
								}}
							/>

							{/* progress rail (gated at Activities) */}
							<motion.path
								d="M0,165 C220,65 420,205 600,125 C780,45 980,205 1200,125"
								pathLength="1"
								fill="none"
								stroke="url(#railProgress)"
								strokeWidth="14"
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
								style={{
									strokeDasharray: "1 1",
									filter: "drop-shadow(0 2px 6px rgba(59,130,246,0.35))",
									pointerEvents: "none",
								}}
								initial={{
									strokeDashoffset: prevProgOffsetRef.current ?? 1,
									opacity: 1,
								}}
								animate={{
									strokeDashoffset:
										1 - (prefersReduced ? gatedClamped : gatedAdjusted),
									opacity: 1,
								}}
								transition={{
									duration: ANIM.progDuration,
									ease: "easeInOut",
									delay: ANIM.progDelay,
								}}
							/>
						</svg>

						<ul className="absolute inset-0" role="list" aria-label="Sections">
							{items.map((it, i) => {
								const pos = nodePos[i] || { x: 0, y: 0, deg: 0, t: 0 };
								const hue = it.hue ?? 210;
								const nodeHex = hslToHex(hue, 64, 55);
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
								const cardTop = pos.y + NODE_R + CARD_GAP_Y + dy;

								if (clampCards) {
									const halfW = (cardWidth * scale) / 2;
									const minCenter = clampMargin + halfW;
									const maxCenter = 1200 - (clampMargin + halfW);
									cardLeft = Math.min(Math.max(cardLeft, minCenter), maxCenter);
								}

								const isActivities = it.label === "Activities";

								return (
									<li
										key={`${it.label}-${i}`}
										className="absolute"
										style={{ left: 0, top: 0 }}
									>
										{/* NODE */}
										<motion.button
											id={`toc-node-${i}`}
											type="button"
											onClick={() => onNavigate?.(it.index)}
											className="outline-none pointer-events-auto rounded-full focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
											style={{
												position: "absolute",
												left: pos.x + (nodeX[i] || 0),
												top: pos.y + (nodeY[i] || 0),
												transform: "translate(-50%, -50%)",
												WebkitTapHighlightColor: "transparent",
												["--node-color"]: nodeHex,
											}}
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											whileHover={{ scale: 1.06 }}
											whileTap={{ scale: 0.96 }}
											transition={{
												delay: ANIM.nodeDelay0 + i * ANIM.nodeStagger,
												type: "spring",
												stiffness: 230,
												damping: 26,
											}}
											onKeyDown={(e) => {
												if (e.key === "ArrowRight" || e.key === "ArrowDown") {
													e.preventDefault();
													cycleFocus(i, +1);
												} else if (
													e.key === "ArrowLeft" ||
													e.key === "ArrowUp"
												) {
													e.preventDefault();
													cycleFocus(i, -1);
												} else if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													onNavigate?.(it.index);
												}
											}}
											aria-label={
												isActivities
													? `Activities (${activitiesVisitedCount}/${activitiesTotal})`
													: `${it.label}${isVisited ? " (visited)" : ""}`
											}
										>
											<motion.div
												className="backdrop-blur-md flex items-center justify-center no-backdrop-glass border-2 rounded-full relative"
												style={{
													width: 52,
													height: 52,
													borderColor: "var(--node-color)",
													background: isVisited
														? `hsla(${hue}, 70%, 92%, 0.95)`
														: `hsla(${hue}, 70%, 97%, 0.85)`,
													boxShadow: isVisited
														? "0 10px 26px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.75)"
														: "0 8px 24px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
													filter: isVisited ? "grayscale(0.1)" : "none",
												}}
												whileHover={{
													boxShadow:
														"0 12px 30px rgba(15,23,42,0.24), inset 0 1px 0 rgba(255,255,255,0.8)",
												}}
											>
												<FontAwesomeIcon
													icon={it.icon}
													className="text-lg"
													style={{
														color: "var(--node-color)",
														opacity: isVisited ? 0.9 : 1,
													}}
													aria-hidden
												/>
												{/* keep green check badge for non-Activities visited */}
												{!isActivities && isVisited && (
													<span
														className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full grid place-items-center text-white"
														style={{
															backgroundColor: "#10B981",
															boxShadow: "0 2px 6px rgba(16,185,129,0.45)",
														}}
														aria-hidden
													>
														<FontAwesomeIcon
															icon={faCircleCheck}
															className="text-[11px]"
														/>
													</span>
												)}
											</motion.div>
										</motion.button>

										{/* CARD */}
										<motion.button
											id={`toc-card-${i}`}
											type="button"
											onClick={() => onNavigate?.(it.index)}
											tabIndex={-1}
											aria-hidden="true"
											className="pointer-events-auto absolute text-left origin-top outline-none rounded-2xl focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
											style={{
												left: cardLeft,
												top: cardTop,
												transform: `translate(-50%, 0)`,
												WebkitTapHighlightColor: "transparent",
												["--node-color"]: nodeHex,
												width: "max-content",
												maxWidth: "calc(100vw - 48px)",
											}}
											initial={{ opacity: 0, y: 14 }}
											animate={{ opacity: 1, y: 0 }}
											whileHover={{ y: -2, scale: 1.02 }}
											whileTap={{ scale: 0.99 }}
											transition={{
												delay: ANIM.cardDelay0 + i * ANIM.cardStagger,
												duration: 0.55,
												ease: "easeOut",
											}}
										>
											<div
												className="rounded-2xl border backdrop-blur transition-shadow no-backdrop-glass"
												style={{
													background: isVisited
														? "rgba(241,245,249,0.95)"
														: "rgba(255,255,255,0.92)",
													borderColor: isVisited
														? "rgba(148,163,184,0.6)"
														: "rgba(203,213,225,0.8)",
													boxShadow: isVisited
														? "0 12px 36px rgba(2,6,23,0.16)"
														: "0 10px 30px rgba(2,6,23,0.12)",
												}}
											>
												<div className="px-4 py-3 hover:shadow-[0_14px_40px_rgba(2,6,23,0.16)]">
													<div className="inline-flex items-center gap-2 whitespace-nowrap">
														<span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--node-color)]" />
														<span
															className={`text-sm font-semibold ${
																isVisited ? "text-slate-700" : "text-slate-900"
															}`}
														>
															{it.label}
														</span>

														{/* Activities chip shows X/total; others show "Visited" */}
														{it.label === "Activities" ? (
															<span
																className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-700"
																style={{
																	backgroundColor: "rgba(16,185,129,0.12)",
																	border: "1px solid rgba(16,185,129,0.25)",
																}}
																aria-hidden
															>
																{activitiesVisitedCount}/{activitiesTotal}
															</span>
														) : (
															isVisited && (
																<span
																	className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-700"
																	style={{
																		backgroundColor: "rgba(16,185,129,0.12)",
																		border: "1px solid rgba(16,185,129,0.25)",
																	}}
																	aria-hidden
																>
																	<FontAwesomeIcon
																		icon={faCircleCheck}
																		className="text-[10px]"
																	/>
																	Visited
																</span>
															)
														)}
													</div>
												</div>
											</div>
										</motion.button>
									</li>
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
								delay: ANIM.cardDelay0 + items.length * ANIM.cardStagger,
							}}
							aria-hidden="true"
						>
							Use arrow keys to move • Enter to open
						</motion.div>
					</div>
				</div>

				{/* === NEW: Downloads panel (two side-by-side boxes) === */}
			</nav>
			<div className="px-6 pb-10 mt-9">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Box 1: Download Activities List (uses your existing component) */}
					<motion.div
						className="rounded-2xl border border-slate-300/70 bg-white/90 backdrop-blur p-5 shadow hover:shadow-md focus-within:ring-4 focus-within:ring-sky-600 focus-within:ring-offset-2 focus-within:ring-offset-white/80"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
					>
						<div className="flex items-start gap-3">
							<span
								className="inline-grid place-items-center w-10 h-10 rounded-xl"
								style={{
									backgroundColor: "rgba(59,130,246,0.12)",
									border: "1px solid rgba(59,130,246,0.28)",
									color: "#2563EB",
								}}
								aria-hidden="true"
							>
								<FontAwesomeIcon icon={faListCheck} />
							</span>
							<div className="min-w-0">
								<div className="text-base font-semibold text-slate-900">
									Download activities list
								</div>
								<div className="text-sm text-slate-600 mt-0.5">
									Get a document with all activity titles.
								</div>
							</div>
						</div>

						<div className="mt-4">
							{/* Your existing button (kept as-is to reuse its logic) */}
							<DownloadAllActivitiesButton accent="#2563EB" />
						</div>
					</motion.div>

					{/* Box 2: Download All Reflections (gated) */}
					<motion.div
						className={`rounded-2xl border p-5 shadow ${
							reflectionsReady
								? "border-slate-300/70 bg-white/90 backdrop-blur hover:shadow-md"
								: "border-slate-200 bg-slate-50"
						}`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, ease: "easeOut", delay: 0.28 }}
					>
						<div className="flex items-start gap-3">
							<span
								className="inline-grid place-items-center w-10 h-10 rounded-xl"
								style={{
									backgroundColor: reflectionsReady
										? "rgba(16,185,129,0.12)"
										: "rgba(148,163,184,0.15)",
									border: reflectionsReady
										? "1px solid rgba(16,185,129,0.28)"
										: "1px solid rgba(148,163,184,0.35)",
									color: reflectionsReady ? "#059669" : "#64748B",
								}}
								aria-hidden="true"
							>
								<FontAwesomeIcon icon={faComments} />
							</span>
							<div className="min-w-0">
								<div
									className={`text-base font-semibold ${
										reflectionsReady ? "text-slate-900" : "text-slate-400"
									}`}
								>
									Download all reflections
								</div>
								<div
									className={`text-sm mt-0.5 ${
										reflectionsReady ? "text-slate-600" : "text-slate-400"
									}`}
								>
									Personal reflections from each activity consolidated into one
									document.
								</div>
							</div>
						</div>

						<div className="mt-4">
							<button
								type="button"
								onClick={
									reflectionsReady ? onDownloadAllReflections : undefined
								}
								disabled={!reflectionsReady}
								aria-disabled={!reflectionsReady}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2
                    ${
											reflectionsReady
												? "bg-sky-600 text-white hover:bg-sky-700"
												: "bg-slate-200 text-slate-500 cursor-not-allowed"
										}`}
							>
								{reflectionsReady
									? "Download"
									: "Finish all reflections to enable"}
							</button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
