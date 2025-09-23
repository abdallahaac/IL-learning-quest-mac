// src/components/TopEdgeProgress.jsx
import React from "react";

export default function TopEdgeProgress({ progress = 0 }) {
	const clamped = Math.max(0, Math.min(1, progress));
	return (
		<div aria-hidden className="sticky top-[64px] sm:top-[72px] z-40">
			<div className="h-[2px] w-full bg-transparent">
				<div
					className="h-[2px] bg-sky-500/70 transition-[width] duration-300"
					style={{ width: `${clamped * 100}%` }}
				/>
			</div>
		</div>
	);
}
