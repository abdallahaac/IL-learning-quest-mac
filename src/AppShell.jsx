import React, { useState, useEffect, useMemo } from "react";
import { useScorm } from "./contexts/ScormContext.jsx";
import useHashRoute from "./hooks/useHashRoute.js";
import { buildPages } from "./utils/pages.js";
import { pageThemes, activityThemes } from "./constants/themes.js";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import TransitionView from "./components/TransitionView.jsx";

import IntroPage from "./components/IntroPage.jsx";
import CoverPage from "./pages/CoverPage.jsx";
import ContentsPage from "./pages/ContentsPage.jsx";
import PreparationPage from "./pages/PreparationPage.jsx";
import SectionPage from "./pages/SectionPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import TeamReflectionPage from "./pages/TeamReflectionPage.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import PatternMorph from "./components/PatternMorph.jsx";
// ---- Local storage helpers ----
const LS_KEY = "quest_state_v1";
function loadFromLS() {
	try {
		const raw = localStorage.getItem(LS_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function saveToLS(payload) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(payload));
	} catch {}
}

export default function AppShell() {
	const { getSuspendData, setSuspendData, scorm } = useScorm();

	const pages = useMemo(() => buildPages(), []);
	const totalPages = pages.length;

	const activityPages = useMemo(
		() =>
			pages
				.map((p, idx) => ({ p, idx }))
				.filter(({ p }) => p.type === "activity"),
		[pages]
	);
	const activityIds = useMemo(
		() => activityPages.map(({ p }) => p.content.id),
		[activityPages]
	);
	const activityPageIndices = useMemo(
		() => activityPages.map(({ idx }) => idx),
		[activityPages]
	);

	const [route, push] = useHashRoute();

	// hydrate from SCORM or localStorage
	const [state, setState] = useState(() => {
		const scormSaved = getSuspendData?.();
		const lsSaved = loadFromLS();
		const saved = scormSaved ?? lsSaved ?? null;

		const initialIndex = Math.min(saved?.pageIndex ?? 0, totalPages - 1);
		const visitedFromSave = Array.isArray(saved?.visited)
			? new Set(saved.visited)
			: new Set();
		visitedFromSave.add(initialIndex);

		return {
			pageIndex: initialIndex,
			notes: saved?.notes ?? {},
			completed: saved?.completed ?? {},
			finished: saved?.finished ?? false,
			visited: visitedFromSave,
		};
	});

	// sync with hash route, mark visited
	useEffect(() => {
		const idx = Math.min(Math.max(route.pageIndex, 0), totalPages - 1);
		setState((s) => {
			if (idx === s.pageIndex && s.visited.has(idx)) return s;
			const nextVisited = new Set(s.visited);
			nextVisited.add(idx);
			return { ...s, pageIndex: idx, visited: nextVisited };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [route.pageIndex, totalPages]);

	// persist to SCORM + localStorage
	useEffect(() => {
		const payload = {
			pageIndex: state.pageIndex,
			notes: state.notes,
			completed: state.completed,
			finished: state.finished,
			visited: Array.from(state.visited),
		};
		setSuspendData?.(payload);
		saveToLS(payload);
	}, [state, setSuspendData]);

	const currentPage = pages[state.pageIndex] ?? pages[0];
	const isActivity = currentPage.type === "activity";

	const themeClass =
		currentPage.type === "activity"
			? activityThemes[currentPage.activityIndex]
			: pageThemes[currentPage.type] || "";

	const jumpToActivity = (i) => {
		const target = activityPageIndices[i];
		if (typeof target === "number") gotoPage(target);
	};

	const gotoPage = (idx) => {
		const clamped = Math.min(Math.max(idx, 0), totalPages - 1);
		push(clamped);
		setState((s) => {
			const nextVisited = new Set(s.visited);
			nextVisited.add(clamped);
			return { ...s, pageIndex: clamped, visited: nextVisited };
		});
	};

	const next = () => {
		setState((s) => {
			const atLast = s.pageIndex >= totalPages - 1;
			if (atLast) {
				if (scorm) {
					scorm.set("cmi.core.lesson_status", "completed");
					scorm.save();
				}
				push(0);
				const nextVisited = new Set(s.visited);
				nextVisited.add(0);
				return { ...s, pageIndex: 0, finished: true, visited: nextVisited };
			}
			const nextIndex = s.pageIndex + 1;
			push(nextIndex);
			const nextVisited = new Set(s.visited);
			nextVisited.add(nextIndex);
			return { ...s, pageIndex: nextIndex, visited: nextVisited };
		});
	};

	const prev = () => {
		setState((s) => {
			const prevIndex = Math.max(0, s.pageIndex - 1);
			push(prevIndex);
			const nextVisited = new Set(s.visited);
			nextVisited.add(prevIndex);
			return { ...s, pageIndex: prevIndex, visited: nextVisited };
		});
	};

	const setNote = (id, value) =>
		setState((s) => ({ ...s, notes: { ...s.notes, [id]: value } }));
	const toggleComplete = (id) =>
		setState((s) => ({
			...s,
			completed: { ...s.completed, [id]: !s.completed[id] },
		}));

	// ------- PROGRESS: visits drive progress; activities add a bonus -------
	const idxByType = (t) => pages.findIndex((p) => p.type === t);
	const idxIntro = idxByType("intro");
	const idxPrep = idxByType("preparation");
	const idxTeam = idxByType("team");
	const idxConclusion = idxByType("conclusion");
	const idxResources = idxByType("resources");

	const visitedHas = (i) => (i >= 0 ? state.visited.has(i) : false);

	// base progress from visiting the five sections (each worth 0.2)
	const baseVisited =
		(visitedHas(idxIntro) ? 1 : 0) +
		(visitedHas(idxPrep) ? 1 : 0) +
		(visitedHas(idxTeam) ? 1 : 0) +
		(visitedHas(idxConclusion) ? 1 : 0) +
		(visitedHas(idxResources) ? 1 : 0);

	const baseFrac = baseVisited / 5;

	// activities add up to +0.25 extra (optional: tweak weight)
	const completedCount = activityIds.reduce(
		(acc, id) => acc + (state.completed[id] ? 1 : 0),
		0
	);
	const activityFrac =
		activityPages.length > 0 ? completedCount / activityPages.length : 0;
	const activitiesBonus = visitedHas(idxPrep) ? 0.25 * activityFrac : 0;

	const curvedProgress = Math.min(1, baseFrac * 0.75 + activitiesBonus); // smooth + capped

	// prefill only until Intro has been visited
	const sawIntro = visitedHas(idxIntro);
	const dynamicPrefill = sawIntro ? 0 : 0;

	const siteTitle = "Learning Quest on Indigenous Cultures";
	const pageTitle =
		currentPage.type === "cover" ? "" : currentPage.content.title;

	const BG_SEQUENCE = ["dots", "plus", "grid", "plus", "dots"];
	const chromeHidden =
		"transition-opacity duration-500 ease-out will-change-[opacity] opacity-0 pointer-events-none";
	const chromeShown = "transition-opacity duration-500 ease-out opacity-100";

	// ----- Render switch -----
	let pageContent = null;
	switch (currentPage.type) {
		case "cover":
			pageContent = (
				<CoverPage
					content={currentPage.content}
					onStart={() => gotoPage(1)}
					onIntroActiveChange={(v) => v}
				/>
			);
			break;
		case "contents":
			pageContent = (
				<ContentsPage
					activityCount={activityPages.length}
					onNavigate={gotoPage}
					progress={curvedProgress}
					prefillStart={dynamicPrefill}
				/>
			);
			break;
		case "intro":
			pageContent = <IntroPage content={currentPage.content} />;
			break;
		case "preparation":
			pageContent = (
				<PreparationPage
					content={currentPage.content}
					onStartActivities={() => gotoPage(4)}
				/>
			);
			break;
		case "conclusion":
			pageContent = (
				<SectionPage type="conclusion" content={currentPage.content} />
			);
			break;
		case "resources":
			pageContent = <ResourcesPage content={currentPage.content} />;
			break;
		case "activity":
			pageContent = (
				<ActivityPage
					content={currentPage.content}
					notes={state.notes[currentPage.content.id]}
					completed={!!state.completed[currentPage.content.id]}
					onNotes={(v) => setNote(currentPage.content.id, v)}
					onToggleComplete={() => toggleComplete(currentPage.content.id)}
					activityIndex={currentPage.activityIndex}
				/>
			);
			break;
		case "team":
			pageContent = (
				<TeamReflectionPage
					content={currentPage.content}
					notes={state.notes["reflect"]}
					onNotes={(v) => setNote("reflect", v)}
				/>
			);
			break;
		default:
			pageContent = <SectionPage content={currentPage.content} />;
	}

	return (
		<div className={`relative min-h-screen flex flex-col ${themeClass}`}>
			<PatternMorph pageIndex={state.pageIndex} sequence={BG_SEQUENCE} />

			{/* Header */}
			<div
				className={currentPage.type === "cover" ? chromeHidden : chromeShown}
			>
				<Header
					siteTitle={siteTitle}
					pageTitle={pageTitle}
					isActivity={isActivity}
					activityIndex={currentPage.activityIndex}
					totalActivities={activityPages.length}
					onHome={() => gotoPage(0)}
					onContents={() => gotoPage(1)}
					activityIds={activityIds}
					completedMap={state.completed}
					onJumpToActivity={jumpToActivity}
				/>
			</div>

			{/* Main */}
			<main className="flex-1 overflow-y-auto relative">
				<div style={{ zIndex: 10 }}>
					<TransitionView screenKey={`page-${state.pageIndex}`}>
						{pageContent}
					</TransitionView>
				</div>
				<div aria-hidden className="h-24 sm:h-20" />
			</main>

			{/* Footer */}
			<div
				className={currentPage.type === "cover" ? chromeHidden : chromeShown}
			>
				<Footer
					pageIndex={state.pageIndex}
					totalPages={totalPages}
					onPrev={prev}
					onNext={next}
					finished={state.finished}
					showPrev={state.pageIndex > 0}
					showNext={state.pageIndex > 0 && state.pageIndex < totalPages - 1}
					nextLabel={(function () {
						const i = state.pageIndex;
						if (i >= totalPages - 1) return "Finish";
						const nextPage = pages[i + 1];
						if (currentPage.type === "preparation") return "Begin Activities";
						if (nextPage?.type === "activity") {
							const num = (nextPage.activityIndex ?? 0) + 1;
							return `Activity ${num}`;
						}
						return nextPage?.content?.title || "Next";
					})()}
				/>
			</div>
		</div>
	);
}
