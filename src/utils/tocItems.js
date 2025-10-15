import {
	faBookOpen,
	faClipboardList,
	faListCheck,
	faUsers,
	faComments,
	faFlagCheckered,
	faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { UI_STRINGS } from "../constants/content.js";

/* query param > <html lang> > navigator; defaults to en */
function detectLang() {
	try {
		const qs = new URLSearchParams(window.location.search);
		if (qs.get("lang")) return qs.get("lang").toLowerCase().slice(0, 2);
		const html = document.documentElement?.getAttribute("lang");
		if (html) return html.toLowerCase().slice(0, 2);
		const nav = navigator?.language || navigator?.languages?.[0];
		if (nav) return nav.toLowerCase().slice(0, 2);
	} catch {}
	return "en";
}

/**
 * Build the ordered TOC items from tocTargets with localized labels.
 */
export function buildTocItems(tocTargets) {
	const lang = detectLang() === "fr" ? "fr" : "en";
	const STR = UI_STRINGS[lang]?.toc || UI_STRINGS.en.toc;

	const base = [
		{
			key: "intro",
			label: STR.intro ?? "Introduction",
			index: tocTargets.introIndex,
			icon: faBookOpen,
			hue: 215,
			type: "intro",
			slug: "introduction",
		},
		{
			key: "preparation",
			label: STR.preparation ?? "Preparation",
			index: tocTargets.preparationIndex,
			icon: faClipboardList,
			hue: 260,
			type: "preparation",
			slug: "preparation",
		},
		{
			key: "activities",
			label: STR.activities ?? "Activities",
			index: tocTargets.activitiesIndex,
			icon: faListCheck,
			hue: 0,
			type: "activities",
			slug: "activities",
		},
		{
			key: "team",
			label: STR.teamReflection ?? "Team Reflection",
			index: tocTargets.teamIndex,
			icon: faUsers,
			hue: 212,
			type: "team",
			slug: "team-reflection",
		},
	];

	if (
		typeof tocTargets.reflectionIndex === "number" &&
		tocTargets.reflectionIndex >= 0
	) {
		base.push({
			key: "reflection",
			label: STR.reflection ?? "Reflection",
			index: tocTargets.reflectionIndex,
			icon: faComments,
			hue: 330,
			type: "reflection",
			slug: "reflection",
		});
	}

	base.push(
		{
			key: "conclusion",
			label: STR.conclusion ?? "Conclusion",
			index: tocTargets.conclusionIndex,
			icon: faFlagCheckered,
			hue: 15,
			type: "conclusion",
			slug: "conclusion",
		},
		{
			key: "resources",
			label: STR.resources ?? "Resources",
			index: tocTargets.resourcesIndex,
			icon: faFolderOpen,
			hue: 145,
			type: "resources",
			slug: "resources",
		}
	);

	return base.filter((it) => typeof it.index === "number" && it.index >= 0);
}
