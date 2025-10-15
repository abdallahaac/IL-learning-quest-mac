// src/AppShell.jsx
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
		// Prefer session persistence for a single browser tab, but also fall back to local in case you want cross-tab persistence.
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
		// Optional: persist across tabs/sessions too
		localStorage.setItem(SPLASH_SEEN_KEY, "1");
	} catch {}
}

function maybeResetSplashFlagFromQuery() {
	try {
		const qs = new URLSearchParams(window.location.search);
		// Handy dev knobs:
		// ?resetSplash=1 clears the flag; ?forceSplash=1 shows it regardless of prior flag (still respects reduced motion unless you also add &force=1 logic yourself).
		if (qs.has("resetSplash")) {
			sessionStorage.removeItem(SPLASH_SEEN_KEY);
			localStorage.removeItem(SPLASH_SEEN_KEY);
		}
	} catch {}
}

export default function AppShell() {
	const scrollRef = React.useRef(null);

	// SCORM
	const { getSuspendData, setSuspendData, scorm } = useScorm();

	// Autoplay unlock
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

	// Pages + routing
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

	// Persisted state
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

	// One-time splash: show only on the very first render (per tab/session), unless disabled or reduced motion.
	// Also support ?forceSplash=1 for manual testing.
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
			// Worst case, show it once.
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

	// Derived indices & progress
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

	const siteTitle = "Learning Quest on Indigenous Cultures";
	const [headerRef] = useResizeObserver();
	const [footerRef, footerSize] = useResizeObserver();
	const footerHeight = footerSize.height || 0;

	const activitySteps = activityPages.map(({ p, idx }, i) => ({
		key: p.content.id,
		label: `Activity ${i + 1}`,
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
		if (atLast) return "Finish";
		const nextPage = pages[i + 1];
		if (currentPage.type === "preparation") return "Start Activities";
		if (nextPage?.type === "activity") {
			const num = (nextPage.activityIndex ?? 0) + 1;
			return `Activity ${num}`;
		}
		return nextPage?.content?.title || "Next";
	};

	// While splash is showing: mount PatternMorph underneath with a NORMAL z-index.
	if (showSplash) {
		return (
			<div className="app-shell relative h-screen flex flex-col bg-white">
				{/* Pattern background (visible because it's not negative z) */}
				<div className="absolute inset-0 z-0 pointer-events-none">
					<PatternMorph
						pageIndex={0}
						sequence={["dots", "asterisks", "grid"]}
					/>
				</div>

				{/* Splash sits ABOVE everything */}
				<div className="relative z-20">
					<SplashPage
						onDone={() => {
							// Mark as seen so we never show it again after first render.
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

	// Normal app chrome after splash
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
			{/* Pattern is part of the stacking context with z-0 */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<PatternMorph
					pageIndex={state.pageIndex}
					sequence={["dots", "asterisks", "grid"]}
				/>
			</div>

			{/* Everything else sits above the pattern */}
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
											content={currentPage.content}
											onStart={() => gotoPage(1)}
											onIntroActiveChange={() => {}}
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
										/>
									)}

									{currentPage.type === "intro" && (
										<IntroPage content={currentPage.content} />
									)}

									{currentPage.type === "preparation" && (
										<PreparationPage
											content={currentPage.content}
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
											content={currentPage.content}
											accent="#D66843"
										/>
									)}

									{currentPage.type === "resources" && (
										<ResourcesPage content={currentPage.content} />
									)}

									{currentPage.type === "activity" && (
										<ActivityPage
											content={currentPage.content}
											notes={state.notes[currentPage.content.id]}
											completed={!!state.completed[currentPage.content.id]}
											onNotes={(v) => setNote(currentPage.content.id, v)}
											onToggleComplete={() =>
												toggleComplete(currentPage.content.id)
											}
											activityIndex={currentPage.activityIndex}
										/>
									)}

									{currentPage.type === "team" && (
										<TeamReflectionPage
											content={currentPage.content}
											notes={state.notes["team"]}
											onNotes={(v) => setNote("team", v)}
										/>
									)}

									{currentPage.type === "reflection" && (
										<TeamReflectionPage
											content={currentPage.content}
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
										<SectionPage content={currentPage.content} />
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
					/>
				</div>
			</div>
		</div>
	);
}
