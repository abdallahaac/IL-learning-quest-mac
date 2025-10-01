import React, {
	useMemo,
	useState,
	useRef,
	useLayoutEffect,
	useEffect,
} from "react";

/* --- central accent map for all 10 activities --- */
const ACTIVITY_ACCENTS = {
	1: "#2563EB",
	2: "#047857",
	3: "#B45309",
	4: "#4338CA",
	5: "#BE123C",
	6: "#0891B2",
	7: "#0D9488",
	8: "#E11D48",
	9: "#934D6C",
	10: "#DB5A42",
};

/* --- small color helpers --- */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const withAlpha = (hex, aa /* like "14" */) => `${hex}${aa}`;

const hexToRgb = (hex) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
};
const rgbToHex = ({ r, g, b }) =>
	`#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const relLum = ({ r, g, b }) => {
	const f = (c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	};
	const [R, G, B] = [f(r), f(g), f(b)];
	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
const contrastRatio = (hex1, hex2) => {
	const L1 = relLum(hexToRgb(hex1));
	const L2 = relLum(hexToRgb(hex2));
	const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
	return (hi + 0.05) / (lo + 0.05);
};

/** Blend an opaque accent over white by alpha (0..1) → hex */
const blendOverWhite = (hex, a) => {
	const { r, g, b } = hexToRgb(hex);
	const R = Math.round(255 * (1 - a) + r * a);
	const G = Math.round(255 * (1 - a) + g * a);
	const B = Math.round(255 * (1 - a) + b * a);
	return rgbToHex({ r: R, g: G, b: B });
};

/** Find the smallest alpha (within range) that yields >= target contrast vs text */
const findAlphaForContrast = ({
	accent,
	text = "#0F172A",
	target = 4.5,
	min = 0.08,
	max = 0.28,
	step = 0.01,
}) => {
	let a = min;
	let best = blendOverWhite(accent, a);
	while (a <= max) {
		const bg = blendOverWhite(accent, a);
		if (contrastRatio(bg, text) >= target) return { alpha: a, bg };
		best = bg;
		a += step;
	}
	return { alpha: max, bg: best };
};

const isLight = (hex) => relLum(hexToRgb(hex)) > 0.5;

/** choose accent */
const resolveAccent = (step, idx, defaultAccent) => {
	const fromProp = normalizeHex(step?.accent);
	if (fromProp) return fromProp;
	const activityId =
		typeof step?.activityId === "number" ? step.activityId : idx + 1;
	return (
		normalizeHex(ACTIVITY_ACCENTS[activityId]) ||
		normalizeHex(defaultAccent) ||
		"#67AAF9"
	);
};

/**
 * Accent-aware Activities pill + right-rail with accessible tints.
 */
export default function ActivityDock({
	steps = [],
	currentPageIndex = 0,
	onJump,
	contentMaxWidth = 1200,
	defaultAccent = "#67AAF9",
}) {
	const [open, setOpen] = useState(false);
	const btnRef = useRef(null);

	if (!steps.length) return null;

	// enrich steps with computed accent
	const enrichedSteps = useMemo(
		() =>
			steps.map((s, i) => ({
				...s,
				_accent: resolveAccent(s, i, defaultAccent),
			})),
		[steps, defaultAccent]
	);

	const activeIdx = useMemo(
		() => enrichedSteps.findIndex((s) => s.index === currentPageIndex),
		[enrichedSteps, currentPageIndex]
	);
	const completedCount = enrichedSteps.filter((s) => s.completed).length;
	const pct = Math.round((completedCount / enrichedSteps.length) * 100);

	// current activity accent
	const activeAccent =
		normalizeHex(enrichedSteps[activeIdx]?._accent) ||
		normalizeHex(defaultAccent) ||
		"#67AAF9";

	// layout
	const [panelLeft, setPanelLeft] = useState(0);
	const [panelTop, setPanelTop] = useState(0);

	const measurePosition = () => {
		const vw = window.innerWidth;
		const btnRect = btnRef.current?.getBoundingClientRect();
		const leftStart = Math.max(
			8,
			(vw - contentMaxWidth) / 2 + contentMaxWidth + 24
		);
		const computedLeft = Math.min(leftStart, Math.max(8, vw - 320 - 8));
		const computedTop = (btnRect?.bottom ?? 80) + 8;
		setPanelLeft(computedLeft);
		setPanelTop(computedTop);
	};

	useLayoutEffect(() => {
		if (!open) return;
		measurePosition();
	}, [open, contentMaxWidth]);

	useEffect(() => {
		if (!open) return;
		const onResize = () => measurePosition();
		const onScroll = () => measurePosition();
		window.addEventListener("resize", onResize);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("scroll", onScroll);
		};
	}, [open]);

	const positioned = panelLeft !== 0 || panelTop !== 0;

	/* one-time pulse when newly visited */
	const prevVisitedRef = useRef(enrichedSteps.map((s) => !!s.visited));
	const [flashSet, setFlashSet] = useState(new Set());
	useEffect(() => {
		const prev = prevVisitedRef.current;
		const now = enrichedSteps.map((s) => !!s.visited);
		const newlyVisited = new Set();
		now.forEach((v, i) => {
			if (v && !prev[i]) newlyVisited.add(i);
		});
		if (newlyVisited.size) {
			setFlashSet(newlyVisited);
			const t = setTimeout(() => setFlashSet(new Set()), 900);
			return () => clearTimeout(t);
		}
		prevVisitedRef.current = now;
	}, [enrichedSteps]);

	const textColor = "#0F172A"; // dark slate for readability

	return (
		<>
			{/* header pill */}
			<button
				ref={btnRef}
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className="
          inline-flex items-center gap-3 rounded-full
          bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur
          border border-slate-200 shadow-sm px-3 py-2
          hover:shadow-lg transition
          focus:outline-none
        "
				style={{ boxShadow: open ? `0 0 0 2px ${activeAccent}` : "none" }}
				onFocus={(e) =>
					(e.currentTarget.style.boxShadow = `0 0 0 2px ${activeAccent}`)
				}
				onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
				title={`${pct}% complete`}
			>
				<span
					aria-hidden="true"
					className="relative grid place-items-center w-9 h-9 rounded-full"
					style={{
						background: `conic-gradient(${activeAccent} ${
							pct * 3.6
						}deg, #e2e8f0 0)`,
					}}
				>
					<span className="absolute inset-[3px] rounded-full bg-white shadow-inner" />
					<span className="relative text-xs font-semibold">
						<span style={{ color: "#0F172A" }}>{completedCount}</span>
						<span style={{ color: activeAccent }}>/</span>
						<span style={{ color: activeAccent }}>{enrichedSteps.length}</span>
					</span>
				</span>
				<span className="text-sm font-medium text-slate-800">Activities</span>
				<svg
					className={`w-4 h-4 text-slate-500 transition-transform ${
						open ? "rotate-180" : ""
					}`}
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
				</svg>
			</button>

			{/* right rail */}
			<div
				aria-hidden={!open}
				className={`fixed z-[80] ${
					open
						? "opacity-100 translate-y-0 scale-100"
						: "opacity-0 translate-y-1 scale-[0.99] pointer-events-none"
				} duration-200 ease-out`}
				style={{
					left: panelLeft,
					top: panelTop,
					maxHeight: "calc(100vh - 32px)",
					transitionProperty: "opacity, transform",
					visibility: positioned ? "visible" : "hidden",
				}}
			>
				<div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-3 origin-top w-[min(92vw,960px)] max-w-[300px] overflow-auto">
					<nav aria-label="Activities">
						<div className="grid gap-2 sm:grid-cols-1">
							{enrichedSteps.map((s, i) => {
								const isActive = s.index === currentPageIndex;
								const done = !!s.completed;
								const seen = !!s.visited;
								const accent = s._accent;

								// compute a base alpha that meets 4.5:1 (small text) vs dark text
								const { alpha: baseAlpha, bg: baseBg } = findAlphaForContrast({
									accent,
									text: textColor,
									target: 4.5,
									min: 0.1, // start at 10% tint
									max: 0.28, // cap at ~28% tint
									step: 0.01,
								});

								const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
								const seenAlpha = clamp(baseAlpha + 0.02, 0.1, 0.3);
								const doneAlpha = clamp(baseAlpha + 0.04, 0.12, 0.32);
								const activeAlpha = clamp(baseAlpha + 0.06, 0.14, 0.34);

								const bgSeen = blendOverWhite(accent, seenAlpha);
								const bgDone = blendOverWhite(accent, doneAlpha);
								const bgActive = blendOverWhite(accent, activeAlpha);

								const borderFromBg = (bg) => {
									// nudge border a bit stronger than bg for definition
									const ratio = 0.12;
									const { r, g, b } = hexToRgb(bg);
									const R = Math.round(r * (1 - ratio));
									const G = Math.round(g * (1 - ratio));
									const B = Math.round(b * (1 - ratio));
									return rgbToHex({ r: R, g: G, b: B });
								};

								const base =
									"relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition w-full justify-start";
								const stateCls = isActive ? "shadow-sm" : "hover:shadow-sm";

								const pillStyle = isActive
									? {
											backgroundColor: bgActive,
											border: `1px solid ${borderFromBg(bgActive)}`,
											color: textColor,
									  }
									: done
									? {
											backgroundColor: bgDone,
											border: `1px solid ${borderFromBg(bgDone)}`,
											color: textColor,
									  }
									: seen
									? {
											backgroundColor: bgSeen,
											border: `1px solid ${borderFromBg(bgSeen)}`,
											color: textColor,
									  }
									: {
											backgroundColor: baseBg,
											border: `1px solid ${borderFromBg(baseBg)}`,
											color: textColor,
									  };

								const pulse = flashSet.has(i) && !done;

								const statusIcon = done ? (
									<svg
										className="w-3.5 h-3.5"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.3 6.23-2.29-2.27a1 1 0 10-1.42 1.41l3 2.98a1 1 0 001.407-.003l7.01-6.93z" />
									</svg>
								) : seen ? (
									<span
										aria-hidden="true"
										className="inline-block w-2 h-2 rounded-full"
										style={{ backgroundColor: accent }}
									/>
								) : (
									<span className="text-[11px] font-semibold text-slate-600">
										{i + 1}
									</span>
								);

								const ariaStatus = done
									? " (completed)"
									: seen
									? " (visited)"
									: " (not started)";

								return (
									<button
										key={s.key ?? i}
										type="button"
										onClick={() => {
											onJump?.(s.index);
											setOpen(false);
										}}
										className={`${base} ${stateCls} focus:outline-none ${
											pulse ? "visited-pulse" : ""
										}`}
										style={{
											...pillStyle,
											paddingLeft: 12,
											boxShadow: `0 0 0 0 transparent`,
										}}
										onFocus={(e) =>
											(e.currentTarget.style.boxShadow = `0 0 0 2px ${accent}`)
										}
										onBlur={(e) =>
											(e.currentTarget.style.boxShadow = `0 0 0 0 transparent`)
										}
										aria-current={isActive ? "step" : undefined}
										title={`${s.label}${ariaStatus}`}
									>
										{/* badge */}
										<span
											className="grid place-items-center w-6 h-6 rounded-full text-xs font-semibold bg-white"
											style={{
												border: `1px solid ${withAlpha(accent, "33")}`,
												color: isLight(accent) ? "#0B1220" : "#0B1220",
											}}
											aria-hidden="true"
										>
											{statusIcon}
										</span>

										{/* label */}
										<span className="whitespace-nowrap">
											{s.label}
											<span className="sr-only">{ariaStatus}</span>
										</span>
									</button>
								);
							})}
						</div>
					</nav>
				</div>
			</div>

			<style>{`
        @keyframes pulseOnce {
          0%   { box-shadow: 0 0 0 0 rgba(0,0,0,0); transform: translateY(0); }
          40%  { box-shadow: 0 0 0 8px rgba(0,0,0,0.06); transform: translateY(-1px); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); transform: translateY(0); }
        }
        .visited-pulse { animation: pulseOnce 0.9s ease-out both; }
      `}</style>
		</>
	);
}
