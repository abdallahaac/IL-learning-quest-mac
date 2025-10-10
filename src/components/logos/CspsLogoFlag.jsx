// CspsLogoFlag.jsx
import * as React from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Wavy "flag" intro for the CSPS logo, then settle.
 *
 * Props:
 * - duration (ms): total time for the wave to fade out
 * - delay (ms): wait before starting fade-out
 * - maxScale: feDisplacementMap scale at start (strength of wave)
 * - baseFreq: starting feTurbulence baseFrequency
 * - fill / stroke / strokeWidth: optional visual overrides
 * - onSettled: callback when animation finishes
 */
export default function CspsLogoFlag({
	duration = 1400,
	delay = 100,
	maxScale = 18,
	baseFreq = 0.018,
	fill = "#524362",
	stroke,
	strokeWidth,
	onSettled,
	...props
}) {
	const reduce = useReducedMotion();
	const turbRef = React.useRef(null);
	const dispRef = React.useRef(null);
	const groupRef = React.useRef(null);
	const [filterId] = React.useState(
		() => `flagWave-${Math.random().toString(36).slice(2)}`
	);

	React.useEffect(() => {
		if (!turbRef.current || !dispRef.current || !groupRef.current) return;

		// If user prefers reduced motion: skip waving and render crisp.
		if (reduce) {
			groupRef.current.removeAttribute("filter");
			onSettled?.();
			return;
		}

		let raf = 0;
		let start = 0;

		// Apply the filter initially
		groupRef.current.setAttribute("filter", `url(#${filterId})`);
		turbRef.current.setAttribute("baseFrequency", String(baseFreq));
		dispRef.current.setAttribute("scale", String(maxScale));

		const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

		const tick = (now) => {
			if (!start) start = now + delay;
			const t = Math.max(0, Math.min(1, (now - start) / duration));
			// fade strength from 1 → 0 with ease-out
			const k = 1 - easeOutCubic(t);
			const freq = baseFreq * k;
			const scale = maxScale * k;

			// update filter
			turbRef.current.setAttribute("baseFrequency", freq.toFixed(5));
			dispRef.current.setAttribute("scale", scale.toFixed(2));

			if (t < 1) {
				raf = requestAnimationFrame(tick);
			} else {
				// remove filter so it rests perfectly crisp
				groupRef.current.removeAttribute("filter");
				onSettled?.();
			}
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [reduce, duration, delay, baseFreq, maxScale, filterId, onSettled]);

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 584" {...props}>
			<defs>
				<clipPath id="logo-clip" clipPathUnits="userSpaceOnUse">
					<path d="M 0,438.123 H 480 V 0 H 0 Z" />
				</clipPath>

				{/* Flag wave filter */}
				<filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
					{/* Coarse noise for cloth ripples */}
					<feTurbulence
						ref={turbRef}
						type="fractalNoise"
						baseFrequency={baseFreq}
						numOctaves="2"
						seed="7"
						result="noise"
					/>
					{/* Smooth the noise a touch */}
					<feGaussianBlur in="noise" stdDeviation="0.4" result="blurred" />
					{/* Displace geometry by the noise (strength animated via scale) */}
					<feDisplacementMap
						ref={dispRef}
						in="SourceGraphic"
						in2="blurred"
						scale={maxScale}
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</defs>

			<g transform="matrix(1.3333333,0,0,-1.3333333,0,584)">
				<g clipPath="url(#logo-clip)">
					{/* we attach/remove the filter on this group */}
					<g ref={groupRef} transform="translate(240,349.1163)">
						<path
							d="m 0,0 c -53.333,31.2 -106.667,-31.2 -160,0 v -180 c 51.816,-30.312 103.632,27.716 155.448,2.431 l 1.086,26.642 c 0.138,2.822 -2.384,5.038 -5.164,4.539 l -36.96,-6.625 5.024,14.857 c 0.476,1.408 0.021,2.964 -1.14,3.892 l -39.668,31.763 6.802,3.369 c 1.498,0.741 2.271,2.43 1.855,4.049 l -6.709,26.1 20.846,-4.985 c 1.643,-0.393 3.335,0.431 4.038,1.967 l 5.421,11.845 18.906,-20.812 c 2.429,-2.673 6.831,-0.414 6.075,3.118 l -9.401,43.917 13.967,-8.425 c 1.736,-1.048 3.995,-0.424 4.948,1.366 L 0,-13.515 14.626,-40.992 c 0.952,-1.79 3.212,-2.414 4.948,-1.366 l 13.967,8.425 -9.401,-43.917 c -0.756,-3.532 3.646,-5.791 6.075,-3.118 l 18.906,20.812 5.421,-11.845 c 0.703,-1.536 2.395,-2.36 4.038,-1.967 l 20.846,4.985 -6.709,-26.1 c -0.416,-1.619 0.357,-3.308 1.855,-4.049 l 6.801,-3.369 -39.668,-31.763 c -1.16,-0.928 -1.615,-2.484 -1.139,-3.892 l 5.024,-14.857 -36.959,6.625 c -2.781,0.499 -5.303,-1.717 -5.165,-4.539 l 1.086,-26.642 C 56.368,-152.284 108.184,-210.312 160,-180 V 0 C 106.666,-31.2 53.334,31.2 0,0 m 0,-240.109 c -53.333,31.2 -106.667,-31.201 -160,0 v -20 c 53.333,-31.201 106.667,31.2 160,0 53.333,31.2 106.667,-31.201 160,0 v 20 c -53.333,-31.201 -106.667,31.2 -160,0 m 0,40 c -53.333,31.2 -106.667,-31.201 -160,0 v -20 c 53.333,-31.201 106.667,31.2 160,0 53.333,31.2 106.667,-31.201 160,0 v 20 c -53.333,-31.201 -106.667,31.2 -160,0"
							fill={fill}
							stroke={stroke}
							strokeWidth={strokeWidth}
							vectorEffect={strokeWidth ? "non-scaling-stroke" : undefined}
							strokeLinejoin="round"
						/>
					</g>
				</g>
			</g>
		</svg>
	);
}
