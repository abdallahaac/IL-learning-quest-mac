import React, { useMemo, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";

export default function PortalPresence({ show, onExitComplete, children }) {
	const el = useMemo(() => {
		const d = document.createElement("div");
		d.setAttribute("id", "intro-overlay-root");
		return d;
	}, []);

	useLayoutEffect(() => {
		document.body.appendChild(el);
		return () => {
			document.body.removeChild(el);
		};
	}, [el]);

	return createPortal(
		<AnimatePresence
			initial={false}
			mode="wait"
			onExitComplete={onExitComplete}
		>
			{show ? children : null}
		</AnimatePresence>,
		el
	);
}
