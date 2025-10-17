// src/pages/PreparationPage.jsx
import React, { useEffect, useId, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import {
	INTRO_INFO_CONTENT,
	INTRO_INFO_CONTENT_FR,
} from "../constants/content.js";

/** tiny lang helper (same behavior as elsewhere) */
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

/** sr-only helper */
function SrOnly({ children }) {
	return (
		<span className="absolute overflow-hidden w-px h-px p-0 m-[-1px] border-0 whitespace-nowrap clip-[rect(0,0,0,0)]">
			{children}
		</span>
	);
}

/** FlipCard with scroll-safe, WCAG-friendly interaction (no custom scrollbar) */
function FlipCard({
	step,
	backText,
	isVisited = false,
	onVisited,
	ACCENT,
	STR,
}) {
	const [flipped, setFlipped] = useState(false);
	const [reduceMotion, setReduceMotion] = useState(false);
	const [srStatus, setSrStatus] = useState(""); // aria-live updates
	const uid = useId();
	const frontId = `${uid}-front`;
	const backId = `${uid}-back`;
	const scrollId = `${uid}-scroll`;
	const liveId = `${uid}-live`;
	const DRAG_TOLERANCE = 6;

	const startPos = useRef({ x: 0, y: 0 });
	const moved = useRef(false);
	const scrollRef = useRef(null);
	const btnRef = useRef(null);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onChange = () => setReduceMotion(!!mq.matches);
		onChange();
		mq.addEventListener?.("change", onChange);
		return () => mq.removeEventListener?.("change", onChange);
	}, []);

	// Mark visited when flipped first time + announce state for SR
	useEffect(() => {
		if (flipped && !isVisited) onVisited?.();
		setSrStatus(
			flipped
				? STR.sr?.cardOpen || "Card opened. Content is now visible."
				: STR.sr?.cardClosed || "Card closed. Front is now visible."
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flipped]);

	// When flipped, move focus into the scroll area for keyboard scrolling
	useEffect(() => {
		if (flipped && scrollRef.current) {
			const active = document.activeElement;
			if (!scrollRef.current.contains(active)) {
				scrollRef.current.focus({ preventScroll: true });
			}
		}
	}, [flipped]);

	const baseClasses = [
		"group relative w-full",
		"h-82 sm:h-80 lg:h-96",
		"rounded-xl shadow-sm border transition-transform duration-500 will-change-transform",
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
		"focus-visible:ring-offset-white focus-visible:ring-violet-600",
		flipped && !reduceMotion ? "[transform:rotateY(180deg)]" : "",
		"p-0",
	].join(" ");

	const cardBorder = isVisited ? "border-slate-300" : "border-gray-200";
	const cardBg = isVisited ? "bg-slate-50/95" : "bg-white/95";

	const isFromScrollArea = (target) =>
		target?.closest?.('[data-scroll-area="true"]');

	const tryFlip = (e) => {
		if (isFromScrollArea(e.target)) return;
		if (moved.current) return;
		setFlipped((v) => !v);
	};

	const handlePointerDown = (e) => {
		if (isFromScrollArea(e.target)) return;
		const pt = "touches" in e ? e.touches?.[0] : e;
		startPos.current = { x: pt?.clientX ?? 0, y: pt?.clientY ?? 0 };
		moved.current = false;
	};

	const handlePointerMove = (e) => {
		if (!startPos.current) return;
		const pt = "touches" in e ? e.touches?.[0] : e;
		const dx = Math.abs((pt?.clientX ?? 0) - startPos.current.x);
		const dy = Math.abs((pt?.clientY ?? 0) - startPos.current.y);
		if (dx > DRAG_TOLERANCE || dy > DRAG_TOLERANCE) moved.current = true;
	};

	const handlePointerUp = () => {
		setTimeout(() => {
			moved.current = false;
			startPos.current = { x: 0, y: 0 };
		}, 0);
	};

	// Wheel: route to inner scroller when it can actually scroll; otherwise allow page to move.
	const routeWheelToInner = (e) => {
		const el = scrollRef.current;
		if (!el) return;
		const delta = e.deltaY;
		const atTop = el.scrollTop <= 0;
		const atBottom =
			Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

		const scrollingUp = delta < 0;
		const scrollingDown = delta > 0;

		const canScrollUp = !atTop && scrollingUp;
		const canScrollDown = !atBottom && scrollingDown;

		if (canScrollUp || canScrollDown) {
			e.preventDefault();
			el.scrollTop += delta;
		}
		// If we’re at a boundary and the user keeps pushing past it, let the page scroll. No traps.
	};

	// Keyboard on the button: flip only when the button itself has focus
	const handleButtonKeyDown = (e) => {
		if (e.currentTarget !== e.target) return;
		if (["Enter", " "].includes(e.key)) {
			e.preventDefault();
			setFlipped((v) => !v);
		}
		if (e.key.toLowerCase() === "f") {
			e.preventDefault();
			setFlipped((v) => !v);
		}
	};

	// Keyboard inside the scroll area: Space/PageUp/PageDown do expected scroll
	const handleScrollAreaKeyDown = (e) => {
		const el = scrollRef.current;
		if (!el) return;
		const page = Math.max(24, Math.floor(el.clientHeight * 0.9));
		switch (e.key) {
			case " ":
			case "PageDown":
				e.preventDefault();
				el.scrollTop = Math.min(el.scrollTop + page, el.scrollHeight);
				break;
			case "PageUp":
				e.preventDefault();
				el.scrollTop = Math.max(el.scrollTop - page, 0);
				break;
			default:
				// ArrowUp/Down, Home/End work natively
				break;
		}
	};

	// Touch: allow inner scroll, block body only when inner can scroll in that direction
	const swallowTouchMove = (e) => {
		const el = scrollRef.current;
		if (!el) return;

		const touch = e.touches?.[0];
		if (!touch) return;

		const prev = el.__lastTouchY ?? touch.clientY;
		const dy = prev - touch.clientY; // positive = scroll down
		el.__lastTouchY = touch.clientY;

		const atTop = el.scrollTop <= 0;
		const atBottom =
			Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

		const scrollingUp = dy < 0;
		const scrollingDown = dy > 0;

		const canScrollUp = !atTop && scrollingUp;
		const canScrollDown = !atBottom && scrollingDown;

		if (canScrollUp || canScrollDown) {
			if (e.cancelable) e.preventDefault();
			el.scrollTop += dy;
		}
		// else, let it bubble to the page so users aren’t trapped.
	};
	const clearLastTouch = () => {
		if (scrollRef.current) delete scrollRef.current.__lastTouchY;
	};

	return (
		<li className="relative">
			{/* Non-flipping badge */}
			{isVisited && (
				<span
					className="absolute -top-3 -right-3 z-10 w-12 h-12 rounded-full grid place-items-center text-white"
					style={{
						backgroundColor: "#10B981",
						boxShadow: "0 2px 6px rgba(16,185,129,0.45)",
					}}
					aria-hidden="true"
				>
					{/* checkmark doubled in visible size */}
					<FontAwesomeIcon icon={faCircleCheck} className="text-[24px]" />
				</span>
			)}

			<div className="relative isolate [perspective:1000px]">
				<button
					ref={btnRef}
					type="button"
					className={`${baseClasses} ${cardBorder} ${cardBg}`}
					aria-pressed={flipped}
					aria-expanded={flipped}
					aria-controls={backId}
					aria-describedby={flipped ? backId : frontId}
					onClick={tryFlip}
					onKeyDown={handleButtonKeyDown}
					onMouseDown={handlePointerDown}
					onMouseMove={handlePointerMove}
					onMouseUp={handlePointerUp}
					onTouchStart={handlePointerDown}
					onTouchMove={handlePointerMove}
					onTouchEnd={handlePointerUp}
					onWheel={routeWheelToInner}
					style={{
						transformStyle: "preserve-3d",
						boxShadow: "0 1px 0 rgba(255,255,255,.6) inset",
					}}
				>
					{/* FRONT */}
					<div
						id={frontId}
						aria-hidden={flipped}
						className="absolute inset-0 grid place-items-center backface-hidden px-4 rounded-2xl"
						style={{
							backfaceVisibility: "hidden",
							backgroundColor: ACCENT, // purple front background
							color: "#FFFFFF", // white text
						}}
					>
						<h4 className="text-2xl sm:text-3xl font-bold tracking-tight select-none">
							{STR.stepLabel} {step}
						</h4>
						<SrOnly>{STR.sr.flip}</SrOnly>
					</div>

					{/* BACK (unchanged visually) */}
					<div
						id={backId}
						aria-hidden={!flipped}
						className={[
							"absolute inset-0 backface-hidden",
							!reduceMotion ? "[transform:rotateY(180deg)]" : "",
							"grid place-items-center px-5 py-6 rounded",
						].join(" ")}
						style={{ backfaceVisibility: "hidden" }}
						role="group"
						aria-label={`${STR.stepLabel} ${step} ${STR.howTitle}`}
						onTouchMove={swallowTouchMove}
						onTouchEnd={clearLastTouch}
						onTouchCancel={clearLastTouch}
					>
						{/* Focusable scroll area */}
						<div
							id={scrollId}
							ref={scrollRef}
							className="max-h-full w-full overflow-auto outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-lg"
							data-scroll-area="true"
							tabIndex={0}
							role="region"
							aria-roledescription="Scrollable card content"
							aria-label={STR.sr.readMore || "Scrollable description"}
							onKeyDown={handleScrollAreaKeyDown}
							onClick={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
							onTouchStart={(e) => e.stopPropagation()}
						>
							{/* RENDER HTML FROM JSON */}
							<div
								className="leading-relaxed text-gray-900 text-center text-[15px]"
								dangerouslySetInnerHTML={{ __html: backText }}
							/>
						</div>
						<p className="sr-only">{STR.sr.flipBack}</p>
					</div>

					{/* Sizer for consistent dimensions — hidden from AT to avoid duplicate reading */}
					<div className="opacity-0 h-full w-full px-5 py-6" aria-hidden="true">
						<h4 className="text-2xl font-bold">
							{STR.stepLabel} {step}
						</h4>
						{/* use innerHTML here too — aria-hidden prevents SR duplication */}
						<div
							className="mt-2 text-sm"
							dangerouslySetInnerHTML={{ __html: backText }}
						/>
					</div>
				</button>

				{/* Live region to announce open/close state */}
				<div id={liveId} aria-live="polite" className="sr-only">
					{srStatus}
				</div>
			</div>
		</li>
	);
}

export default function PreparationPage({ content, onStartActivities }) {
	const ACCENT = "#7443d6";

	const STR = content?.ui ?? {
		sectionTitle: content?.title ?? "Preparation",
		howTitle: "How does the Learning Quest work?",
		instructions:
			"Click a card to flip it and read the step. A green check will appear after you’ve viewed a card.",
		stepLabel: "Step",
		sr: {
			flip: "Press Enter or Space to flip and read the description.",
			flipBack: "Press Enter, Space, or F to flip back.",
			readMore:
				"Scrollable card content. Use arrow keys or Page Up/Down to read.",
			cardOpen: "Card opened. Use Page Down or arrow keys to scroll.",
			cardClosed: "Card closed.",
		},
	};

	const title = content?.title ?? STR.sectionTitle ?? "Preparation";
	const p0 = content?.paragraphs?.[0] ?? "";
	const p1 = content?.paragraphs?.[1] ?? "";

	const lang = detectLang() === "fr" ? "fr" : "en";
	const intro = lang === "fr" ? INTRO_INFO_CONTENT_FR : INTRO_INFO_CONTENT;
	const items = intro?.bullets?.[0]?.items ?? [];
	const prefersReduced = useReducedMotion();

	const LS_KEY = "prep_flip_visited_v1";
	const [visited, setVisited] = useState(() => {
		try {
			const raw = localStorage.getItem(LS_KEY);
			const parsed = raw ? JSON.parse(raw) : [];
			return Array.from({ length: items.length }, (_, i) => !!parsed[i]);
		} catch {
			return Array.from({ length: items.length }, () => false);
		}
	});

	useEffect(() => {
		setVisited((prev) => {
			const next = Array.from({ length: items.length }, (_, i) => !!prev[i]);
			try {
				localStorage.setItem(LS_KEY, JSON.stringify(next));
			} catch {}
			return next;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items.length]);

	const markVisited = (i) => {
		setVisited((prev) => {
			if (prev[i]) return prev;
			const next = [...prev];
			next[i] = true;
			try {
				localStorage.setItem(LS_KEY, JSON.stringify(next));
			} catch {}
			return next;
		});
	};

	const fadeUp = prefersReduced
		? { initial: { opacity: 0 }, animate: { opacity: 1 } }
		: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

	const fastEase = prefersReduced
		? { duration: 0 }
		: { duration: 0.4, ease: "easeOut" };

	return (
		<div className="relative bg-transparent min-h-[100svh]">
			{/* subtle gradient background */}
			<motion.div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(to bottom, rgba(116,67,214,0.8), rgba(255,255,255,0.6), rgba(248,250,252,0.8))",
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.12 }}
				transition={{ duration: 0.6, ease: "easeInOut" }}
			/>

			<div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
				{/* Header */}
				<motion.section
					{...fadeUp}
					transition={fastEase}
					className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5"
					role="region"
					aria-labelledby="prep-section"
				>
					<h2
						id="prep-section"
						className="text-2xl font-bold"
						style={{ color: ACCENT }}
					>
						{title}
					</h2>

					{(p0 || p1) && (
						<div className="space-y-3 text-gray-800 leading-relaxed">
							{p0 && <p>{p0}</p>}
							{p1 && <p>{p1}</p>}
						</div>
					)}
				</motion.section>

				{/* How it works */}
				<motion.section
					{...fadeUp}
					transition={fastEase}
					className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-6 sm:p-8"
					role="region"
					aria-labelledby="how-section"
				>
					<h3
						id="how-section"
						className="text-2xl font-bold"
						style={{ color: ACCENT }}
					>
						{STR.howTitle}
					</h3>

					<p className="mt-2 text-slate-700">{STR.instructions}</p>
					<SrOnly>
						{STR.sr.readMore ||
							"Cards open with Enter or Space. When opened, use arrow keys or Page Up/Down to scroll the content."}
					</SrOnly>

					<ol className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
						{items.map((it, i) => (
							<FlipCard
								key={i}
								step={i + 1}
								backText={it}
								isVisited={!!visited[i]}
								onVisited={() => markVisited(i)}
								ACCENT={ACCENT}
								STR={STR}
							/>
						))}
					</ol>
				</motion.section>
			</div>
		</div>
	);
}
