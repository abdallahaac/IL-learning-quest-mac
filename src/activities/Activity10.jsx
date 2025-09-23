import React, { useState } from "react";
import {
	Store, // header icon
	ShoppingBag, // Shop First Nations
	Newspaper, // roundup/article
	Landmark, // government directory
	ExternalLink,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity10({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Business, offerings, how you’ll support…";
	const [localNotes, setLocalNotes] = useState(notes);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const activityNumber = 10;

	// --- Unified custom color (#DB5A42) theme (deep plum) ---
	const cardBadge =
		"w-10 h-10 rounded-xl grid place-items-center bg-[#DB5A42]/10 text-[#DB5A42]";
	const linkCard =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB5A42] focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-[#DB5A42] text-xs font-medium";

	// NoteComposer palette in plum
	const notePalette = {
		ring: "focus-visible:ring-[#DB5A42]",
		btn: "bg-[#DB5A42] hover:bg-[#311925] active:bg-[#26141c]",
		badgeBg: "bg-[#DB5A42]/10",
		border: "border-[#DB5A42]/20",
	};

	// helper row with left badge icon + centered title
	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div className={`${cardBadge} absolute left-0 top-1/2 -translate-y-1/2`}>
				<Icon className="w-5 h-5" aria-hidden="true" />
			</div>
			<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
				{children}
			</div>
		</div>
	);

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header (plum theme) */}
				<header className="text-center space-y-2">
					<p className="text-[#DB5A42] font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Indigenous-Owned Business
						</h1>
						<Store className="w-7 h-7 text-[#DB5A42]" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Explore a First Nations, Inuit or Métis-owned business (in person or
						online). What products/services spoke to you and why?
					</p>
				</header>

				{/* Resource links */}
				<section>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<a
							href="https://shopfirstnations.com/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Shop First Nations (new tab)"
							aria-label="Open Shop First Nations in a new tab"
						>
							<TitleRow Icon={ShoppingBag}>Shop First Nations</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						<a
							href="https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: 17 Canadian Indigenous-Owned Businesses (new tab)"
							aria-label="Open 17 Canadian Indigenous-Owned Businesses in a new tab"
						>
							<TitleRow Icon={Newspaper}>
								17 Canadian Indigenous-Owned Businesses (2025)
							</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>

						<a
							href="https://www.sac-isc.gc.ca/rea-ibd"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Indigenous Business Directory (new tab)"
							aria-label="Open Indigenous Business Directory in a new tab"
						>
							<TitleRow Icon={Landmark}>Indigenous Business Directory</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
								<span>Open link</span>
							</div>
						</a>
					</div>
				</section>

				{/* Notes (plum controls, neutral text) */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${content?.id || "10"}`}
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
					downloadFileName={`Activity-${content?.id || "10"}-Reflection.docx`}
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
