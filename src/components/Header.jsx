// src/components/Header.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars } from "@fortawesome/free-solid-svg-icons";
import ActivityDock from "./ActivityDock.jsx";
import ActivitiesModal from "./ActivitiesModal.jsx";

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
	homeLabel = "Home",
	lang = "en",
}) {
	const accentHex = normalizeHex(accent) || "#67AAF9";
	const hover = shadeHex(accentHex, -0.08);
	const active = shadeHex(accentHex, -0.16);

	const [menuOpen, setMenuOpen] = React.useState(false);

	const isFr = lang === "fr";
	const activitiesTitle = isFr ? "Activités" : "Activities";
	const activitiesAriaLabel = isFr ? "Ouvrir les activités" : "Open activities";

	return (
		<div
			ref={containerRef}
			role="banner"
			className="sticky inset-x-0 top-0 z-[80] bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-b border-slate-200 shadow-sm pointer-events-none"
			style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
		>
			<div
				className="
          relative mx-auto w-full max-w-8xl
          px-3 xs:px-4 sm:px-6 md:px-8
          h-[52px] sm:h-[64px] md:h-[72px] lg:h-[88px]
          max-[330px]:h-[48px]
          flex items-center justify-between gap-2 sm:gap-3
          pointer-events-auto"
			>
				<div className="min-w-0">
					{onHome ? (
						<button
							type="button"
							onClick={onHome}
							className="
                block text-left font-semibold text-slate-900 leading-tight tracking-tight truncate
                max-w-[38ch] sm:max-w-[40ch] md:max-w-[42ch] max-[330px]:max-w-[32ch]
                text-[clamp(0.82rem,3.8vw,1.05rem)]
                sm:text-[clamp(0.95rem,2.2vw,1.15rem)]
                md:text-xl lg:text-2xl
                ml-0 md:ml-40
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
							style={{ boxShadow: "0 0 0 0 transparent" }}
							onFocus={(e) =>
								(e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}`)
							}
							onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
							aria-label={homeLabel}
							title={homeLabel}
						>
							{siteTitle}
						</button>
					) : (
						<h1
							className="
                font-semibold text-slate-900 leading-tight tracking-tight truncate
                max-w-[36ch] sm:max-w-[40ch] md:max-w-[42ch] max-[330px]:max-w-[32ch]
                text-[clamp(0.82rem,3.8vw,1.05rem)]
                sm:text-[clamp(0.95rem,2.2vw,1.15rem)]
                md:text-xl lg:text-2xl
                ml-0 md:ml-40"
						>
							{siteTitle}
						</h1>
					)}
				</div>

				<div className="flex items-center gap-2 md:gap-3">
					{onContents && (
						<button
							type="button"
							onClick={onContents}
							className={
								primaryBtnClassOverride
									? "inline-flex items-center justify-center h-9 w-9 min-[380px]:h-10 min-[380px]:w-10 md:h-12 md:w-auto md:px-4 rounded-full text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-sky-600 hover:bg-sky-700 focus:ring-sky-400"
									: "inline-flex items-center justify-center h-9 w-9 min-[380px]:h-10 min-[380px]:w-10 md:h-12 md:w-auto md:px-4 rounded-full text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition max-[330px]:h-8 max-[330px]:w-8"
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
							aria-label={homeLabel}
							title={homeLabel}
						>
							<FontAwesomeIcon
								className="w-4 h-4 min-[380px]:w-5 min-[380px]:h-5 max-[330px]:w-4 max-[330px]:h-4"
								icon={faHouse}
								aria-hidden="true"
							/>
							<span className="hidden md:inline ml-2 font-semibold">
								{homeLabel}
							</span>
						</button>
					)}

					<div className="hidden md:block">
						<ActivityDock
							steps={activitySteps}
							currentPageIndex={currentPageIndex}
							onJump={onJumpToPage}
							contentMaxWidth={1200}
							defaultAccent={accentHex}
							lang={lang}
						/>
					</div>

					<button
						type="button"
						onClick={() => setMenuOpen(true)}
						className="md:hidden inline-flex items-center justify-center h-9 w-9 max-[330px]:h-8 max-[330px]:w-8 rounded-full text-slate-900 bg-white/90 border border-slate-200 shadow-sm hover:shadow-md focus:outline-none"
						style={{ boxShadow: "0 0 0 0 transparent" }}
						onFocus={(e) =>
							(e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}`)
						}
						onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
						aria-haspopup="dialog"
						aria-expanded={menuOpen}
						aria-controls="activities-modal"
						aria-label={activitiesAriaLabel}
						title={activitiesTitle}
					>
						<FontAwesomeIcon
							className="w-4 h-4"
							icon={faBars}
							aria-hidden="true"
						/>
					</button>
				</div>
			</div>

			<ActivitiesModal
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				steps={activitySteps}
				currentPageIndex={currentPageIndex}
				onJump={onJumpToPage}
				title={activitiesTitle}
				accent={accentHex}
			/>
		</div>
	);
}
