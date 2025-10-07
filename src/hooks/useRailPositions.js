import { useLayoutEffect, useRef, useState } from "react";
import { SVG_PATH_D } from "../constants/content.js";

/**
 * Computes node positions (x,y,deg,t) along the SVG path for N evenly spaced items.
 */
export function useRailPositions(itemsLength) {
	const railRef = useRef(null);
	const measurePathRef = useRef(null);
	const [nodePos, setNodePos] = useState([]);
	const [pathLen, setPathLen] = useState(0);

	useLayoutEffect(() => {
		const svg = railRef.current;
		const measure = measurePathRef.current;
		if (!svg || !measure) return;

		const place = () => {
			const len = measure.getTotalLength?.() ?? 0;
			setPathLen(len);
			const n = itemsLength;
			const pos = Array.from({ length: n }).map((_, i) => {
				const t = 0.08 + (i * 0.84) / Math.max(1, n - 1);
				const p = measure.getPointAtLength(len * t);
				const p2 = measure.getPointAtLength(Math.min(len, len * t + 1));
				const deg = Math.atan2(p2.y - p.y, p2.x - p.x) * (180 / Math.PI);
				return { x: p.x, y: p.y, deg, t };
			});
			setNodePos(pos);
		};

		place();
		let ro;
		if (typeof window !== "undefined" && "ResizeObserver" in window) {
			ro = new ResizeObserver(place);
			ro.observe(svg);
		} else {
			window.addEventListener("resize", place);
		}
		return () => {
			ro?.disconnect?.();
			window.removeEventListener?.("resize", place);
		};
	}, [itemsLength]);

	return { railRef, measurePathRef, nodePos, pathLen, d: SVG_PATH_D };
}
