import { accentForActivityIndex } from "../constants/accents.js";

export const idxByType = (pages, t) => pages.findIndex((p) => p.type === t);

export const buildActivityMeta = (activityPages) =>
	activityPages.map(({ p, idx }, i) => ({
		id: p?.content?.id || `activity-${i + 1}`,
		title: p?.content?.title || `Activity ${i + 1}`,
		number: i + 1,
		index: idx,
	}));

export const computeActivityProgress = (activityPageIndices, visited) => {
	const count = activityPageIndices.reduce(
		(acc, idx) => acc + (visited.has(idx) ? 1 : 0),
		0
	);
	const frac =
		activityPageIndices.length > 0 ? count / activityPageIndices.length : 0;
	return { count, frac };
};

export const computeCurvedProgress = ({
	visited,
	pages,
	activityFrac,
	idxIntro,
	idxPrep,
	idxTeam,
	idxReflection,
	idxConclusion,
	idxResources,
}) => {
	const visitedHas = (i) => (i >= 0 ? visited.has(i) : false);
	const reflectionPresent = idxReflection >= 0;
	const activitiesSlot = visitedHas(idxPrep) ? activityFrac : 0;

	const slots = [
		visitedHas(idxIntro) ? 1 : 0,
		visitedHas(idxPrep) ? 1 : 0,
		activitiesSlot,
		visitedHas(idxTeam) ? 1 : 0,
		...(reflectionPresent ? [visitedHas(idxReflection) ? 1 : 0] : []),
		visitedHas(idxConclusion) ? 1 : 0,
		visitedHas(idxResources) ? 1 : 0,
	];

	let acc = 0;
	for (let i = 0; i < slots.length; i++) {
		const f = Math.max(0, Math.min(1, slots[i]));
		if (f >= 1) acc += 1;
		else {
			acc += f;
			break;
		}
	}
	return acc / slots.length;
};

export const accentForPage = (page) => {
	if (!page) return "#67AAF9";
	if (page.type === "activity")
		return accentForActivityIndex(page.activityIndex || 0);
	if (page.type === "intro") return "#4380D6";
	if (page.type === "preparation") return "#7443D6";
	if (page.type === "conclusion") return "#D66843";
	if (page.type === "resources") return "#10B981";
	return "#67AAF9";
};
