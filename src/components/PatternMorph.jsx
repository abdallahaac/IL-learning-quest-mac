// src/components/PatternMorph.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { PATTERN_CELL_PX } from "../constants/pattern.js";
import { getCanvasDeviceSize } from "../utils/patternGrid.js";

export default function PatternMorph({
	pageIndex = 0,
	sequence = ["dots", "grid"],
	bg = "#ffff",
	ink = "rgba(0,0,0,0.05)",
	duration = 800,
	cellPx = PATTERN_CELL_PX,
	showFold = true,
	foldSize = 900,
	foldFill = "rgba(255,255,255,0.94)",
	foldStroke = "rgba(0,0,0,0.04)",
	foldShadow = "rgba(0,0,0,0)",
}) {
	const canvasRef = useRef(null);
	const rafRef = useRef(0);

	const fromRef = useRef("dots");
	const toRef = useRef("dots");
	const tRef = useRef(1);
	const startRef = useRef(0);
	const lastIndexRef = useRef(-1);

	const targetKey = useMemo(() => {
		if (!sequence?.length) return "dots";
		return sequence[pageIndex % sequence.length];
	}, [pageIndex, sequence]);

	useEffect(() => {
		if (lastIndexRef.current === -1) {
			fromRef.current = targetKey;
			toRef.current = targetKey;
			tRef.current = 1;
			lastIndexRef.current = pageIndex;
			draw();
			return;
		}
		fromRef.current = toRef.current;
		toRef.current = targetKey;
		tRef.current = 0;
		startRef.current = performance.now();
		cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(loop);
		lastIndexRef.current = pageIndex;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [targetKey, pageIndex]);

	useEffect(() => {
		const handle = () => {
			const c = canvasRef.current;
			if (!c) return;
			const { W, H, cssW, cssH } = getCanvasDeviceSize();
			c.width = W;
			c.height = H;
			c.style.width = `${cssW}px`;
			c.style.height = `${cssH}px`;
			draw();
		};
		handle();
		window.addEventListener("resize", handle);
		window.addEventListener("orientationchange", handle);
		return () => {
			window.removeEventListener("resize", handle);
			window.removeEventListener("orientationchange", handle);
		};
	}, []);

	useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

	function loop(now) {
		const t = Math.min(1, (now - startRef.current) / duration);
		tRef.current = t;
		draw();
		if (t < 1) rafRef.current = requestAnimationFrame(loop);
	}

	function draw() {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
		const { W, H, dpr } = getCanvasDeviceSize();

		// Paper base
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, W, H);

		// Lattice
		const cell = Math.max(2, cellPx) * dpr;
		const cx0 = Math.round((W % cell) / 2);
		const cy0 = Math.round((H % cell) / 2);

		const t = easeInOutCubic(tRef.current);
		const from = fromRef.current;
		const to = toRef.current;
		const w = weights(from, to, t);

		// Sizes in device px. These appear as CSS px because canvas is DPR-scaled.
		const dotR = mix(0, 2.0 * dpr, w.dot); // 2 CSS px radius
		const arm = mix(0, 7.0 * dpr, w.plus);
		const astArm = mix(0, 6.5 * dpr, w.ast);
		const lw = 1.2 * dpr;
		const lineAlpha = 0.9;

		// Lines underlay
		if (w.lines > 0) {
			ctx.save();
			ctx.globalAlpha = w.lines * lineAlpha;
			ctx.strokeStyle = ink;
			ctx.lineWidth = lw;
			for (let y = cy0; y <= H; y += cell) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(W, y);
				ctx.stroke();
			}
			ctx.restore();
		}

		// Grid underlay
		if (w.grid > 0) {
			ctx.save();
			ctx.globalAlpha = w.grid * lineAlpha;
			ctx.strokeStyle = ink;
			ctx.lineWidth = lw;
			for (let x = cx0; x <= W; x += cell) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, H);
				ctx.stroke();
			}
			for (let y = cy0; y <= H; y += cell) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(W, y);
				ctx.stroke();
			}
			ctx.restore();
		}

		// Rotation for plus
		const plusAngle = from === "plus" || to === "plus" ? 2 * Math.PI * t : 0;

		// Glyphs
		ctx.lineCap = "round";
		ctx.lineWidth = lw;

		for (let y = cy0; y < H; y += cell) {
			for (let x = cx0; x < W; x += cell) {
				if (w.dot > 0 && dotR > 0.01) {
					ctx.globalAlpha = clamp01(w.dot);
					ctx.fillStyle = ink;
					ctx.beginPath();
					ctx.arc(x, y, dotR, 0, Math.PI * 2);
					ctx.fill();
				}
				if (w.plus > 0 && arm > 0.01) {
					ctx.save();
					ctx.translate(x, y);
					ctx.rotate(plusAngle);
					ctx.globalAlpha = clamp01(w.plus) * lineAlpha;
					ctx.strokeStyle = ink;
					ctx.beginPath();
					ctx.moveTo(0, -arm);
					ctx.lineTo(0, arm);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(-arm, 0);
					ctx.lineTo(arm, 0);
					ctx.stroke();
					ctx.restore();
				}
				if (w.ast > 0 && astArm > 0.01) {
					ctx.globalAlpha = clamp01(w.ast) * lineAlpha;
					ctx.strokeStyle = ink;
					const d = astArm * 0.70710678;
					ctx.beginPath();
					ctx.moveTo(x - d, y - d);
					ctx.lineTo(x + d, y + d);
					ctx.moveTo(x - d, y + d);
					ctx.lineTo(x + d, y - d);
					ctx.stroke();
				}
			}
		}
		ctx.globalAlpha = 1;
	}

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10"
		/>
	);
}

function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a + (b - a) * clamp01(t);
function weights(from, to, t) {
	const zero = { dot: 0, plus: 0, grid: 0, ast: 0, lines: 0 };
	const A = { ...zero, ...unit(from) };
	const B = { ...zero, ...unit(to) };
	return {
		dot: mix(A.dot, B.dot, t),
		plus: mix(A.plus, B.plus, t),
		grid: mix(A.grid, B.grid, t),
		ast: mix(A.ast, B.ast, t),
		lines: mix(A.lines, B.lines, t),
	};
}
function unit(kind) {
	switch (kind) {
		case "dots":
			return { dot: 1 };
		case "plus":
			return { plus: 1 };
		case "grid":
			return { grid: 1 };
		case "asterisks":
			return { ast: 1 };
		case "lines":
			return { lines: 1 };
		default:
			return { dot: 1 };
	}
}
