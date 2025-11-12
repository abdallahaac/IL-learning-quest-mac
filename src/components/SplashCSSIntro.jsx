// src/components/SplashCSSIntro.jsx
import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

export const SPLASH_LOCK_KEY = "__APP_SPLASH_ACTIVE__";
const CONTAINER_ID = "app-splash-overlay-root";

/** Timing constants you can edit at a glance */
export const SPLASH_TIMING_DEFAULTS = {
	FADE_IN_MS: 600,
	LOGO_ENTRANCE_MS: 800,
	LOGO_STAGGER_MS: 240,
	CAPTION_ENTRANCE_MS: 900,
	PRE_HOLD_MS: 200,
	HOLD_AFTER_CAPTION_MS: 3600,
	FADE_OUT_MS: 1000,
	LEAD_BG_SWITCH_MS: 150,
};

function getContainer() {
	if (typeof document === "undefined") return null;
	let el = document.getElementById(CONTAINER_ID);
	if (!el) {
		el = document.createElement("div");
		el.id = CONTAINER_ID;
		document.body.appendChild(el);
	}
	return el;
}

const prefersReduced = () =>
	typeof window !== "undefined" &&
	window.matchMedia &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Detect page language via <html lang="...">, then navigator as fallback
function detectIsFr() {
	if (typeof document !== "undefined") {
		const langAttr = (
			document.documentElement.getAttribute("lang") || ""
		).toLowerCase();
		if (langAttr.startsWith("fr")) return true;
		if (langAttr.startsWith("en")) return false;
	}
	if (typeof navigator !== "undefined") {
		const navLang = (
			navigator.language ||
			navigator.userLanguage ||
			""
		).toLowerCase();
		if (navLang.startsWith("fr")) return true;
	}
	return false;
}

// Default bilingual caption text
const DEFAULT_TEXT = {
	en: "Canada School of Public Service in collaboration with Parks Canada",
	fr: "École de la fonction publique du Canada en collaboration avec Parcs Canada",
};

// Resolve final caption text based on locale and overrides
function resolveCollabText(collabText, isFr) {
	if (typeof collabText === "string") return collabText;
	if (collabText && typeof collabText === "object") {
		const en = collabText.en || DEFAULT_TEXT.en;
		const fr = collabText.fr || collabText.en || DEFAULT_TEXT.fr;
		return isFr ? fr : en;
	}
	return isFr ? DEFAULT_TEXT.fr : DEFAULT_TEXT.en;
}

// Helpers to build gradient and shadow from variables
const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const pct = (v) => (typeof v === "number" ? `${v}%` : String(v));

function buildRadialGradient({
	rgb = [0, 0, 0],
	shape = "140% 180% at 50% 50%",
	stops = [],
}) {
	const [r, g, b] = rgb;
	const parts = stops.map(
		(s) => `rgba(${r},${g},${b},${clamp01(s.alpha)}) ${pct(s.pos)}`
	);
	return `radial-gradient(${shape}, ${parts.join(", ")})`;
}

function buildShadow({
	x = 0,
	y = 18,
	blur = 48,
	spread = 0,
	rgb = [0, 0, 0],
	alpha = 0.35,
}) {
	const [r, g, b] = rgb;
	return `${x}px ${y}px ${blur}px ${spread}px rgba(${r},${g},${b},${clamp01(
		alpha
	)})`;
}

export default function SplashCSSIntro({
	bg = "#4b3a69",
	dotColor = "rgba(255,255,255,0.28)",
	dotSize = 4,
	dotGap = 22,
	logos = [],

	// Caption text, can be string or { en, fr }
	collabText = DEFAULT_TEXT,

	// Optional manual override; if omitted, auto-detect from document/navigator
	locale,

	// Callbacks
	onDone,
	onWillEnd,

	// Timing
	timing = SPLASH_TIMING_DEFAULTS,

	// Backdrop behind caption
	enableCaptionBackdrop = true,

	// Backdrop geometry/softness
	backdropRadius = "9999px",
	backdropPadX = 18,
	backdropPadY = 10,
	backdropBlurPx = 20,
	backdropMaskFeatherPx = 22,

	// Optional full CSS overrides
	backdropGradient,
	backdropShadow,

	// Variable-driven gradient
	backdropGradientRGB = [0, 0, 0],
	backdropGradientShape = "160% 200% at 50% 50%",
	backdropGradientStops = [
		{ pos: "0%", alpha: 0.55 },
		{ pos: "35%", alpha: 0.42 },
		{ pos: "65%", alpha: 0.22 },
		{ pos: "90%", alpha: 0.1 },
		{ pos: "100%", alpha: 0.0 },
	],

	// Shadow controls
	backdropShadowRGB = [0, 0, 0],
	backdropShadowAlpha = 0.28,
	backdropShadowX = 0,
	backdropShadowY = 22,
	backdropShadowBlur = 90,
	backdropShadowSpread = 0,

	// Overall opacity
	backdropOpacity = 0.1,

	// Caption typography controls
	captionFontSize = "clamp(1.5rem, 2.8vw + 0.5rem, 2.4rem)",
	captionLineHeight = 1.2,
	captionFontWeight = 500,
	captionLetterSpacing = 1,

	// Caption width/position controls
	captionMaxWidth = "min(98vw, 2000px)",
	captionWidth, // e.g., "820px" to force a fixed width
	captionTop = "65%",
	captionRight, // e.g., "8%"
	captionBottom = "12%", // default relative bottom
	captionLeft = "50%", // center horizontally by default
	captionTranslate = "translate(-50%, 0)",
	captionTextAlign = "center",
}) {
	const reduced = prefersReduced();
	const rootRef = useRef(null);
	const logosRef = useRef(null);
	const captionRef = useRef(null);
	const doneRef = useRef(false);
	const willEndCallRef = useRef(null);
	const [canRender, setCanRender] = useState(false);
	const [container, setContainer] = useState(null);

	// DPR-aware background-position to align CSS dots with PatternMorph lattice
	const [bgPos, setBgPos] = useState("0px 0px");
	const computeBgPosition = () => {
		if (typeof window === "undefined") return;
		const dpr = Math.max(1, window.devicePixelRatio || 1);
		const cellDevicePx = Math.max(2, dotGap) * dpr; // PatternMorph: cell = cellPx * dpr
		const W = Math.floor(window.innerWidth * dpr);
		const H = Math.floor(window.innerHeight * dpr);
		const offXDevice = Math.round((W % cellDevicePx) / 2);
		const offYDevice = Math.round((H % cellDevicePx) / 2);
		const offXCss = offXDevice / dpr;
		const offYCss = offYDevice / dpr;
		setBgPos(`${offXCss}px ${offYCss}px`);
	};

	// Normalize timing with defaults
	const T = { ...SPLASH_TIMING_DEFAULTS, ...(timing || {}) };

	// Determine whether we should use French
	const isFr = useMemo(() => {
		if (locale) {
			const lc = String(locale).toLowerCase();
			return lc === "fr" || lc.startsWith("fr-");
		}
		return detectIsFr();
	}, [locale]);

	// Compute the final caption string
	const captionTextResolved = useMemo(
		() => resolveCollabText(collabText, isFr),
		[collabText, isFr]
	);

	// Build gradient/shadow CSS from variables unless explicit strings are provided
	const gradientCSS = useMemo(() => {
		if (backdropGradient) return backdropGradient;
		return buildRadialGradient({
			rgb: backdropGradientRGB,
			shape: backdropGradientShape,
			stops: backdropGradientStops,
		});
	}, [
		backdropGradient,
		backdropGradientRGB,
		backdropGradientShape,
		backdropGradientStops,
	]);

	const shadowCSS = useMemo(() => {
		if (backdropShadow) return backdropShadow;
		return buildShadow({
			x: backdropShadowX,
			y: backdropShadowY,
			blur: backdropShadowBlur,
			spread: backdropShadowSpread,
			rgb: backdropShadowRGB,
			alpha: backdropShadowAlpha,
		});
	}, [
		backdropShadow,
		backdropShadowX,
		backdropShadowY,
		backdropShadowBlur,
		backdropShadowSpread,
		backdropShadowRGB,
		backdropShadowAlpha,
	]);

	useEffect(() => {
		if (typeof document === "undefined" || typeof window === "undefined")
			return;
		if (window[SPLASH_LOCK_KEY]) return;
		window[SPLASH_LOCK_KEY] = true;
		setCanRender(true);
		setContainer(getContainer());
		return () => {
			window[SPLASH_LOCK_KEY] = false;
		};
	}, []);

	// Keep CSS background aligned with PatternMorph lattice (on mount, resize, DPR change-ish)
	useEffect(() => {
		if (typeof window === "undefined") return;
		const handler = () => computeBgPosition();
		computeBgPosition();
		window.addEventListener("resize", handler);
		// Re-run shortly after mount to catch mobile UI chrome changes
		const id = setTimeout(handler, 50);
		return () => {
			clearTimeout(id);
			window.removeEventListener("resize", handler);
		};
	}, [dotGap]);

	const safeDone = () => {
		if (doneRef.current) return;
		doneRef.current = true;
		try {
			window[SPLASH_LOCK_KEY] = false;
		} catch {}
		onDone?.();
	};

	const size = `${dotGap}px ${dotGap}px`;
	const bgImage = useMemo(
		() =>
			`radial-gradient(${dotColor} ${dotSize / 2}px, transparent ${
				dotSize / 2 + 0.01
			}px)`,
		[dotColor, dotSize]
	);

	const Z = 2147483647;

	useLayoutEffect(() => {
		if (!canRender || !rootRef.current) return;

		if (reduced) {
			onWillEnd?.();
			const t = setTimeout(safeDone, 0);
			return () => clearTimeout(t);
		}

		gsap.set(rootRef.current, { opacity: 0, pointerEvents: "auto" });

		const tlIn = gsap.timeline();

		// Overlay fade-in
		tlIn.to(rootRef.current, {
			opacity: 1,
			duration: T.FADE_IN_MS / 1000,
			ease: "power2.out",
		});

		// Logos entrance
		tlIn.fromTo(
			logosRef.current?.children || [],
			{ opacity: 0, y: 10, scale: 0.975 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: T.LOGO_ENTRANCE_MS / 1000,
				ease: "power3.out",
				stagger: (T.LOGO_STAGGER_MS || 0) / 1000,
			},
			"+=0.08"
		);

		// Caption entrance
		if (captionRef.current) {
			tlIn.fromTo(
				captionRef.current,
				{ opacity: 0, y: 12 },
				{
					opacity: 1,
					y: 0,
					duration: T.CAPTION_ENTRANCE_MS / 1000,
					ease: "power3.out",
				},
				"+=0.12"
			);
		}

		// Hold after caption appears
		const holdSec =
			Math.max(0, T.PRE_HOLD_MS) / 1000 +
			Math.max(0, T.HOLD_AFTER_CAPTION_MS) / 1000;

		// When to call onWillEnd slightly before exit
		const fadeSec = Math.max(0.01, T.FADE_OUT_MS / 1000);
		const totalSec = holdSec + fadeSec;
		const willEndAt = Math.max(
			0,
			totalSec - Math.max(0, T.LEAD_BG_SWITCH_MS) / 1000
		);
		const dc = gsap.delayedCall(willEndAt, () => onWillEnd?.());
		willEndCallRef.current = dc;

		// Exit timeline
		const tlOut = gsap.timeline({
			defaults: { ease: "power2.out" },
			onComplete: safeDone,
		});
		tlOut.to({}, { duration: holdSec });
		tlOut.set(rootRef.current, { pointerEvents: "none" });
		tlOut.to(rootRef.current, { opacity: 0, duration: fadeSec });

		// Skip on click or key
		const skip = () => {
			if (doneRef.current) return;
			onWillEnd?.();
			willEndCallRef.current?.kill?.();
			tlOut.kill();
			gsap.set(rootRef.current, { pointerEvents: "none" });
			gsap.to(rootRef.current, {
				opacity: 0,
				duration: Math.max(0.15, fadeSec),
				ease: "power2.out",
				onComplete: safeDone,
			});
		};

		window.addEventListener("click", skip, { once: true });
		window.addEventListener("keydown", skip, { once: true });

		return () => {
			tlIn.kill();
			tlOut.kill();
			willEndCallRef.current?.kill?.();
			window.removeEventListener("click", skip);
			window.removeEventListener("keydown", skip);
		};
	}, [canRender, reduced, T, onWillEnd]);

	if (!canRender || !container) return null;

	const gradientOpacity = clamp01(backdropOpacity);

	// Compute caption wrapper absolute positioning from variables
	const captionWrapStyle = {
		position: "absolute",
		left: captionLeft,
		right: captionRight,
		top: captionTop,
		bottom: captionBottom,
		transform: captionTranslate,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		pointerEvents: "none",
		opacity: 0, // animated in
	};

	return createPortal(
		<div
			ref={rootRef}
			className="fixed inset-0 overflow-hidden"
			style={{
				zIndex: Z,
				background: bg,
				backgroundImage: bgImage,
				backgroundSize: size,
				backgroundPosition: bgPos, // DPR-aware centering to match PatternMorph lattice
				opacity: 0,
				pointerEvents: "auto",
				isolation: "isolate",
				willChange: "opacity",
			}}
			role="presentation"
			aria-hidden
		>
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{ pointerEvents: "none" }}
			>
				<div
					ref={logosRef}
					className="inline-flex items-center justify-center gap-6 sm:gap-8 px-4"
				>
					{logos.map((entry, i) => {
						const n =
							typeof entry === "string"
								? { src: entry }
								: entry?.src
								? entry
								: entry?.el
								? entry
								: null;
						if (!n) return null;
						const h =
							typeof n.height === "number"
								? `${n.height}px`
								: n.height || "100px";
						const w = n.width
							? typeof n.width === "number"
								? `${n.width}px`
								: n.width
							: "auto";
						if (n.src) {
							return (
								<img
									key={i}
									src={n.src}
									alt=""
									draggable={false}
									style={{
										height: h,
										width: w,
										filter: "drop-shadow(0 1px 2px rgba(0,0,0,.25))",
									}}
								/>
							);
						}
						const Comp = n.el;
						return (
							<div key={i} style={{ height: h, width: w }}>
								<Comp
									style={{ height: "100%", width: "100%" }}
									preserveAspectRatio="xMidYMid meet"
								/>
							</div>
						);
					})}
				</div>
			</div>

			{captionTextResolved ? (
				<div ref={captionRef} style={captionWrapStyle}>
					<span
						className="text-white"
						style={{
							// Typography variables
							fontSize: captionFontSize,
							lineHeight: captionLineHeight,
							fontWeight: captionFontWeight,
							letterSpacing: captionLetterSpacing,
							textAlign: captionTextAlign,
							maxWidth: captionMaxWidth,
							width: captionWidth, // optional fixed width
							textShadow: "0 1px 2px rgba(0,0,0,0.6)",
							display: "inline-block",
							pointerEvents: "none",
						}}
					>
						{enableCaptionBackdrop ? (
							<span style={{ position: "relative", display: "inline-block" }}>
								{/* Backdrop layer */}
								<span
									aria-hidden="true"
									style={{
										position: "absolute",
										left: `-${backdropPadX + 8}px`,
										right: `-${backdropPadX + 8}px`,
										top: `-${backdropPadY + 8}px`,
										bottom: `-${backdropPadY + 8}px`,
										borderRadius: backdropRadius,
										background: gradientCSS,
										boxShadow: shadowCSS,
										filter: `blur(${backdropBlurPx}px)`,
										WebkitMaskImage: `radial-gradient(closest-side, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)`,
										maskImage: `radial-gradient(closest-side, rgba(0,0,0,1) calc(60% - ${backdropMaskFeatherPx}px), rgba(0,0,0,0) 100%)`,
										opacity: gradientOpacity,
									}}
								/>
								{/* Content with padding */}
								<span
									style={{
										position: "relative",
										display: "inline-block",
										padding: `${backdropPadY}px ${backdropPadX}px`,
										borderRadius: backdropRadius,
									}}
								>
									{captionTextResolved}
								</span>
							</span>
						) : (
							captionTextResolved
						)}
					</span>
				</div>
			) : null}
		</div>,
		container
	);
}
