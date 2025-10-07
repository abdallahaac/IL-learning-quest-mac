import {
	faBookOpen,
	faClipboardList,
	faListCheck,
	faUsers,
	faComments,
	faFlagCheckered,
	faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Build the ordered TOC items once, from tocTargets.
 * This is the single source of truth for the items & their hues/icons.
 */
export function buildTocItems(tocTargets) {
	const base = [
		{
			label: "Introduction",
			index: tocTargets.introIndex,
			icon: faBookOpen,
			hue: 215,
		},
		{
			label: "Preparation",
			index: tocTargets.preparationIndex,
			icon: faClipboardList,
			hue: 260,
		},
		{
			label: "Activities",
			index: tocTargets.activitiesIndex,
			icon: faListCheck,
			hue: 0,
		},
		{
			label: "Team Reflection",
			index: tocTargets.teamIndex,
			icon: faUsers,
			hue: 212,
		},
	];
	// Only include Reflection when present
	if (
		typeof tocTargets.reflectionIndex === "number" &&
		tocTargets.reflectionIndex >= 0
	) {
		base.push({
			label: "Reflection",
			index: tocTargets.reflectionIndex,
			icon: faComments,
			hue: 330,
		});
	}
	base.push(
		{
			label: "Conclusion",
			index: tocTargets.conclusionIndex,
			icon: faFlagCheckered,
			hue: 15,
		},
		{
			label: "Resources",
			index: tocTargets.resourcesIndex,
			icon: faFolderOpen,
			hue: 145,
		}
	);
	return base.filter((it) => typeof it.index === "number" && it.index >= 0);
}
