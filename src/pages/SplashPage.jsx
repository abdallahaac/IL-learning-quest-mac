// src/pages/SplashPage.jsx
import React, { useEffect } from "react";
import SplashCSSIntro from "../components/SplashCSSIntro.jsx";
import CspsLogo from "../components/logos/cspslogo.jsx";
import ParcsCanadaLogo from "../components/logos/parcsCanadaLogo.jsx";

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
					{ el: CspsLogo, height: 204 },
					{ el: ParcsCanadaLogo, height: 150 },
				]}
				bg="#4b3a69"
				dotColor="rgba(255,255,255,0.28)"
				dotSize={4}
				dotGap={24}
				durationMs={2600}
				fadeOutMs={700}
				leadBgSwitchMs={100}
				onWillEnd={handleWillEnd}
				onDone={onDone}
			/>
		</div>
	);
}
