import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBookOpen,
	faClipboardList,
	faUsers,
	faFlagCheckered,
	faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_CARD_OFFSETS = [
	{ x: -80, y: 0 },
	{ x: -100, y: 10 },
	{ x: -75, y: 10 },
	{ x: -50, y: 0 },
	{ x: -30, y: 0 },
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

/* one-time HSL→HEX helper so Firefox/Chrome match exactly */
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
	activityCount = 0,
	onNavigate,
	cardPosOverrides,
	progress = 0,
	prefillStart = 0.06,

	/** NEW: card layout knobs */
	cardWidth = 210, // base width in px
	autoScaleCards = true, // shrink to fit per lane
	clampCards = true, // keep within left/right bounds
	clampMargin = 12, // padding from edges when clamped
}) {
	const startActivities = 4;
	const teamIndex = startActivities + activityCount;
	const conclusionIndex = teamIndex + 1;
	const resourcesIndex = conclusionIndex + 1;

	const items = useMemo(
		() => [
			{
				label: "Introduction & Quest Info",
				index: 2,
				icon: faBookOpen,
				hue: 215,
			},
			{
				label: "Preparation & Activities",
				index: 3,
				icon: faClipboardList,
				hue: 260,
			},
			{ label: "Team & Reflection", index: teamIndex, icon: faUsers, hue: 305 },
			{
				label: "Conclusion",
				index: conclusionIndex,
				icon: faFlagCheckered,
				hue: 15,
			},
			{
				label: "Resources",
				index: resourcesIndex,
				icon: faFolderOpen,
				hue: 145,
			},
		],
		[teamIndex, conclusionIndex, resourcesIndex]
	);

	const prefersReduced = useReducedMotion();

	const NODE_R = 26;
	const CARD_H = 84;
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

	// progress math (unit-space dashes)
	const pre = Math.max(0, Math.min(0.3, prefillStart));
	const clamped = Math.max(0, Math.min(1, progress));
	const adjusted = pre + (1 - pre) * clamped;

	const baseInit = 1;
	const baseTarget = 0;
	const prevProgOffsetRef = useRef(null);
	useLayoutEffect(() => {
		if (prevProgOffsetRef.current == null) prevProgOffsetRef.current = 1;
	}, []);
	const initialProgOffset =
		prevProgOffsetRef.current != null ? prevProgOffsetRef.current : 1;
	useLayoutEffect(() => {
		prevProgOffsetRef.current = 1 - adjusted;
	}, [adjusted]);

	return (
		<div
			className="flex-1 flex flex-col items-center px-4"
			style={{ paddingTop: "8vh", paddingBottom: "5vh" }}
		>
			<nav
				aria-labelledby="tocTitle"
				className="w-full max-w-7xl mx-auto rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_10px_40px_rgba(2,6,23,0.08)]"
			>
				{/* Title */}
				<div className="pt-8 px-6">
					<div className="w-full flex justify-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/70 bg-white/85 backdrop-blur shadow-sm">
							<span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-600" />
							<h2
								id="tocTitle"
								className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900"
							>
								Table of Contents
							</h2>
						</div>
					</div>

					<div
						role="progressbar"
						aria-label="Course progress"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(adjusted * 100)}
						className="sr-only"
					/>
					<p id="tocHelp" className="sr-only">
						Use Tab to move between items. Arrow keys also move between icons.
						Press Enter or Space to open a section.
					</p>
					<div className="mx-auto mt-4 h-px w-3/4 bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
				</div>

				{/* Rail */}
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

							{/* progress rail */}
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
								animate={{ strokeDashoffset: 1 - adjusted, opacity: 1 }}
								transition={{
									duration: ANIM.progDuration,
									ease: "easeInOut",
									delay: ANIM.progDelay,
								}}
							/>
						</svg>

						{/* Nodes + cards */}
						<ul className="absolute inset-0" role="list" aria-label="Sections">
							{items.map((it, i) => {
								const pos = nodePos[i] || { x: 0, y: 0, deg: 0, t: 0 };
								const hue = it.hue ?? 210;
								const nodeHex = hslToHex(hue, 64, 55);

								const lanes = items.length;
								const laneW = 1200 / lanes;
								const laneCenterX = laneW * (i + 0.5);
								const lanePadding = 24;

								// width & scaling
								const maxCardW = Math.max(140, laneW - lanePadding * 2);
								const scale = autoScaleCards
									? Math.min(1, maxCardW / cardWidth)
									: 1;
								const CARD_W = cardWidth; // use prop

								// position with optional clamp
								const dx = offsets[i]?.x || 0;
								const dy = offsets[i]?.y || 0;
								let cardLeft = laneCenterX + dx;
								const cardTop = pos.y + NODE_R + CARD_GAP_Y + dy;

								if (clampCards) {
									const halfW = (CARD_W * scale) / 2;
									const minCenter = clampMargin + halfW;
									const maxCenter = 1200 - (clampMargin + halfW);
									cardLeft = Math.min(Math.max(cardLeft, minCenter), maxCenter);
								}

								return (
									<li key={i} className="absolute" style={{ left: 0, top: 0 }}>
										{/* Node (tabbable) */}
										<motion.button
											id={`toc-node-${i}`}
											type="button"
											onClick={() => onNavigate?.(it.index)}
											className="outline-none pointer-events-auto rounded-full focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
											aria-label={`${it.label}, Page ${it.index + 1}`}
											style={{
												position: "absolute",
												left: pos.x,
												top: pos.y,
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
										>
											<motion.div
												className="backdrop-blur-md flex items-center justify-center no-backdrop-glass border-2 rounded-full"
												style={{
													width: 52,
													height: 52,
													borderColor: "var(--node-color)",
													background: `hsla(${hue}, 70%, 97%, 0.85)`,
													boxShadow:
														"0 8px 24px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
												}}
												whileHover={{
													boxShadow:
														"0 10px 28px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.75)",
												}}
											>
												<FontAwesomeIcon
													icon={it.icon}
													className="text-lg text-[var(--node-color)]"
													aria-hidden
												/>
											</motion.div>
										</motion.button>

										{/* Card (clickable, not tabbable) */}
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
												width: CARD_W,
												height: CARD_H,
												transform: `translate(-50%, 0) scale(${scale})`,
												WebkitTapHighlightColor: "transparent",
												["--node-color"]: nodeHex,
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
												className="rounded-2xl border bg-white/92 backdrop-blur transition-shadow no-backdrop-glass"
												style={{
													borderColor: "rgba(203,213,225,0.8)",
													boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
												}}
											>
												<div className="px-4 py-3 hover:shadow-[0_14px_40px_rgba(2,6,23,0.16)]">
													<div className="flex items-center gap-2">
														<span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--node-color)]" />
														<span className="text-sm font-semibold text-slate-900 line-clamp-1">
															{it.label}
														</span>
													</div>
													<div className="text-xs text-slate-600 mt-1">
														Page {it.index + 1}
													</div>
													<div className="text-[11px] text-slate-700 mt-1">
														Open →
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
			</nav>
		</div>
	);
}
