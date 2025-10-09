// src/components/ScribbleUnderline.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * ScribbleUnderline
 * Draws a hand-drawn, marker-style underline under the element referenced by `anchorRef`.
 *
 * Props:
 * - anchorRef: React ref to the text element to underline
 * - color: hex/rgb string for the marker color
 * - thickness: base stroke width in CSS px (default 8)
 * - jitter: wobble intensity in px (default 6)
 * - inset: vertical offset from the element’s bottom (default 6)
 * - duration: animation time in seconds (default 0.9)
 * - delay: start delay in seconds (default 0.1)
 */
export default function ScribbleUnderline({
	anchorRef,
	color = "#ffbe3c",
	thickness = 8,
	jitter = 6,
	inset = 6,
	duration = 0.9,
	delay = 0.1,
}) {
	const svgRef = useRef(null);
	const [dims, setDims] = useState({ w: 0, h: 0 });
	const [seed, setSeed] = useState(0);
	const reduceMotion = useReducedMotion();

	// Measure the anchor width; re-render on resize
	useLayoutEffect(() => {
		const el = anchorRef?.current;
		if (!el) return;

		const update = () => {
			const r = el.getBoundingClientRect();
			// small padding so the stroke caps don't clip
			setDims({
				w: Math.max(0, Math.ceil(r.width)),
				h: Math.max(20, thickness * 3),
			});
			// change seed so the scribble looks a tiny bit different when width changes
			setSeed((s) => (s + 1) % 10000);
		};
		update();

		const ro = new ResizeObserver(update);
		ro.observe(el);
		window.addEventListener("resize", update);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", update);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [anchorRef, thickness]);

	if (dims.w <= 0) return null;

	const { w, h } = dims;
	const pathD = makeScribblePath(w, h, jitter, seed);
	const pathD2 = makeScribblePath(w, h, jitter * 0.75, seed + 17); // second pass

	// animation config
	const anim = reduceMotion
		? {}
		: {
				initial: { pathLength: 0 },
				animate: {
					pathLength: 1,
					transition: { duration, delay, ease: "easeInOut" },
				},
		  };

	return (
		<div
			aria-hidden
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				top: `calc(100% + ${inset}px)`,
				pointerEvents: "none",
				// keeps the underline aligned with the text width only
				width: w,
				height: h,
			}}
		>
			<svg
				ref={svgRef}
				width={w}
				height={h}
				viewBox={`0 0 ${w} ${h}`}
				fill="none"
				style={{
					display: "block",
					overflow: "visible",
					mixBlendMode: "multiply",
				}}
			>
				{/* subtle paper-bleed blur for a marker feel */}
				<defs>
					<filter
						id="marker-bleed"
						x="-20%"
						y="-50%"
						width="140%"
						height="200%"
					>
						<feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
					</filter>
				</defs>

				{/* pass 1: thicker, semi-opaque */}
				<motion.path
					d={pathD}
					stroke={color}
					strokeOpacity={0.45}
					strokeWidth={thickness}
					strokeLinecap="round"
					strokeLinejoin="round"
					filter="url(#marker-bleed)"
					{...anim}
				/>

				{/* pass 2: slightly thinner and offset for a scribbly double-stroke */}
				<motion.path
					d={pathD2}
					stroke={color}
					strokeOpacity={0.7}
					strokeWidth={Math.max(1, thickness * 0.7)}
					strokeLinecap="round"
					strokeLinejoin="round"
					{...anim}
				/>
			</svg>
		</div>
	);
}

/* ------- helper: build a wobbly underline path ------- */
function makeScribblePath(w, h, jitter = 6, seed = 0) {
	// baseline with a slight upward arc
	const yMid = h * 0.6;
	const segments = Math.max(6, Math.round(w / 72)); // density scales with width
	const dx = w / segments;

	// seeded pseudo-random
	const rand = mulberry32(seed || 1);

	const p = [];
	for (let i = 0; i <= segments; i++) {
		const x = i * dx;
		// arc curve + jitter
		const arc = Math.sin((i / segments) * Math.PI) * (h * 0.12);
		const jx = (rand() * 2 - 1) * jitter * 0.5;
		const jy = (rand() * 2 - 1) * jitter;
		p.push([clamp(x + jx, 0, w), clamp(yMid + arc + jy, 0, h)]);
	}

	// convert to smooth quadratic path
	let d = `M ${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
	for (let i = 1; i < p.length; i++) {
		const [x, y] = p[i];
		const [px, py] = p[i - 1];
		// control point halfway with more wobble
		const cx = (px + x) / 2 + (rand() * 2 - 1) * jitter * 0.6;
		const cy = (py + y) / 2 + (rand() * 2 - 1) * jitter * 0.6;
		d += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(
			2
		)}`;
	}
	return d;
}

/* small PRNG for stable jitter */
function mulberry32(a) {
	let t = a + 0x6d2b79f5;
	return function () {
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
