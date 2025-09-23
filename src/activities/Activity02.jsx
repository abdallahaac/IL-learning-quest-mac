import React, { useState } from "react";
import { Leaf, ExternalLink, BookOpen } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity02({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Plants, uses, teachings you discovered…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	// Distinct color scheme from Activity 1 (emerald)
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-emerald-50 text-emerald-700";
	const linkCard =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-emerald-700 text-xs font-medium";

	// Pass an emerald palette to NoteComposer (different from Activity 1)
	const notePalette = {
		text: "text-emerald-700",
		ring: "focus-visible:ring-emerald-700",
		btn: "bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900",
		badgeBg: "bg-emerald-50",
		border: "border-emerald-100",
	};

	const activityNumber = 2;

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				<header className="text-center space-y-2">
					<p className="text-emerald-700 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>

					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Indigenous Medicinal Plants
						</h1>
						<Leaf className="w-7 h-7 text-emerald-700" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Discover Indigenous medicinal uses for plants in your area.
						<br /> <strong> Describe what you learned.</strong>{" "}
					</p>
				</header>

				<section className="flex justify-center">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 place-content-center">
						{/* Card 1: Métis uses (PDF) */}
						<a
							href="https://www.metismuseum.ca/media/document.php/148985.La%20Michinn%20revised%20and%20catalogued.pdf"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open PDF: La Michinn – Revised and Catalogued (new tab)"
							aria-label="Open PDF: La Michinn – Revised and Catalogued in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<BookOpen className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									Métis traditional uses for plants (PDF)
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						{/* Card 2: FAO book */}
						<a
							href="https://openknowledge.fao.org/server/api/core/bitstreams/02134cf4-156b-47c7-972d-cf2690df1b55/content"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Traditional plant foods of Indigenous Peoples in Canada (new tab)"
							aria-label="Open: Traditional plant foods of Indigenous Peoples in Canada in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<BookOpen className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									Traditional plant foods of Indigenous Peoples in Canada (book)
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
					storageKey={`notes-${content?.id || "02"}`}
					placeholder={placeholder || "Type your reflections…"}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					palette={notePalette} // distinct emerald styling
					downloadFileName={`Activity-${content?.id || "02"}-Reflection.docx`}
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
