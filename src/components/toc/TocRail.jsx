import React from "react";
import { motion } from "framer-motion";
import { TOC_ANIM } from "../../constants/content.js";

export default function TocRail({
	d, // SVG path "d"
	prevProgOffsetRef,
	prefersReduced,
	gatedClamped,
	gatedAdjusted,
}) {
	const baseInit = 1;
	const baseTarget = 0;

	return (
		<>
			<defs aria-hidden="true">
				<linearGradient
					id="railProgress"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="0%"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#25A1F4" />
					<stop offset="50%" stopColor="#4265F0" />
					<stop offset="100%" stopColor="#8951EC" />
				</linearGradient>
				<filter id="softDrop" x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.14" />
				</filter>
			</defs>

			{/* base rail */}
			<motion.path
				d={d}
				pathLength="1"
				fill="none"
				stroke="hsl(220 25% 72%)"
				strokeWidth="10"
				strokeLinecap="round"
				filter="url(#softDrop)"
				vectorEffect="non-scaling-stroke"
				style={{ strokeDasharray: "1 1" }}
				initial={{ strokeDashoffset: baseInit }}
				animate={{ strokeDashoffset: baseTarget }}
				transition={{
					duration: TOC_ANIM.baseDuration,
					ease: "easeInOut",
					delay: TOC_ANIM.baseDelay,
				}}
			/>

			{/* progress rail */}
			<motion.path
				d={d}
				pathLength="1"
				fill="none"
				stroke="url(#railProgress)"
				strokeWidth="14"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				style={{
					strokeDasharray: "1 1",
					filter: "drop-shadow(0 2px 6px rgba(59,130,246,0.35))",
					pointerEvents: "none",
				}}
				initial={{
					strokeDashoffset: prevProgOffsetRef.current ?? 1,
					opacity: 1,
				}}
				animate={{
					strokeDashoffset: 1 - (prefersReduced ? gatedClamped : gatedAdjusted),
					opacity: 1,
				}}
				transition={{
					duration: TOC_ANIM.progDuration,
					ease: "easeInOut",
					delay: TOC_ANIM.progDelay,
				}}
			/>
		</>
	);
}
