// src/components/MobileActivityBar.jsx
import React, { useMemo } from "react";

export default function MobileActivityBar({
	total = 0,
	activityIds = [],
	completedMap = {},
}) {
	if (total <= 0) return null;

	const completedCount = useMemo(
		() => activityIds.reduce((n, id) => n + (completedMap[id] ? 1 : 0), 0),
		[activityIds, completedMap]
	);
	const pct = Math.round((completedCount / Math.max(total, 1)) * 100);

	return (
		<div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-4">
			<div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white/90 backdrop-blur p-3 shadow-sm">
				<div className="flex items-center justify-between text-xs mb-1">
					<span className="font-medium text-slate-700">Activities</span>
					<span className="text-slate-600">
						{completedCount}/{total} ({pct}%)
					</span>
				</div>
				<div className="h-1.5 w-full bg-slate-200 rounded">
					<div
						className="h-1.5 rounded bg-sky-500 transition-[width] duration-300"
						style={{ width: `${pct}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
