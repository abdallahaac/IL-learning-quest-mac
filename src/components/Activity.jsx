// src/pages/ActivityPage.jsx
import React from "react";
import {
	ActivityHeader,
	GalleryCards,
	Checklist,
	Flashcards,
	MediaCards,
} from "../components/ActivityViews.jsx";
import {
	Palette,
	Leaf,
	Utensils,
	Globe2,
	Film,
	BookOpen,
	Languages,
	HeartHandshake,
	Newspaper,
	Store,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

const icons = [
	Palette,
	Leaf,
	Utensils,
	Globe2,
	Film,
	BookOpen,
	Languages,
	HeartHandshake,
	Newspaper,
	Store,
];

// Soft, low-contrast gradient overlays (Tailwind classes)
// Tweak or reorder as you like; indexes 0..9 map to activities 1..10.
const GRADIENTS = [
	// 0
	"bg-gradient-to-b from-sky-50/80 via-white/60 to-slate-50/80",
	// 1
	"bg-gradient-to-b from-emerald-50/80 via-white/60 to-slate-50/80",
	// 2
	"bg-gradient-to-b from-amber-50/80 via-white/60 to-slate-50/80",
	// 3
	"bg-gradient-to-b from-indigo-50/80 via-white/60 to-slate-50/80",
	// 4
	"bg-gradient-to-b from-rose-50/80 via-white/60 to-slate-50/80",
	// 5
	"bg-gradient-to-b from-cyan-50/80 via-white/60 to-slate-50/80",
	// 6
	"bg-gradient-to-b from-fuchsia-50/80 via-white/60 to-slate-50/80",
	// 7
	"bg-gradient-to-b from-lime-50/80 via-white/60 to-slate-50/80",
	// 8
	"bg-gradient-to-b from-orange-50/80 via-white/60 to-slate-50/80",
	// 9
	"bg-gradient-to-b from-violet-50/80 via-white/60 to-slate-50/80",
];

export default function ActivityPage({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
	activityIndex,
}) {
	const Icon = icons[activityIndex] ?? Palette;

	// Pick a gentle gradient for this activity
	const gradientClass =
		GRADIENTS[activityIndex % GRADIENTS.length] ||
		"bg-gradient-to-b from-sky-50/80 via-white/60 to-slate-50/80";

	// Normalize notes
	const toObj = (n) =>
		typeof n === "string" || !n
			? { text: n || "", bullets: [], tags: [] }
			: { text: n.text || "", bullets: n.bullets || [], tags: n.tags || [] };

	// Choose layout
	let body = null;
	switch (activityIndex) {
		case 0:
			body = (
				<GalleryCards
					items={
						content.resources?.map((r) => ({
							title: r,
							desc: "Explore this recommendation",
							href: "#",
						})) ?? []
					}
				/>
			);
			break;

		case 1: {
			const model = toObj(notes);
			const currentChecks = model.checks || {};
			body = (
				<Checklist
					items={[
						"Identify 3 local medicinal plants",
						"Find sources on traditional uses",
						"Note seasonal availability",
					]}
					checked={currentChecks}
					onToggle={(id) => {
						const nextChecks = { ...currentChecks, [id]: !currentChecks[id] };
						onNotes({ ...model, checks: nextChecks });
					}}
				/>
			);
			break;
		}

		case 6: {
			const model = toObj(notes);
			const cards = model.cards ?? [
				{ front: "tansi", back: "hello" },
				{ front: "nakurmiik", back: "thank you" },
				{ front: "taanshi", back: "hi (Michif)" },
			];
			body = <Flashcards cards={cards} />;
			break;
		}

		default:
			body = (
				<MediaCards
					items={(content.resources ?? []).map((t) => ({
						title: t,
						desc: content.prompt,
					}))}
				/>
			);
	}

	return (
		<div className="relative bg-transparent">
			{/* subtle per-activity gradient overlay (above morphing canvas, below content) */}
			<div
				aria-hidden
				className={`absolute inset-0 z-0 pointer-events-none ${gradientClass}`}
			/>

			{/* content layer */}
			<div className="relative z-10 flex-1">
				<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
					<ActivityHeader
						icon={Icon}
						title={content.title}
						subtitle={content.prompt}
					/>

					{body}

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
					/>

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
