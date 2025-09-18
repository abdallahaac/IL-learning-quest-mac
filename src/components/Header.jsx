import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons"; // better "overview" icon

export default function Header({
	siteTitle = "Learning Quest",
	pageTitle = "",
	isActivity = false,
	activityIndex = 0,
	totalActivities = 0,
	onHome,
	onContents,
}) {
	const subtitle = isActivity
		? `Activity ${activityIndex + 1} of ${totalActivities}: ${pageTitle}`
		: pageTitle;

	return (
		<header
			className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200"
			role="banner"
		>
			<div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
				{/* Left: Title */}
				{onHome ? (
					<button
						type="button"
						onClick={onHome}
						className="text-left text-xl sm:text-2xl font-semibold text-gray-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
						aria-label="Go to home"
						title="Home"
					>
						{siteTitle}
					</button>
				) : (
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
						{siteTitle}
					</h1>
				)}

				{/* Center: Subtitle */}
				{subtitle && (
					<span className="text-sm sm:text-base text-gray-600 mx-auto hidden sm:block">
						{subtitle}
					</span>
				)}

				{/* Right: Actions */}
				<div className="flex items-center gap-2">
					{onContents && (
						<button
							type="button"
							onClick={onContents}
							className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium 
								bg-sky-500 text-white shadow-sm 
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
						</button>
					)}
				</div>
			</div>

			{/* Mobile subtitle */}
			{subtitle && (
				<div className="sm:hidden px-4 pb-2">
					<span className="text-sm text-gray-600">{subtitle}</span>
				</div>
			)}
		</header>
	);
}
