import React from "react";

export default function ContentsPage({ activityCount = 0, onNavigate }) {
	const startActivities = 4;
	const teamIndex = startActivities + activityCount;
	const conclusionIndex = teamIndex + 1;
	const resourcesIndex = conclusionIndex + 1;
	const contents = [
		{ label: "Introduction & Quest Info", index: 2 },
		{ label: "Preparation & Activities", index: 3 },
		{ label: "Team & Reflection", index: teamIndex },
		{ label: "Conclusion", index: conclusionIndex },
		{ label: "Resources", index: resourcesIndex },
	];
	return (
		<div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
			<h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-8">
				Table of Contents
			</h2>
			<ul className="space-y-4 max-w-md w-full text-left">
				{contents.map((item, idx) => (
					<li
						key={idx}
						className="border border-gray-300 rounded-lg bg-white/80 hover:bg-white/90 transition-colors"
					>
						<button
							onClick={() => onNavigate(item.index)}
							className="w-full text-left px-4 py-3 flex justify-between items-center text-gray-700"
						>
							<span>{item.label}</span>
							<span className="text-sm text-gray-500">
								Page {item.index + 1}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
