import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * One persistent background layer that never fades.
 * On pageIndex change:
 *  - kicks a short transform burst (rotate/translate/scale),
 *  - swaps the CSS pattern mid-burst (no opacity),
 *  - settles back to neutral transform.
 *
 * Props:
 *   pageIndex: number (drives animation & pattern sequence)
 *   patterns?: string[] (keys: "dots" | "lines" | "plus" | "grid" | "asterisks" if you add it)
 */
export default function PatternMatrix({
	pageIndex = 0,
	patterns = ["dots", "lines", "plus", "grid"],
}) {
	const PATTERN_CLASS = useMemo(
		() => ({
			dots: "bg-dots",
			lines: "bg-lines",
			plus: "bg-plus",
			grid: "bg-grid",
			// asterisks: "bg-asterisks", // add the utility if you want this one too
		}),
		[]
	);

	// pick base/current pattern from pageIndex (start with dots on first page)
	const targetKey = patterns[pageIndex % patterns.length];
	const [activeKey, setActiveKey] = useState(targetKey);

	// animation controller for the transform-only motion
	const controls = useAnimationControls();
	const stepTimer = useRef(null);

	useEffect(() => {
		// if the pattern doesn’t change (same page bucket), still give a small wiggle
		const nextKey = targetKey;
		const direction = pageIndex % 2 === 0 ? 1 : -1;

		// Phase A: quick kick
		controls.start({
			rotate: 14 * direction,
			x: 24 * direction,
			y: -14 * direction,
			scale: 1.04,
			transition: { type: "spring", stiffness: 180, damping: 20, mass: 0.6 },
		});

		// Mid-swap (no fade): change the background class while things are moving
		clearTimeout(stepTimer.current);
		stepTimer.current = setTimeout(() => {
			setActiveKey(nextKey);
		}, 140); // ~1/3 into the burst feels good

		// Phase B: settle back
		controls.start({
			rotate: 0,
			x: 0,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 120,
				damping: 18,
				mass: 0.8,
				delay: 0.18,
			},
		});

		return () => clearTimeout(stepTimer.current);
	}, [pageIndex, targetKey, controls]);

	// current CSS class for the active pattern
	const patternClass = PATTERN_CLASS[activeKey] || "bg-dots";

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			{/* Outer shell gets the transform; we never touch opacity */}
			<motion.div
				className="absolute inset-0"
				animate={controls}
				style={
					{
						// If you *really* want a raw matrix, uncomment and compute it yourself:
						// transform: 'matrix(a, b, c, d, e, f)'
					}
				}
			>
				{/* The actual pattern layer */}
				<div
					className={`absolute inset-0 ${patternClass}`}
					style={{
						backgroundColor: "transparent",
						willChange: "transform",
					}}
				/>
			</motion.div>
		</div>
	);
}
