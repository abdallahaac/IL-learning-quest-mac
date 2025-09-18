import React from "react";
import {
	faBookOpen,
	faClipboardList,
	faUsers,
	faFlagCheckered,
	faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContentsPage({ activityCount = 0, onNavigate }) {
	const startActivities = 4;
	const teamIndex = startActivities + activityCount;
	const conclusionIndex = teamIndex + 1;
	const resourcesIndex = conclusionIndex + 1;

	const contents = [
		{ label: "Introduction & Quest Info", index: 2, icon: faBookOpen },
		{ label: "Preparation & Activities", index: 3, icon: faClipboardList },
		{ label: "Team & Reflection", index: teamIndex, icon: faUsers },
		{ label: "Conclusion", index: conclusionIndex, icon: faFlagCheckered },
		{ label: "Resources", index: resourcesIndex, icon: faFolderOpen },
	];

	return (
		<div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
			<h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-10">
				Table of Contents
			</h2>

			{/* Flex wrap centers the last row automatically */}
			<ul
				role="list"
				className="flex flex-wrap justify-center gap-6 w-full max-w-5xl"
			>
				{contents.map((item, idx) => (
					<li key={idx}>
						<button
							onClick={() => onNavigate(item.index)}
							className="
                group
                w-64 h-48 sm:w-72 sm:h-52
                rounded-xl border-2 border-indigo-200 bg-white/90
                p-6 text-center shadow-sm hover:shadow-md
                hover:border-indigo-400 focus:outline-none focus:ring-4
                focus:ring-indigo-300 transition-all
                flex flex-col items-center justify-center
              "
						>
							<FontAwesomeIcon
								icon={item.icon}
								className="text-indigo-600 text-3xl mb-4 group-hover:scale-110 transition-transform"
								aria-hidden="true"
							/>
							<span className="text-lg font-medium text-gray-800">
								{item.label}
							</span>
							<span className="mt-1 text-sm text-gray-500">
								Page {item.index + 1}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
