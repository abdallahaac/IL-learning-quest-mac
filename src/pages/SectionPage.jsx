// src/pages/SectionPage.jsx
import React from "react";
import ConclusionSection from "./ConclusionSection.jsx";

export default function SectionPage({ content = {}, type }) {
	if (type === "conclusion") {
		return <ConclusionSection content={content} />;
	}

	const { title, paragraphs, bullets, items } = content;

	return (
		<div className="flex-1 px-4 py-12 max-w-4xl mx-auto space-y-6">
			<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>

			{Array.isArray(paragraphs) &&
				paragraphs.map((p, idx) => (
					<p key={`p-${idx}`} className="text-gray-700 leading-relaxed">
						{p}
					</p>
				))}

			{Array.isArray(bullets) &&
				bullets.map((group, gidx) => (
					<div key={`group-${gidx}`} className="space-y-2">
						{group.heading && (
							<h3 className="text-lg font-medium text-gray-800">
								{group.heading}
							</h3>
						)}
						<ul className="list-disc list-inside space-y-1 text-gray-700">
							{group.items.map((item, i) => (
								<li key={`bullet-${gidx}-${i}`}>{item}</li>
							))}
						</ul>
					</div>
				))}

			{Array.isArray(items) && (
				<ul className="list-disc list-inside space-y-2 text-gray-700">
					{items.map((it, i) => (
						<li key={`item-${i}`}>{it}</li>
					))}
				</ul>
			)}
		</div>
	);
}
