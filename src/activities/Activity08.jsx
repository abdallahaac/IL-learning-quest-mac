import React, { useState } from "react";
import {
	HeartHandshake,
	Link2,
	BookOpen,
	Bookmark,
	ExternalLink,
	Users, // relevant icon for advocates
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

	// Egale card-specific class variables
	const egaleCard =
		"group relative block w-full rounded-2xl border border-gray-200 " +
		"bg-white/90 backdrop-blur-sm p-5 shadow-sm transition " +
		"hover:shadow-md hover:-translate-y-0.5 " +
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2";
	const egaleIconBadge =
		"absolute left-5 top-5 w-10 h-10 rounded-xl grid place-items-center bg-rose-50 text-rose-600";
	const egaleCenter =
		"min-h-[108px] flex flex-col items-center justify-center text-center";

	const notePalette = {
		ring: "focus-visible:ring-rose-600",
		btn: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800",
		badgeBg: "bg-rose-50",
		border: "border-rose-100",
	};

	/** TitleRow */
	const TitleRow = ({ Icon, children, centered = false }) => {
		if (centered) {
			return (
				<div className="grid grid-cols-[40px_1fr] items-center gap-3 min-h-[2.75rem]">
					<div className={cardBadge}>
						<Icon className="w-5 h-5" />
					</div>
					<div className="justify-self-center text-center font-medium text-gray-800 group-hover:underline">
						{children}
					</div>
				</div>
			);
		}
		return (
			<div className="relative flex items-center pl-14">
				<div
					className={`${cardBadge} absolute left-0 top-1/2 -translate-y-1/2`}
				>
					<Icon className="w-5 h-5" />
				</div>
				<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
					{children}
				</div>
			</div>
		);
	};

	/** TipCard */
	const TipCard = ({
		icon: Icon = Users,
		title = "Advocates to explore",
		subtitle,
		items = [],
	}) => {
		return (
			<section
				className="mx-auto max-w-xl w-full rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-4 shadow-sm"
				role="note"
				aria-label={title}
			>
				<header className="flex items-start gap-3">
					<div className="shrink-0 w-10 h-10 rounded-xl grid place-items-center bg-white text-rose-600 border border-rose-100">
						<Icon className="w-5 h-5" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<h3 className="font-semibold text-slate-900">{title}</h3>
						{subtitle ? (
							<p className="text-sm text-slate-600">{subtitle}</p>
						) : null}
					</div>
				</header>
				<ul className="mt-3 flex flex-wrap gap-2" aria-label={`${title} list`}>
					{items.map((it) => (
						<li key={it}>
							<span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3 py-1.5 text-sm text-rose-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
								{it}
							</span>
						</li>
					))}
				</ul>
			</section>
		);
	};

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header */}
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

				{/* Resources + Tip */}
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

						{/* Egale card using variables */}
						<a
							href="https://egale.ca/awareness/two-spirits-one-voice/"
							target="_blank"
							rel="noreferrer"
							title="Open: Two Spirits, One Voice (new tab)"
							aria-label="Open Two Spirits, One Voice in a new tab"
							className={egaleCard}
						>
							<div className={egaleIconBadge} aria-hidden="true">
								<Bookmark className="w-5 h-5" />
							</div>
							<div className={egaleCenter}>
								<div className="font-medium text-gray-800 group-hover:underline">
									Two Spirits, One Voice (Egale)
								</div>
								<div className="mt-1 flex items-center justify-center gap-1 text-rose-600 text-xs font-medium">
									<ExternalLink className="w-4 h-4" aria-hidden="true" />
									<span>Open link</span>
								</div>
							</div>
						</a>

						{/* TipCard with icon + pill list */}
						<TipCard
							title="Advocates to explore"
							subtitle="Follow and learn from these voices"
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
