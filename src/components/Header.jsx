import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import ActivityDock from "./ActivityDock.jsx";

/* --- tiny color utils (accessible button coloring) --- */
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

export default function Header({
	siteTitle = "Learning Quest on Indigenous Cultures",
	onHome,
	onContents,
	containerRef,
	activitySteps = [],
	currentPageIndex = 0,
	onJumpToPage,
	accent = "#67AAF9", // ← passed from AppShell (current activity accent)
}) {
	const accentHex = normalizeHex(accent) || "#67AAF9";
	const hover = shadeHex(accentHex, -0.08);
	const active = shadeHex(accentHex, -0.16);
	const textOnAccent =
		contrastRatio(accentHex, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#0B1220";

	return (
		<div
			ref={containerRef}
			role="banner"
			className="
        fixed inset-x-0 top-0 z-[80]
        bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur
        border-b border-slate-200 shadow-sm
      "
			style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
		>
			<div
				className="
          relative max-w-8xl mx-auto w-full
          px-10 sm:px-11 py-4
          min-h-[120px]
          grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]
          items-center gap-y-3
        "
			>
				{/* Left: Title */}
				<div className="min-w-0 ml-20">
					{onHome ? (
						<button
							type="button"
							onClick={onHome}
							className="block text-left text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-snug tracking-tight max-w-[36ch] line-clamp-2 focus:outline-none focus-visible:ring-2"
							style={{ boxShadow: `0 0 0 0 transparent` }}
							onFocus={(e) =>
								(e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}`)
							}
							onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
							aria-label="Go to home"
							title="Home"
						>
							{siteTitle}
						</button>
					) : (
						<h1 className="text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-snug tracking-tight max-w-[36ch] line-clamp-2">
							{siteTitle}
						</h1>
					)}
				</div>

				{/* Right cluster */}
				<div className="justify-self-end w-full max-w-[460px]">
					<div className="flex items-center justify-between gap-3">
						{/* Contents button — accent-themed */}
						{onContents && (
							<button
								type="button"
								onClick={onContents}
								className="inline-flex text-white items-center gap-2 rounded-full px-4 md:px-5 py-3.5 text-sm md:text-base font-medium shadow-md hover:shadow-lg focus:outline-none transition"
								style={{
									backgroundColor: accentHex,
									color: "white",
									border: "1px solid transparent",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.backgroundColor = hover)
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.backgroundColor = accentHex)
								}
								onMouseDown={(e) =>
									(e.currentTarget.style.backgroundColor = active)
								}
								onMouseUp={(e) =>
									(e.currentTarget.style.backgroundColor = hover)
								}
								onFocus={(e) =>
									(e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}`)
								}
								onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
								aria-label="Go to Table of Contents"
								title="Table of Contents"
							>
								<FontAwesomeIcon
									className="w-5 h-5"
									icon={faTableColumns}
									aria-hidden="true"
								/>
								<span className="hidden sm:inline text-center">Home</span>
								<span className="sm:hidden">TOC</span>
							</button>
						)}

						{/* Activity menu (uses same accent for focus ring defaults) */}
						<ActivityDock
							steps={activitySteps}
							currentPageIndex={currentPageIndex}
							onJump={onJumpToPage}
							contentMaxWidth={1200}
							defaultAccent={accentHex} // keep visuals consistent
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
