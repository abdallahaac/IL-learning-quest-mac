import { useMemo, useRef, useLayoutEffect } from "react";

/**
 * Returns gated progress values for the animated rail, and remembers previous offset
 * for smooth animation.
 */
export function useGatedProgress({
	prefersReduced,
	progress,
	prefillStart,
	items,
	activitiesVisitedCount,
	activitiesTotal,
}) {
	const pre = Math.max(0, Math.min(0.3, prefillStart));
	const clamped = Math.max(0, Math.min(1, progress));
	const adjusted = pre + (1 - pre) * clamped;

	// Gate at "Activities"
	const activitiesItemIdx = items.findIndex((it) => it.label === "Activities");
	const activitiesT =
		activitiesItemIdx >= 0
			? 0.08 + (activitiesItemIdx * 0.84) / Math.max(1, items.length - 1)
			: 1;

	const activitiesComplete = activitiesVisitedCount >= activitiesTotal;
	const gatedAdjusted = activitiesComplete
		? adjusted
		: Math.min(adjusted, activitiesT);
	const gatedClamped = activitiesComplete
		? clamped
		: Math.min(clamped, activitiesT);

	const prevProgOffsetRef = useRef(null);
	useLayoutEffect(() => {
		if (prevProgOffsetRef.current == null) prevProgOffsetRef.current = 1;
	}, []);
	useLayoutEffect(() => {
		prevProgOffsetRef.current =
			1 - (prefersReduced ? gatedClamped : gatedAdjusted);
	}, [gatedAdjusted, gatedClamped, prefersReduced]);

	return { gatedAdjusted, gatedClamped, prevProgOffsetRef };
}
