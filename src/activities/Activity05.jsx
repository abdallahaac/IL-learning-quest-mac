import React, { useState } from "react";
import { Film, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity05({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Title, creator(s), insights…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const activityNumber = 5;

	// THEME: ROSE
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-rose-50 text-rose-700";
	const linkCard =
		"group block mx-auto max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-rose-700 text-xs font-medium";

	const notePalette = {
		text: "text-rose-700",
		ring: "focus-visible:ring-rose-700",
		btn: "bg-rose-700 hover:bg-rose-800 active:bg-rose-900",
		badgeBg: "bg-rose-50",
		border: "border-rose-100",
	};

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header with rose label + icon */}
				<header className="text-center space-y-2">
					<p className="text-rose-700 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Film, TV, or Podcast
						</h1>
						<Film className="w-7 h-7 text-rose-700" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Watch an Indigenous film/TV show or listen to an Indigenous-focused
						podcast.
						<br />
						<strong>What did you learn?</strong>
					</p>
				</header>

				{/* Two centered cards */}
				<section className="flex justify-center">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						{/* Card 1: NFB Indigenous Cinema */}
						<a
							href="https://www.nfb.ca/indigenous-cinema/?&film_lang=en&sort=year:desc,title&year_min=1939&year_max=2022"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: National Film Board — Indigenous cinema (new tab)"
							aria-label="Open: National Film Board — Indigenous cinema in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<Film className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									National Film Board — Indigenous cinema
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						{/* Card 2: CBC Gem Indigenous Stories */}
						<a
							href="https://gem.cbc.ca/section/indigenous-stories"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: CBC Gem — Indigenous stories (new tab)"
							aria-label="Open: CBC Gem — Indigenous stories in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<Film className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									CBC Gem — Indigenous stories
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>
					</div>
				</section>

				{/* Rose-styled NoteComposer */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "05"}`}
					placeholder={placeholder || "Type your reflections…"}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					palette={notePalette}
					downloadFileName={`Activity-${content?.id || "05"}-Reflection.docx`}
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
