import React, { useMemo, useState, useEffect } from "react";
import { Users, ClipboardList, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommitmentsCard from "../components/CommitmentsCard";

export default function TeamReflectionPage({ content, notes, onNotes }) {
	// ---- THEME (change ACCENT to match your set) ------------------------------
	const ACCENT = "#67AAF9";
	const wrap = "max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6";
	const card = "rounded-2xl border border-gray-200 bg-white shadow-sm";
	const ringAccent = `focus:outline-none focus-visible:ring-2 focus-visible:ring-[${ACCENT}] focus-visible:ring-offset-2`;

	// ---- MODEL ----------------------------------------------------------------
	const model = useMemo(() => {
		if (typeof notes === "string")
			return { text: notes, commitments: [], checks: [] };
		return {
			text: notes?.text ?? "",
			commitments: notes?.commitments ?? [],
			checks: Array.isArray(notes?.checks) ? notes.checks : [],
		};
	}, [notes]);

	const [text, setText] = useState(model.text);
	const [checks, setChecks] = useState(() => {
		const total = content?.steps?.length ?? 0;
		const base = Array.from({ length: total }, (_, i) => !!model.checks[i]);
		return base;
	});

	// Persist text/steps to parent
	useEffect(() => {
		onNotes({ ...model, text, checks });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [text, checks]);

	const addCommitment = (t) =>
		onNotes({ ...model, text, checks, commitments: [...model.commitments, t] });

	const removeCommitment = (idx) => {
		const next = [...model.commitments];
		next.splice(idx, 1);
		onNotes({ ...model, text, checks, commitments: next });
	};

	// ---- UI state helpers -----------------------------------------------------
	const totalSteps = content?.steps?.length ?? 0;
	const completed = checks.filter(Boolean).length;
	const pct = totalSteps ? Math.round((completed / totalSteps) * 100) : 0;

	// Saved blip
	const [saved, setSaved] = useState(false);
	useEffect(() => {
		setSaved(true);
		const t = setTimeout(() => setSaved(false), 800);
		return () => clearTimeout(t);
	}, [text, checks, model.commitments]);

	// Small celebratory pulse when 100% reached (not on first render if already complete)
	const [didCelebrate, setDidCelebrate] = useState(
		completed === totalSteps && totalSteps > 0
	);
	useEffect(() => {
		if (totalSteps > 0 && completed === totalSteps && !didCelebrate) {
			setDidCelebrate(true);
			const t = setTimeout(() => setDidCelebrate(false), 700);
			return () => clearTimeout(t);
		}
	}, [completed, totalSteps, didCelebrate]);

	// ---- ATTENTION HINT (glow) ------------------------------------------------
	// Show a gentle glow on the FIRST unchecked button to suggest it’s clickable.
	// Stops after any interaction or 8s.
	const [showHint, setShowHint] = useState(() => !model.checks?.some(Boolean));
	useEffect(() => {
		const t = setTimeout(() => setShowHint(false), 8000);
		return () => clearTimeout(t);
	}, []);
	const firstUncheckedIndex = checks.findIndex((c) => !c);
	const shouldHintIndex =
		showHint && firstUncheckedIndex !== -1 ? firstUncheckedIndex : -1;

	// Glow keyframes (box-shadow + scale)
	const glowKeyframes = {
		boxShadow: [
			`0 0 0 0 ${ACCENT}00`,
			`0 0 0 6px ${ACCENT}14`, // ~8% alpha
			`0 0 0 0 ${ACCENT}00`,
		],
		scale: [1, 1.05, 1],
	};

	// Quick prompts
	const quickPrompts = [
		"One thing that surprised us…",
		"A perspective we hadn’t considered…",
		"Where we might follow up…",
		"How this connects to our work…",
	];

	// Word count
	const wordCount = (text || "").trim() ? text.trim().split(/\s+/).length : 0;

	// ---- RENDER ---------------------------------------------------------------
	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className={wrap}>
				{/* Header */}
				<header className="text-center space-y-2">
					<p
						className="font-semibold uppercase tracking-wide text-sm sm:text-base"
						style={{ color: ACCENT }}
					>
						Team Exercise
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							{content?.title || "Team Reflection"}
						</h1>
						<Users
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: ACCENT }}
						/>
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						A short, structured check-in for the team.
					</p>
				</header>

				{/* Steps + progress */}
				<section className={`${card} p-4 sm:p-5`}>
					<div className="flex items-center justify-between gap-3 mb-4">
						<div className="flex items-center gap-2">
							<div
								className="w-10 h-10 rounded-xl grid place-items-center border"
								style={{
									color: ACCENT,
									backgroundColor: `${ACCENT}1A`,
									borderColor: `${ACCENT}33`,
								}}
								aria-hidden="true"
							>
								<ClipboardList className="w-5 h-5" />
							</div>
							<h2 className="text-lg font-semibold text-slate-900">Steps</h2>
						</div>

						{/* Saved blip */}
						<AnimatePresence>
							{saved && (
								<motion.div
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									className="text-xs font-medium text-slate-600"
								>
									Saved
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Progress bar */}
					<div className="mb-4">
						<div className="flex items-center justify-between text-sm text-slate-600 mb-1">
							<span>
								{completed} / {totalSteps} completed
							</span>
							<span>{pct}%</span>
						</div>
						<div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
							<motion.div
								className="h-full"
								style={{ backgroundColor: ACCENT }}
								initial={false}
								animate={{ width: `${pct}%` }}
								transition={{ type: "spring", stiffness: 240, damping: 28 }}
							/>
						</div>
					</div>

					{/* Steps list with check toggles */}
					<ol className="space-y-4">
						{content?.steps?.map((s, i) => {
							const isChecked = !!checks[i];
							const isHinted = i === shouldHintIndex;
							return (
								<li key={i} className="flex gap-3 sm:gap-4 items-start">
									<motion.button
										type="button"
										onClick={() => {
											setChecks((prev) => {
												const next = [...prev];
												next[i] = !next[i];
												return next;
											});
											setShowHint(false); // stop hint after first interaction
										}}
										className={`shrink-0 inline-flex items-center justify-center rounded-full border w-9 h-9 ${ringAccent}`}
										style={{
											borderColor: isChecked ? `${ACCENT}66` : "#e5e7eb",
											backgroundColor: isChecked ? `${ACCENT}1A` : "white",
											color: isChecked ? ACCENT : "#64748b",
										}}
										aria-pressed={isChecked}
										aria-label={
											isChecked ? `Unmark step ${i + 1}` : `Mark step ${i + 1}`
										}
										title={isChecked ? "Unmark complete" : "Mark complete"}
										whileHover={{ scale: 1.06 }}
										whileTap={{ scale: 0.96 }}
										// Gentle glow loop only for the first unchecked step while hint is active
										animate={
											isHinted
												? glowKeyframes
												: { boxShadow: "0 0 0 0 rgba(0,0,0,0)", scale: 1 }
										}
										transition={
											isHinted
												? {
														repeat: Infinity,
														repeatType: "loop",
														duration: 1.6,
														ease: "easeInOut",
												  }
												: { duration: 0.2 }
										}
									>
										{isChecked ? (
											<CheckCircle2 className="w-5 h-5" />
										) : (
											<span className="text-sm">{i + 1}</span>
										)}
									</motion.button>

									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<h3 className="font-medium text-slate-900">
												{s.heading}
											</h3>
											{isHinted && (
												<span
													className="text-[11px] px-2 py-0.5 rounded-full"
													style={{
														color: ACCENT,
														backgroundColor: `${ACCENT}0D`,
														border: `1px solid ${ACCENT}2e`,
													}}
												>
													Click to mark
												</span>
											)}
										</div>
										<ul className="mt-1.5 list-disc list-outside pl-5 text-[15px] leading-6 text-slate-700 space-y-1">
											{s.items.map((it, k) => (
												<li key={k}>{it}</li>
											))}
										</ul>
									</div>
								</li>
							);
						})}
					</ol>

					{/* Little pulse when all complete */}
					<AnimatePresence>
						{totalSteps > 0 && completed === totalSteps && (
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ type: "spring", stiffness: 220, damping: 16 }}
								className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
								style={{
									backgroundColor: `${ACCENT}0D`,
									color: ACCENT,
									border: `1px solid ${ACCENT}33`,
								}}
							>
								<Sparkles className="w-4 h-4" />
								<span className="text-sm font-medium">
									Great—steps complete!
								</span>
							</motion.div>
						)}
					</AnimatePresence>
				</section>

				{/* Notes + Commitments */}
				<section className="grid md:grid-cols-2 gap-6">
					{/* Reflection */}
					<div className={`${card} p-4 sm:p-5`}>
						<div className="flex items-center justify-between">
							<label
								htmlFor="reflection"
								className="block text-sm font-medium text-slate-800"
							>
								{content?.reflectionPrompt || "Reflection"}
							</label>
							<span className="text-xs text-slate-500">{wordCount} words</span>
						</div>

						{/* quick prompts */}
						<div className="mt-2 flex flex-wrap gap-2">
							{quickPrompts.map((p) => (
								<button
									key={p}
									type="button"
									onClick={() =>
										setText((t) => (t ? `${t}\n\n${p} ` : `${p} `))
									}
									className={`rounded-full px-3 py-1.5 text-sm ${ringAccent}`}
									style={{
										color: ACCENT,
										backgroundColor: `${ACCENT}0D`,
										border: `1px solid ${ACCENT}33`,
									}}
									title="Insert prompt"
								>
									{p}
								</button>
							))}
						</div>

						<textarea
							id="reflection"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Write a few sentences…"
							className={`mt-3 w-full min-h-40 bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 resize-vertical ${ringAccent}`}
						/>
						<p className="mt-2 text-xs text-slate-500">
							Tip: notes save automatically in this lesson.
						</p>
					</div>

					{/* Commitments */}
					<div className={`${card} p-4 sm:p-5`}>
						<CommitmentsCard
							commitments={model.commitments}
							onAdd={addCommitment}
							onRemove={removeCommitment}
						/>
					</div>
				</section>
			</div>
		</div>
	);
}
