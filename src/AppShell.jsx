import React from "react";
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
import useResizeObserver from "./hooks/useResizeObserver.jsx";
import ConclusionSection from "./pages/ConclusionSection.jsx";
import SplashPage from "./pages/SplashPage.jsx";

import { HEADER_FIXED_H } from "./constants/storage.js";
import { accentForActivityIndex } from "./constants/accents.js";
import { useQuestState } from "./state/useQuestState.js";
import {
	idxByType,
	buildActivityMeta,
	computeActivityProgress,
	computeCurvedProgress,
	accentForPage,
} from "./selectors/pageSelectors.js";
import { downloadAllReflections } from "./exports/downloadReflections.js";

import {
	COVER_CONTENT,
	INTRO_INFO_CONTENT,
	PREPARATION_CONTENT,
	TEAM_CONTENT,
	CONCLUSION_CONTENT,
	RESOURCES_CONTENT,
	COVER_CONTENT_FR,
	INTRO_INFO_CONTENT_FR,
	PREPARATION_CONTENT_FR,
	TEAM_CONTENT_FR,
	CONCLUSION_CONTENT_FR,
	RESOURCES_CONTENT_FR,
	UI_STRINGS,
	ACTIVITIES_CONTENT,
} from "./constants/content.js";

const SPLASH_SEEN_KEY = "__APP_SPLASH_SEEN_ONCE__";

function isSplashDisabled() {
	try {
		const qs = new URLSearchParams(window.location.search);
		if (qs.has("noSplash")) return true;
		if (localStorage.getItem("noSplash") === "1") return true;
	} catch {}
	return String(import.meta.env?.VITE_DISABLE_SPLASH || "").trim() === "1";
}
function hasSeenSplashOnce() {
	try {
		return (
			sessionStorage.getItem(SPLASH_SEEN_KEY) === "1" ||
			localStorage.getItem(SPLASH_SEEN_KEY) === "1"
		);
	} catch {
		return false;
	}
}
function markSplashSeen() {
	try {
		sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
		localStorage.setItem(SPLASH_SEEN_KEY, "1");
	} catch {}
}
function maybeResetSplashFlagFromQuery() {
	try {
		const qs = new URLSearchParams(window.location.search);
		if (qs.has("resetSplash")) {
			sessionStorage.removeItem(SPLASH_SEEN_KEY);
			localStorage.removeItem(SPLASH_SEEN_KEY);
		}
	} catch {}
}

function scrollContainerToTop(el, { reduced }) {
	if (!el) return;
	const atTop = (el.scrollTop || 0) <= 1;
	if (atTop) return;
	const canSmooth =
		!reduced &&
		typeof el.scrollTo === "function" &&
		"scrollBehavior" in document.documentElement.style;
	try {
		if (canSmooth) el.scrollTo({ top: 0, behavior: "smooth" });
		else el.scrollTop = 0;
	} catch {
		el.scrollTop = 0;
	}
}

// Language detection
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

// Static page content map
const CONTENT_BY_TYPE = {
	cover: { en: COVER_CONTENT, fr: COVER_CONTENT_FR },
	intro: { en: INTRO_INFO_CONTENT, fr: INTRO_INFO_CONTENT_FR },
	preparation: { en: PREPARATION_CONTENT, fr: PREPARATION_CONTENT_FR },
	team: { en: TEAM_CONTENT, fr: TEAM_CONTENT_FR },
	conclusion: { en: CONCLUSION_CONTENT, fr: CONCLUSION_CONTENT_FR },
	resources: { en: RESOURCES_CONTENT, fr: RESOURCES_CONTENT_FR },
};

// Return localized activity payload from constants by id with EN fallback
function getActivityContent(id, lang) {
	const pack = ACTIVITIES_CONTENT?.[id];
	if (!pack) return null;
	return lang === "fr" ? pack.fr || pack.en : pack.en;
}

export default function AppShell() {
	const scrollRef = React.useRef(null);
	const reducedMotion = React.useMemo(() => {
		try {
			return (
				window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ===
				true
			);
		} catch {
			return false;
		}
	}, []);

	const { getSuspendData, setSuspendData, scorm } = useScorm();

	const [userInteracted, setUserInteracted] = React.useState(false);
	React.useEffect(() => {
		if (userInteracted) return;
		const onFirst = () => setUserInteracted(true);
		window.addEventListener("pointerdown", onFirst, {
			once: true,
			capture: true,
		});
		window.addEventListener("keydown", onFirst, { once: true, capture: true });
		return () => {
			window.removeEventListener("pointerdown", onFirst, { capture: true });
			window.removeEventListener("keydown", onFirst, { capture: true });
		};
	}, [userInteracted]);
	React.useEffect(() => {
		if (!userInteracted) return;
		const els = document.querySelectorAll("video[autoplay],audio[autoplay]");
		els.forEach((el) => {
			if (el.tagName === "VIDEO" && el.muted !== true) el.muted = true;
			el.play?.().catch(() => {});
		});
	}, [userInteracted]);
	window.safePlay = async (el) => {
		try {
			await el.play();
			return true;
		} catch {
			return false;
		}
	};

	const pages = React.useMemo(() => buildPages(), []);
	const totalPages = pages.length;
	const activityPages = React.useMemo(
		() =>
			pages
				.map((p, idx) => ({ p, idx }))
				.filter(({ p }) => p.type === "activity"),
		[pages]
	);
	const activityPageIndices = React.useMemo(
		() => activityPages.map(({ idx }) => idx),
		[activityPages]
	);
	const [route, push] = useHashRoute();

	const { state, setState, setNote, toggleComplete } = useQuestState({
		scorm: {
			getSuspendData,
			setSuspendData,
			set: scorm?.set,
			save: scorm?.save,
		},
		routePageIndex: route.pageIndex,
		totalPages,
	});

	const [showSplash, setShowSplash] = React.useState(() => {
		try {
			maybeResetSplashFlagFromQuery();
			const qs = new URLSearchParams(window.location.search);
			const force = qs.has("forceSplash");
			if (isSplashDisabled() && !force) return false;

			const reduced =
				window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ===
				true;
			if (reduced && !force) return false;

			if (!force && hasSeenSplashOnce()) return false;
			return true;
		} catch {
			return true;
		}
	});

	const gotoPage = (idx) => {
		const clamped = Math.min(Math.max(idx, 0), totalPages - 1);
		push(clamped);
		setState((s) => {
			const visited = new Set(s.visited);
			visited.add(clamped);
			return { ...s, pageIndex: clamped, visited };
		});
	};

	const next = () => {
		setState((s) => {
			const atLast = s.pageIndex >= totalPages - 1;
			if (atLast) {
				try {
					if (scorm?.version === "1.2")
						scorm?.set?.("cmi.core.lesson_status", "completed");
					else scorm?.set?.("cmi.completion_status", "completed");
					scorm?.save?.();
				} catch {}
				push(0);
				const visited = new Set(s.visited);
				visited.add(0);
				return { ...s, pageIndex: 0, finished: true, visited };
			}
			const nextIndex = s.pageIndex + 1;
			push(nextIndex);
			const visited = new Set(s.visited);
			visited.add(nextIndex);
			return { ...s, pageIndex: nextIndex, visited };
		});
	};

	const prev = () => {
		setState((s) => {
			const prevIndex = Math.max(0, s.pageIndex - 1);
			push(prevIndex);
			const visited = new Set(s.visited);
			visited.add(prevIndex);
			return { ...s, pageIndex: prevIndex, visited };
		});
	};

	const idxIntro = idxByType(pages, "intro");
	const idxPrep = idxByType(pages, "preparation");
	const idxTeam = idxByType(pages, "team");
	const idxReflection = idxByType(pages, "reflection");
	const idxConclusion = idxByType(pages, "conclusion");
	const idxResources = idxByType(pages, "resources");
	const idxFirstActivity = activityPageIndices[0] ?? -1;

	const { count: activityVisitedCount, frac: activityFrac } =
		computeActivityProgress(activityPageIndices, state.visited);

	const curvedProgress = computeCurvedProgress({
		visited: state.visited,
		pages,
		activityFrac,
		idxIntro,
		idxPrep,
		idxTeam,
		idxReflection,
		idxConclusion,
		idxResources,
	});

	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const STR = UI_STRINGS[lang];
	const siteTitle =
		lang === "fr"
			? "Quête d’apprentissage sur les cultures autochtones"
			: "Learning Quest on Indigenous Cultures";

	const [headerRef] = useResizeObserver();
	const [footerRef, footerSize] = useResizeObserver();
	const footerHeight = footerSize.height || 0;

	const activitySteps = activityPages.map(({ p, idx }, i) => ({
		key: p.content.id,
		label: lang === "fr" ? `Activité ${i + 1}` : `Activity ${i + 1}`,
		index: idx,
		completed: state.visited.has(idx),
		visited: state.visited.has(idx),
		accent: accentForActivityIndex(i),
	}));

	const currentPage = pages[state.pageIndex] ?? pages[0];
	const accentForThisPage = accentForPage(currentPage);

	const activityMeta = React.useMemo(
		() => buildActivityMeta(activityPages),
		[activityPages]
	);

	const allActivitiesVisited =
		activityPageIndices.length > 0 &&
		activityVisitedCount >= activityPageIndices.length;

	const allActivitiesCompleted = React.useMemo(
		() => activityPages.every(({ p }) => !!state.completed[p.content.id]),
		[activityPages, state.completed]
	);

	const [reflectBusy, setReflectBusy] = React.useState(false);
	const onDownloadAllReflections = async () => {
		if (reflectBusy || !allActivitiesCompleted) return;
		setReflectBusy(true);
		try {
			downloadAllReflections({ activityMeta, notes: state.notes });
		} finally {
			setTimeout(() => setReflectBusy(false), 900);
		}
	};

	const getNextLabel = () => {
		const i = state.pageIndex;
		const atLast = i >= totalPages - 1;
		if (atLast) return STR.footer.finish;
		const nextPage = pages[i + 1];
		if (currentPage.type === "preparation")
			return lang === "fr" ? "Commencer les activités" : "Start Activities";
		if (nextPage?.type === "activity") {
			const num = (nextPage.activityIndex ?? 0) + 1;
			return lang === "fr" ? `Activité ${num}` : `Activity ${num}`;
		}
		return nextPage?.content?.title || STR.footer.next;
	};

	// Localize non-activity pages
	const localizedContent = React.useMemo(() => {
		const type = currentPage?.type;
		const map = CONTENT_BY_TYPE[type];
		if (!map) return currentPage?.content;
		return lang === "fr" ? map.fr : map.en;
	}, [currentPage, lang]);

	// Localize activity content from constants by id; fallback to EN
	const localizedActivityContent = React.useMemo(() => {
		if (currentPage?.type !== "activity") return null;
		const id = currentPage?.content?.id; // "a1".."a10"
		return getActivityContent(id, lang) || currentPage.content;
	}, [currentPage, lang]);

	React.useEffect(() => {
		scrollContainerToTop(scrollRef.current, { reduced: reducedMotion });
	}, [state.pageIndex, reducedMotion]);

	React.useEffect(() => {
		if (!showSplash) {
			requestAnimationFrame(() => {
				scrollContainerToTop(scrollRef.current, { reduced: reducedMotion });
			});
		}
	}, [showSplash, reducedMotion]);

	if (showSplash) {
		return (
			<div className="app-shell relative h-screen flex flex-col bg-white">
				<div className="absolute inset-0 z-0 pointer-events-none">
					<PatternMorph pageIndex={0} sequence={["dots", "grid"]} />
				</div>
				<div className="relative z-20">
					<SplashPage
						onDone={() => {
							markSplashSeen();
							setShowSplash(false);
							try {
								document.body.style.backgroundColor = "#ffffff";
								document.documentElement.style.backgroundColor = "#ffffff";
							} catch {}
						}}
					/>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`app-shell relative h-screen flex flex-col bg-white ${
				currentPage.type === "activity"
					? activityThemes[currentPage.activityIndex]
					: pageThemes[currentPage.type] || ""
			}`}
			style={{
				"--header-h": `${HEADER_FIXED_H}px`,
				"--footer-h": `${footerHeight}px`,
			}}
		>
			<div className="absolute inset-0 z-0 pointer-events-none">
				<PatternMorph
					pageIndex={state.pageIndex}
					sequence={["dots", , "grid"]}
				/>
			</div>

			<div className="relative z-10 flex min-h-0 flex-1 flex-col">
				<Header
					containerRef={headerRef}
					siteTitle={siteTitle}
					onHome={() => gotoPage(0)}
					onContents={() => gotoPage(1)}
					activitySteps={activitySteps}
					currentPageIndex={state.pageIndex}
					onJumpToPage={(idx) => gotoPage(idx)}
					accent={accentForThisPage}
					primaryBtnClassOverride={
						["cover", "contents"].includes(currentPage.type)
							? "inline-flex items-center gap-2 h-11 md:h-12 px-4 md:px-5 bg-sky-600 text-sm md:text-base font-medium text-white rounded-full shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-colors"
							: null
					}
					homeLabel={STR.header.home}
				/>

				<div className="flex-1 relative min-h-0">
					<div
						ref={scrollRef}
						className="relative flex h-full flex-col overflow-y-auto min-h-0"
						style={{ paddingBottom: "var(--footer-h)" }}
					>
						<main className="flex-1 relative min-h-0">
							<div className="relative z-10">
								<TransitionView screenKey={`page-${state.pageIndex}`}>
									{currentPage.type === "cover" && (
										<CoverPage
											content={localizedContent}
											onStart={() => gotoPage(1)}
											onIntroActiveChange={() => {}}
											labels={STR.cover}
										/>
									)}

									{currentPage.type === "contents" && (
										<ContentsPage
											onNavigate={gotoPage}
											progress={curvedProgress}
											prefillStart={0.06}
											tocTargets={{
												introIndex: idxIntro,
												preparationIndex: idxPrep,
												activitiesIndex: idxFirstActivity,
												teamIndex: idxTeam,
												reflectionIndex: idxReflection,
												conclusionIndex: idxConclusion,
												resourcesIndex: idxResources,
											}}
											visitedIndices={[...state.visited]}
											activitiesVisitedCount={activityVisitedCount}
											activitiesTotal={activityPageIndices.length}
											allActivitiesCompleted={allActivitiesCompleted}
											nodeXOffsetOverrides={[-80, -140, -90, -150, -100, -200]}
											nodeYOffsetOverrides={[-100, 70, -105, 95, -95, 50]}
											cardPosOverrides={[
												{ x: -19, y: -165 },
												{ x: -75, y: 5 },
												{ x: -20, y: -170 },
												{ x: -85, y: 30 },
												{ x: -30, y: -160 },
												{ x: -130, y: -15 },
											]}
											reflectionsReady={allActivitiesCompleted && !reflectBusy}
											onDownloadAllReflections={onDownloadAllReflections}
											labels={UI_STRINGS[lang].toc}
										/>
									)}

									{currentPage.type === "intro" && (
										<IntroPage content={localizedContent} />
									)}

									{currentPage.type === "preparation" && (
										<PreparationPage
											content={localizedContent}
											onStartActivities={() =>
												gotoPage(
													idxFirstActivity >= 0
														? idxFirstActivity
														: state.pageIndex + 1
												)
											}
										/>
									)}

									{currentPage.type === "conclusion" && (
										<ConclusionSection
											content={localizedContent}
											accent="#D66843"
										/>
									)}

									{currentPage.type === "resources" && (
										<ResourcesPage content={localizedContent} />
									)}

									{currentPage.type === "activity" && (
										<ActivityPage
											content={localizedActivityContent ?? currentPage.content}
											notes={
												state.notes[
													(localizedActivityContent ?? currentPage.content).id
												]
											}
											completed={
												!!state.completed[
													(localizedActivityContent ?? currentPage.content).id
												]
											}
											onNotes={(v) =>
												setNote(
													(localizedActivityContent ?? currentPage.content).id,
													v
												)
											}
											onToggleComplete={() =>
												toggleComplete(
													(localizedActivityContent ?? currentPage.content).id
												)
											}
											activityIndex={currentPage.activityIndex}
										/>
									)}

									{currentPage.type === "team" && (
										<TeamReflectionPage
											content={localizedContent}
											notes={state.notes["team"]}
											onNotes={(v) => setNote("team", v)}
										/>
									)}

									{currentPage.type === "reflection" && (
										<TeamReflectionPage
											content={localizedContent}
											notes={state.notes["reflect"]}
											onNotes={(v) => setNote("reflect", v)}
										/>
									)}

									{![
										"cover",
										"contents",
										"intro",
										"preparation",
										"conclusion",
										"resources",
										"activity",
										"team",
										"reflection",
									].includes(currentPage.type) && (
										<SectionPage
											content={localizedContent ?? currentPage.content}
										/>
									)}
								</TransitionView>
							</div>
						</main>
					</div>
				</div>

				<div className="transition-opacity duration-500 ease-out opacity-100">
					<Footer
						pageIndex={state.pageIndex}
						totalPages={totalPages}
						onPrev={prev}
						onNext={next}
						nextLabel={getNextLabel()}
						activitySteps={activitySteps}
						onJumpToPage={(idx) => gotoPage(idx)}
						accent={accentForThisPage}
						nextBtnClassOverride={
							["cover", "contents"].includes(currentPage.type)
								? "px-5 py-2 bg-sky-600 text-white font-medium rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-colors"
								: null
						}
						containerRef={footerRef}
						backLabel={STR.footer.back}
						finishLabel={STR.footer.finish}
					/>
				</div>
			</div>
		</div>
	);
}
