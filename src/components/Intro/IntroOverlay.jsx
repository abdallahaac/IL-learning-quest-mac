import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import PortalPresence from "../PortalPresence";
import WriteHighlightIntro from "./WriteHighlightIntro";

export default function IntroOverlay({ onGate, onExitComplete, options = {} }) {
	const reduceMotion = useReducedMotion();

	const [visible, setVisible] = useState(!reduceMotion);
	useEffect(() => {
		if (reduceMotion) setVisible(false);
	}, [reduceMotion]);

	const handleGate = () => {
		onGate?.(); // mount content
		setVisible(false); // begin fade-out (AnimatePresence exit)
	};

	if (reduceMotion) return null;

	return (
		<PortalPresence show={visible} onExitComplete={onExitComplete}>
			<WriteHighlightIntro onContentGate={handleGate} options={options} />
		</PortalPresence>
	);
}
