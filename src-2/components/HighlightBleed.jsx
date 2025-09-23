import React, { useRef } from "react";
import { motion } from "framer-motion";

/**
 * Water/ink style highlight with bleeding edges.
 * - Sweeps in from the left and then stays.
 * - Uses an SVG filter: turbulence + displacement + blur.
 */
export default function HighlightBleed({
	children,
	play = false,
	color = "#3b83f692", // blue-500
	duration = 0.7,
	delay = 0,
	opacity = 0.95,
	className = "",
	// edge/texture controls
	roughness = 0.9, // noise frequency (lower = larger blobs)
	noiseOctaves = 2, // more octaves = more detail
	bleed = 8, // displacement intensity
	blur = 1.6, // soft blur for edges
	radius = 10, // corner roundness
}) {
	// stable id for the filter (StrictMode-safe)
	const uidRef = useRef(Math.random().toString(36).slice(2));
	const uid = uidRef.current;

	return (
		<span className={`relative inline-block leading-tight ${className}`}>
			{/* The "ink" lives under the text; 1em tall so it follows font size */}
			<motion.span
				aria-hidden
				className="
          absolute left-0 top-[55%] -translate-y-1/2
          h-[0.95em] w-full
          pointer-events-none
          mix-blend-multiply
          "
				style={{ zIndex: 1, opacity }}
				initial={{ scaleX: 0, originX: 0 }}
				animate={
					play
						? { scaleX: 1, transition: { duration, delay, ease: "easeOut" } }
						: { scaleX: 0 }
				}
			>
				<svg
					viewBox="0 0 100 100"
					width="100%"
					height="100%"
					preserveAspectRatio="none"
				>
					<defs>
						{/* Grain + edge bleed */}
						<filter
							id={`ink-${uid}`}
							x="-25%"
							y="-60%"
							width="150%"
							height="220%"
						>
							<feTurbulence
								type="fractalNoise"
								baseFrequency={roughness}
								numOctaves={noiseOctaves}
								seed="7"
								result="noise"
							/>
							{/* Push the edges around for an organic outline */}
							<feDisplacementMap
								in="SourceGraphic"
								in2="noise"
								scale={bleed}
								xChannelSelector="R"
								yChannelSelector="G"
								result="displaced"
							/>
							{/* Small blur to feather the edge */}
							<feGaussianBlur
								in="displaced"
								stdDeviation={blur}
								result="soft"
							/>
							{/* Keep original color */}
							<feColorMatrix
								in="soft"
								type="matrix"
								values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
								result="final"
							/>
						</filter>

						{/* Slight paper/grain tint for texture variation */}
						<filter
							id={`grain-${uid}`}
							x="-20%"
							y="-50%"
							width="140%"
							height="200%"
						>
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.8"
								numOctaves="1"
								seed="11"
							/>
							<feColorMatrix
								type="matrix"
								values="
                  0 0 0 0 0.03
                  0 0 0 0 0.03
                  0 0 0 0 0.03
                  0 0 0 1 0"
							/>
						</filter>
					</defs>

					{/* main bar */}
					<rect
						x="0"
						y="0"
						width="100"
						height="100"
						rx={radius}
						ry={radius}
						fill={color}
						filter={`url(#ink-${uid})`}
					/>
					{/* subtle paper tint on top (very light) */}
					<rect
						x="0"
						y="0"
						width="100"
						height="100"
						rx={radius}
						ry={radius}
						filter={`url(#grain-${uid})`}
						opacity="0.12"
					/>
				</svg>
			</motion.span>

			{/* The text stays above the ink */}
			<span className="relative" style={{ zIndex: 2 }}>
				{children}
			</span>
		</span>
	);
}
