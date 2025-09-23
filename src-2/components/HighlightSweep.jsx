import React from "react";
import { motion } from "framer-motion";

export default function HighlightSweep({
	children,
	play = false,
	color = "#3b82f6", // Tailwind blue-500
	duration = 0.7,
	delay = 0,
	className = "",
}) {
	return (
		<span className={`relative inline-block leading-tight ${className}`}>
			<motion.span
				aria-hidden
				className="
          absolute left-0 top-[55%] h-[0.9em] w-full -translate-y-1/2 rounded-md
          pointer-events-none mix-blend-multiply
        "
				style={{ backgroundColor: color, zIndex: 1 }}
				initial={{ scaleX: 0, opacity: 0, originX: 0 }}
				animate={
					play
						? {
								scaleX: 1,
								opacity: 0.95,
								transition: { duration, delay, ease: "easeOut" },
						  }
						: { scaleX: 0, opacity: 0 }
				}
			/>
			<span className="relative" style={{ zIndex: 2 }}>
				{children}
			</span>
		</span>
	);
}
