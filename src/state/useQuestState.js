import { useEffect, useMemo, useRef, useState } from "react";
import { STATE_VERSION, BUILD_ID, LS_KEY } from "../constants/storage.js";

/**
 * Encapsulates: hydration, persistence (LS + SCORM), routing sync, visited set,
 * and note/complete mutations. Keeps AppShell slim.
 */
export function useQuestState({ scorm, routePageIndex, totalPages }) {
	const [state, setState] = useState(() => {
		const scormSaved =
			typeof scorm?.getSuspendData === "function"
				? scorm.getSuspendData()
				: undefined;
		let saved = scormSaved ?? loadFromLS() ?? null;

		let forceFresh = false;
		try {
			const url = new URL(window.location.href);
			forceFresh = url.searchParams.has("fresh");
		} catch {}

		const usingSaved =
			!!saved &&
			!forceFresh &&
			saved?.version === STATE_VERSION &&
			saved?.buildId === BUILD_ID;
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

	// Sync with route changes
	useEffect(() => {
		const idx = Math.min(Math.max(routePageIndex, 0), totalPages - 1);
		setState((s) => {
			if (idx === s.pageIndex && s.visited.has(idx)) return s;
			const nextVisited = new Set(s.visited);
			nextVisited.add(idx);
			return { ...s, pageIndex: idx, visited: nextVisited };
		});
	}, [routePageIndex, totalPages]);

	// Persist (skip first)
	const firstPersistSkipRef = useRef(true);
	useEffect(() => {
		if (firstPersistSkipRef.current) {
			firstPersistSkipRef.current = false;
			return;
		}
		const payload = {
			pageIndex: state.pageIndex,
			notes: state.notes,
			completed: state.completed,
			finished: state.finished,
			visited: Array.from(state.visited),
			version: STATE_VERSION,
			buildId: BUILD_ID,
		};
		scorm?.setSuspendData?.(payload);
		saveToLS(payload);
	}, [state, scorm]);

	// API
	const setNote = (id, value) =>
		setState((s) => ({ ...s, notes: { ...s.notes, [id]: value } }));
	const toggleComplete = (id) =>
		setState((s) => ({
			...s,
			completed: { ...s.completed, [id]: !s.completed[id] },
		}));

	return { state, setState, setNote, toggleComplete };
}

/* helpers */
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
