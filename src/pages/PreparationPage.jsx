// src/pages/PreparationPage.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMap,
	faClock,
	faHandsHelping,
	faFeather,
	faSeedling,
	faBook,
	faChevronDown,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { INTRO_INFO_CONTENT } from "../constants/content.js";

export default function PreparationPage({ content, onStartActivities }) {
	const [openTip, setOpenTip] = useState(0);

	const tips = [
		{
			title: "Plan your path",
			icon: faMap,
			body: "Decide together which nations, languages or regions you’ll explore. Set a simple sequence—weekly, bi-weekly, or monthly.",
			chips: ["Team-first", "Flexible pacing", "Shared curiosity"],
		},
		{
			title: "Make room for time",
			icon: faClock,
			body: "Block small focus windows (20–40 minutes) for solo discovery between check-ins. Light, regular cadence wins.",
			chips: ["20–40 min", "Async friendly", "Low friction"],
		},
		{
			title: "Create a safe space",
			icon: faHandsHelping,
			body: "Agree on norms: listen generously, assume good intent, and keep stories confidential unless consent is given.",
			chips: ["Respect", "Consent", "Care"],
		},
	];

	const starter = [
		{
			icon: faFeather,
			text: "Best media by Indigenous voices (starter mural)",
		},
		{ icon: faSeedling, text: "Local plants & traditional uses" },
		{ icon: faBook, text: "Books, films, music by Indigenous creators" },
	];

	return (
		// relative wrapper so we can layer a gradient between the canvas and content
		<div className="relative bg-transparent">
			{/* gradient overlay (above PatternMorph canvas, below content) */}
			<div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none
                   bg-gradient-to-b from-sky-50/85 via-white/75 to-slate-50/85"
			/>

			{/* content layer */}
			<div className="relative z-10 flex-1 px-4 py-10 sm:py-12 max-w-5xl mx-auto space-y-8">
				<header className="text-center space-y-2">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
						{content.title}
					</h2>
					<p className="text-gray-700 max-w-3xl mx-auto">
						{content.paragraphs[0]}
					</p>
					<p className="text-gray-700 max-w-3xl mx-auto">
						{content.paragraphs[1]}
					</p>
				</header>

				<section className="grid md:grid-cols-3 gap-4">
					{tips.map((t) => (
						<article
							key={t.title}
							className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm"
						>
							<div className="flex items-center gap-3">
								<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
									<FontAwesomeIcon icon={t.icon} />
								</span>
								<h3 className="font-semibold text-gray-900">{t.title}</h3>
							</div>
							<p className="mt-3 text-gray-700">{t.body}</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{t.chips.map((c) => (
									<span
										key={c}
										className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700"
									>
										{c}
									</span>
								))}
							</div>
						</article>
					))}
				</section>

				<section className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
					<button
						type="button"
						onClick={() => setOpenTip((v) => (v === 1 ? 0 : 1))}
						className="w-full px-4 py-3 flex items-center justify-between text-left"
						aria-expanded={openTip === 1}
					>
						<span className="font-semibold text-gray-900">
							How does the Learning Quest work?
						</span>
						<FontAwesomeIcon
							icon={faChevronDown}
							className={`text-gray-500 transition-transform ${
								openTip === 1 ? "rotate-180" : ""
							}`}
						/>
					</button>
					<div
						className={`grid transition-[grid-template-rows] duration-300 ease-out ${
							openTip === 1 ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
						}`}
						aria-hidden={openTip !== 1}
					>
						<div className="overflow-hidden">
							<ul className="px-4 pb-4 list-disc list-inside space-y-2 text-gray-700">
								{INTRO_INFO_CONTENT.bullets[0].items.map((it, i) => (
									<li key={i}>{it}</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				<section className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
					<h3 className="font-semibold text-gray-900">
						Need a starting point?
					</h3>
					<ul className="mt-3 grid sm:grid-cols-3 gap-3">
						{starter.map((s) => (
							<li
								key={s.text}
								className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 bg-white/90"
							>
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
									<FontAwesomeIcon icon={s.icon} />
								</span>
								<span className="text-gray-800">{s.text}</span>
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
