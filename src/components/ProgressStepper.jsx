import React, { useMemo } from "react";

const SIZE = {
	xs: { dot: "w-5 h-5 text-[10px]", segW: "w-4", segH: "h-px" },
	sm: { dot: "w-6 h-6 text-[11px]", segW: "w-5", segH: "h-[2px]" },
	md: { dot: "w-7 h-7 text-xs", segW: "w-6", segH: "h-[3px]" },
	lg: { dot: "w-8 h-8 text-sm", segW: "w-8", segH: "h-[3px]" },
};

export default function ProgressStepper({
	total = 0,
	currentIndex = -1,
	activityIds = [],
	completedMap = {},
	onJump,
	size = "xs",
}) {
	if (total <= 0) return null;
	const s = SIZE[size] ?? SIZE.xs;

	// Longest contiguous prefix
	const prefixDone = useMemo(() => {
		let k = 0;
		for (; k < total; k++) {
			const id = activityIds[k];
			if (!id || !completedMap[id]) break;
		}
		return k;
	}, [total, activityIds, completedMap]);

	return (
		<div
			className="inline-flex items-center gap-1"
			role="group"
			aria-label="Activity progress"
		>
			{Array.from({ length: total }).map((_, i) => {
				const id = activityIds[i];
				const isDone = !!completedMap[id];
				const isCurrent = i === currentIndex;

				const btnBase = `inline-flex items-center justify-center rounded-full font-semibold transition
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${s.dot}`;

				const btnStyle = isDone
					? "bg-sky-500 text-white hover:bg-sky-600"
					: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50";

				const ring = isCurrent ? " ring-2 ring-sky-500" : "";

				const segFilled = i < prefixDone - 1;
				const segBase = `rounded ${s.segH} ${s.segW} transition-colors`;
				const segStyle = segFilled ? "bg-sky-500" : "bg-slate-300";

				return (
					<React.Fragment key={i}>
						<button
							type="button"
							className={`${btnBase} ${btnStyle}${ring}`}
							aria-label={`Activity ${i + 1}`}
							aria-current={isCurrent ? "step" : undefined}
							onClick={() => onJump?.(i)}
						>
							{i + 1}
						</button>

						{i < total - 1 && (
							<span aria-hidden className={`${segBase} ${segStyle}`} />
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
}
