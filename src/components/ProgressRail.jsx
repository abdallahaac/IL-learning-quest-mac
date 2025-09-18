// src/components/ProgressRail.jsx
import React, { useMemo } from "react";

export default function ProgressRail({
	total = 0,
	currentIndex = -1,
	activityIds = [],
	completedMap = {},
	onJump,
}) {
	if (total <= 0) return null;

	const completedCount = useMemo(
		() => activityIds.reduce((n, id) => n + (completedMap[id] ? 1 : 0), 0),
		[activityIds, completedMap]
	);

	return (
		<>
			{/* Desktop/Tablet: fixed right-side rail */}
			<nav
				aria-label="Activity progress"
				className="hidden md:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40
                   flex-col items-center gap-2 select-none"
			>
				{/* Track */}
				<div className="relative flex flex-col items-center">
					{/* Line */}
					<span
						aria-hidden
						className="absolute top-0 bottom-0 w-px bg-slate-200"
						style={{ left: "50%" }}
					/>
					{/* Dots */}
					<ul className="relative flex flex-col items-center gap-3">
						{Array.from({ length: total }).map((_, i) => {
							const id = activityIds[i];
							const isDone = !!completedMap[id];
							const isCurrent = i === currentIndex;
							return (
								<li key={i}>
									<button
										type="button"
										onClick={() => onJump?.(i)}
										aria-current={isCurrent ? "step" : undefined}
										aria-label={`Activity ${i + 1}${
											isDone ? " (completed)" : ""
										}`}
										className={[
											"w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
											"border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
											isCurrent
												? "bg-sky-600 text-white border-sky-600 shadow"
												: isDone
												? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600"
												: "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
										].join(" ")}
									>
										{i + 1}
									</button>
								</li>
							);
						})}
					</ul>
				</div>

				{/* Small percent chip */}
				<div
					className="mt-3 text-[11px] px-2 py-1 rounded-full bg-slate-900 text-white/90"
					aria-hidden
				>
					{Math.round((completedCount / Math.max(total, 1)) * 100)}%
				</div>
			</nav>
		</>
	);
}
