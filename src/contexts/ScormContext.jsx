// src/contexts/ScormContext.jsx
import React, {
	useState,
	useEffect,
	useMemo,
	useRef,
	useCallback,
	createContext,
	useContext,
} from "react";

const ScormContext = createContext(null);
export const useScorm = () => useContext(ScormContext);

// Safe JSON helpers
const parseSafe = (s, fb) => {
	try {
		return JSON.parse(String(s ?? ""));
	} catch {
		return fb;
	}
};
const strSafe = (v, fb = "{}") => {
	try {
		return JSON.stringify(v);
	} catch {
		return fb;
	}
};

export function ScormProvider({ children }) {
	// Grab pipwerks SCORM from the global wrapper script
	const scorm = useMemo(() => {
		if (typeof window === "undefined") return null;
		return window.pipwerks?.SCORM ?? null;
	}, []);

	const [lmsConnected, setLmsConnected] = useState(false);
	const [learnerName, setLearnerName] = useState("Learner");
	const initedRef = useRef(false);

	// Debounced saver to avoid LMS thrashing
	const saveTimerRef = useRef(null);
	const debouncedSave = useCallback(() => {
		if (!scorm?.save) return;
		if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
		saveTimerRef.current = setTimeout(() => {
			try {
				scorm.save();
			} catch {
				// ignore
			}
		}, 900);
	}, [scorm]);

	useEffect(() => {
		if (!scorm || initedRef.current) return;
		initedRef.current = true;

		// Ensure wrapper knows SCORM version (1.2 vs 2004)
		try {
			if (!scorm.version && scorm.API?.isFound) {
				scorm.API.isFound(); // sets scorm.version
				console.log("[SCORM] Detected version:", scorm.version);
			}
		} catch (e) {
			console.warn("[SCORM] Failed to detect SCORM version", e);
		}

		let ok = false;
		try {
			ok = !!scorm.init();
			console.log("[SCORM] init() returned:", ok);
		} catch (e) {
			console.error("[SCORM] init() threw", e);
			ok = false;
		}
		setLmsConnected(ok);

		if (ok) {
			// Learner name
			try {
				const key =
					scorm.version === "1.2"
						? "cmi.core.student_name"
						: "cmi.learner_name";
				const nm = scorm.get?.(key);
				if (nm) setLearnerName(String(nm));
			} catch (e) {
				console.warn("[SCORM] Failed to read learner name", e);
			}

			// Set incomplete at launch if not complete
			try {
				if (scorm.version === "1.2") {
					const st = scorm.get?.("cmi.core.lesson_status");
					if (st !== "completed" && st !== "passed") {
						scorm.set?.("cmi.core.lesson_status", "incomplete");
						scorm.save?.();
					}
				} else {
					const st = scorm.get?.("cmi.completion_status");
					if (st !== "completed") {
						scorm.set?.("cmi.completion_status", "incomplete");
						scorm.save?.();
					}
				}
			} catch (e) {
				console.warn("[SCORM] Failed to set initial status", e);
			}
		} else {
			console.warn("[SCORM] init() failed or API not found. Offline mode.");
		}

		const onUnload = () => {
			try {
				scorm?.quit?.();
			} catch {
				// ignore
			}
		};
		window.addEventListener("beforeunload", onUnload);
		return () => {
			window.removeEventListener("beforeunload", onUnload);
			onUnload();
		};
	}, [scorm]);

	const getSuspendData = useCallback(() => {
		try {
			if (!lmsConnected || !scorm) {
				return parseSafe(localStorage.getItem("suspend_data") || "{}", {});
			}
			return parseSafe(scorm.get?.("cmi.suspend_data") || "{}", {});
		} catch {
			return {};
		}
	}, [lmsConnected, scorm]);

	const setSuspendData = useCallback(
		(patch) => {
			try {
				const cur = getSuspendData() || {};
				const next = { ...cur, ...(patch || {}) };
				const txt = strSafe(next);

				if (!lmsConnected || !scorm) {
					localStorage.setItem("suspend_data", txt);
					return true;
				}
				scorm.set?.("cmi.suspend_data", txt);
				debouncedSave();
				return true;
			} catch {
				return false;
			}
		},
		[getSuspendData, lmsConnected, scorm, debouncedSave]
	);

	const value = useMemo(
		() => ({
			scorm,
			lmsConnected,
			learnerName,
			getSuspendData,
			setSuspendData,
		}),
		[scorm, lmsConnected, learnerName, getSuspendData, setSuspendData]
	);

	return (
		<ScormContext.Provider value={value}>{children}</ScormContext.Provider>
	);
}
