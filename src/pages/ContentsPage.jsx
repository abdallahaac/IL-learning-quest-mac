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
	{ x: -120, y: 0 },
	{ x: -100, y: 10 },
	{ x: -75, y: 10 },
	{ x: -50, y: 0 },
	{ x: -30, y: 0 },
];

export default function ContentsPage({
	activityCount = 0,
	onNavigate,
	cardPosOverrides,
	/** 0..1 sequential course progress */
	progress = 0,
	/** tiny head-start before first node */
	prefillStart = 0.12,
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
	const CARD_W = 240;
	const CARD_H = 90;
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

	// --- compute dash numbers above your return() ---
	const hasLen = pathLen > 0;
	const pre = Math.max(0, Math.min(0.3, prefillStart)); // tiny head-start
	const clamped = Math.max(0, Math.min(1, progress));
	const adjusted = pre + (1 - pre) * clamped; // 0..1 with prefill

	// Dash math: show `visible = len * adjusted` from the left
	const dashArray = hasLen ? `${pathLen} ${pathLen}` : "1 1";
	const targetOffset = hasLen ? pathLen - pathLen * adjusted : 1;

	// We need a defined numeric "from" value so FM can animate.
	// Seed it to the *prefill* amount on first measure.
	const prevOffsetRef = useRef(null);
	useLayoutEffect(() => {
		if (hasLen && prevOffsetRef.current == null) {
			prevOffsetRef.current = pathLen - pathLen * pre; // small prefill on mount
		}
	}, [hasLen, pathLen, pre]);

	const initialOffset =
		prevOffsetRef.current != null ? prevOffsetRef.current : targetOffset;

	// After each render, remember where we ended so the next change animates from there
	useLayoutEffect(() => {
		if (hasLen) prevOffsetRef.current = targetOffset;
	}, [hasLen, targetOffset]);
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
							style={{ height: 230, overflow: "visible" }}
							viewBox="0 0 1200 230"
							aria-hidden="true"
							focusable="false"
						>
							{/* hidden path for length/points */}
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
								>
									<stop offset="0%" stopColor="hsl(204 90% 55%)" />
									<stop offset="50%" stopColor="hsl(228 85% 60%)" />
									<stop offset="100%" stopColor="hsl(262 80% 62%)" />
								</linearGradient>
								<filter
									id="softDrop"
									x="-50%"
									y="-50%"
									width="200%"
									height="200%"
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
								fill="none"
								stroke="hsl(220 25% 72%)"
								strokeWidth="10"
								strokeLinecap="round"
								filter="url(#softDrop)"
								vectorEffect="non-scaling-stroke"
								initial={prefersReduced ? undefined : { pathLength: 0 }}
								animate={prefersReduced ? undefined : { pathLength: 1 }}
								transition={
									prefersReduced
										? { duration: 0 }
										: { duration: 1.2, ease: "easeOut" }
								}
							/>

							{/* progress (animate dashoffset between numeric values) */}
							{/* PROGRESS (animates from prefill -> new progress) */}
							<motion.path
								d="M0,165 C220,65 420,205 600,125 C780,45 980,205 1200,125"
								fill="none"
								stroke="url(#railProgress)"
								strokeWidth="14"
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
								style={{
									strokeDasharray: dashArray, // "<len> <len>"
									filter: "drop-shadow(0 2px 6px rgba(59,130,246,0.35))",
									pointerEvents: "none",
								}}
								initial={{
									strokeDashoffset: initialOffset,
									opacity: hasLen ? 1 : 0,
								}}
								animate={{
									strokeDashoffset: targetOffset,
									opacity: hasLen ? 1 : 0,
								}}
								transition={{ duration: 0.6, ease: "easeOut" }}
							/>
						</svg>

						{/* Nodes + cards */}
						<ul className="absolute inset-0" role="list" aria-label="Sections">
							{items.map((it, i) => {
								const pos = nodePos[i] || { x: 0, y: 0, deg: 0, t: 0 };
								const hue = it.hue ?? 210;
								const base = `hsl(${hue} 72% 44%)`;
								const glass = `hsla(${hue} 70% 97% / 0.85)`;
								const border = `hsl(${hue} 64% 55%)`;

								const lanes = items.length;
								const laneW = 1200 / lanes;
								const laneCenterX = laneW * (i + 0.5);
								const lanePadding = 24;
								const maxCardW = Math.max(140, laneW - lanePadding * 2);
								const scale = Math.min(1, maxCardW / 240);

								const dx = offsets[i]?.x || 0;
								const dy = offsets[i]?.y || 0;
								const cardLeft = laneCenterX + dx;
								const cardTop = pos.y + NODE_R + CARD_GAP_Y + dy;

								const completed = adjusted >= pos.t;

								return (
									<li key={i} className="absolute" style={{ left: 0, top: 0 }}>
										<motion.button
											id={`toc-node-${i}`}
											type="button"
											onClick={() => onNavigate?.(it.index)}
											className="outline-none pointer-events-auto rounded-full focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
											aria-label={`${it.label}, Page ${it.index + 1}${
												completed ? " (completed)" : ""
											}`}
											style={{
												position: "absolute",
												left: pos.x,
												top: pos.y,
												transform: "translate(-50%, -50%)",
											}}
											initial={
												prefersReduced ? undefined : { scale: 0, opacity: 0 }
											}
											animate={
												prefersReduced ? undefined : { scale: 1, opacity: 1 }
											}
											transition={
												prefersReduced
													? { duration: 0 }
													: {
															delay: 0.08 + i * 0.06,
															type: "spring",
															stiffness: 260,
															damping: 22,
													  }
											}
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
											<div
												className="backdrop-blur-md flex items-center justify-center"
												style={{
													width: NODE_R * 2,
													height: NODE_R * 2,
													borderRadius: 9999,
													border: `2px solid ${border}`,
													background: glass,
													boxShadow:
														"0 8px 24px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
												}}
											>
												<FontAwesomeIcon
													icon={it.icon}
													className="text-lg"
													style={{
														color: completed ? "hsl(204 90% 45%)" : base,
													}}
													aria-hidden
												/>
											</div>
										</motion.button>

										<svg
											className="absolute"
											style={{ left: 0, top: 0, width: "100%", height: "100%" }}
											viewBox="0 0 1200 230"
											aria-hidden="true"
										>
											<path
												d={`M ${pos.x} ${pos.y + NODE_R}
                           C ${pos.x} ${pos.y + NODE_R + 28},
                             ${cardLeft} ${cardTop - 36},
                             ${cardLeft} ${cardTop}`}
												fill="none"
												stroke={`hsl(${hue} 40% 60% / 0.55)`}
												strokeWidth="2"
											/>
										</svg>

										<motion.button
											id={`toc-card-${i}`}
											type="button"
											onClick={() => onNavigate?.(it.index)}
											className="pointer-events-auto absolute text-left origin-top outline-none rounded-2xl focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
											aria-label={`Open ${it.label}, Page ${it.index + 1}`}
											style={{
												left: cardLeft,
												top: cardTop,
												width: CARD_W,
												height: CARD_H,
												transform: `translate(-50%, 0) scale(${scale})`,
											}}
											initial={
												prefersReduced ? undefined : { opacity: 0, y: 10 }
											}
											animate={
												prefersReduced ? undefined : { opacity: 1, y: 0 }
											}
											transition={
												prefersReduced
													? { duration: 0 }
													: { delay: 0.22 + i * 0.05, duration: 0.35 }
											}
										>
											<div className="rounded-2xl border border-slate-300/80 bg-white/92 backdrop-blur shadow-[0_10px_30px_rgba(2,6,23,0.12)] px-4 py-3 hover:shadow-[0_14px_40px_rgba(2,6,23,0.16)] transition-shadow">
												<div className="flex items-center gap-2">
													<span
														className="inline-block w-2.5 h-2.5 rounded-full"
														style={{
															background: completed
																? "hsl(204 90% 45%)"
																: `hsl(${hue} 70% 45%)`,
														}}
													/>
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
										</motion.button>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="mt-6 text-center">
						<motion.div
							className="text-slate-600 text-xs md:text-sm"
							initial={prefersReduced ? undefined : { opacity: 0, y: 6 }}
							animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
							transition={
								prefersReduced
									? { duration: 0 }
									: { duration: 0.45, delay: 0.2 }
							}
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
