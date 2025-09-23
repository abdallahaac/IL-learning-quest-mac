import React, { useState } from "react";
import { Globe2, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity04({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Which community? What you learned…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const activityNumber = 4;

	// Indigo accents (distinct from other activities)
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-indigo-50 text-indigo-700";
	const linkCard =
		"group block mx-auto max-w-md w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-indigo-700 text-xs font-medium";

	const notePalette = {
		text: "text-indigo-700",
		ring: "focus-visible:ring-indigo-700",
		btn: "bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900",
		badgeBg: "bg-indigo-50",
		border: "border-indigo-100",
	};

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header with indigo label + icon */}
				<header className="text-center space-y-2">
					<p className="text-indigo-700 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Indigenous Peoples Outside Canada
						</h1>
						<Globe2 className="w-7 h-7 text-indigo-700" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Discover facts about an Indigenous population outside Canada.
						<br />
						<strong>What stood out to you?</strong>
					</p>
				</header>

				{/* Two centered cards */}
				<section className="flex justify-center">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center w-full">
						{/* Card 1 */}
						<a
							href="https://newshour-classroom-tc.digi-producers.pbs.org/uploads/app/uploads/2014/11/A-global-map-of-indigenous-peoples.pdf"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: A global map of Indigenous peoples (PDF) — new tab"
							aria-label="Open: A global map of Indigenous peoples (PDF) in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<Globe2 className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									Global map of Indigenous Peoples (PDF)
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						{/* Card 2 */}
						<a
							href="https://www.visualcapitalist.com/cp/mapped-the-worlds-indigenous-peoples/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Mapped — The world's Indigenous Peoples (Visual Capitalist) — new tab"
							aria-label="Open: Mapped — The world's Indigenous Peoples (Visual Capitalist) in a new tab"
						>
							<div className="flex items-center gap-3">
								<div className={cardBadge}>
									<Globe2 className="w-5 h-5" aria-hidden="true" />
								</div>
								<div className="font-medium text-gray-800 group-hover:underline">
									Mapped: The world’s Indigenous Peoples
								</div>
							</div>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>
					</div>
				</section>

				{/* Indigo-styled NoteComposer */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "04"}`}
					placeholder={placeholder || "Type your reflections…"}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					palette={notePalette}
					downloadFileName={`Activity-${content?.id || "04"}-Reflection.docx`}
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
