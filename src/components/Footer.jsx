// src/components/Footer.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Footer({
	pageIndex = 0,
	totalPages = 1,
	onPrev,
	onNext,
	nextLabel = "Next",
}) {
	const isFirst = pageIndex === 0;
	const isLast = pageIndex === totalPages - 1;

	return (
		<footer
			id="app-footer"
			className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur border-t border-gray-200"
		>
			<div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<span className="text-sm text-gray-600">
					Page {pageIndex + 1} / {totalPages}
				</span>

				<div className="flex gap-2 mt-2 sm:mt-0">
					{/* Back */}
					<button
						type="button"
						className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={onPrev}
						disabled={isFirst}
					>
						Back
					</button>

					{/* Next / Finish */}
					{!isFirst && (
						<button
							type="button"
							className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600"
							onClick={onNext}
							aria-label={isLast ? "Finish" : nextLabel}
							title={isLast ? "Finish" : nextLabel}
						>
							{isLast ? "Finish" : nextLabel}
							{!isLast && <FontAwesomeIcon icon={faArrowRight} />}
						</button>
					)}
				</div>
			</div>
		</footer>
	);
}
