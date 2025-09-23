import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Minimal intro: shows a word (defaults to "Learning") and paints a brush-like highlight
 * behind it, then fades out. Header remains visible behind the overlay.
 */
export default function TextHighlightIntro({ onContentGate, options = {} }) {
	const {
		revealSeconds = 1.8,
		holdSeconds = 0.25,
		fadeSeconds = 0.5,
		text = "Learning",
		width = 900,
		height = 280,
		fontSize = 96,
	} = options;

	// gate (tell page to show content) right before we start fading
	useEffect(() => {
		const t = setTimeout(() => {
			onContentGate?.();
		}, (revealSeconds + holdSeconds) * 1000 - 40);
		return () => clearTimeout(t);
	}, [onContentGate, revealSeconds, holdSeconds]);

	const uid = useRef(Math.random().toString(36).slice(2)).current;
	const ease = [0.16, 1, 0.3, 1];

	// cheap text width estimate to size the highlight
	const textWidth = useMemo(
		() => Math.max(240, text.length * fontSize * 0.62),
		[text, fontSize]
	);
	const padX = 40;
	const padY = Math.max(12, fontSize * 0.18);
	const rectW = textWidth + padX * 2;
	const rectH = fontSize * 0.55 + padY;
	const cx = width / 2;
	const cy = height / 2;
	const rectX = cx - rectW / 2;
	const rectY = cy - rectH / 2 + fontSize * 0.12; // slight drop so it sits under text

	return (
		<motion.div
			className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
			style={{ willChange: "opacity, transform", backfaceVisibility: "hidden" }}
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
				width={Math.min(width, window.innerWidth * 0.92)}
				height="auto"
				style={{ overflow: "visible" }}
				initial={{ opacity: 1, scale: 0.995 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<defs>
					{/* Displacement to make the rectangle edges look brushy */}
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
				</defs>

				{/* highlight block (animated scaleX from left) */}
				<motion.rect
					x={rectX}
					y={rectY}
					rx={14}
					ry={14}
					width={rectW}
					height={rectH}
					fill="#000000ff" // tailwind yellow-400
					filter={`url(#brush-${uid})`}
					style={{ transformOrigin: `${rectX}px ${rectY + rectH / 2}px` }}
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: revealSeconds, ease }}
				/>

				{/* small second pass for a layered look */}
				<motion.rect
					x={rectX + 10}
					y={rectY - 10}
					rx={18}
					ry={18}
					width={rectW - 20}
					height={rectH + 20}
					fill="#000000ff" // amber-500
					opacity={0.22}
					filter={`url(#brush-${uid})`}
					style={{ transformOrigin: `${rectX + 10}px ${rectY + rectH / 2}px` }}
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{
						duration: revealSeconds * 0.8,
						delay: revealSeconds * 0.1,
						ease,
					}}
				/>

				{/* the word */}
				<text
					x={cx}
					y={cy}
					textAnchor="middle"
					fill="#0f172a" // slate-900
					fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
					fontWeight="900"
					fontSize={fontSize}
					dominantBaseline="central"
					letterSpacing="0.5"
				>
					{text}
				</text>
			</motion.svg>
		</motion.div>
	);
}
