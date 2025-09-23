import React, { useState } from "react";
import {
	HeartHandshake,
	Link2,
	BookOpen,
	Bookmark,
	ExternalLink,
	Library,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity08({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Voices you followed; what you learned…";

	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const activityNumber = 8;

	// --- Warm rose-600 theme ---
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-rose-50 text-rose-600";
	const linkCard =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-rose-600 text-xs font-medium";

	const notePalette = {
		ring: "focus-visible:ring-rose-600",
		btn: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800",
		badgeBg: "bg-rose-50",
		border: "border-rose-100",
	};

	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div className={`${cardBadge} absolute left-0 top-1/2 -translate-y-1/2`}>
				<Icon className="w-5 h-5" />
			</div>
			<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
				{children}
			</div>
		</div>
	);

	// Reusable slightly-transparent bullet-card in ROSE theme
	const BulletCard = ({ icon: Icon = Library, title, items = [] }) => {
		const tipCard =
			"mx-auto max-w-md w-full rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-4 shadow-sm text-center";
		return (
			<div className={tipCard} role="note" aria-label={title}>
				<div className="flex flex-col items-center gap-3">
					<div className="w-10 h-10 rounded-xl grid place-items-center bg-white text-rose-600 border border-rose-100">
						<Icon className="w-5 h-5" aria-hidden="true" />
					</div>

					{title ? (
						<div className="font-medium text-gray-800">{title}</div>
					) : null}

					<ul className="text-sm text-gray-800 list-disc list-inside space-y-1 text-left w-full max-w-xs mx-auto marker:text-rose-500">
						{items.map((it) => (
							<li key={it}>{it}</li>
						))}
					</ul>
				</div>
			</div>
		);
	};

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header in rose-600 */}
				<header className="text-center space-y-2">
					<p className="text-rose-600 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							2SLGBTQQIA+ / Two-Spirit & Indigiqueer Communities
						</h1>
						<HeartHandshake
							className="w-7 h-7 text-rose-600"
							aria-hidden="true"
						/>
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous
						2SLGBTQQIA+ communities and their histories.
					</p>
				</header>

				{/* Resources */}
				<section>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<a
							href="https://nativegov.org/resources/indigenous-knowledge-and-two-spirit-leadership/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Indigenous knowledge & Two-Spirit leadership (new tab)"
							aria-label="Open Indigenous knowledge & Two-Spirit leadership in a new tab"
						>
							<TitleRow Icon={Link2}>
								Indigenous knowledge & Two-Spirit leadership
							</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>

						<a
							href="https://w2sa.ca/two-spirit-library"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Two-Spirit Library (new tab)"
							aria-label="Open Two-Spirit Library in a new tab"
						>
							<TitleRow Icon={BookOpen}>Two-Spirit Library (W2SA)</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>

						<a
							href="https://egale.ca/awareness/two-spirits-one-voice/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Two Spirits, One Voice (new tab)"
							aria-label="Open Two Spirits, One Voice in a new tab"
						>
							<TitleRow Icon={Bookmark}>
								Two Spirits, One Voice (Egale)
							</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>

						{/* Advocates — transparent bullet-only card in rose */}
						<BulletCard
							title="Advocates to explore"
							items={[
								"Dr. James Makokis",
								"Jaris Swidrovich",
								"Raven Davis",
								"TJ Cuthand",
								"Alexa Keleutak",
								"Chelsea Vowel",
							]}
						/>
					</div>
				</section>

				{/* Notes */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "08"}`}
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
					downloadFileName={`Activity-${content?.id || "08"}-Reflection.docx`}
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
