// src/components/Header.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";

/**
 * Fixed header that vertically centers the title and the "Contents" button.
 * AppShell adds top padding equal to this element’s measured height.
 */
export default function Header({
	siteTitle = "Learning Quest on Indigenous Cultures",
	onHome,
	onContents,
	containerRef, // pass from AppShell for ResizeObserver measuring
}) {
	return (
		<div
			ref={containerRef}
			role="banner"
			className="
        fixed inset-x-0 top-0 z-[70]
        bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur
        border-b border-slate-200 shadow-sm
      "
			style={{
				// Safe-area applied on the wrapper so inner centering stays true
				paddingTop: "max(0px, env(safe-area-inset-top))",
				WebkitBackdropFilter: "blur(6px)",
				backdropFilter: "blur(6px)",
			}}
		>
			<div
				className="
          relative max-w-7xl mx-auto w-full
          px-5 sm:px-10 py-4
          /* a roomy header height; grid centers children vertically */
          min-h-[150px] md:min-h-[150px] lg:min-h-[150px]
          grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]
          items-center content-center gap-y-3
        "
			>
				{/* Title */}
				<div className="min-w-0">
					{onHome ? (
						<button
							type="button"
							onClick={onHome}
							className="
                block text-left text-[1.15rem] sm:text-lg md:text-xl font-semibold
                text-slate-900 leading-snug tracking-tight
                whitespace-normal break-words max-w-[36ch] line-clamp-2
                focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded
              "
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

				{/* Contents button */}
				<div className="justify-self-start md:justify-self-end self-center">
					{onContents && (
						<button
							type="button"
							onClick={onContents}
							className="
                inline-flex items-center gap-2
                rounded-full px-4 md:px-5 py-2.5
                text-sm md:text-base font-medium
                bg-sky-500 text-white shadow-sm
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
							<span className="hidden sm:inline">Contents</span>
							<span className="sm:hidden">TOC</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
