import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faComments } from "@fortawesome/free-solid-svg-icons";
import DownloadAllActivitiesButton from "../DownloadAllActivitiesButton.jsx";

export default function DownloadsPanel({
	reflectionsReady,
	onDownloadAllReflections,
}) {
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
						<DownloadAllActivitiesButton accent="#2563EB" />
					</div>
				</motion.div>

				{/* Box 2: Reflections (gated) */}
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
						<button
							type="button"
							onClick={reflectionsReady ? onDownloadAllReflections : undefined}
							disabled={!reflectionsReady}
							aria-disabled={!reflectionsReady}
							title={
								reflectionsReady
									? "Download All Reflections (.docx)"
									: "Finish all activities and mark each one Complete first"
							}
							className={[
								"group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
								"border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
								reflectionsReady
									? "bg-gradient-to-b from-emerald-50 to-white text-emerald-700 border-emerald-300 hover:from-emerald-100 hover:to-white"
									: "bg-white text-slate-400 border-slate-200 cursor-not-allowed",
							].join(" ")}
						>
							<Download
								className={`w-4 h-4 ${
									reflectionsReady ? "text-emerald-600" : "text-slate-400"
								}`}
								aria-hidden="true"
							/>
							<span>Download All Reflections (.docx)</span>
						</button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
