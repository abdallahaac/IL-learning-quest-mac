import React, { useState } from "react";
import { BookOpen, ExternalLink, Library } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity06({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Author, title, key takeaways…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const activityNumber = 6;

	// --- Unified cyan-600 theme ---
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-cyan-50 text-cyan-600";
	const linkCard =
		"group block mx-auto max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-cyan-600 text-xs font-medium";

	const tipCard =
		"mx-auto max-w-md w-full rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/40 p-4 shadow-sm text-center";

	// NoteComposer buttons (Write/Bullets/Add/Download) in cyan-600 as well
	const notePalette = {
		ring: "focus-visible:ring-cyan-600",
		btn: "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800",
		badgeBg: "bg-cyan-50",
		border: "border-cyan-100",
		// no `text` -> body text stays gray
	};

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header in cyan-600 */}
				<header className="text-center space-y-2">
					<p className="text-cyan-600 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Read a Book
						</h1>
						<BookOpen className="w-7 h-7 text-cyan-600" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Read a book by a First Nations, Inuit, or Métis author. What did you
						think?
					</p>
				</header>

				{/* Centered link + tip cards */}
				<section className="flex justify-center">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						<a
							href="https://www.rcaanc-cirnac.gc.ca/eng/1496255894592/1557840487211"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: #IndigenousReads (new tab)"
							aria-label="Open: #IndigenousReads in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<BookOpen className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									#IndigenousReads (Government of Canada)
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						<div
							className={tipCard}
							role="note"
							aria-label="Tip: Ask your library"
						>
							<div className="flex flex-col items-center gap-2">
								<div className="w-10 h-10 rounded-xl grid place-items-center bg-white text-cyan-600 border border-cyan-100">
									<Library className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800">
									Ask your local library for suggestions
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* NoteComposer with cyan-600 buttons, gray text */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "06"}`}
					placeholder={placeholder || "Type your reflections…"}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					palette={notePalette}
					wrapperClassName="" // keep text gray
					textareaClassName="placeholder:text-gray-400"
					downloadFileName={`Activity-${content?.id || "06"}-Reflection.docx`}
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
