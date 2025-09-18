import React from "react";

/**
 * Header component for the holistic learning quest.
 * - Click the site title to go "Home" (cover page) via onHome()
 * - Shows contextual subtitle (activity count when applicable)
 */
export default function Header({
	siteTitle = "Learning Quest",
	pageTitle = "",
	isActivity = false,
	activityIndex = 0,
	totalActivities = 0,
	onHome, // <-- NEW: pass from AppShell: onHome={() => gotoPage(0)}
}) {
	const subtitle = isActivity
		? `Activity ${activityIndex + 1} of ${totalActivities}: ${pageTitle}`
		: pageTitle;

	return (
		<header
			className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200"
			role="banner"
		>
			<div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
				{/* Clickable title goes home when onHome is provided */}
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

				{subtitle && (
					<span className="text-sm sm:text-base text-gray-600">{subtitle}</span>
				)}
			</div>
		</header>
	);
}
