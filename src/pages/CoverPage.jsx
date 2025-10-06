// src/pages/CoverPage.jsx
import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import IntroOverlay from "../components/Intro/IntroOverlay";
// import HighlightBleed from "../components/HighlightBleed.jsx"; // optional

// ✅ Correct path to your SCORM context (matches AppShell.jsx usage)
import { useScorm } from "../contexts/ScormContext.jsx";

export default function CoverPage({ content, onStart, onIntroActiveChange }) {
	const { title = "", paragraphs = [] } = content || {};
	const reduceMotion = useReducedMotion();

	const INTRO_OPTS = {
		lines: ["Learning Quest ", " on Indigenous Cultures "],
		width: 1100,
		height: 360,
		fontSizeTop: 80,
		fontSizeBottom: 88,
		gap: 52,
		writeTop: 1.0,
		writeBottom: 1.1,
		highlight: 0.7,
		holdSeconds: 0.25,
		fadeSeconds: 0.55,
		textFill: "#0f172a",
		highlight1: "#00000001",
		highlight2: "#0b74f5ff",
	};

	const shouldPlayIntro = useMemo(() => {
		if (reduceMotion) return false;
		try {
			return !sessionStorage.getItem("introSeen");
		} catch {
			return true;
		}
	}, [reduceMotion]);

	const [introDone, setIntroDone] = useState(!shouldPlayIntro);
	const [introActive, setIntroActive] = useState(shouldPlayIntro);

	// trigger ink sweep after content shows (one-shot)
	const [heroHighlightTrigger, setHeroHighlightTrigger] = useState(null);
	const hasHighlighted = useRef(false);

	useEffect(() => {
		onIntroActiveChange?.(introActive);
	}, [introActive, onIntroActiveChange]);

	useLayoutEffect(() => {
		if (!introActive) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [introActive]);

	useEffect(() => {
		if (!shouldPlayIntro) return;
		const total =
			INTRO_OPTS.writeTop +
			INTRO_OPTS.writeBottom +
			INTRO_OPTS.highlight +
			INTRO_OPTS.holdSeconds +
			INTRO_OPTS.fadeSeconds +
			0.25;
		const kill = setTimeout(() => {
			setIntroDone(true);
			setIntroActive(false);
			try {
				sessionStorage.setItem("introSeen", "1");
			} catch {}
		}, total * 1000);
		return () => clearTimeout(kill);
	}, [shouldPlayIntro]);

	const handleExitComplete = () => {
		setIntroActive(false);
		try {
			sessionStorage.setItem("introSeen", "1");
		} catch {}
	};

	// ink highlight trigger after page visible
	useEffect(() => {
		if (!introDone || hasHighlighted.current) return;
		const t = setTimeout(() => {
			hasHighlighted.current = true;
			setHeroHighlightTrigger(Date.now());
		}, 2000);
		return () => clearTimeout(t);
	}, [introDone]);

	return (
		<div className="relative z-0 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
			{shouldPlayIntro && (
				<IntroOverlay
					onGate={() => setIntroDone(true)}
					onExitComplete={handleExitComplete}
					options={INTRO_OPTS}
				/>
			)}

			{introDone && (
				<motion.main
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut" }}
					className="relative z-10 w-full will-change-[transform,opacity]"
				>
					<CoverBody
						title={title}
						paragraphs={paragraphs}
						onStart={onStart}
						reduced={reduceMotion}
						heroHighlightTrigger={heroHighlightTrigger}
					/>
				</motion.main>
			)}
		</div>
	);
}

/* --- Body --- */
function CoverBody({
	title,
	paragraphs,
	onStart,
	reduced,
	heroHighlightTrigger, // reserved if you animate highlights later
}) {
	// Context may expose different shapes; be defensive
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

	// Try to read name directly from SCORM if context didn't provide it
	useEffect(() => {
		setConnected(!!ctxConnected);
		const fromCtx = extractFirstName(ctxLearnerName);
		if (fromCtx) {
			setFirstName(fromCtx);
			return;
		}

		// Attempt SCORM get() safely
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
		} catch {
			// ignore — fallback stays "Learner"
		}
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
			{/* 👋 Personalized Welcome — now always blue like the CTA */}
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

			{/* ✅ Both paragraphs use the same font & size */}
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

	// Prefer splitting before "on Indigenous Cultures"
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
	// SCORM often returns "Last, First"
	if (raw.includes(",")) {
		const parts = raw.split(",");
		return (parts[1] || "").trim() || (parts[0] || "").trim();
	}
	// Otherwise take first token
	return raw.trim().split(/\s+/)[0] || "";
}
