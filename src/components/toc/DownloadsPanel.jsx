// src/components/toc/DownloadsPanel.jsx
import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faComments } from "@fortawesome/free-solid-svg-icons";
import DownloadAllActivitiesButton from "../DownloadAllActivitiesButton.jsx";

// local utils
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const withAlpha = (hex, aa) => `${hex}${aa}`;

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

	const STR = {
		actTitle: isFr
			? "Télécharger la liste des activités"
			: "Download activities list",
		actSub: isFr
			? "Obtenez un document avec tous les activités."
			: "Get a document with all activities.",
		reflTitle: isFr
			? "Télécharger les réflexions des activités"
			: "Download activities reflections",
		reflSubReady: isFr
			? "Réflexions personnelles de chaque activité réunies dans un seul document."
			: "Personal reflections from each activity.",
		reflSubLocked: isFr
			? "Terminez toutes les activités et marquez chacune comme terminée pour activer ce téléchargement."
			: "Mark each activity complete to enable this download.",
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
			: "Mark each activity complete to enable this download.",
	};

	const reflectionsAccentHex = normalizeHex("#10B981") || "#10B981";
	const ringAccent =
		`focus:outline-none focus-visible:ring-2 ` +
		`focus-visible:ring-[${reflectionsAccentHex}] focus-visible:ring-offset-2`;

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

	// One source of truth for BOTH cards’ outer shell so padding matches 1:1
	const panelShell =
		"rounded-2xl border shadow p-5 sm:p-6 focus-within:ring-4 focus-within:ring-offset-2 focus-within:ring-offset-white/80";
	const panelReady =
		"border-slate-300/70 bg-white/90 backdrop-blur hover:shadow-md";
	const panelLocked = "border-slate-200 bg-slate-50";

	// Shared header row style (icon + text) to avoid tiny alignment drift
	const headerRow = "flex items-start gap-3";

	// Shared icon badge style
	const iconBadge = "inline-grid place-items-center w-10 h-10 rounded-xl";

	return (
		<div className="px-6 pb-10 mt-9">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Box 1: Activities list */}
				<motion.div
					className={`${panelShell} ${panelReady} focus-within:ring-sky-600`}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
				>
					<div className={headerRow}>
						<span
							className={iconBadge}
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
						<DownloadAllActivitiesButton accent="#2563EB" locale={lang} />
					</div>
				</motion.div>

				{/* Box 2: Reflections — uses the EXACT same shell/padding as Box 1 */}
				<motion.div
					className={`${panelShell} ${
						reflectionsReady
							? `${panelReady} focus-within:ring-sky-600`
							: `${panelLocked} focus-within:ring-slate-300`
					}`}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.28 }}
				>
					<div className={headerRow}>
						<span
							className={iconBadge}
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
