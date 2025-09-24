// src/pages/PreparationPage.jsx
import React, { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { INTRO_INFO_CONTENT } from "../constants/content.js";

/** sr-only helper */
function SrOnly({ children }) {
	return (
		<span className="absolute overflow-hidden w-px h-px p-0 m-[-1px] border-0 whitespace-nowrap clip-[rect(0,0,0,0)]">
			{children}
		</span>
	);
}

/** Accessible, uniform FlipCard */
function FlipCard({ step, backText }) {
	const [flipped, setFlipped] = useState(false);
	const [reduceMotion, setReduceMotion] = useState(false);
	const uid = useId();
	const frontId = `${uid}-front`;
	const backId = `${uid}-back`;

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onChange = () => setReduceMotion(!!mq.matches);
		onChange();
		mq.addEventListener?.("change", onChange);
		return () => mq.removeEventListener?.("change", onChange);
	}, []);

	return (
		<li className="relative">
			<div className="relative isolate [perspective:1000px]">
				<button
					type="button"
					className={[
						"group relative w-full",
						"h-56 sm:h-64 lg:h-72",
						"bg-white/95 border border-gray-200 rounded-xl shadow-sm",
						// focus ring swapped to #7443d6
						"focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7443d6] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
						"transition-transform duration-500 will-change-transform",
						flipped && !reduceMotion ? "[transform:rotateY(180deg)]" : "",
						"p-0",
					].join(" ")}
					aria-pressed={flipped}
					aria-describedby={flipped ? backId : frontId}
					onClick={() => setFlipped((v) => !v)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setFlipped((v) => !v);
						}
						if (e.key.toLowerCase() === "f") {
							e.preventDefault();
							setFlipped((v) => !v);
						}
					}}
					style={{ transformStyle: "preserve-3d" }}
				>
					{/* FRONT */}
					<div
						id={frontId}
						aria-hidden={flipped}
						className="absolute inset-0 grid place-items-center backface-hidden px-4"
						style={{ backfaceVisibility: "hidden" }}
					>
						<h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#7443d6] select-none">
							Step {step}
						</h4>
						<SrOnly>
							Press Enter or Space to flip and read the description.
						</SrOnly>
					</div>

					{/* BACK */}
					<div
						id={backId}
						aria-hidden={!flipped}
						className={[
							"absolute inset-0 backface-hidden",
							!reduceMotion ? "[transform:rotateY(180deg)]" : "",
							"grid place-items-center px-5 py-6",
						].join(" ")}
						style={{ backfaceVisibility: "hidden" }}
					>
						<div className="max-h-full w-full overflow-auto">
							<p className="text-md leading-relaxed text-gray-800 text-center">
								{backText}
							</p>
						</div>
						<p className="sr-only">Press Enter, Space, or F to flip back.</p>
					</div>

					{/* Sizer */}
					<div className="opacity-0 h-full w-full px-5 py-6">
						<h4 className="text-2xl font-bold">Step {step}</h4>
						<p className="mt-2 text-sm">{backText}</p>
					</div>
				</button>
			</div>
		</li>
	);
}

export default function PreparationPage({ content, onStartActivities }) {
	const title = content?.title ?? "Preparation";
	const p0 = content?.paragraphs?.[0] ?? "";
	const p1 = content?.paragraphs?.[1] ?? "";
	const items = INTRO_INFO_CONTENT?.bullets?.[0]?.items ?? [];
	const prefersReduced = useReducedMotion();

	// shared motion props (respect reduced motion)
	const fadeUp = prefersReduced
		? { initial: { opacity: 0 }, animate: { opacity: 1 } }
		: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

	const fastEase = prefersReduced
		? { duration: 0 }
		: { duration: 0.4, ease: "easeOut" };

	return (
		<div className="relative bg-transparent min-h-[100svh] ">
			{/* gradient (fades in) – shifted to purple family */}
			<motion.div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none
             bg-gradient-to-b from-[#7443d6]/80 via-white/60 to-slate-50/80"
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.1 }}
				transition={{ duration: 0.6, ease: "easeInOut" }}
			/>

			<div className="relative z-10 px-4 py-10 sm:py-12 max-w-6xl mx-auto space-y-8">
				{/* header card */}
				<motion.section
					{...fadeUp}
					transition={fastEase}
					className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-6 sm:p-8 text-center"
				>
					<header className="space-y-1">
						<h1 className="text-2xl font-bold text-[#7443d6]">Preparation</h1>
					</header>

					{(p0 || p1) && (
						<div className="mt-4 space-y-3 text-gray-800 leading-relaxed">
							{p0 && <p>{p0}</p>}
							{p1 && <p>{p1}</p>}
						</div>
					)}

					{/* chips REMOVED per request */}
				</motion.section>

				{/* HOW IT WORKS */}
				<motion.section
					{...fadeUp}
					transition={fastEase}
					className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 text-center"
				>
					<h2 className="text-2xl font-bold text-[#7443d6]">
						How does the Learning Quest work?
					</h2>

					{/* Responsive grid */}
					<ol className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
						{items.map((it, i) => (
							<FlipCard key={i} step={i + 1} backText={it} />
						))}
					</ol>
				</motion.section>
			</div>
		</div>
	);
}
