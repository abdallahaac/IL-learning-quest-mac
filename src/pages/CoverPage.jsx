// src/pages/CoverPage.jsx
import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import SplashMarkerIntro from "../components/SplashMarkerIntro.jsx";
import { useScorm } from "../contexts/ScormContext.jsx";
import CspsLogo from "../components/logos/cspslogo.jsx";
import ParcsCanadaLogo from "../components/logos/parcsCanadaLogo.jsx";

export default function CoverPage({ content, onStart, onIntroActiveChange }) {
	const { title = "", paragraphs = [] } = content || {};
	const reduceMotion = useReducedMotion();

	// --- Robust gating: reload OR first mount of Cover per session ---
	const SESSION_KEY = "coverSplashSeen";
	const firstMountRef = useRef(true);

	const wasReload = useMemo(() => {
		try {
			const nav = performance.getEntriesByType("navigation")[0];
			if (nav?.type) return nav.type === "reload";
			// Fallback (deprecated)
			// eslint-disable-next-line deprecation/deprecation
			return performance.navigation?.type === 1; // 1 == reload
		} catch {
			return false;
		}
	}, []);

	const shouldPlaySplash = useMemo(() => {
		if (reduceMotion) return false;
		if (wasReload) return true;
		try {
			const seen = sessionStorage.getItem(SESSION_KEY);
			return firstMountRef.current && !seen;
		} catch {
			return firstMountRef.current;
		}
	}, [reduceMotion, wasReload]);

	const [splashDone, setSplashDone] = useState(!shouldPlaySplash);
	const [splashActive, setSplashActive] = useState(shouldPlaySplash);

	// mark first mount complete
	useEffect(() => {
		firstMountRef.current = false;
	}, []);

	useEffect(() => {
		onIntroActiveChange?.(splashActive);
	}, [splashActive, onIntroActiveChange]);

	// Lock scroll while splash is visible
	useLayoutEffect(() => {
		if (!splashActive) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [splashActive]);

	// TEMP: match splash bg while splash is active, then restore immediately after
	useLayoutEffect(() => {
		if (!shouldPlaySplash || !splashActive) return;
		const prevBodyBg = document.body.style.backgroundColor;
		const prevHtmlBg = document.documentElement.style.backgroundColor;
		try {
			document.body.style.backgroundColor = "#4b3a69";
			document.documentElement.style.backgroundColor = "#4b3a69";
		} catch {}
		// cleanup runs as soon as splashActive flips to false (i.e., splash ends)
		return () => {
			try {
				document.body.style.backgroundColor = prevBodyBg;
				document.documentElement.style.backgroundColor = prevHtmlBg;
			} catch {}
		};
	}, [shouldPlaySplash, splashActive]);

	const handleSplashDone = () => {
		setSplashDone(true);
		setSplashActive(false); // triggers cleanup above to restore background
		try {
			sessionStorage.setItem(SESSION_KEY, "1");
		} catch {}
	};

	return (
		<section className="relative z-0 flex-1">
			{/* Splash intro (reload or first mount in this session) */}
			{shouldPlaySplash && (
				<SplashMarkerIntro
					logos={[
						{ el: CspsLogo, height: 204 },
						{ el: ParcsCanadaLogo, height: 150 },
					]}
					bg="#4b3a69"
					dotColor="rgba(255,255,255,0.28)"
					dotSize={4}
					dotGap={24}
					dotsRevealTotalMs={1000}
					dotAnimMs={100}
					logosDelayAfterDotsMs={500}
					durationMs={3600}
					onDone={handleSplashDone}
				/>
			)}

			{/* Cover content: truly centered within remaining viewport (after header/footer) */}
			{splashDone && (
				<motion.main
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut" }}
					className="relative z-10 w-full will-change-[transform,opacity]"
				>
					<div
						className="grid place-items-center px-4"
						style={{
							// Use modern viewport units. Swap 100svh -> 100dvh if you prefer dynamic.
							minHeight: "calc(100svh - var(--header-h) - var(--footer-h))",
						}}
					>
						<div className="w-full max-w-4xl text-center">
							<CoverBody
								title={title}
								paragraphs={paragraphs}
								onStart={onStart}
								reduced={reduceMotion}
							/>
						</div>
					</div>
				</motion.main>
			)}
		</section>
	);
}

/* --- Body --- */
function CoverBody({ title, paragraphs, onStart, reduced }) {
	const scormCtx = (typeof useScorm === "function" ? useScorm() : null) || {};
	const {
		scorm,
		lmsConnected: ctxConnected,
		learnerName: ctxLearnerName,
	} = scormCtx;

	const [connected, setConnected] = useState(!!ctxConnected);
	const [firstName, setFirstName] = useState(
		() => extractFirstName(ctxLearnerName) || "Learner"
	);

	useEffect(() => {
		setConnected(!!ctxConnected);
		const fromCtx = extractFirstName(ctxLearnerName);
		if (fromCtx) {
			setFirstName(fromCtx);
			return;
		}
		try {
			const raw =
				scorm?.get?.("cmi.core.student_name") ||
				scorm?.get?.("cmi.learner_name") ||
				"";
			const extracted = extractFirstName(raw);
			if (extracted) {
				setFirstName(extracted);
				setConnected(true);
			}
		} catch {}
	}, [ctxConnected, ctxLearnerName, scorm]);

	const DUR = 0.4;
	const baseDelay = reduced ? 0 : 0.12;
	const step = (i, gap = 0.08) => (reduced ? 0 : baseDelay + i * gap);

	const item = {
		hidden: { opacity: 0, y: reduced ? 0 : 8 },
		show: (i) => ({
			opacity: 1,
			y: 0,
			transition: { duration: DUR, ease: "easeOut", delay: step(i) },
		}),
	};

	const underline = {
		hidden: { opacity: 0, scaleX: reduced ? 1 : 0, transformOrigin: "left" },
		show: (i) => ({
			opacity: 1,
			scaleX: 1,
			transition: { duration: 0.3, ease: "easeOut", delay: step(i) },
		}),
	};

	const [line1, line2] = splitTitle(title);
	const idxKicker = 0,
		idxTitle1 = 1,
		idxTitle2 = 2,
		idxUnderline = 3,
		idxFirstPara = 4;
	const idxCTA = idxFirstPara + Math.max(1, paragraphs.length || 1);

	return (
		<div className="max-w-4xl mx-auto">
			<motion.div
				custom={idxKicker}
				variants={item}
				initial="hidden"
				animate="show"
				className="mb-6 text-2xl font-semibold text-sky-600"
				aria-live="polite"
			>
				Welcome {firstName}!
			</motion.div>

			<h1 className="mb-2">
				<motion.span
					custom={idxTitle1}
					variants={item}
					initial="hidden"
					animate="show"
					className="block text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight"
				>
					{line1}
				</motion.span>

				{line2 && (
					<motion.span
						custom={idxTitle2}
						variants={item}
						initial="hidden"
						animate="show"
						className="block text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight"
					>
						{line2}
					</motion.span>
				)}
			</h1>

			<motion.div
				custom={idxUnderline}
				variants={underline}
				initial="hidden"
				animate="show"
				className="mx-auto h-0.5 w-24 bg-gray-900/80 rounded-full"
			/>

			<div className="mt-6 space-y-4 max-w-3xl mx-auto">
				{(paragraphs.length ? paragraphs : [""]).map((p, i) => (
					<motion.p
						key={i}
						custom={idxFirstPara + i}
						variants={item}
						initial="hidden"
						animate="show"
						className="text-base sm:text-lg text-gray-700 leading-relaxed"
					>
						{p}
					</motion.p>
				))}
			</div>

			<motion.div
				custom={idxCTA}
				variants={item}
				initial="hidden"
				animate="show"
				className="mt-10"
			>
				<button
					onClick={onStart}
					className="px-8 py-3 bg-sky-600 text-white font-medium rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-colors"
				>
					Get Started
				</button>
			</motion.div>
		</div>
	);
}

/* --- Helpers --- */
function splitTitle(t) {
	if (!t) return ["", ""];
	const re = /\s+on\s+Indigenous\s+Cultures/i;
	const m = t.match(re);
	if (m && m.index != null) {
		const idx = m.index;
		const before = t.slice(0, idx).trimEnd();
		const after = t.slice(idx).trimStart();
		return [before, after];
	}
	if (t.length < 26) return [t, ""];
	const mid = Math.floor(t.length / 2);
	const left = t.lastIndexOf(" ", mid);
	const right = t.indexOf(" ", mid);
	const idx =
		left === -1
			? right === -1
				? mid
				: right
			: right === -1
			? left
			: Math.abs(mid - left) < Math.abs(right - mid)
			? left
			: right;
	return [t.slice(0, idx), t.slice(idx + 1)];
}

function extractFirstName(raw) {
	if (!raw || typeof raw !== "string") return "";
	if (raw.includes(",")) {
		const parts = raw.split(",");
		return (parts[1] || "").trim() || (parts[0] || "").trim();
	}
	return raw.trim().split(/\s+/)[0] || "";
}
