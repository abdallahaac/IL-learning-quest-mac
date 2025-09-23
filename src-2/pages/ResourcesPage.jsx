// src/pages/ResourcesPage.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPrint,
	faFileArrowDown,
	faLink,
} from "@fortawesome/free-solid-svg-icons";
import { categorizeResources, iconForGroup } from "../utils/resources.js";

export default function ResourcesPage({ content }) {
	const groups = categorizeResources(content.items);

	const escapeHTML = (s) =>
		String(s)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");

	const composeHTML = () => {
		const style = `
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111827; line-height:1.5; }
        h1 { font-size:1.5rem; margin:0 0 .5rem; }
        h2 { font-size:1.125rem; margin:1rem 0 .25rem; }
        .tag { display:inline-block; padding:2px 8px; border-radius:999px; background:#ECFDF5; color:#065F46; margin:2px 6px 2px 0; font-size:12px; border:1px solid #A7F3D0; }
        .card { border:1px solid #E5E7EB; border-radius:12px; padding:12px; margin:.5rem 0; }
      </style>
    `;
		const sections = Object.entries(groups)
			.map(([title, items]) => {
				const tags = items
					.map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
					.join("");
				return `<h2>${escapeHTML(title)}</h2><div>${tags}</div>`;
			})
			.join("");
		// no doctype
		return `<html lang="en"><head><meta charset="utf-8">${style}</head><body><h1>${escapeHTML(
			content.title
		)}</h1>${sections}</body></html>`;
	};

	const exportWord = () => {
		const html = composeHTML();
		const blob = new Blob([html], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "resources.doc";
		a.click();
		URL.revokeObjectURL(url);
	};

	const exportPdf = () => {
		const html = composeHTML();
		const w = window.open("", "_blank", "noopener,noreferrer");
		if (!w) return;
		w.document.open();
		w.document.write(html);
		w.document.close();
		setTimeout(() => w.print(), 250);
	};

	return (
		// full-width wrapper so the overlay is not clipped
		<div className="relative flex-1 bg-transparent py-10 sm:py-12">
			{/* sky overlay: same recipe as other pages, spanning full width */}
			<div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none
                   bg-gradient-to-b from-sky-50/85 via-white/75 to-slate-50/85"
			/>

			{/* content container (width-limited) */}
			<div className="relative z-10 max-w-5xl mx-auto px-4 space-y-8">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
						{content.title}
					</h2>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={exportPdf}
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
							title="Open print dialog to save as PDF"
						>
							<FontAwesomeIcon icon={faPrint} /> PDF
						</button>
						<button
							type="button"
							onClick={exportWord}
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-teal-300 bg-white text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
							title="Download a Word document"
						>
							<FontAwesomeIcon icon={faFileArrowDown} /> Word
						</button>
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-4 mt-2">
					{Object.entries(groups).map(([title, items]) => (
						<article
							key={title}
							className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm"
						>
							<div className="flex items-center gap-3">
								<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
									<FontAwesomeIcon icon={iconForGroup(title)} />
								</span>
								<h3 className="font-semibold text-gray-900">{title}</h3>
							</div>

							<div className="mt-3 flex flex-wrap gap-2">
								{items.map((t, i) => (
									<span
										key={`${title}-${i}`}
										className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full
                               bg-emerald-50 text-emerald-800 border border-emerald-200"
									>
										<FontAwesomeIcon icon={faLink} className="opacity-70" />
										{t}
									</span>
								))}
							</div>
						</article>
					))}
				</div>

				<div className="text-center text-gray-700">
					<p>
						Explore a few resources each week. Save favourites and bring one
						into your next team conversation.
					</p>
				</div>
			</div>
		</div>
	);
}
