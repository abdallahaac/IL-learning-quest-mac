// src/components/PatternRotator.jsx
import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Cross-fading Tailwind background pattern layer.
 * Place it as the first child in your shell (behind everything).
 *
 * patternKey: "dots" | "asterisks" | "lines" | "plus"
 */
export default function PatternRotator({ patternKey = "dots" }) {
	const reduce = useReducedMotion();

	const classFor = (k) => {
		switch (k) {
			case "asterisks":
				return "bg-asterisks";
			case "lines":
				return "bg-lines";
			case "plus":
				return "bg-plus";
			case "dots":
			default:
				return "bg-dots";
		}
	};

	return (
		<div className="pointer-events-none fixed inset-0 -z-10">
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={patternKey}
					className={`absolute inset-0 ${classFor(patternKey)} bg-gray-50`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={
						reduce ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }
					}
				/>
			</AnimatePresence>
		</div>
	);
}
