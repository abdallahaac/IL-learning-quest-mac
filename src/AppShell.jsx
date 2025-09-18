// src/AppShell.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useScorm } from "./contexts/ScormContext.jsx";
import useHashRoute from "./hooks/useHashRoute.js";
import { buildPages } from "./utils/pages.js";
import { pageThemes, activityThemes } from "./constants/themes.js";
import useEdgeOffsets from "./hooks/useEdgeOffsets.js";
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

// ⬇ One persistent morphing background (dots → plus → grid → …)
import PatternMorph from "./components/PatternMorph.jsx";

export default function AppShell() {
	const { getSuspendData, setSuspendData, scorm } = useScorm();

	// Build static page list once
	const pages = useMemo(() => buildPages(), []);
	const totalPages = pages.length;
	const activityTotal = useMemo(
		() => pages.filter((p) => p.type === "activity").length,
		[pages]
	);

	// Hash-based routing
	const [route, push] = useHashRoute();

	// Persisted state (SCORM suspend data)
	const [state, setState] = useState(() => {
		const saved = getSuspendData();
		return {
			pageIndex: Math.min(saved?.pageIndex ?? 0, totalPages - 1),
			notes: saved?.notes ?? {},
			completed: saved?.completed ?? {},
			finished: saved?.finished ?? false,
		};
	});

	// Keep state in sync with hash route
	useEffect(() => {
		if (route.pageIndex !== state.pageIndex) {
			setState((s) => ({
				...s,
				pageIndex: Math.min(Math.max(route.pageIndex, 0), totalPages - 1),
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [route.pageIndex, totalPages]);

	// Save suspend data on change
	useEffect(() => {
		setSuspendData({
			pageIndex: state.pageIndex,
			notes: state.notes,
			completed: state.completed,
			finished: state.finished,
		});
	}, [state, setSuspendData]);
	// inside AppShell, after you have currentPage, pages, state, etc.

	// Helper to derive the CTA label shown in the footer
	const getNextLabel = () => {
		const i = state.pageIndex;
		const atLast = i >= totalPages - 1;
		if (atLast) return "Finish";

		const next = pages[i + 1];

		// Special case: preparation → Begin Activities
		if (currentPage.type === "preparation") {
			return "Begin Activities";
		}

		// Activity pages → "Activity N"
		if (next?.type === "activity") {
			const num = (next.activityIndex ?? 0) + 1;
			return `Activity ${num}`;
		}

		// Otherwise → use the page's title
		return next?.content?.title || "Next";
	};

	// Current page & theme
	const currentPage = pages[state.pageIndex] ?? pages[0];
	const isActivity = currentPage.type === "activity";

	// Keep only base colors in themes; pattern comes from PatternMorph
	const themeClass =
		currentPage.type === "activity"
			? activityThemes[currentPage.activityIndex]
			: pageThemes[currentPage.type] || "";

	// Navigation
	const gotoPage = (idx) => {
		setState((s) => ({ ...s, pageIndex: idx }));
		push(idx);
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
				return { ...s, pageIndex: 0, finished: true };
			}
			const nextIndex = s.pageIndex + 1;
			push(nextIndex);
			return { ...s, pageIndex: nextIndex };
		});
	};

	const prev = () => {
		setState((s) => {
			const prevIndex = Math.max(0, s.pageIndex - 1);
			push(prevIndex);
			return { ...s, pageIndex: prevIndex };
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

	// Detect cover to hide chrome during cover intro (CoverPage calls onIntroActiveChange)
	const isCover = currentPage.type === "cover";
	const [coverIntroActive, setCoverIntroActive] = useState(false);
	useEffect(() => {
		if (!isCover) setCoverIntroActive(false);
	}, [isCover]);

	// Page content switch
	let pageContent = null;
	switch (currentPage.type) {
		case "cover":
			pageContent = (
				<CoverPage
					content={currentPage.content}
					onStart={() => gotoPage(1)}
					onIntroActiveChange={setCoverIntroActive}
				/>
			);
			break;
		case "contents":
			pageContent = (
				<ContentsPage activityCount={activityTotal} onNavigate={gotoPage} />
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

	const siteTitle = "Learning Quest";
	const pageTitle =
		currentPage.type === "cover" ? "" : currentPage.content.title;

	// Chrome fade classes (header/footer) while cover intro plays
	const chromeHiddenClasses =
		"transition-opacity duration-500 ease-out will-change-[opacity] opacity-0 pointer-events-none";
	const chromeShownClasses =
		"transition-opacity duration-500 ease-out opacity-100";

	// Morph order: starts as dots on page 0, then plus → grid → plus → dots → …
	const BG_SEQUENCE = ["dots", "plus", "grid", "plus", "dots"];
	const { header, footer } = useEdgeOffsets(12); // 12px safety buffer

	return (
		<div className={`relative min-h-screen flex flex-col ${themeClass}`}>
			{/* Background stays */}
			<PatternMorph pageIndex={state.pageIndex} sequence={BG_SEQUENCE} />

			{/* Header (STICKY) */}
			<div
				aria-hidden={isCover && coverIntroActive}
				className={
					isCover && coverIntroActive ? chromeHiddenClasses : chromeShownClasses
				}
			>
				<Header
					siteTitle={siteTitle}
					pageTitle={pageTitle}
					isActivity={isActivity}
					activityIndex={currentPage.activityIndex}
					totalActivities={activityTotal}
					onHome={() => gotoPage(0)}
					onContents={() => gotoPage(1)}
				/>
			</div>

			{/* MAIN — absolutely no top padding/margin here */}
			<main className="flex-1 overflow-y-auto relative">
				{/* No top margin/padding here either */}
				<div style={{ zIndex: 10 }}>
					<TransitionView screenKey={`page-${state.pageIndex}`}>
						{pageContent}
					</TransitionView>
				</div>

				{/* Spacer so fixed footer never overlaps content (doesn't move overlays) */}
				<div aria-hidden className="h-24 sm:h-20" />
			</main>

			{/* Footer (FIXED) */}
			<div
				aria-hidden={isCover && coverIntroActive}
				className={
					isCover && coverIntroActive ? chromeHiddenClasses : chromeShownClasses
				}
			>
				<Footer
					pageIndex={state.pageIndex}
					totalPages={totalPages}
					onPrev={prev}
					onNext={next}
					finished={state.finished}
					showPrev={state.pageIndex > 0}
					showNext={state.pageIndex > 0 && state.pageIndex < totalPages - 1}
					nextLabel={getNextLabel()}
				/>
			</div>
		</div>
	);
}
