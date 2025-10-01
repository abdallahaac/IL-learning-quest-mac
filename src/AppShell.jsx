// src/AppShell.jsx
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
import useResizeObserver from "./hooks/useResizeObserver.jsx";

/* ========================================================================
   Accent map to keep Header/Footer/Dock aligned with activities
   ======================================================================== */
const ACTIVITY_ACCENTS = {
	1: "#2563EB",
	2: "#047857",
	3: "#B45309",
	4: "#4338CA",
	5: "#BE123C",
	6: "#0891B2",
	7: "#0D9488",
	8: "#E11D48",
	9: "#934D6C",
	10: "#DB5A42",
};
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};
const accentForActivityIndex = (idx /* 0-based */) =>
	normalizeHex(ACTIVITY_ACCENTS[idx + 1]) || "#67AAF9";

/* ========================================================================
   Persistence helpers (SCORM + localStorage)
   ======================================================================== */
const STATE_VERSION = 3;
const BUILD_ID = "toc-progress-2025-09-19-02";
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

// Keep header height hard-coded to match Header.jsx (prevents wobble)
const HEADER_FIXED_H = 88;

export default function AppShell() {
	const { getSuspendData, setSuspendData, scorm } = useScorm();

	// Build static page list once
	const pages = useMemo(() => buildPages(), []);
	const totalPages = pages.length;

	// Activity helpers
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
	const activityTotal = activityPages.length;

	// Hash-based routing
	const [route, push] = useHashRoute();

	/* --------------------------------------------------------------------
     Hydrate state from SCORM/localStorage (with version/build checks)
     -------------------------------------------------------------------- */
	const [state, setState] = useState(() => {
		const scormSaved = getSuspendData?.();
		const lsSaved = loadFromLS();
		let saved = scormSaved ?? lsSaved ?? null;

		let forceFresh = false;
		try {
			const url = new URL(window.location.href);
			forceFresh = url.searchParams.has("fresh");
		} catch {}

		const usingSaved =
			!!saved &&
			!forceFresh &&
			saved.version === STATE_VERSION &&
			saved.buildId === BUILD_ID;

		if (!usingSaved) saved = null;

		const initialIndex = Math.min(saved?.pageIndex ?? 0, totalPages - 1);

		const visitedFromSave = Array.isArray(saved?.visited)
			? new Set(saved.visited)
			: new Set();
		if (!visitedFromSave.has(initialIndex)) visitedFromSave.add(initialIndex);

		return {
			pageIndex: initialIndex,
			notes: saved?.notes ?? {},
			completed: saved?.completed ?? {},
			finished: saved?.finished ?? false,
			visited: visitedFromSave,
		};
	});

	// Keep state in sync with hash route + mark visited
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

	// Persist to SCORM (if available) and localStorage
	useEffect(() => {
		const payload = {
			pageIndex: state.pageIndex,
			notes: state.notes,
			completed: state.completed,
			finished: state.finished,
			visited: Array.from(state.visited),
			version: STATE_VERSION,
			buildId: BUILD_ID,
		};
		if (setSuspendData) setSuspendData(payload);
		saveToLS(payload);
	}, [state, setSuspendData]);

	// Current page & theme
	const currentPage = pages[state.pageIndex] ?? pages[0];
	const isActivity = currentPage.type === "activity";
	const themeClass =
		currentPage.type === "activity"
			? activityThemes[currentPage.activityIndex]
			: pageThemes[currentPage.type] || "";

	// Jump-to-activity menu
	const jumpToActivity = (i) => {
		const target = activityPageIndices[i];
		if (typeof target === "number") gotoPage(target);
	};

	// Navigation helpers
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

	const setNote = (id, value) => {
		setState((s) => ({ ...s, notes: { ...s.notes, [id]: value } }));
	};

	const toggleComplete = (id) => {
		setState((s) => ({
			...s,
			completed: { ...s.completed, [id]: !s.completed[id] },
		}));
	};

	// Hide chrome during cover intro
	const isCover = currentPage.type === "cover";
	const [coverIntroActive, setCoverIntroActive] = useState(false);
	useEffect(() => {
		if (!isCover) setCoverIntroActive(false);
	}, [isCover]);

	// Footer CTA label
	const getNextLabel = () => {
		const i = state.pageIndex;
		const atLast = i >= totalPages - 1;
		if (atLast) return "Finish";
		const nextPage = pages[i + 1];
		if (currentPage.type === "preparation") return "Begin Activities";
		if (nextPage?.type === "activity") {
			const num = (nextPage.activityIndex ?? 0) + 1;
			return `Activity ${num}`;
		}
		return nextPage?.content?.title || "Next";
	};

	const BG_SEQUENCE = ["dots", "plus", "grid", "plus", "dots"];

	/* --------------------------------------------------------------------
     Sequential progress for the 5 TOC slots (drives the rail fill)
     -------------------------------------------------------------------- */
	const idxByType = (t) => pages.findIndex((p) => p.type === t);
	const idxIntro = idxByType("intro");
	const idxPrep = idxByType("preparation");
	const idxTeam = idxByType("team");
	const idxConclusion = idxByType("conclusion");
	const idxResources = idxByType("resources");

	const visitedHas = (i) => (i >= 0 ? state.visited.has(i) : false);

	// Count how many activity page *indices* have been visited
	const activityVisitedCount = activityPageIndices.reduce(
		(acc, idx) => acc + (state.visited.has(idx) ? 1 : 0),
		0
	);

	// Fraction of activities visited
	const activityFrac =
		activityPages.length > 0 ? activityVisitedCount / activityPages.length : 0;

	// Only contribute activities once the Preparation page has been visited
	const prepPlusActivities = visitedHas(idxPrep) ? activityFrac : 0;

	const slots = [
		visitedHas(idxIntro) ? 1 : 0,
		prepPlusActivities,
		visitedHas(idxTeam) ? 1 : 0,
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
	const curvedProgress = acc / slots.length;

	const siteTitle = "Learning Quest on Indigenous Cultures";

	// We still use the header ref (for focus rings/scroll anchors if needed),
	// but we do NOT rely on its measured height anymore.
	const [headerRef] = useResizeObserver();

	// measure the fixed footer height (kept dynamic)
	const [footerRef, footerSize] = useResizeObserver();
	const footerHeight = footerSize.height || 0;

	// build ActivityDock steps (mark visited/completed, and attach accent)
	const activitySteps = activityPages.map(({ p, idx }, i) => ({
		key: p.content.id,
		label: `Activity ${i + 1}`,
		index: idx,
		completed: state.visited.has(idx),
		visited: state.visited.has(idx),
		accent: accentForActivityIndex(i),
	}));

	/* --------------------------------------------------------------------
     Page-specific overrides (final)
     - Header "Home/TOC" button: sky-600 pill on Cover & Contents
     - Footer "Next" button: same sky-600 color on Cover & Contents (rounded-lg)
     - Intro footer color: #4380D6
     - Preparation footer color: #7443D6
     -------------------------------------------------------------------- */
	const pageType = currentPage.type;

	// Base accent for non-override pages
	let accentForThisPage =
		pageType === "activity"
			? accentForActivityIndex(currentPage.activityIndex || 0)
			: "#67AAF9";

	if (pageType === "intro") {
		accentForThisPage = "#4380D6";
	} else if (pageType === "preparation") {
		accentForThisPage = "#7443D6";
	}

	// Header: exact Tailwind class (uses same base sizing as Header.jsx)
	const tailwindHeaderBtnClass =
		"inline-flex items-center gap-2 h-11 md:h-12 px-4 md:px-5 bg-sky-600 text-sm md:text-base font-medium text-white rounded-full shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-colors";
	const headerPrimaryBtnClassOverride =
		pageType === "cover" || pageType === "contents"
			? tailwindHeaderBtnClass
			: null;

	// Footer: same Tailwind color but rounded-lg, consistent with Back button
	const tailwindFooterNextBtnClass =
		"px-5 py-2 bg-sky-600 text-white font-medium rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-colors";
	const footerNextBtnClassOverride =
		pageType === "cover" || pageType === "contents"
			? tailwindFooterNextBtnClass
			: null;

	// Footer label (again here for render scope)
	const getNextLabelRender = () => getNextLabel();

	// ---- LAYOUT with sticky header ----
	return (
		<div
			className={` app-shell relative h-screen flex flex-col ${themeClass}`}
			style={{
				"--header-h": `${HEADER_FIXED_H}px`, // fixed header height
				"--footer-h": `${footerHeight}px`,
			}}
		>
			<PatternMorph pageIndex={state.pageIndex} sequence={BG_SEQUENCE} />

			{/* Fixed header with dock */}
			<Header
				containerRef={headerRef}
				siteTitle={siteTitle}
				onHome={() => gotoPage(0)}
				onContents={() => gotoPage(1)}
				activitySteps={activitySteps}
				currentPageIndex={state.pageIndex}
				onJumpToPage={(idx) => gotoPage(idx)}
				accent={accentForThisPage}
				primaryBtnClassOverride={headerPrimaryBtnClassOverride}
			/>

			{/* Scroll container (add top padding equal to header height) */}
			<div className="flex-1 relative min-h-0">
				<div
					className="flex h-full flex-col overflow-y-auto min-h-0"
					style={{
						paddingTop: "var(--header-h)",
						scrollbarGutter: "stable",
					}}
				>
					<main className="flex-1 relative min-h-0">
						<div style={{ zIndex: 10 }}>
							<TransitionView screenKey={`page-${state.pageIndex}`}>
								{(() => {
									switch (currentPage.type) {
										case "cover":
											return (
												<CoverPage
													content={currentPage.content}
													onStart={() => gotoPage(1)}
													onIntroActiveChange={setCoverIntroActive}
												/>
											);
										case "contents":
											return (
												<ContentsPage
													activityCount={activityTotal}
													onNavigate={gotoPage}
													progress={curvedProgress}
													prefillStart={0.06}
													// ICON offsets (favicon positions)
													nodeXOffsetOverrides={[-70, -70, -70, -80, -180]}
													nodeYOffsetOverrides={[-100, 80, -105, 95, -130]}
													// CARD offsets (card positions)
													cardPosOverrides={[
														{ x: -30, y: -190 },
														{ x: -10, y: -0 },
														{ x: -0, y: -190 },
														{ x: 0, y: 10 },
														{ x: -80, y: -210 },
													]}
												/>
											);
										case "intro":
											return <IntroPage content={currentPage.content} />;
										case "preparation":
											return (
												<PreparationPage
													content={currentPage.content}
													onStartActivities={() => gotoPage(4)}
												/>
											);
										case "conclusion":
											return (
												<SectionPage
													type="conclusion"
													content={currentPage.content}
												/>
											);
										case "resources":
											return <ResourcesPage content={currentPage.content} />;
										case "activity":
											return (
												<ActivityPage
													content={currentPage.content}
													notes={state.notes[currentPage.content.id]}
													completed={!!state.completed[currentPage.content.id]}
													onNotes={(v) =>
														setState((s) => ({
															...s,
															notes: {
																...s.notes,
																[currentPage.content.id]: v,
															},
														}))
													}
													onToggleComplete={() =>
														setState((s) => ({
															...s,
															completed: {
																...s.completed,
																[currentPage.content.id]:
																	!s.completed[currentPage.content.id],
															},
														}))
													}
													activityIndex={currentPage.activityIndex}
												/>
											);
										case "team":
											return (
												<TeamReflectionPage
													content={currentPage.content}
													notes={state.notes["reflect"]}
													onNotes={(v) =>
														setState((s) => ({
															...s,
															notes: { ...s.notes, reflect: v },
														}))
													}
												/>
											);
										default:
											return <SectionPage content={currentPage.content} />;
									}
								})()}
							</TransitionView>
						</div>

						{/* keep footer off content */}
						<div aria-hidden className="h-24 sm:h-20" />
					</main>
				</div>
			</div>

			{/* Fixed footer */}
			<div
				aria-hidden={currentPage.type === "cover" && coverIntroActive}
				className={
					currentPage.type === "cover" && coverIntroActive
						? "transition-opacity duration-500 ease-out will-change-[opacity] opacity-0 pointer-events-none"
						: "transition-opacity duration-500 ease-out opacity-100"
				}
			>
				<Footer
					pageIndex={state.pageIndex}
					totalPages={totalPages}
					onPrev={prev}
					onNext={next}
					nextLabel={getNextLabelRender()}
					activitySteps={activitySteps}
					onJumpToPage={(idx) => gotoPage(idx)}
					accent={accentForThisPage}
					nextBtnClassOverride={footerNextBtnClassOverride}
					containerRef={footerRef}
				/>
			</div>
		</div>
	);
}
