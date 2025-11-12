// src/pages/SplashPage.jsx
import React, { useEffect, useMemo } from "react";
import SplashCSSIntro from "../components/SplashCSSIntro.jsx";
import CspsLogo from "../components/logos/cspslogo.jsx";
import ParcsCanadaLogo from "../components/logos/parcsCanadaLogo.jsx";
import { PATTERN_CELL_PX } from "../constants/pattern.js";

export default function SplashPage({ onDone }) {
	useEffect(() => {
		try {
			document.body.style.backgroundColor = "#4b3a69";
			document.documentElement.style.backgroundColor = "#4b3a69";
		} catch {}
		return () => {
			try {
				document.body.style.backgroundColor = "#ffffff";
				document.documentElement.style.backgroundColor = "#ffffff";
			} catch {}
		};
	}, []);

	const handleWillEnd = () => {
		try {
			document.body.style.backgroundColor = "#ffffff";
			document.documentElement.style.backgroundColor = "#ffffff";
		} catch {}
	};

	// Match PatternMorph’s dots:
	// PatternMorph dot radius ≈ 2 * dpr  → diameter ≈ 4 * dpr (in CSS px)
	const dotSize = useMemo(() => {
		if (typeof window === "undefined") return 4; // SSR fallback
		const dpr = Math.max(1, window.devicePixelRatio || 1);
		return Math.round(4 * dpr);
	}, []);

	return (
		<div className="fixed inset-0">
			<SplashCSSIntro
				logos={[
					{ el: CspsLogo, height: 304 },
					{ el: ParcsCanadaLogo, height: 220 },
				]}
				bg="#4b3a69"
				// Keep spacing identical to PatternMorph
				dotGap={PATTERN_CELL_PX}
				// Keep dot diameter visually identical to PatternMorph’s dots
				dotSize={dotSize}
				// Optional: nudge color alpha to match canvas ink
				// (PatternMorph ink default is rgba(0,0,0,0.10); yours is white dots on purple bg.)
				dotColor="rgba(255,255,255,0.08)"
				timing={{
					HOLD_AFTER_CAPTION_MS: 3600,
					FADE_OUT_MS: 700,
					LEAD_BG_SWITCH_MS: 100,
				}}
				onWillEnd={handleWillEnd}
				onDone={onDone}
			/>
		</div>
	);
}
