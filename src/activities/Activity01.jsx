import React, { useState } from "react";
import {
	Palette,
	Image as ImageIcon,
	Music4,
	ExternalLink,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity01({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Your reflections on the artist…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	// shared classes for link cards
	const linkCard =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2";

	const badge =
		"w-10 h-10 rounded-xl grid place-items-center bg-sky-50 text-sky-700";

	// center the 'Open link' row
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-sky-700 text-xs font-medium";

	const activityNumber = 1;

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				<header className="text-center space-y-2">
					{/* Blue activity label */}
					<p className="text-sky-700 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>

					{/* Title + blue icon */}
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Explore an Indigenous Artist
						</h1>
						<Palette className="w-7 h-7 text-sky-700" aria-hidden="true" />
					</div>

					{/* Slightly larger body text */}
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Explore works by an Indigenous artist that speak to you. <br />
						<strong>
							How do you relate to this artist? How do they inspire you?
						</strong>
					</p>
				</header>

				<section className="flex justify-center">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 place-content-center">
						{/* Card 1: Artists */}
						<a
							href="https://www.thecanadianencyclopedia.ca/en/article/important-indigenous-artists"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: List of important Indigenous artists in Canada (new tab)"
							aria-label="Open list of important Indigenous artists in Canada in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={badge}>
									<ImageIcon className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									List of important Indigenous artists in Canada
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						{/* Card 2: Musicians */}
						<a
							href="https://www.thecanadianencyclopedia.ca/en/article/influential-indigenous-musicians"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: List of influential Indigenous musicians in Canada (new tab)"
							aria-label="Open list of influential Indigenous musicians in Canada in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={badge}>
									<Music4 className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									List of influential Indigenous musicians in Canada
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>
					</div>
				</section>

				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content.id}`}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					downloadFileName={`Activity-${content.id || "01"}-Reflection.docx`}
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
