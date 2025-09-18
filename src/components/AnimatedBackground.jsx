// src/components/AnimatedBackground.jsx
import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Full-screen SVG pattern layer that sits behind the app.
 * Cross-fades between variants on key change.
 *
 * patternKey: "dots" | "asterisks" | "lines" | "grid"
 */
export default function AnimatedBackground({ patternKey = "dots" }) {
	const reduceMotion = useReducedMotion();

	const variants = {
		initial: { opacity: 0 },
		enter: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 z-0"
			// keep this layer behind everything
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={patternKey}
					className="absolute inset-0"
					initial="initial"
					animate="enter"
					exit="exit"
					transition={
						reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }
					}
					variants={variants}
				>
					<PatternSVG variant={patternKey} />
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

/** Render one tiled SVG pattern that fills the screen. */
function PatternSVG({ variant = "dots" }) {
	const commonStroke = "rgba(0,0,0,0.08)"; // subtle ink color
	const commonFill = "rgba(0,0,0,0.05)";

	// pattern tile sizes (in px)
	const S = {
		dots: 28,
		asterisks: 48,
		lines: 44,
		grid: 40,
	};

	return (
		<svg
			className="w-full h-full"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
		>
			<defs>
				{/* DOTS */}
				<pattern
					id="p-dots"
					width={S.dots}
					height={S.dots}
					patternUnits="userSpaceOnUse"
				>
					<circle cx={S.dots / 2} cy={S.dots / 2} r="1.1" fill={commonFill} />
				</pattern>

				{/* ASTERISKS (little star/plus with angled arms) */}
				<pattern
					id="p-asterisks"
					width={S.asterisks}
					height={S.asterisks}
					patternUnits="userSpaceOnUse"
				>
					<g stroke={commonStroke} strokeWidth="1">
						{/* plus */}
						<line
							x1={S.asterisks / 2}
							y1="6"
							x2={S.asterisks / 2}
							y2={S.asterisks - 6}
						/>
						<line
							x1="6"
							y1={S.asterisks / 2}
							x2={S.asterisks - 6}
							y2={S.asterisks / 2}
						/>
						{/* diagonals */}
						<line x1="10" y1="10" x2={S.asterisks - 10} y2={S.asterisks - 10} />
						<line x1={S.asterisks - 10} y1="10" x2="10" y2={S.asterisks - 10} />
					</g>
				</pattern>

				{/* LINES (horizontal) */}
				<pattern
					id="p-lines"
					width={S.lines}
					height={S.lines}
					patternUnits="userSpaceOnUse"
				>
					<line
						x1="0"
						y1={S.lines - 1}
						x2={S.lines}
						y2={S.lines - 1}
						stroke={commonStroke}
						strokeWidth="1"
					/>
				</pattern>

				{/* GRID (thin crosshatch) */}
				<pattern
					id="p-grid"
					width={S.grid}
					height={S.grid}
					patternUnits="userSpaceOnUse"
				>
					<path
						d={`M 0 ${S.grid - 1} L ${S.grid} ${S.grid - 1} M ${
							S.grid - 1
						} 0 L ${S.grid - 1} ${S.grid}`}
						stroke={commonStroke}
						strokeWidth="1"
					/>
				</pattern>
			</defs>

			<rect
				x="0"
				y="0"
				width="100%"
				height="100%"
				fill={`url(#${
					variant === "asterisks"
						? "p-asterisks"
						: variant === "lines"
						? "p-lines"
						: variant === "grid"
						? "p-grid"
						: "p-dots"
				})`}
			/>
		</svg>
	);
}
