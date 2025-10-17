// src/pages/TeamReflectionPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Users, ClipboardList, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DownloadsPanel from "../components/toc/DownloadsPanel.jsx";
import { TEAM_CONTENT } from "../constants/content.js";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function TeamReflectionPage({
	content,
	notes,
	onNotes,

	// Mirror ContentsPage: parent is the single source of truth.
	// If not provided, we fall back to allActivitiesCompleted the same way your top-level gating does.
	reflectionsReady,
	allActivitiesCompleted = false,

	onDownloadAllReflections,
}) {
	// THEME
	const ACCENT = "#67AAF9";
	const wrap = "max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6";
	const card = "rounded-2xl border border-gray-200 bg-white shadow-sm";
	const ringAccent = `focus:outline-none focus-visible:ring-2 focus-visible:ring-[${ACCENT}] focus-visible:ring-offset-2`;

	// Content source
	const mergedContent = useMemo(() => {
		return {
			...TEAM_CONTENT,
			...(content || {}),
			steps:
				Array.isArray(content?.steps) && content.steps.length
					? content.steps
					: TEAM_CONTENT.steps,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content]);

	// MODEL (text + checks)
	const model = useMemo(() => {
		if (typeof notes === "string") return { text: notes, checks: [] };
		return {
			text: notes?.text ?? "",
			checks: Array.isArray(notes?.checks) ? notes.checks : [],
		};
	}, [notes]);

	const [text, setText] = useState(model.text);
	const [checks, setChecks] = useState(() => {
		const total = mergedContent?.steps?.length ?? 0;
		return Array.from({ length: total }, (_, i) => !!model.checks[i]);
	});

	// Persist to parent (exporter reads notes.team)
	useEffect(() => {
		onNotes?.({ ...model, text, checks });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [text, checks]);

	// UI helpers
	const totalSteps = mergedContent?.steps?.length ?? 0;
	const completed = checks.filter(Boolean).length;
	const pct = totalSteps ? Math.round((completed / totalSteps) * 100) : 0;

	// Saved blip
	const [saved, setSaved] = useState(false);
	useEffect(() => {
		setSaved(true);
		const t = setTimeout(() => setSaved(false), 800);
		return () => clearTimeout(t);
	}, [text, checks]);

	// Celebrate at 100%
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

	// Hint glow
	const [showHint, setShowHint] = useState(() => !model.checks?.some(Boolean));
	useEffect(() => {
		const t = setTimeout(() => setShowHint(false), 8000);
		return () => clearTimeout(t);
	}, []);
	const firstUncheckedIndex = checks.findIndex((c) => !c);
	const shouldHintIndex =
		showHint && firstUncheckedIndex !== -1 ? firstUncheckedIndex : -1;

	const glowKeyframes = {
		boxShadow: [
			`0 0 0 0 ${ACCENT}00`,
			`0 0 0 6px ${ACCENT}14`,
			`0 0 0 0 ${ACCENT}00`,
		],
		scale: [1, 1.05, 1],
	};

	// quick prompts
	const quickPrompts = Array.isArray(mergedContent.quickPrompts)
		? mergedContent.quickPrompts
		: [
				"One thing that surprised me…",
				"A perspective I hadn’t considered…",
				"Where I might follow up…",
				"How this connects to my work…",
		  ];

	const wordCount = (text || "").trim() ? text.trim().split(/\s+/).length : 0;

	// labels
	const INSTRUCTION_PILL = mergedContent.instructionPill || "Instruction";
	const INSTRUCTIONS_HTML = mergedContent.instructionsHtml || "";
	const STEPS_HEADING = mergedContent.stepsHeading || "Steps";
	const SAVED_LABEL = mergedContent.savedLabel || "Saved";
	const CLICK_TO_MARK = mergedContent.clickToMark || "Click to mark";
	const STEPS_COMPLETE_MSG =
		mergedContent.stepsCompleteMessage || "Great—steps complete!";
	const REFLECTION_PROMPT = mergedContent.reflectionPrompt || "Reflection";
	const REFLECTION_PLACEHOLDER =
		mergedContent.reflectionPlaceholder || "Write a few sentences…";
	const NOTES_SAVE_TIP =
		mergedContent.notesSaveTip ||
		"Tip: notes save automatically in this lesson.";
	const WORD_LABEL_SINGULAR = mergedContent.wordsLabelSingular || "word";
	const WORD_LABEL_PLURAL = mergedContent.wordsLabelPlural || "words";

	// EXACTLY like ContentsPage: trust the parent-provided reflectionsReady.
	// If parent doesn't pass it, fall back to allActivitiesCompleted, else false.
	const reflectionsGate =
		typeof reflectionsReady === "boolean"
			? reflectionsReady
			: Boolean(allActivitiesCompleted);

	// Debug breadcrumb if you need to see what’s happening at runtime:
	// console.debug("TeamReflectionPage gate:", { reflectionsReady, allActivitiesCompleted, reflectionsGate });

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			{/* Accent gradient overlay */}
			<motion.div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha(ACCENT, "33")} 0%,
            ${withAlpha(ACCENT, "1F")} 35%,
            rgba(255,255,255,0) 65%,
            rgba(248,250,252,1) 100%
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.3 }}
				transition={{ duration: 0.6 }}
			/>

			{/* Content wrapper */}
			<div className={`relative z-10 ${wrap}`}>
				{/* Header */}
				<header className="text-center space-y-4">
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							{mergedContent?.title || "Team Reflection"}
						</h1>
						<Users
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: ACCENT }}
						/>
					</div>

					{/* Instructions */}
					<aside
						role="note"
						aria-label="Team reflection instructions"
						className="mx-auto max-w-3xl rounded-2xl border bg-white/85 backdrop-blur-sm px-5 py-4 text-base sm:text-lg leading-relaxed shadow-[0_1px_0_rgba(0,0,0,0.05)]"
						style={{ borderColor: withAlpha(ACCENT, "33") }}
					>
						<div className="flex flex-col items-center gap-3 text-center">
							<div
								className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold"
								style={{
									backgroundColor: withAlpha(ACCENT, "15"),
									color: ACCENT,
								}}
								aria-hidden="true"
							>
								{INSTRUCTION_PILL}
							</div>

							{INSTRUCTIONS_HTML ? (
								<div
									className="text-slate-800 max-w-2xl"
									style={{ color: ACCENT }}
									dangerouslySetInnerHTML={{ __html: INSTRUCTIONS_HTML }}
								/>
							) : (
								<p
									className="text-slate-800 max-w-2xl"
									style={{ color: ACCENT }}
								>
									{mergedContent.instructionText ||
										"To make the most of your team discussions during the learning quest, follow these steps to create a safe, respectful, and reflective learning environment."}
								</p>
							)}
						</div>
					</aside>
				</header>

				{/* Steps + progress (pure UX, not gating) */}
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
							<h2 className="text-lg font-semibold text-slate-900">
								{STEPS_HEADING}
							</h2>
						</div>

						<AnimatePresence>
							{saved && (
								<motion.div
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									className="text-xs font-medium text-slate-600"
								>
									{SAVED_LABEL}
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

					{/* Steps list */}
					<ol className="space-y-4">
						{mergedContent?.steps?.map((s, i) => {
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
											setShowHint(false);
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
													{CLICK_TO_MARK}
												</span>
											)}
										</div>
										<ul className="mt-1.5 list-disc list-outside pl-5 text-[15px] leading-6 text-slate-700 space-y-1">
											{Array.isArray(s.items) && s.items.length ? (
												s.items.map((it, k) => <li key={k}>{it}</li>)
											) : (
												<li className="text-slate-500">No items</li>
											)}
										</ul>
									</div>
								</li>
							);
						})}
					</ol>

					{/* Done pulse */}
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
									{STEPS_COMPLETE_MSG}
								</span>
							</motion.div>
						)}
					</AnimatePresence>
				</section>

				{/* Notes */}
				<section className="grid  gap-6">
					<div className={`${card} p-4 sm:p-5`}>
						<div className="flex items-center justify-between">
							<label
								htmlFor="reflection"
								className="block text-sm font-medium text-slate-800"
							>
								{REFLECTION_PROMPT}
							</label>
							<span className="text-xs text-slate-500">
								{wordCount}{" "}
								{wordCount === 1 ? WORD_LABEL_SINGULAR : WORD_LABEL_PLURAL}
							</span>
						</div>

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
							placeholder={REFLECTION_PLACEHOLDER}
							className={`mt-3 w-full min-h-40 bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 resize-vertical ${ringAccent}`}
						/>
						<p className="mt-2 text-xs text-slate-500">{NOTES_SAVE_TIP}</p>
					</div>
				</section>

				{/* Downloads — EXACTLY like Contents: driven by parent/reflection gate */}
				<DownloadsPanel
					reflectionsReady={reflectionsReady}
					onDownloadAllReflections={onDownloadAllReflections}
				/>
			</div>
		</div>
	);
}
