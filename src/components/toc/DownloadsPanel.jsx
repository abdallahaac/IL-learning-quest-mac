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

// minimal lang sniff so this panel localizes itself
function detectLang() {
	try {
		const qs = new URLSearchParams(window.location.search);
		if (qs.get("lang")) return qs.get("lang").toLowerCase().slice(0, 2);
		const html = document.documentElement?.getAttribute("lang");
		if (html) return html.toLowerCase().slice(0, 2);
		const nav = navigator?.language || navigator?.languages?.[0];
		if (nav) return nav.toLowerCase().slice(0, 2);
	} catch {}
	return "en";
}

export default function DownloadsPanel({
	reflectionsReady,
	onDownloadAllReflections,
}) {
	const lang = detectLang() === "fr" ? "fr" : "en";
	const isFr = lang === "fr";

	// Localized strings
	const STR = {
		actTitle: isFr
			? "Télécharger la liste des activités"
			: "Download activities list",
		actSub: isFr
			? "Obtenez un document avec tous les titres d’activité."
			: "Get a document with all activity titles.",
		reflTitle: isFr
			? "Télécharger les réflexions des activités"
			: "Download activities reflections",
		reflSubReady: isFr
			? "Réflexions personnelles de chaque activité réunies dans un seul document."
			: "Personal reflections from each activity consolidated into one document.",
		reflSubLocked: isFr
			? "Terminez toutes les activités et marquez chacune comme terminée pour activer ce téléchargement."
			: "Finish all activities and mark each one complete to enable this download.",
		btnReflReady: isFr
			? "Télécharger toutes les réflexions (.docx)"
			: "Download All Reflections (.docx)",
		btnReflPrep: isFr ? "Préparation…" : "Preparing…",
		btnReflAria: isFr
			? "Télécharger toutes les réflexions"
			: "Download all reflections",
		btnReflTitleReady: isFr
			? "Télécharger toutes les réflexions (.docx)"
			: "Download All Reflections (.docx)",
		btnReflTitleLocked: isFr
			? "Terminez d’abord toutes les activités et marquez chacune comme terminée"
			: "Finish all activities and mark each one Complete first",
	};

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
								{STR.actTitle}
							</div>
							<div className="text-sm text-slate-600 mt-0.5">{STR.actSub}</div>
						</div>
					</div>
					<div className="mt-4">
						{/* If the button supports it, we pass locale. If it doesn't, no harm done. */}
						<DownloadAllActivitiesButton accent="#2563EB" locale={lang} />
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
								{STR.reflTitle}
							</div>
							<div
								className={`text-sm mt-0.5 ${
									reflectionsReady ? "text-slate-600" : "text-slate-400"
								}`}
							>
								{reflectionsReady ? STR.reflSubReady : STR.reflSubLocked}
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
								backgroundColor: reflectionsReady
									? "rgba(16,185,129,0.12)"
									: "rgba(148,163,184,0.15)",
								border: reflectionsReady
									? "1px solid rgba(16,185,129,0.28)"
									: "1px solid rgba(148,163,184,0.35)",
								color: reflectionsReady ? "#059669" : "#64748B",
							}}
							aria-label={STR.btnReflAria}
							title={
								reflectionsReady
									? STR.btnReflTitleReady
									: STR.btnReflTitleLocked
							}
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
						>
							<Download className="w-4 h-4" aria-hidden="true" />
							<span>{working ? STR.btnReflPrep : STR.btnReflReady}</span>
						</motion.button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
