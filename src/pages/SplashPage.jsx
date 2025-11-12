// src/pages/SplashPage.jsx
import React, { useEffect } from "react";
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

	return (
		<div className="fixed inset-0">
			<SplashCSSIntro
				logos={[
					{ el: CspsLogo, height: 304 },
					{ el: ParcsCanadaLogo, height: 220 },
				]}
				bg="#4b3a69"
				dotGap={PATTERN_CELL_PX} // spacing must match PatternMorph.cellPx
				dotSize={4} // 4 CSS px diameter to match canvas 2px radius
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
