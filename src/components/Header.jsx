import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns, faHouse } from "@fortawesome/free-solid-svg-icons";

import ActivityDock from "./ActivityDock.jsx";

/* --- tiny color utils (for hover/active shades) --- */
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

export default function Header({
	siteTitle = "Learning Quest on Indigenous Cultures",
	onHome,
	onContents,
	containerRef,
	activitySteps = [],
	currentPageIndex = 0,
	onJumpToPage,
	accent = "#67AAF9",
	primaryBtnClassOverride = null,
}) {
	const accentHex = normalizeHex(accent) || "#67AAF9";
	const hover = shadeHex(accentHex, -0.08);
	const active = shadeHex(accentHex, -0.16);

	return (
		<div
			ref={containerRef}
			role="banner"
			className="sticky inset-x-0 top-0 z-[80] bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-b border-slate-200 shadow-sm pointer-events-none"
			style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
		>
			<div
				className="
          relative max-w-8xl mx-auto w-full
          px-6 sm:px-8
          h-[88px]
          grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]
          items-center
          pointer-events-auto"
			>
				{/* Left: Title — clamp to single line so it can't grow the header */}
				<div className="min-w-0 ml-20">
					{onHome ? (
						<button
							type="button"
							onClick={onHome}
							className="block text-left text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-tight tracking-tight max-w-[36ch] line-clamp-1 focus:outline-none focus-visible:ring-2"
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
						<h1 className="text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-tight tracking-tight max-w-[36ch] line-clamp-1">
							{siteTitle}
						</h1>
					)}
				</div>

				{/* Right cluster */}
				<div className="justify-self-end w-full max-w-[460px]">
					<div className="flex items-center justify-between gap-3">
						{/* Home / TOC pill — consistent sizing & shape */}
						{onContents && (
							<button
								type="button"
								onClick={onContents}
								className={
									primaryBtnClassOverride
										? `inline-flex items-center gap-2 h-11 md:h-12 px-4 md:px-5 rounded-full text-sm md:text-base font-medium text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-sky-600 hover:bg-sky-700 focus:ring-sky-400`
										: `inline-flex items-center gap-2 h-11 md:h-12 px-4 md:px-5 rounded-full text-sm md:text-base font-medium text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition`
								}
								style={
									primaryBtnClassOverride
										? undefined
										: {
												backgroundColor: accentHex,
												color: "#FFFFFF",
												border: "1px solid transparent",
										  }
								}
								onMouseEnter={(e) => {
									if (!primaryBtnClassOverride)
										e.currentTarget.style.backgroundColor = hover;
								}}
								onMouseLeave={(e) => {
									if (!primaryBtnClassOverride)
										e.currentTarget.style.backgroundColor = accentHex;
								}}
								onMouseDown={(e) => {
									if (!primaryBtnClassOverride)
										e.currentTarget.style.backgroundColor = active;
								}}
								onMouseUp={(e) => {
									if (!primaryBtnClassOverride)
										e.currentTarget.style.backgroundColor = hover;
								}}
								onFocus={(e) =>
									(e.currentTarget.style.boxShadow = primaryBtnClassOverride
										? ""
										: `0 0 0 2px ${accentHex}`)
								}
								onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
								aria-label="Go to Table of Contents"
								title="Table of Contents"
							>
								<FontAwesomeIcon
									className="w-5 h-5"
									icon={faHouse}
									aria-hidden="true"
								/>
								<span className="hidden sm:inline text-center">Home</span>
								<span className="sm:hidden">TOC</span>
							</button>
						)}

						{/* Activity menu */}
						<ActivityDock
							steps={activitySteps}
							currentPageIndex={currentPageIndex}
							onJump={onJumpToPage}
							contentMaxWidth={1200}
							defaultAccent={accentHex}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
