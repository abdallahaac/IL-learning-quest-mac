import React, { useMemo } from "react";
import CommitmentsCard from "../components/CommitmentsCard";

const wrap = "max-w-5xl mx-auto space-y-6";
const card = "bg-white/95 border border-gray-200/80 rounded-xl shadow-sm";

export default function TeamReflectionPage({ content, notes, onNotes }) {
	const model = useMemo(() => {
		if (typeof notes === "string") return { text: notes, commitments: [] };
		return { text: notes?.text ?? "", commitments: notes?.commitments ?? [] };
	}, [notes]);

	const setText = (value) => onNotes({ ...model, text: value });
	const addCommitment = (text) => {
		const t = text.trim();
		if (!t) return;
		onNotes({ ...model, commitments: [...model.commitments, t] });
	};
	const removeCommitment = (idx) => {
		const next = [...model.commitments];
		next.splice(idx, 1);
		onNotes({ ...model, commitments: next });
	};

	return (
		<div className="relative flex-1 px-4 py-8 bg-transparent">
			{/* subtle gradient overlay (above PatternMorph canvas, below content) */}
			<div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none
                   bg-gradient-to-b from-indigo-50/80 via-white/60 to-slate-50/80"
			/>
			{/* content */}
			<div className="relative z-10">
				<div className={wrap}>
					{/* Title */}
					<header className={card + " px-4 py-4"}>
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
							{content?.title || "Team Reflection"}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							A short, structured check-in for the team.
						</p>
					</header>

					{/* Steps */}
					<section className={card + " p-4"}>
						<ol className="space-y-5">
							{content?.steps?.map((s, i) => (
								<li key={i} className="flex gap-4">
									<div className="flex-none h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-xs sm:text-sm font-semibold">
										{i + 1}
									</div>
									<div className="min-w-0">
										<h3 className="font-medium text-gray-900">{s.heading}</h3>
										<ul className="mt-1.5 list-disc list-outside pl-5 text-[15px] leading-6 text-gray-700 space-y-1">
											{s.items.map((it, k) => (
												<li key={k}>{it}</li>
											))}
										</ul>
									</div>
								</li>
							))}
						</ol>
					</section>

					{/* Notes + Commitments */}
					<section className="grid md:grid-cols-2 gap-6">
						<div className={card + " p-4"}>
							<label
								htmlFor="reflection"
								className="block text-sm font-medium text-gray-800"
							>
								{content?.reflectionPrompt || "Reflection"}
							</label>
							<textarea
								id="reflection"
								value={model.text}
								onChange={(e) => setText(e.target.value)}
								placeholder="Write a few sentences…"
								className="mt-2 w-full min-h-40 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 resize-vertical"
							/>
							<p className="mt-2 text-xs text-gray-500">
								Tip: notes save automatically in this lesson.
							</p>
						</div>

						<div className={card + " p-4"}>
							<CommitmentsCard
								commitments={model.commitments}
								onAdd={addCommitment}
								onRemove={removeCommitment}
							/>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
