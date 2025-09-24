import React from "react";
import ActivityDock from "./ActivityDock.jsx";

export default function Footer({
	pageIndex = 0,
	totalPages = 1,
	onPrev,
	onNext,
	nextLabel = "Next",
	activitySteps = [],
	onJumpToPage,
	containerRef, // NEW: ref from AppShell
}) {
	const isFirst = pageIndex === 0;
	const isLast = pageIndex === totalPages - 1;

	return (
		<footer
			ref={containerRef} // NEW: measure me
			className="fixed bottom-0 left-0 w-full z-50 bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-t border-gray-200 shadow-sm"
			role="contentinfo"
		>
			<div className="relative max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
				<ActivityDock
					steps={activitySteps}
					currentPageIndex={pageIndex}
					onJump={onJumpToPage}
					initialPosition={{ x: 24, y: 24 }}
					storageKey="my_dock_pos_v1"
					snapToEdge
				/>
				<span className="text-sm text-gray-600">
					Page {pageIndex + 1} / {totalPages}
				</span>
				<div className="flex-1" />
				<div className="flex gap-2">
					<button
						type="button"
						className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={onPrev}
						disabled={isFirst}
					>
						Back
					</button>
					{!isFirst && (
						<button
							type="button"
							className="px-5 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600"
							onClick={onNext}
							aria-label={isLast ? "Finish" : nextLabel}
							title={isLast ? "Finish" : nextLabel}
						>
							{isLast ? "Finish" : nextLabel}
						</button>
					)}
				</div>
			</div>
		</footer>
	);
}
