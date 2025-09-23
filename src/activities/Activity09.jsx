import React, { useState } from "react";
import { HeartHandshake, Newspaper, ExternalLink } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity09({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Story link, your reflections…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const activityNumber = 9;

	// --- Unified custom color (#934D6C) theme ---
	const ACCENT = "#934D6C"; // deep plum
	// Tailwind arbitrary color utilities keep everything consistent
	const linkCard =
		"group relative block w-full rounded-2xl border border-gray-200 bg-white p-5 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-[#" +
		ACCENT.replace("#", "") +
		"] focus-visible:ring-offset-2";
	const badge =
		"absolute left-5 top-5 w-10 h-10 rounded-xl grid place-items-center " +
		"bg-[#" +
		ACCENT.replace("#", "") +
		"]/10 text-[#" +
		ACCENT.replace("#", "") +
		"]";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-[#" +
		ACCENT.replace("#", "") +
		"] text-xs font-medium";
	const centerStack =
		"min-h-[108px] flex flex-col items-center justify-center text-center";
	const titleCls = "font-medium text-gray-800 group-hover:underline";
	const descDefault =
		"Find a current story from an Indigenous-led outlet. What perspectives, challenges, or biases are visible?";

	// NoteComposer themed controls
	const notePalette = {
		ring: "focus-visible:ring-[#934D6C]",
		btn: "bg-[#934D6C] hover:bg-[#311925] active:bg-[#26141c]",
		badgeBg: "bg-[#934D6C]/10",
		border: "border-[#934D6C]/20",
	};

	const OutletTile = ({ href, title, desc = descDefault }) => (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className={linkCard}
			title={`Open: ${title} (new tab)`}
			aria-label={`Open ${title} in a new tab`}
		>
			{/* top-left icon badge (plum) */}
			<div className={badge} aria-hidden="true">
				<Newspaper className="w-5 h-5" />
			</div>

			{/* centered content */}
			<div className={centerStack}>
				<div className={titleCls}>{title}</div>
				<p className="mt-1 text-sm text-gray-600 max-w-sm">{desc}</p>
				<div className={linkFooter}>
					<ExternalLink className="w-4 h-4" aria-hidden="true" />
					<span>Open link</span>
				</div>
			</div>
		</a>
	);

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header (plum theme) */}
				<header className="text-center space-y-2">
					<p className="text-[#934D6C] font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Indigenous-Focused News Story
						</h1>
						<HeartHandshake
							className="w-7 h-7 text-[#934D6C]"
							aria-hidden="true"
						/>
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Choose a story from one of these Indigenous-led outlets. Summarize
						the piece and reflect on the framing, voices quoted, and possible
						biases.
					</p>
				</header>

				{/* Outlets — all plum-accented */}
				<section>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<OutletTile href="https://www.aptntv.ca/" title="APTN" />
						<OutletTile
							href="https://theturtleislandnews.com/"
							title="The Turtle Island News"
						/>
						<OutletTile href="https://kukukwes.com/" title="Ku'ku'kwes News" />
						<OutletTile href="https://indiginews.com/" title="IndigiNews" />
						<OutletTile href="https://hashilthsa.com/" title="Ha-Shilth-Sa" />
						<OutletTile href="https://windspeaker.com/" title="Windspeaker" />
					</div>
				</section>

				{/* Notes (plum controls) */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "09"}`}
					suggestedTags={[
						"Inspiring",
						"Community",
						"Language",
						"Action",
						"History",
					]}
					placeholder={placeholder || "Type your reflections…"}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					palette={notePalette}
					wrapperClassName=""
					textareaClassName="placeholder:text-gray-400"
					downloadFileName={`Activity-${content?.id || "09"}-Reflection.docx`}
					docTitle={content?.title || "Reflection"}
				/>

				{/* Complete */}
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
