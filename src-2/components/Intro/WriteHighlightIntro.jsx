import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Writes “Learning Quest on / Indigenous Cultures” with a left->right mask,
 * then highlights BOTH lines only after typing finishes, then the parent fades out.
 * Cursors (little dots) are removed.
 */
export default function WriteHighlightIntro({ onContentGate, options = {} }) {
	const {
		// text & layout
		lines = ["Learning Quest on", "Indigenous Cultures"],
		width = 1100,
		height = 360,
		fontSizeTop = 80,
		fontSizeBottom = 88,
		gap = 52,

		// timings (seconds)
		writeTop = 1.0,
		writeBottom = 1.1,
		highlight = 0.7, // duration of highlight sweep
		holdSeconds = 0.25, // small hold before parent fade
		fadeSeconds = 0.55, // parent handles fade via AnimatePresence

		// colors
		textFill = "#0f172a",
		highlight1 = "#facc15",
		highlight2 = "#f59e0b",

		// rendering
		highlightBehindText = true, // draws bars behind letters
	} = options;

	const ease = [0.16, 1, 0.3, 1];
	const uid = useRef(Math.random().toString(36).slice(2)).current;

	const cx = width / 2;
	const topY = (height - gap) / 2 - fontSizeBottom * 0.35;
	const botY = (height + gap) / 2;

	const topTextRef = useRef(null);
	const botTextRef = useRef(null);
	const [topW, setTopW] = useState(0);
	const [botW, setBotW] = useState(0);
	const [ready, setReady] = useState(false);

	// robust width measurement so masks animate the correct length
	useLayoutEffect(() => {
		const measure = () => {
			const tb = topTextRef.current?.getBBox?.();
			const bb = botTextRef.current?.getBBox?.();
			const tw =
				tb?.width ?? topTextRef.current?.getComputedTextLength?.() ?? 0;
			const bw =
				bb?.width ?? botTextRef.current?.getComputedTextLength?.() ?? 0;
			setTopW(Math.max(240, tw));
			setBotW(Math.max(260, bw));
			setReady(true);
		};

		if (document.fonts?.ready) {
			document.fonts.ready.then(measure).catch(measure);
		} else {
			requestAnimationFrame(measure);
		}
	}, []);

	// Gate content to mount *after* highlights have run.
	useEffect(() => {
		if (!ready) return;
		const total = writeTop + writeBottom + highlight + holdSeconds;
		const t = setTimeout(() => onContentGate?.(), total * 1000 - 60);
		return () => clearTimeout(t);
	}, [ready, onContentGate, writeTop, writeBottom, highlight, holdSeconds]);

	// highlights start ONLY after typing finishes
	const highlightDelay = writeTop + writeBottom + 0.05;
	const padX = 42;
	const padY = 12;

	const HighlightGroup = () => (
		<>
			{/* TOP highlight */}
			<motion.g
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{ duration: highlight, delay: highlightDelay, ease }}
				style={{
					transformOrigin: `${cx - (topW + padX * 2) / 2}px ${topY + 12}px`,
					mixBlendMode: "multiply",
					pointerEvents: "none",
				}}
			>
				<rect
					x={cx - (topW + padX * 2) / 2}
					y={topY - fontSizeTop * 0.48}
					width={topW + padX * 2}
					height={fontSizeTop * 0.56 + padY}
					rx={16}
					ry={16}
					fill={highlight1}
					filter={`url(#brush-${uid})`}
				/>
				<rect
					x={cx - (topW + padX * 2 - 24) / 2}
					y={topY - fontSizeTop * 0.58}
					width={topW + padX * 2 - 24}
					height={fontSizeTop * 0.76 + padY + 10}
					rx={18}
					ry={18}
					fill={highlight2}
					opacity="0.22"
					filter={`url(#brush-${uid})`}
				/>
			</motion.g>

			{/* BOTTOM highlight */}
			<motion.g
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{ duration: highlight, delay: highlightDelay + 0.05, ease }}
				style={{
					transformOrigin: `${cx - (botW + padX * 2) / 2}px ${botY + 12}px`,
					mixBlendMode: "multiply",
					pointerEvents: "none",
				}}
			>
				<rect
					x={cx - (botW + padX * 2) / 2}
					y={botY - fontSizeBottom * 0.48}
					width={botW + padX * 2}
					height={fontSizeBottom * 0.56 + padY}
					rx={16}
					ry={16}
					fill={highlight1}
					filter={`url(#brush-${uid})`}
				/>
				<rect
					x={cx - (botW + padX * 2 - 24) / 2}
					y={botY - fontSizeBottom * 0.58}
					width={botW + padX * 2 - 24}
					height={fontSizeBottom * 0.76 + padY + 10}
					rx={18}
					ry={18}
					fill={highlight2}
					opacity="0.22"
					filter={`url(#brush-${uid})`}
				/>
			</motion.g>
		</>
	);

	return (
		<motion.div
			className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
			style={{
				willChange: "opacity, transform",
				backfaceVisibility: "hidden",
				WebkitFontSmoothing: "antialiased",
				MozOsxFontSmoothing: "grayscale",
			}}
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{
				opacity: 0,
				transition: { duration: fadeSeconds, ease: "easeOut" },
			}}
			aria-hidden
		>
			<motion.svg
				viewBox={`0 0 ${width} ${height}`}
				width="min(92vw, 1100px)"
				height="auto"
				style={{ overflow: "visible" }}
				initial={{ opacity: 1, scale: 0.995 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<defs>
					{/* textured brushy edge */}
					<filter
						id={`brush-${uid}`}
						x="-50%"
						y="-50%"
						width="200%"
						height="200%"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.9"
							numOctaves="1"
							seed="3"
							result="noise"
						/>
						<feDisplacementMap
							in="SourceGraphic"
							in2="noise"
							scale="10"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
						<feGaussianBlur stdDeviation="0.6" />
					</filter>

					{/* reveal masks for typing effect */}
					<mask id={`reveal-top-${uid}`} maskUnits="userSpaceOnUse">
						<motion.rect
							x={cx - topW / 2}
							y={topY - fontSizeTop}
							height={fontSizeTop * 1.4}
							initial={{ width: 0 }}
							animate={ready ? { width: topW } : { width: 0 }}
							transition={{ duration: writeTop, ease }}
							fill="white"
						/>
					</mask>
					<mask id={`reveal-bot-${uid}`} maskUnits="userSpaceOnUse">
						<motion.rect
							x={cx - botW / 2}
							y={botY - fontSizeBottom}
							height={fontSizeBottom * 1.5}
							initial={{ width: 0 }}
							animate={ready ? { width: botW } : { width: 0 }}
							transition={{
								duration: writeBottom,
								delay: Math.max(0, writeTop * 0.25),
								ease,
							}}
							fill="white"
						/>
					</mask>
				</defs>

				{/* 1) HIGHLIGHTS FIRST (so they appear BEHIND the text) */}
				{highlightBehindText && <HighlightGroup />}

				{/* 2) Hidden measurement text */}
				<text
					ref={topTextRef}
					x={cx}
					y={topY}
					textAnchor="middle"
					dominantBaseline="alphabetic"
					fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
					fontSize={fontSizeTop}
					fontWeight="900"
					opacity="0"
				>
					{lines[0]}
				</text>
				<text
					ref={botTextRef}
					x={cx}
					y={botY}
					textAnchor="middle"
					dominantBaseline="alphabetic"
					fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
					fontSize={fontSizeBottom}
					fontWeight="900"
					opacity="0"
				>
					{lines[1]}
				</text>

				{/* 3) Visible text revealed by masks */}
				<g mask={`url(#reveal-top-${uid})`}>
					<text
						x={cx}
						y={topY}
						textAnchor="middle"
						dominantBaseline="alphabetic"
						fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
						fontSize={fontSizeTop}
						fontWeight="900"
						fill={textFill}
					>
						{lines[0]}
					</text>
				</g>

				<g mask={`url(#reveal-bot-${uid})`}>
					<text
						x={cx}
						y={botY}
						textAnchor="middle"
						dominantBaseline="alphabetic"
						fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
						fontSize={fontSizeBottom}
						fontWeight="900"
						fill={textFill}
					>
						{lines[1]}
					</text>
				</g>

				{/* 4) If you ever want the highlight to OVERLAY text, render here instead */}
				{!highlightBehindText && <HighlightGroup />}
			</motion.svg>
		</motion.div>
	);
}
