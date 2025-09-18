// src/intro/BrandIntro.jsx
import React, { useEffect, useState } from "react";
import {
	motion,
	AnimatePresence,
	useReducedMotion,
	useAnimationControls,
} from "framer-motion";

export default function BrandIntro({
	logoUrl,
	show,
	onComplete,
	backdropClassName = "", // keep transparent by default
}) {
	const reduceMotion = useReducedMotion();
	const [ready, setReady] = useState(reduceMotion ? true : false);
	const ctrls = useAnimationControls();

	// preload the logo so the mask reveal is smooth
	useEffect(() => {
		if (reduceMotion) return;
		const img = new Image();
		img.onload = () => setReady(true);
		img.onerror = () => setReady(true); // fail open
		img.src = logoUrl;
	}, [logoUrl, reduceMotion]);

	// play sequence once both visible + ready
	useEffect(() => {
		let mounted = true;
		if (!show || !ready || reduceMotion) return;
		(async () => {
			if (!mounted) return;
			await ctrls.start("paint");
			await ctrls.start("swirl");
			await ctrls.start("hold");
			onComplete?.();
		})();
		return () => (mounted = false);
	}, [show, ready, reduceMotion, ctrls, onComplete]);

	if (reduceMotion) return null;

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					key="brand-intro"
					className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClassName}`}
					// transparent by default; let your page bg show through
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
					aria-hidden
				>
					{/* optional: subtle vignette to focus center without whitening the bg */}
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.06)_100%)]" />

					{/* If image isn't ready yet, a tiny pulse */}
					{!ready && (
						<motion.div
							className="w-8 h-8 rounded-full border-2 border-gray-400/60"
							initial={{ opacity: 0.3, scale: 0.9 }}
							animate={{ opacity: 0.6, scale: 1 }}
							transition={{
								repeat: Infinity,
								duration: 0.8,
								ease: "easeInOut",
							}}
						/>
					)}

					{ready && (
						<motion.svg
							viewBox="0 0 400 400"
							width="260"
							height="260"
							className="will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] drop-shadow-sm relative"
							variants={{
								paint: { rotate: -8, scale: 0.985, opacity: 1 },
								swirl: {
									rotate: 182,
									scale: 1.045,
									transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
								},
								hold: { opacity: 1, transition: { duration: 0.15 } },
							}}
							initial={false}
							animate={ctrls}
						>
							<defs>
								{/* watery/brushy edge */}
								<filter id="ink" x="-20%" y="-20%" width="140%" height="140%">
									<feTurbulence
										type="fractalNoise"
										baseFrequency="0.9"
										numOctaves="2"
										seed="3"
										result="noise"
									/>
									<feDisplacementMap
										in="SourceGraphic"
										in2="noise"
										scale="4.5"
										xChannelSelector="R"
										yChannelSelector="G"
										result="disp"
									/>
									<feGaussianBlur in="disp" stdDeviation="0.6" result="blur" />
									<feBlend in="blur" in2="SourceGraphic" mode="multiply" />
								</filter>

								{/* white-on-black mask that reveals the logo */}
								<mask
									id="revealMask"
									maskUnits="userSpaceOnUse"
									maskContentUnits="userSpaceOnUse"
								>
									<rect x="0" y="0" width="400" height="400" fill="black" />
									{/* three staggered brush strokes "painting" the mask */}
									<motion.path
										d="M70,240 C120,170 210,160 300,205"
										fill="none"
										stroke="white"
										strokeWidth="26"
										strokeLinecap="round"
										filter="url(#ink)"
										strokeDasharray="360"
										variants={{
											paint: { strokeDashoffset: 360 },
											swirl: {
												strokeDashoffset: 0,
												transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
											},
											hold: { strokeDashoffset: 0 },
										}}
									/>
									<motion.path
										d="M60,210 C150,130 240,140 320,185"
										fill="none"
										stroke="white"
										strokeWidth="20"
										strokeLinecap="round"
										filter="url(#ink)"
										strokeDasharray="320"
										variants={{
											paint: { strokeDashoffset: 320 },
											swirl: {
												strokeDashoffset: 0,
												transition: {
													duration: 0.9,
													ease: [0.16, 1, 0.3, 1],
													delay: 0.12,
												},
											},
											hold: { strokeDashoffset: 0 },
										}}
									/>
									<motion.path
										d="M85,275 C140,210 235,200 315,230"
										fill="none"
										stroke="white"
										strokeWidth="16"
										strokeLinecap="round"
										filter="url(#ink)"
										strokeDasharray="300"
										variants={{
											paint: { strokeDashoffset: 300 },
											swirl: {
												strokeDashoffset: 0,
												transition: {
													duration: 0.9,
													ease: [0.16, 1, 0.3, 1],
													delay: 0.22,
												},
											},
											hold: { strokeDashoffset: 0 },
										}}
									/>
								</mask>

								{/* faint swirl color stroke */}
								<linearGradient id="swirlStroke" x1="0" x2="1" y1="0" y2="1">
									<stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
									<stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
								</linearGradient>
							</defs>

							{/* ornamental swirl behind the logo */}
							<motion.path
								d="M60,250 C140,140 260,140 330,200"
								fill="none"
								stroke="url(#swirlStroke)"
								strokeWidth="4"
								strokeLinecap="round"
								filter="url(#ink)"
								variants={{
									paint: { pathLength: 0, opacity: 0.35 },
									swirl: {
										pathLength: 1,
										opacity: 0.85,
										transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
									},
									hold: { opacity: 0.6, transition: { duration: 0.2 } },
								}}
							/>

							{/* logo revealed by mask — no background fill added here */}
							<image
								href={logoUrl}
								x="20"
								y="20"
								width="360"
								height="360"
								mask="url(#revealMask)"
							/>
						</motion.svg>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
