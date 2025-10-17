import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	GalleryCards,
	Checklist,
	Flashcards,
	MediaCards,
} from "./ActivityViews.jsx";
import {
	Palette,
	Leaf,
	Utensils,
	Globe2,
	Film,
	BookOpen,
	Feather,
	HeartHandshake,
	Newspaper,
	Store,
} from "lucide-react";
import NoteComposer from "./NoteComposer.jsx";

/** Icons for activities 1..10 (index 0..9) */
const ICONS = [
	Palette,
	Leaf,
	Utensils,
	Globe2,
	Film,
	BookOpen,
	Feather,
	HeartHandshake,
	Newspaper,
	Store,
];

/** Per-activity color palette (explicit TW classes so they aren’t purged) */
const PALETTES = [
	{
		text: "text-sky-700",
		ring: "focus-visible:ring-sky-700",
		btn: "bg-sky-700 hover:bg-sky-800 active:bg-sky-900",
		badgeBg: "bg-sky-50",
		border: "border-sky-100",
	},
	{
		text: "text-emerald-700",
		ring: "focus-visible:ring-emerald-700",
		btn: "bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900",
		badgeBg: "bg-emerald-50",
		border: "border-emerald-100",
	},
	{
		text: "text-amber-700",
		ring: "focus-visible:ring-amber-700",
		btn: "bg-amber-700 hover:bg-amber-800 active:bg-amber-900",
		badgeBg: "bg-amber-50",
		border: "border-amber-100",
	},
	{
		text: "text-indigo-700",
		ring: "focus-visible:ring-indigo-700",
		btn: "bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900",
		badgeBg: "bg-indigo-50",
		border: "border-indigo-100",
	},
	{
		text: "text-rose-700",
		ring: "focus-visible:ring-rose-700",
		btn: "bg-rose-700 hover:bg-rose-800 active:bg-rose-900",
		badgeBg: "bg-rose-50",
		border: "border-rose-100",
	},
	{
		text: "text-cyan-700",
		ring: "focus-visible:ring-cyan-700",
		btn: "bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900",
		badgeBg: "bg-cyan-50",
		border: "border-cyan-100",
	},
	{
		text: "text-fuchsia-700",
		ring: "focus-visible:ring-fuchsia-700",
		btn: "bg-fuchsia-700 hover:bg-fuchsia-800 active:bg-fuchsia-900",
		badgeBg: "bg-fuchsia-50",
		border: "border-fuchsia-100",
	},
	{
		text: "text-lime-700",
		ring: "focus-visible:ring-lime-700",
		btn: "bg-lime-700 hover:bg-lime-800 active:bg-lime-900",
		badgeBg: "bg-lime-50",
		border: "border-lime-100",
	},
	{
		text: "text-orange-700",
		ring: "focus-visible:ring-orange-700",
		btn: "bg-orange-700 hover:bg-orange-800 active:bg-orange-900",
		badgeBg: "bg-orange-50",
		border: "border-orange-100",
	},
	{
		text: "text-violet-700",
		ring: "focus-visible:ring-violet-700",
		btn: "bg-violet-700 hover:bg-violet-800 active:bg-violet-900",
		badgeBg: "bg-violet-50",
		border: "border-violet-100",
	},
];

// Normalize notes to an object
const toObj = (n) =>
	typeof n === "string" || !n
		? { text: n || "", bullets: [], tags: [] }
		: {
				text: n.text || "",
				bullets: n.bullets || [],
				tags: n.tags || [],
				checks: n.checks || {},
				cards: n.cards || [],
				examplesDismissed: !!n.examplesDismissed,
		  };

export default function Activity({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	activityIndex,
}) {
	const idx = activityIndex ?? 0;
	const activityNumber = idx + 1;
	const Icon = ICONS[idx] ?? Palette;
	const palette = PALETTES[idx % PALETTES.length] || PALETTES[0];

	const prefersReduced = useReducedMotion();

	// local state for the Languages editor (index 6)
	const [newFront, setNewFront] = useState("");
	const [newBack, setNewBack] = useState("");

	// ----- BODY CONTENT -----
	let body = null;

	// Activity 1 — force two columns & center the grid
	// Activity 1 — force two columns & center the grid
	if (idx === 0) {
		// Your two links (in order)
		const links = [
			"https://www.thecanadianencyclopedia.ca/en/article/important-indigenous-artists",
			"https://www.thecanadianencyclopedia.ca/en/article/influential-indigenous-musicians",
		];

		// Build items by pairing each title in content.resources with its link
		const items = (content.resources ?? [])
			.slice(0, links.length)
			.map((title, i) => ({
				title,
				desc: "Explore this recommendation",
				href: links[i] || "#",
			}));

		body = (
			<div className="mx-auto max-w-5xl">
				<GalleryCards
					className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-content-center"
					items={items}
					palette={palette}
				/>
				``
			</div>
		);
	} else if (idx === 1) {
		const model = toObj(notes);
		const checks = model.checks || {};
		body = (
			<div className="mx-auto w-full max-w-3xl">
				<Checklist
					items={[
						"Identify 3 local medicinal plants",
						"Find sources on traditional uses",
						"Note seasonal availability",
					]}
					checked={checks}
					onToggle={(id) => {
						const next = { ...checks, [id]: !checks[id] };
						onNotes({ ...model, checks: next });
					}}
					palette={palette}
				/>
			</div>
		);
	} else if (idx === 6) {
		// LANGUAGES activity — editable pairs with examples (neutral)
		const model = toObj(notes);
		const hasUserCards = Array.isArray(model.cards) && model.cards.length > 0;
		const showExamples = !hasUserCards && !model.examplesDismissed;

		const exampleCards = [
			{ front: "hello", back: "greeting" },
			{ front: "friend", back: "companion" },
			{ front: "water", back: "H₂O" },
		];

		const cards = hasUserCards ? model.cards : showExamples ? exampleCards : [];

		const addCard = () => {
			const f = newFront.trim();
			const b = newBack.trim();
			if (!f || !b) return;
			const next = Array.isArray(model.cards) ? model.cards.slice() : [];
			next.push({ front: f, back: b });
			onNotes({ ...model, cards: next, examplesDismissed: true });
			setNewFront("");
			setNewBack("");
		};

		const updateCard = (i, field, val) => {
			const next = Array.isArray(model.cards) ? model.cards.slice() : [];
			if (!next[i]) return;
			next[i] = { ...next[i], [field]: val };
			onNotes({ ...model, cards: next, examplesDismissed: true });
		};

		const removeCard = (i) => {
			const next = Array.isArray(model.cards) ? model.cards.slice() : [];
			next.splice(i, 1);
			onNotes({ ...model, cards: next, examplesDismissed: true });
		};

		body = (
			<div className="mx-auto w-full max-w-3xl space-y-6">
				{showExamples && (
					<div
						className={`rounded-xl border ${palette.border} ${palette.badgeBg} p-4 text-center`}
					>
						<p className={`text-sm ${palette.text}`}>
							You’re seeing <span className="font-semibold">examples</span>. Add
							your own words below — the flashcards update automatically.
						</p>
						<div className="mt-3 flex items-center justify-center gap-2">
							<button
								type="button"
								onClick={() => onNotes({ ...model, examplesDismissed: true })}
								className={`px-3 py-1.5 rounded-lg text-white ${palette.btn} transition focus:outline-none ${palette.ring} focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
							>
								Got it
							</button>
							<button
								type="button"
								onClick={() =>
									onNotes({ ...model, cards: [], examplesDismissed: true })
								}
								className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
							>
								Hide examples
							</button>
						</div>
					</div>
				)}

				{/* Add word + translation */}
				<div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
					<h3 className={`text-lg font-semibold text-center ${palette.text}`}>
						Add a word and its translation
					</h3>
					<p className="text-xs text-slate-600 text-center mt-1">
						Example: <em>term</em> → <em>meaning</em>
					</p>
					<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
						<input
							value={newFront}
							onChange={(e) => setNewFront(e.target.value)}
							placeholder="Word (front)"
							className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2 ${palette.ring}`}
						/>
						<input
							value={newBack}
							onChange={(e) => setNewBack(e.target.value)}
							placeholder="Translation (back)"
							className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2 ${palette.ring}`}
						/>
					</div>
					<div className="mt-3 flex justify-center">
						<button
							type="button"
							onClick={addCard}
							disabled={!newFront.trim() || !newBack.trim()}
							className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${palette.btn} disabled:opacity-50 focus:outline-none ${palette.ring} focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
						>
							Add
						</button>
					</div>
				</div>

				{/* Editable list */}
				<div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
					<h4 className="text-sm font-medium text-slate-700 text-center">
						Your word list
					</h4>
					<div className="mt-3 space-y-3">
						{cards.length > 0 ? (
							cards.map((c, i) => (
								<div
									key={i}
									className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center"
								>
									<input
										value={c.front}
										onChange={(e) => updateCard(i, "front", e.target.value)}
										aria-label={`Word ${i + 1}`}
										className={`rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2 ${palette.ring}`}
									/>
									<span className="text-xs text-slate-500 px-1">→</span>
									<input
										value={c.back}
										onChange={(e) => updateCard(i, "back", e.target.value)}
										aria-label={`Translation ${i + 1}`}
										className={`rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2 ${palette.ring}`}
									/>
									<button
										type="button"
										onClick={() => removeCard(i)}
										className="ml-2 text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
										title="Remove"
									>
										Remove
									</button>
								</div>
							))
						) : (
							<p className="text-sm text-slate-500 text-center">
								No words yet — add your first above.
							</p>
						)}
					</div>
				</div>

				{/* Flashcards preview (palette-aware & empty-safe) */}
				<div className="space-y-2">
					<div className="flex items-center justify-center gap-2">
						<span
							className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${palette.badgeBg} ${palette.text}`}
						>
							{showExamples ? "Examples" : "Preview"}
						</span>
						{showExamples && (
							<span className="text-xs text-slate-600">
								These are sample cards. Add your own above.
							</span>
						)}
					</div>
					<Flashcards cards={cards} palette={palette} />
				</div>
			</div>
		);
	} else {
		body = (
			<div className="mx-auto w-full max-w-3xl">
				<MediaCards
					items={(content.resources ?? []).map((t) => ({
						title: t,
						desc: content.prompt,
					}))}
					palette={palette}
				/>
			</div>
		);
	}

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			{/* fixed, fading gradient — matches Preparation/Intro */}
			<motion.div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-sky-700/5 from-10% via-white/30 via-95% to-slate-50/40"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={
					useReducedMotion
						? { duration: 0 }
						: { duration: 0.6, ease: "easeOut" }
				}
			/>

			{/* content */}
			<div className="relative z-10 flex-1">
				<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
					{/* Centered header (number before icon) */}
					<header className="text-center space-y-2">
						<p
							className={`text-xs font-semibold uppercase tracking-wide ${palette.text}`}
						>
							Activity {activityNumber}
						</p>
						<div className="flex items-center justify-center gap-3">
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
								{content.title}
							</h1>
							<Icon className={`w-6 h-6 ${palette.text}`} aria-hidden="true" />
						</div>
						{content?.prompt && (
							<p className="text-slate-700 max-w-2xl mx-auto">
								{content.prompt}
							</p>
						)}
					</header>

					{/* body */}
					<div className="flex justify-center">{body}</div>

					{/* submission */}
					<NoteComposer
						value={notes}
						onChange={(v) => onNotes(v)}
						storageKey={`notes-${content.id}`}
						suggestedTags={[
							"Inspiring",
							"Community",
							"Language",
							"Action",
							"History",
						]}
						placeholder={content.notePlaceholder || "Type your reflections…"}
						palette={palette}
					/>

					{/* complete button */}
					<div className="flex justify-end">
						<button
							type="button"
							onClick={onToggleComplete}
							aria-pressed={completed}
							className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
								completed
									? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
									: "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100"
							}`}
						>
							{completed ? "Marked Complete" : "Mark Complete"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
