// src/components/toc/DownloadsPanel.jsx
import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faComments } from "@fortawesome/free-solid-svg-icons";
import DownloadAllActivitiesButton from "../DownloadAllActivitiesButton.jsx";

// local utils (match DownloadAllActivitiesButton without new files)
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function DownloadsPanel({
	reflectionsReady,
	onDownloadAllReflections,
}) {
	// Use emerald to mirror your gated “complete all activities” state
	const reflectionsAccentHex = normalizeHex("#10B981") || "#10B981";
	const ringAccent =
		`focus:outline-none focus-visible:ring-2 ` +
		`focus-visible:ring-[${reflectionsAccentHex}] focus-visible:ring-offset-2`;

	// small local “working” lock so the button also shows “Preparing…” like the activities one
	const [working, setWorking] = React.useState(false);

	const handleReflections = async () => {
		if (!reflectionsReady || working) return;
		setWorking(true);
		try {
			await onDownloadAllReflections?.();
		} finally {
			// cooldown similar to the activities button
			setTimeout(() => setWorking(false), 900);
		}
	};

	const reflectionsDisabled = !reflectionsReady || working;

	return (
		<div className="px-6 pb-10 mt-9">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Box 1: Activities list */}
				<motion.div
					className="rounded-2xl border border-slate-300/70 bg-white/90 backdrop-blur p-5 shadow hover:shadow-md focus-within:ring-4 focus-within:ring-sky-600 focus-within:ring-offset-2 focus-within:ring-offset-white/80"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
				>
					<div className="flex items-start gap-3">
						<span
							className="inline-grid place-items-center w-10 h-10 rounded-xl"
							style={{
								backgroundColor: "rgba(59,130,246,0.12)",
								border: "1px solid rgba(59,130,246,0.28)",
								color: "#2563EB",
							}}
							aria-hidden="true"
						>
							<FontAwesomeIcon icon={faListCheck} />
						</span>
						<div className="min-w-0">
							<div className="text-base font-semibold text-slate-900">
								Download activities list
							</div>
							<div className="text-sm text-slate-600 mt-0.5">
								Get a document with all activity titles.
							</div>
						</div>
					</div>
					<div className="mt-4">
						{/* keep your original button exactly */}
						<DownloadAllActivitiesButton accent="#2563EB" />
					</div>
				</motion.div>

				{/* Box 2: Reflections (gated) — styled EXACTLY like DownloadAllActivitiesButton */}
				<motion.div
					className={`rounded-2xl border p-5 shadow ${
						reflectionsReady
							? "border-slate-300/70 bg-white/90 backdrop-blur hover:shadow-md"
							: "border-slate-200 bg-slate-50"
					}`}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.28 }}
				>
					<div className="flex items-start gap-3">
						<span
							className="inline-grid place-items-center w-10 h-10 rounded-xl"
							style={{
								backgroundColor: reflectionsReady
									? "rgba(16,185,129,0.12)"
									: "rgba(148,163,184,0.15)",
								border: reflectionsReady
									? "1px solid rgba(16,185,129,0.28)"
									: "1px solid rgba(148,163,184,0.35)",
								color: reflectionsReady ? "#059669" : "#64748B",
							}}
							aria-hidden="true"
						>
							<FontAwesomeIcon icon={faComments} />
						</span>
						<div className="min-w-0">
							<div
								className={`text-base font-semibold ${
									reflectionsReady ? "text-slate-900" : "text-slate-400"
								}`}
							>
								Download activities reflections
							</div>
							<div
								className={`text-sm mt-0.5 ${
									reflectionsReady ? "text-slate-600" : "text-slate-400"
								}`}
							>
								{reflectionsReady
									? "Personal reflections from each activity consolidated into one document."
									: "Finish all activities and mark each one complete to enable this download."}
							</div>
						</div>
					</div>

					<div className="mt-4">
						{/* Mirror DownloadAllActivitiesButton (motion.button, classes, inline styles, hover/tap) */}
						<motion.button
							type="button"
							onClick={handleReflections}
							disabled={reflectionsDisabled}
							aria-disabled={reflectionsDisabled}
							className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-sm font-semibold border shadow-sm ${ringAccent} ${
								reflectionsDisabled ? "opacity-60 cursor-not-allowed" : ""
							}`}
							style={{
								backgroundColor: withAlpha(reflectionsAccentHex, "14"),
								color: reflectionsAccentHex,
								borderColor: withAlpha(reflectionsAccentHex, "33"),
							}}
							whileHover={
								!reflectionsDisabled
									? {
											backgroundColor: withAlpha(reflectionsAccentHex, "20"),
											boxShadow: `0 6px 18px ${withAlpha(
												reflectionsAccentHex,
												"1A"
											)}`,
									  }
									: {}
							}
							whileTap={
								!reflectionsDisabled
									? {
											backgroundColor: withAlpha(reflectionsAccentHex, "26"),
											scale: 0.98,
											boxShadow: `0 2px 10px ${withAlpha(
												reflectionsAccentHex,
												"1A"
											)}`,
									  }
									: {}
							}
							transition={{ duration: 0.15, ease: "easeOut" }}
							aria-label="Download all reflections"
							title={
								reflectionsReady
									? "Download All Reflections (.docx)"
									: "Finish all activities and mark each one Complete first"
							}
						>
							<Download className="w-4 h-4" aria-hidden="true" />
							<span>
								{working ? "Preparing…" : "Download All Reflections (.docx)"}
							</span>
						</motion.button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
