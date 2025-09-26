import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import ActivityDock from "./ActivityDock.jsx";

export default function Header({
	siteTitle = "Learning Quest on Indigenous Cultures",
	onHome,
	onContents,
	containerRef,
	// pass from AppShell:
	activitySteps = [],
	currentPageIndex = 0,
	onJumpToPage,
}) {
	return (
		<div
			ref={containerRef}
			role="banner"
			className="
        fixed inset-x-0 top-0 z-[80]
        bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur
        border-b border-slate-200 shadow-sm
      "
			style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
		>
			<div
				className="
          relative max-w-8xl mx-auto w-full
          px-10 sm:px-11 py-4
          min-h-[120px]
          grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]
          items-center gap-y-3
        "
			>
				{/* Left: Title */}
				<div className="min-w-0 ml-20">
					{onHome ? (
						<button
							type="button"
							onClick={onHome}
							className="block text-left text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-snug tracking-tight max-w-[36ch] line-clamp-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
							aria-label="Go to home"
							title="Home"
						>
							{siteTitle}
						</button>
					) : (
						<h1 className="text-[1.15rem] sm:text-lg md:text-xl font-semibold text-slate-900 leading-snug tracking-tight max-w-[36ch] line-clamp-2">
							{siteTitle}
						</h1>
					)}
				</div>

				{/* Right: single parent block (children spaced between) */}
				<div className="justify-self-end w-full max-w-[460px]">
					<div className="flex items-center justify-between gap-3">
						{/* Left child inside right block */}
						{onContents && (
							<button
								type="button"
								onClick={onContents}
								className="
                   inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-3.5
      text-sm md:text-base font-medium bg-sky-500 text-white
      shadow-md hover:shadow-lg
      hover:bg-sky-600 active:bg-sky-700
      focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition
                "
								aria-label="Go to Table of Contents"
								title="Table of Contents"
							>
								<FontAwesomeIcon
									className="w-5 h-5"
									icon={faTableColumns}
									aria-hidden="true"
								/>
								<span
									className="hidden sm:inline 
								"
								>
									Contents
								</span>
								<span className="sm:hidden">TOC</span>
							</button>
						)}

						{/* Right child inside right block */}
						<ActivityDock
							steps={activitySteps}
							currentPageIndex={currentPageIndex}
							onJump={onJumpToPage}
							contentMaxWidth={1200}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
