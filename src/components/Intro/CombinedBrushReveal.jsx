import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function CombinedBrushReveal({
	leftSrc,
	rightSrc,
	size = 240,
	leftScale = 1,
	rightScale = 1,
	gap = 64,
	revealSeconds = 4.8,
	scale = 1,
	leftNudge = { x: 0, y: 0 },
	rightNudge = { x: 0, y: 0 },
}) {
	// stable unique id per mount (StrictMode-safe)
	const uidRef = useRef(Math.random().toString(36).slice(2));
	const uid = uidRef.current;

	const leftSize = size * leftScale;
	const rightSize = size * rightScale;

	const innerW = leftSize + gap + rightSize;
	const innerH = Math.max(leftSize, rightSize);

	const P = Math.round(Math.max(leftSize, rightSize) * 0.7);
	const W = innerW + P * 2;
	const H = innerH + P * 2;

	const ease = [0.16, 1, 0.3, 1];
	const rnd = (a, b) => a + Math.random() * (b - a);

	// PASS 1: broad sweeps (left → right)
	const sweeps = [
		{ y: 0.82, w: 120, t: 0.0 },
		{ y: 0.6, w: 85, t: 0.2 },
		{ y: 0.45, w: 52, t: 0.36 },
	].map((s) => {
		const d = `M ${P - innerH * 0.6} ${P + innerH * s.y}
               C ${P + innerW * 0.2} ${P + innerH * (s.y - 0.22)},
                 ${P + innerW * 0.55} ${P + innerH * (s.y - 0.56)},
                 ${P + innerW + innerH * 0.6} ${P + innerH * (s.y - 0.66)}`;
		return { d, width: s.w, delay: s.t, dur: revealSeconds * 0.3 };
	});

	// PASS 2: vertical cross-hatch
	const columns = 22;
	const start2 = 0.4 * revealSeconds;
	const dur2 = revealSeconds * 0.32;
	const perColDelay = dur2 / (columns * 1.25);
	const vStrokes = Array.from({ length: columns }, (_, i) => {
		const t = (i + 0.5) / columns;
		const x = P + t * innerW + rnd(-6, 6);
		const tilt = (rnd(-4, 4) * Math.PI) / 180;
		const x1 = x + Math.tan(tilt) * (innerH * 0.08);
		const x2 = x - Math.tan(tilt) * (innerH * 0.08);
		const y1 = P + innerH + rnd(12, 32);
		const y2 = P - rnd(12, 32);
		const cx1 = x1 + rnd(8, 18),
			cy1 = y1 - rnd(18, 28);
		const cx2 = x2 - rnd(8, 18),
			cy2 = y2 + rnd(18, 28);
		const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
		const len = Math.hypot(x2 - x1, y2 - y1) + 80;
		return {
			d,
			len,
			width: rnd(22, 52),
			delay: start2 + i * perColDelay + rnd(-0.06, 0.06),
			dur: dur2 * rnd(0.85, 1.05),
			opacity: rnd(0.82, 0.96),
		};
	});

	// PASS 3: fine diagonals (left → right)
	const start3 = start2 + dur2 * 0.6;
	const dur3 = revealSeconds * 0.22;
	const diagCount = 14;
	const diag = Array.from({ length: diagCount }, (_, i) => {
		const y = P + rnd(-30, innerH + 30);
		const x0 = P - 40,
			x1 = P + innerW + 40;
		const y0 = y + rnd(-22, 18),
			y1 = y - rnd(-18, 22);
		const d = `M ${x0} ${y0} L ${x1} ${y1}`;
		const len = Math.hypot(x1 - x0, y1 - y0);
		return {
			d,
			len,
			width: rnd(10, 24),
			delay: start3 + (i / diagCount) * (dur3 * 0.7),
			dur: dur3 * rnd(0.55, 0.8),
			opacity: rnd(0.75, 0.9),
		};
	});

	// PASS 4: reverse sweeps (bottom-right → left)
	const start4 = 0.3 * revealSeconds;
	const dur4 = revealSeconds * 0.4;
	const revCount = 18;
	const rev = Array.from({ length: revCount }, (_, i) => {
		const xStart = P + innerW + 90 + rnd(-10, 20);
		const yBase = P + innerH * rnd(0.55, 0.95);
		const xEnd = P - 90 + rnd(-10, 20);
		const yEnd = P + innerH * rnd(0.05, 0.45);
		const cx1 = xStart - innerW * rnd(0.2, 0.35);
		const cy1 = yBase - innerH * rnd(0.05, 0.18);
		const cx2 = xEnd + innerW * rnd(0.15, 0.3);
		const cy2 = yEnd + innerH * rnd(0.05, 0.16);
		const d = `M ${xStart} ${yBase} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xEnd} ${yEnd}`;
		const len = Math.hypot(xEnd - xStart, yEnd - yBase) + 200;
		return {
			d,
			len,
			width: rnd(28, 60),
			delay: start4 + (i / revCount) * (dur4 * 0.8) + rnd(-0.05, 0.05),
			dur: dur4 * rnd(0.6, 0.85),
			opacity: rnd(0.8, 0.95),
		};
	});

	// tiny late coverage to fill pinholes
	const coverage = {
		d: `M ${P - 140} ${P + innerH * 0.72}
        C ${P + innerW * 0.35} ${P + innerH * 0.98},
          ${P + innerW * 0.7}  ${P + innerH * 0.12},
          ${P + innerW + 200}  ${P + innerH * 0.08}`,
		width: Math.max(innerH * 0.38, 120),
		delay: revealSeconds * 0.97,
		dur: revealSeconds * 0.1,
	};

	const speckles = Array.from({ length: 8 }, () => ({
		x: P + rnd(0.1, 0.9) * innerW,
		y: P + rnd(0.15, 0.85) * innerH,
		r: rnd(2, 5),
		delay: revealSeconds * rnd(0.65, 0.95),
	}));

	return (
		<svg
			viewBox={`0 0 ${W} ${H}`}
			width={innerW * scale}
			height={innerH * scale}
			style={{ overflow: "visible" }}
		>
			<defs>
				<filter
					id={`bleed-${uid}`}
					x="-60%"
					y="-60%"
					width="220%"
					height="220%"
				>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.015 0.025"
						numOctaves="2"
						seed="7"
						result="noise"
					/>
					<feDisplacementMap
						in="SourceGraphic"
						in2="noise"
						scale="7"
						xChannelSelector="R"
						yChannelSelector="G"
						result="disp"
					/>
					<feGaussianBlur in="disp" stdDeviation="1.7" result="blur" />
					<feColorMatrix
						in="blur"
						type="matrix"
						values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 1 0"
						result="bleedOut"
					/>
				</filter>

				<filter id={`wash-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
						numOctaves="1"
						seed="3"
						result="paper"
					/>
					<feColorMatrix
						in="paper"
						type="matrix"
						values="
            0 0 0 0 0.03
            0 0 0 0 0.03
            0 0 0 0 0.03
            0 0 0 1 0"
						result="washTint"
					/>
				</filter>

				<mask
					id={`reveal-${uid}`}
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width={W}
					height={H}
				>
					<g filter={`url(#bleed-${uid})`}>
						{sweeps.map((s, i) => (
							<motion.path
								key={`sw-${i}`}
								d={s.d}
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={s.width}
								initial={{
									pathLength: 0,
									strokeDasharray: 1200,
									strokeDashoffset: 1200,
								}}
								animate={{ pathLength: 1, strokeDashoffset: 0 }}
								transition={{ duration: s.dur, delay: s.delay, ease }}
							/>
						))}
						{vStrokes.map((v, i) => (
							<motion.path
								key={`v-${i}`}
								d={v.d}
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={v.width}
								style={{ opacity: v.opacity }}
								initial={{
									pathLength: 0,
									strokeDasharray: v.len,
									strokeDashoffset: v.len,
								}}
								animate={{ pathLength: 1, strokeDashoffset: 0 }}
								transition={{ duration: v.dur, delay: v.delay, ease }}
							/>
						))}
						{diag.map((d, i) => (
							<motion.path
								key={`dg-${i}`}
								d={d.d}
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={d.width}
								style={{ opacity: d.opacity }}
								initial={{
									pathLength: 0,
									strokeDasharray: d.len,
									strokeDashoffset: d.len,
								}}
								animate={{ pathLength: 1, strokeDashoffset: 0 }}
								transition={{ duration: d.dur, delay: d.delay, ease }}
							/>
						))}
						{rev.map((d, i) => (
							<motion.path
								key={`rv-${i}`}
								d={d.d}
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={d.width}
								style={{ opacity: d.opacity }}
								initial={{
									pathLength: 0,
									strokeDasharray: d.len,
									strokeDashoffset: d.len,
								}}
								animate={{ pathLength: 1, strokeDashoffset: 0 }}
								transition={{ duration: d.dur, delay: d.delay, ease }}
							/>
						))}
						<motion.path
							d={coverage.d}
							fill="none"
							stroke="white"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={coverage.width}
							initial={{
								pathLength: 0,
								strokeDasharray: 1600,
								strokeDashoffset: 1600,
							}}
							animate={{ pathLength: 1, strokeDashoffset: 0 }}
							transition={{
								duration: coverage.dur,
								delay: coverage.delay,
								ease,
							}}
						/>
						{speckles.map((s, i) => (
							<motion.circle
								key={`sp-${i}`}
								cx={s.x}
								cy={s.y}
								r={s.r}
								fill="white"
								initial={{ opacity: 0, scale: 0.6 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: s.delay, ease: "easeOut" }}
							/>
						))}
					</g>
				</mask>
			</defs>

			<motion.g
				initial={{ rotate: -2.5, scale: 0.985 }}
				animate={{ rotate: 0, scale: 1 }}
				transition={{ duration: revealSeconds * 0.5, ease: "easeOut" }}
				mask={`url(#reveal-${uid})`}
			>
				<image
					href={leftSrc}
					x={P + leftNudge.x}
					y={P + (innerH - leftSize) / 2 + leftNudge.y}
					width={leftSize}
					height={leftSize}
					preserveAspectRatio="xMidYMid meet"
				/>
				<image
					href={rightSrc}
					x={P + leftSize + gap + rightNudge.x}
					y={P + (innerH - rightSize) / 2 + rightNudge.y}
					width={rightSize}
					height={rightSize}
					preserveAspectRatio="xMidYMid meet"
				/>
				<rect
					x={P}
					y={P}
					width={innerW}
					height={innerH}
					filter={`url(#wash-${uid})`}
					opacity="0.10"
				/>
			</motion.g>
		</svg>
	);
}
