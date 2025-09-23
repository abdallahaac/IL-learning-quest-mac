import React, { useState } from "react";
import { Utensils, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity03({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Recipe, process, who you shared it with…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	// Amber theme (distinct from Activities 1 & 2)
	const activityNumber = 3;
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-amber-50 text-amber-700";
	const linkCard =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-amber-700 text-xs font-medium";

	const notePalette = {
		text: "text-amber-700",
		ring: "focus-visible:ring-amber-700",
		btn: "bg-amber-700 hover:bg-amber-800 active:bg-amber-900",
		badgeBg: "bg-amber-50",
		border: "border-amber-100",
	};

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header with amber label + icon */}
				<header className="text-center space-y-2">
					<p className="text-amber-700 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Make a Traditional Recipe
						</h1>
						<Utensils className="w-7 h-7 text-amber-700" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Try making a traditional First Nations, Inuit or Métis recipe.
						<br />
						<strong>Share your experience </strong>(potluck optional!)
					</p>
				</header>

				{/* Single centered card */}
				<section className="flex justify-center">
					<div className="grid grid-cols-1 place-items-center gap-4 w-full">
						<a
							href="https://www.firstnations.org/knowledge-center/recipes/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: First Nations Development Institute – Recipes (new tab)"
							aria-label="Open First Nations Development Institute – Recipes in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<Utensils className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									Native/Indigenous recipes (First Nations Development
									Institute)
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>
					</div>
				</section>

				{/* Amber-styled NoteComposer */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "03"}`}
					placeholder={placeholder || "Type your reflections…"}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					palette={notePalette}
					downloadFileName={`Activity-${content?.id || "03"}-Reflection.docx`}
					docTitle={content?.title || "Reflection"}
				/>

				<div className="flex justify-end">
					<button
						type="button"
						onClick={onToggleComplete}
						aria-pressed={!!completed}
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
	);
}
