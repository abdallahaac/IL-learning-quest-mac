// src/pages/PreparationPage.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMap,
	faClock,
	faHandsHelping,
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

	const title = content?.title ?? "Preparation";
	const p0 = content?.paragraphs?.[0] ?? "";
	const p1 = content?.paragraphs?.[1] ?? "";

	const items = INTRO_INFO_CONTENT?.bullets?.[0]?.items ?? [];

	return (
		<div className="relative bg-transparent min-h-[100svh] pb-28">
			{/* gradient layer — kept per your requirement */}
			<div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-sky-50/80 via-white/70 to-slate-50/80"
			/>

			{/* page */}
			<div className="relative z-10 px-4 py-10 sm:py-12 max-w-6xl mx-auto space-y-8">
				{/* header card */}
				<section className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-6 sm:p-8">
					<header className="space-y-2">
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
							Preparation
						</h1>
						{title && <p className="text-indigo-700/90 font-medium">{title}</p>}
					</header>

					{(p0 || p1) && (
						<div className="mt-4 space-y-3 text-gray-800 leading-relaxed">
							{p0 && <p>{p0}</p>}
							{p1 && <p>{p1}</p>}
						</div>
					)}

					{/* quick chips */}
					<div className="mt-5 flex flex-wrap gap-2">
						<span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
							Lightweight cadence
						</span>
						<span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
							Team-first
						</span>
						<span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700">
							Safe & supportive
						</span>
					</div>
				</section>

				{/* how it works */}
				<section className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg">
					<button
						type="button"
						onClick={() => setOpenTip((v) => (v === 1 ? 0 : 1))}
						className="w-full px-4 py-3 sm:px-6 flex items-center justify-between text-left group"
						aria-expanded={openTip === 1}
						aria-controls="how-content"
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setOpenTip((v) => (v === 1 ? 0 : 1));
							}
						}}
					>
						<span className="font-semibold text-gray-900">
							How does the Learning Quest work?
						</span>
						<FontAwesomeIcon
							icon={faChevronDown}
							className={`text-gray-500 transition-transform duration-300 group-hover:text-gray-700 ${
								openTip === 1 ? "rotate-180" : ""
							}`}
						/>
					</button>

					<div
						id="how-content"
						className={`grid transition-[grid-template-rows] duration-300 ease-out ${
							openTip === 1 ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
						}`}
						aria-hidden={openTip !== 1}
					>
						<div className="overflow-hidden">
							{/* timeline style list */}
							<ol className="px-4 sm:px-6 pb-5 relative">
								<div
									aria-hidden
									className="absolute left-7 top-0 bottom-4 w-px bg-gradient-to-b from-indigo-200 via-indigo-100 to-transparent"
								/>
								{items.map((it, i) => (
									<li key={i} className="pl-10 py-2">
										<div className="flex items-start gap-3">
											<span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold ring-2 ring-white">
												{i + 1}
											</span>
											<p className="text-sm leading-relaxed text-gray-800 bg-white/90 border border-gray-200 rounded-lg px-3 py-2.5">
												{it}
											</p>
										</div>
									</li>
								))}
							</ol>
						</div>
					</div>
				</section>

				{/* three cards */}
				<section className="grid md:grid-cols-3 gap-4">
					{tips.map((t) => (
						<article
							key={t.title}
							className="group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
						>
							<div className="flex items-center gap-3">
								<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 transition-transform group-hover:scale-105">
									<FontAwesomeIcon icon={t.icon} />
								</span>
								<h3 className="font-semibold text-gray-900">{t.title}</h3>
							</div>
							<p className="mt-3 text-gray-700">{t.body}</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{t.chips.map((c) => (
									<span
										key={c}
										className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700"
									>
										{c}
									</span>
								))}
							</div>
						</article>
					))}
				</section>
			</div>
		</div>
	);
}
