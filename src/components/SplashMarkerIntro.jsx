// src/components/SplashMarkerIntro.jsx
import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Full-viewport splash:
 *  - staggered dot grid
 *  - two logos (optional)
 *  - animated collaboration caption
 *  - auto close or user skip
 */
export default function SplashMarkerIntro({
	logos, // [left, right] each can be url string, component, or { el|src, height?, width?, className?, style? }

	// Longer overall guard (auto-dismiss)
	durationMs = 5200,

	// Visuals
	bg = "#4b3a69",
	dotColor = "rgba(255,255,255,0.28)",
	dotSize = 4,
	dotGap = 22,

	// Slower reveal across the whole grid + slightly longer per-dot anim
	dotsRevealTotalMs = 2600,
	dotAnimMs = 140,
	// Give logos more time after dots finish
	logosDelayAfterDotsMs = 800,

	// Caption
	collabText = "Canada School in collaboration with Parks Canada",
	// Caption waits a beat after logos
	collabDelayAfterLogosMs = 500,

	onDone,
	debugHold = false,

	// Slightly larger default logo height to match bigger caption
	logoHeight = 100,
}) {
	const reduce = useReducedMotion();
	const [show, setShow] = useState(true);
	const [ready, setReady] = useState(reduce);
	const [grid, setGrid] = useState({ rows: 0, cols: 0 });
	const timerRef = useRef();

	const [L, R] = Array.isArray(logos) ? logos : [];

	const norm = (entry) => {
		try {
			if (!entry) return null;
			if (typeof entry === "string") return { type: "url", src: entry };
			if (typeof entry === "function") return { type: "comp", el: entry };
			if (typeof entry === "object" && (entry.src || entry.el)) {
				return { type: entry.src ? "url" : "comp", ...entry };
			}
			return null;
		} catch {
			return null;
		}
	};
	const NL = norm(L);
	const NR = norm(R);

	const recalcGrid = () => {
		try {
			const w = Math.max(1, window.innerWidth);
			const h = Math.max(1, window.innerHeight);
			const cols = Math.ceil(w / dotGap) + 2;
			const rows = Math.ceil(h / dotGap) + 2;
			setGrid((g) => (g.rows === rows && g.cols === cols ? g : { rows, cols }));
		} catch {}
	};

	useLayoutEffect(() => {
		recalcGrid();
		const onResize = () => recalcGrid();
		try {
			window.addEventListener("resize", onResize);
			return () => window.removeEventListener("resize", onResize);
		} catch {
			return () => {};
		}
	}, [dotGap]);

	useEffect(() => {
		if (reduce) return setReady(true);
		try {
			const urls = [
				NL?.type === "url" ? NL.src : null,
				NR?.type === "url" ? NR.src : null,
			].filter(Boolean);
			if (!urls.length) return setReady(true);
			let alive = true;
			Promise.all(
				urls.map(
					(u) =>
						new Promise((res) => {
							try {
								const im = new Image();
								im.onload = res;
								im.onerror = res;
								im.src = u;
							} catch {
								res();
							}
						})
				)
			).then(() => alive && setReady(true));
			return () => {
				alive = false;
			};
		} catch {
			setReady(true);
		}
	}, [reduce, NL?.type, NL?.src, NR?.type, NR?.src]);

	useEffect(() => {
		if (debugHold || !ready) return;
		try {
			timerRef.current = setTimeout(() => {
				setShow(false);
				try {
					onDone?.();
				} catch {}
			}, durationMs);
			return () => clearTimeout(timerRef.current);
		} catch {
			setShow(false);
			try {
				onDone?.();
			} catch {}
		}
	}, [ready, durationMs, onDone, debugHold]);

	useEffect(() => {
		if (debugHold || !show) return;
		const skip = () => {
			try {
				clearTimeout(timerRef.current);
			} catch {}
			setShow(false);
			try {
				onDone?.();
			} catch {}
		};
		try {
			window.addEventListener("click", skip, { once: true });
			window.addEventListener("keydown", skip, { once: true });
			return () => {
				window.removeEventListener("click", skip);
				window.removeEventListener("keydown", skip);
			};
		} catch {
			return () => {};
		}
	}, [show, onDone, debugHold]);

	const toCssSize = (v) => (typeof v === "number" ? `${v}px` : v);

	const renderLogo = (nEntry, motionProps = {}) => {
		try {
			if (!nEntry) return null;
			const heightCss = toCssSize(nEntry.height ?? logoHeight);
			const widthCss = nEntry.width ? toCssSize(nEntry.width) : "auto";
			const common = {
				className: `inline-flex items-center justify-center shrink-0 ${
					nEntry.className ?? ""
				}`,
				style: { lineHeight: 0, ...nEntry.style },
				...motionProps,
			};
			if (nEntry.type === "url") {
				return (
					<motion.div {...common}>
						<img
							src={nEntry.src}
							alt=""
							draggable={false}
							style={{ height: heightCss, width: widthCss }}
						/>
					</motion.div>
				);
			}
			const Comp = nEntry.el;
			if (typeof Comp !== "function") return null;
			return (
				<motion.div {...common}>
					<Comp
						preserveAspectRatio="xMidYMid meet"
						style={{ height: heightCss, width: widthCss }}
					/>
				</motion.div>
			);
		} catch {
			return null;
		}
	};

	// ── Timing math ──────────────────────────────────────────────────────────────
	const dotCount = Math.max(0, grid.rows * grid.cols);
	const perDotSec = dotAnimMs / 1000;
	const totalSec = dotsRevealTotalMs / 1000;

	const staggerChildren =
		reduce || dotCount <= 1
			? 0
			: Math.max(0, (totalSec - perDotSec) / Math.max(1, dotCount - 1));

	const gridKey = `${grid.rows}x${grid.cols}_${dotGap}_${dotSize}`;

	const gridVariant = useMemo(
		() => ({
			start: {},
			reveal: {
				transition: {
					delayChildren: 0,
					staggerChildren: reduce ? 0 : staggerChildren,
				},
			},
		}),
		[reduce, staggerChildren]
	);

	const dotVariant = useMemo(
		() => ({
			start: { opacity: 0, scale: 0.6 },
			reveal: {
				opacity: 1,
				scale: 1,
				transition: { duration: perDotSec, ease: [0.22, 1, 0.36, 1] },
			},
		}),
		[perDotSec]
	);

	const logoDelaySec = reduce
		? 0
		: Math.max(0, totalSec + logosDelayAfterDotsMs / 1000);
	const collabDelaySec = reduce
		? 0
		: logoDelaySec + collabDelayAfterLogosMs / 1000;

	if (typeof document === "undefined" || !document.body) return null;

	return createPortal(
		<AnimatePresence>
			{show && (
				<motion.div
					className="fixed inset-0"
					style={{ zIndex: 2147483647, background: bg }}
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{
						opacity: 0,
						transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
					}}
					aria-hidden
				>
					{/* Dot grid */}
					{grid.rows > 0 && grid.cols > 0 && (
						<motion.div
							key={gridKey}
							className="absolute inset-0 grid"
							style={{
								gridTemplateColumns: `repeat(${grid.cols}, ${dotGap}px)`,
								gridTemplateRows: `repeat(${grid.rows}, ${dotGap}px)`,
								justifyContent: "center",
								alignContent: "center",
								gap: `${Math.max(0, dotGap - dotSize)}px`,
								willChange: "opacity, transform",
							}}
							variants={gridVariant}
							initial="start"
							animate="reveal"
						>
							{Array.from({ length: dotCount }).map((_, i) => (
								<motion.span
									key={i}
									variants={dotVariant}
									style={{
										width: dotSize,
										height: dotSize,
										borderRadius: 9999,
										background: dotColor,
										willChange: "opacity, transform",
									}}
								/>
							))}
						</motion.div>
					)}

					{/* Logos */}
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="inline-flex items-center justify-center gap-6 sm:gap-8 px-4">
							{renderLogo(NL, {
								initial: { opacity: 0, y: 6, scale: 0.98 },
								animate: {
									opacity: ready ? 1 : 0,
									y: 0,
									scale: 1,
									transition: {
										duration: 1.0,
										delay: logoDelaySec,
										ease: [0.22, 1, 0.36, 1],
									},
								},
							})}
							{renderLogo(NR, {
								initial: { opacity: 0, y: 6, scale: 0.98 },
								animate: {
									opacity: ready ? 1 : 0,
									y: 0,
									scale: 1,
									transition: {
										duration: 1.0,
										delay: logoDelaySec + 0.15,
										ease: [0.22, 1, 0.36, 1],
									},
								},
							})}
						</div>
					</div>

					{/* Collaboration caption */}
					{collabText ? (
						<motion.div
							className="absolute left-0 right-0 bottom-[12%] flex items-center justify-center px-4 pointer-events-none"
							initial={{ opacity: 0, y: 8 }}
							animate={{
								opacity: 1,
								y: 0,
								transition: {
									duration: 1.0,
									delay: collabDelaySec,
									ease: [0.22, 1, 0.36, 1],
								},
							}}
						>
							<span
								className="text-white/95 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-center"
								aria-label={collabText}
							>
								{collabText}
							</span>
						</motion.div>
					) : null}
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
}
