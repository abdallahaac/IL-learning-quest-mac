import React from "react";
import ActivityDock from "./ActivityDock.jsx";

/* utils */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const hexToRgb = (hex) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
};
const relLum = ({ r, g, b }) => {
	const f = (c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	};
	const [R, G, B] = [f(r), f(g), f(b)];
	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
const contrastRatio = (hexA, hexB) => {
	const LA = relLum(hexToRgb(hexA));
	const LB = relLum(hexToRgb(hexB));
	const [L1, L2] = LA >= LB ? [LA, LB] : [LB, LA];
	return (L1 + 0.05) / (L2 + 0.05);
};
const shadeHex = (hex, amt) => {
	const { r, g, b } = hexToRgb(hex);
	const t = amt < 0 ? 0 : 255;
	const p = Math.abs(amt);
	const nr = Math.round((t - r) * p + r);
	const ng = Math.round((t - g) * p + g);
	const nb = Math.round((t - b) * p + b);
	const to2 = (n) => n.toString(16).padStart(2, "0");
	return `#${to2(nr)}${to2(ng)}${to2(nb)}`;
};

export default function Footer({
	pageIndex = 0,
	totalPages = 1,
	onPrev,
	onNext,
	nextLabel = "Next",
	activitySteps = [],
	onJumpToPage,
	containerRef,
	accent = "#67AAF9", // default accent
	accentOverride = null, // kept for compatibility
	nextBtnClassOverride = null, // optional Tailwind override for Next
}) {
	const isFirst = pageIndex === 0;
	const isLast = pageIndex === totalPages - 1;

	const baseAccent =
		normalizeHex(accentOverride) || normalizeHex(accent) || "#67AAF9";
	const hover = shadeHex(baseAccent, -0.08);
	const active = shadeHex(baseAccent, -0.16);

	// Always white text inside footer buttons per request
	const textOnAccent = "#FFFFFF";

	return (
		<footer
			ref={containerRef}
			className="sticky bottom-0 left-0 w-full z-50 bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-t border-gray-200 shadow-sm pointer-events-none"
			role="contentinfo"
		>
			<div className="relative max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:justify-between pointer-events-auto">
				{/* (Keeping this non-button text as-is for contrast) */}
				<span className="text-sm text-gray-600">
					Page {pageIndex + 1} / {totalPages}
				</span>

				<div className="flex-1" />

				<div className="flex gap-2">
					<button
						type="button"
						className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={onPrev}
						disabled={isFirst}
					>
						Back
					</button>

					{/* Next — respects override on Cover/TOC; otherwise uses accent with white text */}
					<button
						type="button"
						className={
							nextBtnClassOverride
								? nextBtnClassOverride
								: "px-5 py-2 rounded-lg font-medium shadow-sm focus:outline-none transition text-white"
						}
						style={
							nextBtnClassOverride
								? undefined
								: {
										backgroundColor: baseAccent,
										color: "#FFFFFF",
										border: "1px solid transparent",
								  }
						}
						onMouseEnter={(e) => {
							if (!nextBtnClassOverride)
								e.currentTarget.style.backgroundColor = hover;
						}}
						onMouseLeave={(e) => {
							if (!nextBtnClassOverride)
								e.currentTarget.style.backgroundColor = baseAccent;
						}}
						onMouseDown={(e) => {
							if (!nextBtnClassOverride)
								e.currentTarget.style.backgroundColor = active;
						}}
						onMouseUp={(e) => {
							if (!nextBtnClassOverride)
								e.currentTarget.style.backgroundColor = hover;
						}}
						onClick={onNext}
						aria-label={isLast ? "Finish" : nextLabel}
						title={isLast ? "Finish" : nextLabel}
					>
						{isLast ? "Finish" : nextLabel}
					</button>
				</div>
			</div>
		</footer>
	);
}
