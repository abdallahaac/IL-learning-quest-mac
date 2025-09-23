import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import ProgressStepper from "./ProgressStepper.jsx";

export default function Header({
	siteTitle = "Learning Quest on Indigenous Cultures",
	isActivity = false,
	activityIndex = 0,
	totalActivities = 0,
	activityIds = [],
	completedMap = {},
	onJumpToActivity,
	onHome,
	onContents,
}) {
	return (
		<header
			className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm"
			role="banner"
		>
			{/* relative so the stepper can be absolutely centered on md+ */}

			{/* 
				<div
				className="relative max-w-8xl mx-auto px-20 py-5 md:py-6 
                 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-y-2 
                 min-h-[80px]" // NEW: ensures a taller header
			> */}
			<div
				className="relative max-w-7xl mx-auto px-4 py-5 md:py-6 
                 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-y-2 
                 min-h-[80px]" // NEW: ensures a taller header
			>
				{/* Title (left on md+) */}
				<div className="min-w-0">
					{onHome ? (
						<button
							type="button"
							onClick={onHome}
							className="block text-left text-[1.15rem] sm:text-lg md:text-xl font-semibold 
                             text-slate-900 leading-snug tracking-tight
                             whitespace-normal break-words max-w-[36ch] line-clamp-2
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
							aria-label="Go to home"
							title="Home"
						>
							{siteTitle}
						</button>
					) : (
						<h1 className="text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-snug tracking-tight whitespace-normal break-words max-w-[36ch] line-clamp-2">
							{siteTitle}
						</h1>
					)}
				</div>

				{/* Contents button (right on md+) */}
				<div className="justify-self-start md:justify-self-end">
					{onContents && (
						<button
							type="button"
							onClick={onContents}
							className="inline-flex items-center gap-2 rounded-full px-3 md:px-3.5 py-2
                             text-xs md:text-sm font-medium bg-sky-500 text-white shadow-sm
                             hover:bg-sky-600 active:bg-sky-700
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
							aria-label="Go to Table of Contents"
							title="Table of Contents"
						>
							<FontAwesomeIcon
								icon={faTableColumns}
								className="w-4 h-4"
								aria-hidden="true"
							/>
							<span className="hidden sm:inline">Contents</span>
							<span className="sm:hidden">TOC</span>
						</button>
					)}
				</div>

				{/* Stepper */}
			</div>
		</header>
	);
}
