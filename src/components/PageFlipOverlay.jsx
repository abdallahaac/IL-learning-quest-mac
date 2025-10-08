import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Fullscreen, pointer-events:none overlay that plays a quick page flip.
 * - direction: "next" (flip from right) | "prev" (flip from left)
 * - Shows for `duration` ms whenever `flipKey` changes.
 */
export default function PageFlipOverlay({
	flipKey, // change this to trigger the animation (e.g., pageIndex)
	direction = "next", // "next" | "prev"
	duration = 700, // ms
	paper = "#ffffff", // paper color
	shadow = "rgba(2,6,23,0.30)", // cast shadow color
}) {
	const [show, setShow] = React.useState(false);
	const reduceMotion = useReducedMotion();

	React.useEffect(() => {
		if (reduceMotion) return; // honor OS reduce-motion
		setShow(true);
		const t = setTimeout(() => setShow(false), duration);
		return () => clearTimeout(t);
	}, [flipKey, duration, reduceMotion]);

	if (reduceMotion || !show) return null;

	const origin = direction === "prev" ? "left center" : "right center";
	const start = 0;
	const end = direction === "prev" ? 180 : -180;

	return (
		<div
			aria-hidden
			className="fixed inset-0 z-[60] pointer-events-none"
			style={{ perspective: 1400 }}
		>
			<motion.div
				initial={{ rotateY: start, opacity: 1 }}
				animate={{ rotateY: end, opacity: 1 }}
				transition={{ duration: duration / 1000, ease: [0.2, 0.6, 0.2, 1] }}
				style={{
					transformOrigin: origin,
					willChange: "transform",
					height: "100%",
				}}
			>
				{/* “Paper” face with subtle shading */}
				<div
					className="h-full w-full"
					style={{
						background: `linear-gradient(
              to ${direction === "prev" ? "right" : "left"},
              rgba(0,0,0,0.05) 0%,
              ${paper} 14%,
              ${paper} 86%,
              rgba(0,0,0,0.05) 100%
            )`,
						boxShadow:
							direction === "prev"
								? `6px 0 40px -8px ${shadow}`
								: `-6px 0 40px -8px ${shadow}`,
						borderLeft:
							direction === "prev" ? "1px solid rgba(0,0,0,0.06)" : "none",
						borderRight:
							direction === "prev" ? "none" : "1px solid rgba(0,0,0,0.06)",
					}}
				/>
			</motion.div>
		</div>
	);
}
