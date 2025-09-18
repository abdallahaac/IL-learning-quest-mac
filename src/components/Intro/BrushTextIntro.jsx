import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Watercolor text intro:
 * - Animated brush strokes (incl. right→left) paint a mask that reveals the text
 * - Light-blue gradient fill + subtle paper/bleed filters
 * - Fades the whole overlay on exit
 */
export default function BrushTextIntro({
  // Default text updated to singular “Culture” to align with the revised cover
  text = "Learning Quest on Indigenous Culture",
	onContentGate,
	options = {},
}) {
	const {
		revealSeconds = 4.8,
		holdSeconds = 0.4,
		fadeSeconds = 0.6,
		// visual layout
		width = 900, // canvas inner width (before padding)
		height = 280, // canvas inner height (before padding)
		scale = 1.0, // overall SVG scale
		// text styling
		fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
		fontWeight = 800,
		lineHeight = 0.96, // tspan dy multiplier
		// light blue gradient
		colorStops = ["#93c5fd", "#38bdf8"], // tailwind sky-300 → sky-400
	} = options;

	// gate content right before the overlay fade starts
	const gatedOnce = useRef(false);
	useEffect(() => {
		if (gatedOnce.current) return;
		gatedOnce.current = true;
		const t = setTimeout(
			() => onContentGate?.(),
			(revealSeconds + holdSeconds) * 1000 - 60
		);
		return () => clearTimeout(t);
	}, [onContentGate, revealSeconds, holdSeconds]);

	return (
		<motion.div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent pointer-events-none"
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{
				opacity: 0,
				transition: { duration: fadeSeconds, ease: "easeOut" },
			}}
			aria-hidden
		>
			<AnimatedBrushMaskedText
				text={text}
				width={width}
				height={height}
				scale={scale}
				revealSeconds={revealSeconds}
				fontFamily={fontFamily}
				fontWeight={fontWeight}
				lineHeight={lineHeight}
				colorStops={colorStops}
				fadeSeconds={fadeSeconds}
			/>
		</motion.div>
	);
}

function AnimatedBrushMaskedText({
	text,
	width,
	height,
	scale,
	revealSeconds,
	fontFamily,
	fontWeight,
	lineHeight,
	colorStops,
	fadeSeconds,
}) {
	// split the title into 2–3 lines (simple heuristic)
	const lines = splitToLines(text, 24, 52); // soft break targets

	// padding so strokes can overshoot
	const P = Math.round(Math.max(width, height) * 0.35);
	const W = width + P * 2;
	const H = height + P * 2;

	// center baseline
	const cx = P + width / 2;
	const cy = P + height / 2;

	// font size fits height depending on line count
	const baseSize =
		height / (lines.length + (lines.length - 1) * (1 - lineHeight));
	const fontSize = Math.round(baseSize);

	// ids
	const uid = useRef(Math.random().toString(36).slice(2)).current;

	const ease = [0.16, 1, 0.3, 1];
	const rnd = (a, b) => a + Math.random() * (b - a);

	/* PASS 1: broad sweeps (left → right) */
	const sweeps = [
		{ y: 0.78, w: 110, t: 0.0 },
		{ y: 0.56, w: 80, t: 0.18 },
		{ y: 0.38, w: 50, t: 0.33 },
	].map((s) => {
		const d = `M ${P - height * 0.6} ${P + height * s.y}
               C ${P + width * 0.18} ${P + height * (s.y - 0.22)},
                 ${P + width * 0.55} ${P + height * (s.y - 0.52)},
                 ${P + width + height * 0.6} ${P + height * (s.y - 0.62)}`;
		return { d, width: s.w, delay: s.t, dur: revealSeconds * 0.3 };
	});

	/* PASS 2: vertical cross-hatch */
	const columns = 20;
	const start2 = revealSeconds * 0.38;
	const dur2 = revealSeconds * 0.32;
	const perColDelay = dur2 / (columns * 1.2);
	const vStrokes = Array.from({ length: columns }, (_, i) => {
		const t = (i + 0.5) / columns;
		const x = P + t * width + rnd(-6, 6);
		const tilt = (rnd(-4, 4) * Math.PI) / 180;
		const x1 = x + Math.tan(tilt) * (height * 0.08);
		const x2 = x - Math.tan(tilt) * (height * 0.08);
		const y1 = P + height + rnd(12, 28);
		const y2 = P - rnd(12, 28);
		const cx1 = x1 + rnd(8, 18),
			cy1 = y1 - rnd(18, 28);
		const cx2 = x2 - rnd(8, 18),
			cy2 = y2 + rnd(18, 28);
		const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
		const len = Math.hypot(x2 - x1, y2 - y1) + 80;
		return {
			d,
			len,
			width: rnd(22, 48),
			delay: start2 + i * perColDelay + rnd(-0.06, 0.06),
			dur: dur2 * rnd(0.85, 1.05),
			opacity: rnd(0.82, 0.96),
		};
	});

	/* PASS 3: fine diagonals (left → right) */
	const start3 = start2 + dur2 * 0.6;
	const dur3 = revealSeconds * 0.22;
	const diagCount = 12;
	const diag = Array.from({ length: diagCount }, (_, i) => {
		const y = P + rnd(-20, height + 20);
		const x0 = P - 40,
			x1 = P + width + 40;
		const y0 = y + rnd(-18, 14),
			y1 = y - rnd(-14, 18);
		const d = `M ${x0} ${y0} L ${x1} ${y1}`;
		const len = Math.hypot(x1 - x0, y1 - y0);
		return {
			d,
			len,
			width: rnd(10, 22),
			delay: start3 + (i / diagCount) * (dur3 * 0.7),
			dur: dur3 * rnd(0.55, 0.8),
			opacity: rnd(0.75, 0.9),
		};
	});

	/* PASS 4: reverse sweeps (bottom-right → left) */
	const start4 = revealSeconds * 0.28;
	const dur4 = revealSeconds * 0.42;
	const revCount = 16;
	const rev = Array.from({ length: revCount }, (_, i) => {
		const xStart = P + width + 90 + rnd(-10, 20);
		const yBase = P + height * rnd(0.55, 0.95);
		const xEnd = P - 90 + rnd(-10, 20);
		const yEnd = P + height * rnd(0.05, 0.45);
		const cx1 = xStart - width * rnd(0.2, 0.35);
		const cy1 = yBase - height * rnd(0.05, 0.18);
		const cx2 = xEnd + width * rnd(0.15, 0.3);
		const cy2 = yEnd + height * rnd(0.05, 0.16);
		const d = `M ${xStart} ${yBase} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xEnd} ${yEnd}`;
		const len = Math.hypot(xEnd - xStart, yEnd - yBase) + 200;
		return {
			d,
			len,
			width: rnd(26, 54),
			delay: start4 + (i / revCount) * (dur4 * 0.8) + rnd(-0.05, 0.05),
			dur: dur4 * rnd(0.6, 0.85),
			opacity: rnd(0.8, 0.95),
		};
	});

	// tiny late wash to fill pinholes
	const coverage = {
		d: `M ${P - 120} ${P + height * 0.72}
        C ${P + width * 0.35} ${P + height * 0.98},
          ${P + width * 0.7}  ${P + height * 0.12},
          ${P + width + 180}  ${P + height * 0.08}`,
		width: Math.max(height * 0.36, 110),
		delay: revealSeconds * 0.96,
		dur: revealSeconds * 0.12,
	};

  /*
   * For a more dynamic intro, we draw subtle "highlight" strokes behind
   * each line of text.  These rectangles animate from left to right like
   * someone swiping a highlighter marker across the phrase.  We compute
   * approximate positions based on the line count, font size, and
   * container width.  The highlights live inside the reveal mask so
   * they're only visible where the text will ultimately appear.
   */
  // approximate character width to size the highlights; tweak multiplier
  const charW = fontSize * 0.55;
  const highlightRects = lines.map((ln, i) => {
    // baseline for this line
    const baseline = cy - ((lines.length - 1) * (fontSize * lineHeight)) / 2 + i * (fontSize * lineHeight);
    // width: scale with line length but clamp within [0.6*width, 0.95*width]
    const rawW = ln.length * charW + fontSize;
    const minW = width * 0.6;
    const maxW = width * 0.95;
    const rectW = Math.max(minW, Math.min(maxW, rawW));
    // center horizontally within the text area
    const rectX = P + (width - rectW) / 2;
    // vertical positioning: place highlight slightly below baseline to cover descenders
    const rectH = fontSize * 0.9;
    const rectY = baseline - rectH * 0.8;
    return { x: rectX, y: rectY, w: rectW, h: rectH };
  });

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      width={width * scale}
      height={height * scale}
      style={{ overflow: "visible" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: fadeSeconds, ease: "easeOut" },
      }}
    >
      <defs>
        {/* Watercolor wobble/bleed for strokes */}
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
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="d"
          />
          <feGaussianBlur in="d" stdDeviation="1.2" />
        </filter>

        {/* Slight tooth for the revealed text area */}
        <filter
          id={`paper-${uid}`}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="3"
            result="p"
          />
          <feColorMatrix
            in="p"
            type="matrix"
            values="
              0 0 0 0 0.03
              0 0 0 0 0.03
              0 0 0 0 0.03
              0 0 0 1 0"
            result="t"
          />
        </filter>

        {/* Light-blue gradient fill for text */}
        <linearGradient id={`ink-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colorStops[0]} />
          <stop offset="100%" stopColor={colorStops[1]} />
        </linearGradient>

        {/* Animated reveal mask painted by the strokes */}
        <mask
          id={`reveal-${uid}`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={W}
          height={H}
        >
          <rect x="0" y="0" width={W} height={H} fill="black" />
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
          </g>
        </mask>
      </defs>

      {/* Revealed text and highlights group */}
      <motion.g
        initial={{ rotate: -2.5, scale: 0.985 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: revealSeconds * 0.45, ease: "easeOut" }}
        mask={`url(#reveal-${uid})`}
      >
        {/* Highlight strokes drawn behind each line.  These grow from left to right. */}
        {highlightRects.map((rect, i) => {
          // stagger highlights slightly after the strokes start painting
          const hlDelay = revealSeconds * 0.25 + i * (revealSeconds * 0.08);
          const hlDur = revealSeconds * 0.3;
          return (
            <motion.rect
              key={`hl-${i}`}
              x={rect.x}
              y={rect.y}
              width={rect.w}
              height={rect.h}
              rx={rect.h * 0.15}
              fill="#fde047"
              initial={{ scaleX: 0, opacity: 0.0 }}
              animate={{ scaleX: 1, opacity: 0.85 }}
              transition={{
                duration: hlDur,
                delay: hlDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "left center" }}
            />
          );
        })}
        <g filter={`url(#paper-${uid})`}>
          <TextBlock
            cx={cx}
            cy={cy}
            lines={lines}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fontSize={fontSize}
            lineHeight={lineHeight}
            fill={`url(#ink-${uid})`}
          />
        </g>
      </motion.g>
    </motion.svg>
  );
}

function TextBlock({
	cx,
	cy,
	lines,
	fontFamily,
	fontWeight,
	fontSize,
	lineHeight,
	fill,
}) {
	return (
		<text
			x={cx}
			y={cy - ((lines.length - 1) * (fontSize * lineHeight)) / 2}
			textAnchor="middle"
			fontFamily={fontFamily}
			fontWeight={fontWeight}
			fontSize={fontSize}
			fill={fill}
			style={{ dominantBaseline: "alphabetic" }}
		>
			{lines.map((ln, i) => (
				<tspan key={i} x={cx} dy={i === 0 ? 0 : fontSize * lineHeight}>
					{ln}
				</tspan>
			))}
		</text>
	);
}

// naive 2–3 line splitter that tries to keep lines visually balanced
function splitToLines(s, soft1 = 24, soft2 = 52) {
	const words = s.trim().split(/\s+/);
	if (words.length <= 3) return [s]; // very short phrases

	// try 2 lines first
	let best = [s];
	let bestScore = Infinity;

	for (let i = 1; i < words.length; i++) {
		const l1 = words.slice(0, i).join(" ");
		const l2 = words.slice(i).join(" ");
		const score =
			Math.abs(l1.length - soft1) + Math.abs(l1.length + l2.length - soft2);
		if (Math.max(l1.length, l2.length) <= soft2 + 12 && score < bestScore) {
			best = [l1, l2];
			bestScore = score;
		}
	}

	// if a line still looks very long, split into 3 lines
	if (
		best.length === 2 &&
		Math.max(best[0].length, best[1].length) > soft2 + 10
	) {
		const mid = Math.floor(words.length / 3);
		const a = words.slice(0, mid).join(" ");
		const b = words.slice(mid, mid * 2).join(" ");
		const c = words.slice(mid * 2).join(" ");
		return [a, b, c].filter(Boolean);
	}

	return best;
}
