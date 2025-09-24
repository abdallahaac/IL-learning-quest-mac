import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Feather,
	Link2,
	BookText,
	BookOpen,
	Bookmark,
	ExternalLink,
} from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity07({
	content,
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const placeholder =
		content?.notePlaceholder || "Words/phrases and where they’re used…";

	// normalize notes to object so we can store cards inside it
	const initialModel = useMemo(() => {
		if (typeof notes === "string" || !notes) {
			return { text: notes || "", bullets: [], cards: [] };
		}
		return {
			text: notes.text || "",
			bullets: Array.isArray(notes.bullets) ? notes.bullets : [],
			cards: Array.isArray(notes.cards) ? notes.cards : [],
		};
	}, [notes]);

	const [model, setModel] = useState(initialModel);
	const saveNotes = (next) => {
		setModel(next);
		onNotes?.(next);
	};

	// ----- FLASHCARD EDITOR STATE -----
	const [newFront, setNewFront] = useState("");
	const [newBack, setNewBack] = useState("");

	const addCard = () => {
		const f = newFront.trim();
		const b = newBack.trim();
		if (!f || !b) return;
		const next = {
			...model,
			cards: [...(model.cards || []), { front: f, back: b }],
		};
		saveNotes(next);
		setNewFront("");
		setNewBack("");
	};

	const updateCard = (i, field, val) => {
		const list = Array.isArray(model.cards) ? [...model.cards] : [];
		if (!list[i]) return;
		list[i] = { ...list[i], [field]: val };
		saveNotes({ ...model, cards: list });
	};

	const removeCard = (i) => {
		const list = Array.isArray(model.cards) ? [...model.cards] : [];
		list.splice(i, 1);
		saveNotes({ ...model, cards: list });
	};

	const handleNewKey = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addCard();
		}
	};

	const activityNumber = 7;

	// counts & gating
	const validCount = (model.cards || []).filter(
		(c) => c?.front?.trim() && c?.back?.trim()
	).length;
	const canComplete = validCount >= 3; // at least 3

	// celebration: fire only on upward crossing during this *session*
	const [celebrate, setCelebrate] = useState(false);
	const [hasCelebrated, setHasCelebrated] = useState(false);
	const prevValidRef = useRef(validCount);

	// on mount, if we already have 3+, do NOT celebrate, but mark as "already celebrated"
	useEffect(() => {
		setHasCelebrated(validCount >= 3);
		prevValidRef.current = validCount;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // run once

	useEffect(() => {
		const prev = prevValidRef.current;

		// upward crossing: (<3) -> (>=3)
		if (prev < 3 && validCount >= 3) {
			setCelebrate(true);
			setHasCelebrated(true);
		}

		// if we drop below 3, allow future celebrations again
		if (validCount < 3) {
			setHasCelebrated(false);
		}

		// keep the ref in sync
		prevValidRef.current = validCount;
	}, [validCount]);

	// gentle shake when trying to complete too early
	const [shake, setShake] = useState(false);
	const handleCompleteClick = () => {
		if (canComplete) {
			onToggleComplete?.();
		} else {
			setShake(true);
			setTimeout(() => setShake(false), 450);
		}
	};

	// THEME: TEAL
	const badge =
		"w-10 h-10 rounded-xl grid place-items-center bg-teal-50 text-teal-600";
	const linkCard =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";
	const linkFooter =
		"mt-2 flex items-center justify-center gap-1 text-teal-600 text-xs font-medium";

	const notePalette = {
		ring: "focus-visible:ring-teal-600",
		btn: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800",
		badgeBg: "bg-teal-50",
		border: "border-teal-100",
	};

	// helper: icon-left, centered title
	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div className={`${badge} absolute left-0 top-1/2 -translate-y-1/2`}>
				<Icon className="w-5 h-5" />
			</div>
			<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
				{children}
			</div>
		</div>
	);

	return (
		<div className="relative bg-transparent min-h-[80svh]">
			{/* celebration burst (fades out) */}
			<AnimatePresence initial={false} mode="wait">
				{celebrate && <Celebration onClose={() => setCelebrate(false)} />}
			</AnimatePresence>

			{/* wider container for a more homogeneous layout */}
			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header */}
				<header className="text-center space-y-2">
					<p className="text-teal-600 font-semibold uppercase tracking-wide text-sm sm:text-base">
						Activity {activityNumber}
					</p>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Learn Three Words
						</h1>
						<Feather className="w-7 h-7 text-teal-600" aria-hidden="true" />
					</div>
					<p className="text-slate-700 text-lg sm:text-xl max-w-2xl mx-auto">
						Learn to say three words in an Indigenous language. Share them with
						your team and use them often.
					</p>
				</header>

				{/* Resources (2 cols on sm+) */}
				<section>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<a
							href="https://www.firstvoices.com/"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: FirstVoices (new tab)"
							aria-label="Open FirstVoices in a new tab"
						>
							<TitleRow Icon={Link2}>FirstVoices</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>
						<a
							href="https://tusaalanga.ca/glossary"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Inuktut glossary (new tab)"
							aria-label="Open Inuktut glossary in a new tab"
						>
							<TitleRow Icon={BookText}>
								Inuktut glossary (Inuktut Tusaalanga)
							</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>
						<a
							href="https://speakmichif.ca/learn/resources"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Michif Language Revitalization Circle resources (new tab)"
							aria-label="Open Michif Language Revitalization Circle resources in a new tab"
						>
							<TitleRow Icon={BookOpen}>
								Michif Language Revitalization Circle (resources)
							</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>
						<a
							href="https://www.louisrielinstitute.ca/metis-languages-learning-resources"
							target="_blank"
							rel="noreferrer"
							className={linkCard}
							title="Open: Métis languages resources — Louis Riel Institute (new tab)"
							aria-label="Open Métis languages resources in a new tab"
						>
							<TitleRow Icon={Bookmark}>
								Métis languages resources (Louis Riel Institute)
							</TitleRow>
							<div className={linkFooter}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</a>
					</div>
				</section>

				{/* Explanation panel */}
				<div className="mx-auto max-w-3xl rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-center">
					<p className="text-sm text-slate-700">
						Add <strong>at least three</strong> word cards below (word on the
						front, meaning on the back). You’ll get a little celebration when
						you hit three, and you can only mark this activity complete once you
						have <strong>3+</strong>.
					</p>
				</div>
				{/* Editor LEFT · Flip preview RIGHT */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* LEFT: Editor card */}
					<div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow p-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-slate-900">
								Add your words (Flip Cards)
							</h3>
							<span
								className={`text-sm ${
									canComplete ? "text-emerald-700" : "text-slate-500"
								}`}
							>
								{validCount} / 3+
							</span>
						</div>
						<p className="text-xs text-slate-600 mt-1">
							Tip: press <kbd>Enter</kbd> in the “Back” field to add quickly.
						</p>

						{/* Always-visible input row */}
						<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
							<input
								value={newFront}
								onChange={(e) => setNewFront(e.target.value)}
								placeholder="Front (word / phrase)"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
							/>
							<input
								value={newBack}
								onChange={(e) => setNewBack(e.target.value)}
								onKeyDown={handleNewKey}
								placeholder="Back (meaning / translation)"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
							/>
						</div>

						<div className="mt-3 flex justify-center">
							<button
								type="button"
								onClick={addCard}
								disabled={!newFront.trim() || !newBack.trim()}
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white
                           bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
							>
								Add card
							</button>
						</div>

						{/* Editable list */}
						<div className="mt-4">
							{model.cards?.length ? (
								<ul className="space-y-2">
									{model.cards.map((c, i) => (
										<li
											key={i}
											className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center"
										>
											<input
												value={c.front}
												onChange={(e) => updateCard(i, "front", e.target.value)}
												aria-label={`Front ${i + 1}`}
												className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
												placeholder="Front"
											/>
											<span className="hidden sm:block text-xs text-slate-500 px-1 text-center">
												↔
											</span>
											<input
												value={c.back}
												onChange={(e) => updateCard(i, "back", e.target.value)}
												aria-label={`Back ${i + 1}`}
												className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
												placeholder="Back"
											/>
											<button
												type="button"
												onClick={() => removeCard(i)}
												className="sm:ml-2 text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
												title="Remove"
											>
												Remove
											</button>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-slate-500">
									No cards yet — add your first above.
								</p>
							)}
						</div>
					</div>

					{/* RIGHT: Flip preview wrapped in a matching card */}
					<div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow p-4 flex items-center justify-center">
						<Flashcards cards={model.cards || []} palette={notePalette} />
					</div>
				</section>

				{/* Complete button with gating (3 or more required) */}
				<div className="flex items-center justify-between">
					<span
						className={`text-sm ${
							canComplete ? "text-emerald-700" : "text-slate-500"
						}`}
					>
						{canComplete
							? "Great—at least 3 words added!"
							: "Add at least 3 cards to complete this activity"}
					</span>

					<motion.button
						type="button"
						onClick={handleCompleteClick}
						aria-pressed={!!completed}
						animate={shake ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
						transition={{ duration: 0.45 }}
						className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
							canComplete
								? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
								: "border-gray-300 bg-gray-50 text-gray-800"
						}`}
						title={canComplete ? "Ready to mark complete" : "Add 3 words first"}
					>
						{completed ? "Marked Complete" : "Mark Complete"}
					</motion.button>
				</div>
			</div>
		</div>
	);
}

/* ----- Flashcards: whole-card flip, non-mirrored, tiny headers without bg ----- */
function Flashcards({ cards = [], palette = {} }) {
	const palBtn =
		palette?.btn || "bg-sky-700 hover:bg-sky-800 active:bg-sky-900";

	const safeCards = Array.isArray(cards) ? cards : [];
	const [i, setI] = useState(0);
	const [flipped, setFlipped] = useState(false);

	const count = safeCards.length;
	const curr = count ? safeCards[Math.max(0, Math.min(i, count - 1))] : null;

	const next = () => {
		if (!count) return;
		setFlipped(false);
		setI((v) => (v + 1) % count);
	};
	const prev = () => {
		if (!count) return;
		setFlipped(false);
		setI((v) => (v - 1 + count) % count);
	};

	return (
		<div className="grid gap-4 place-items-center w-full">
			<div className="text-sm text-gray-600">
				{count ? `${i + 1} / ${count}` : "No cards yet"}
			</div>

			{/* Outer shell (static) */}
			<button
				disabled={!curr}
				onClick={() => curr && setFlipped(!flipped)}
				className={`relative w-full aspect-[4/3] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden
          ${curr ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
				style={{ perspective: 1000 }} // 3D context
				title={curr ? "Click to flip" : undefined}
				type="button"
			>
				{/* Inner flipper (rotates as a whole card) */}
				<motion.div
					animate={{ rotateY: flipped ? 180 : 0 }}
					transition={{ duration: 0.45 }}
					style={{
						transformStyle: "preserve-3d",
						width: "100%",
						height: "100%",
						willChange: "transform",
					}}
					className="relative"
				>
					{/* FRONT */}
					<div
						className="absolute inset-0 grid place-items-center"
						style={{
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
						}}
					>
						<div className="absolute top-0 left-0 right-0 px-3 py-1.5 text-[11px] font-medium text-teal-700">
							New word
						</div>
						<div className="h-full w-full grid place-items-center px-6 pt-8">
							<div className="text-2xl font-semibold text-gray-800 text-center">
								{curr ? curr.front : "Add cards to get started"}
							</div>
						</div>
					</div>

					{/* BACK */}
					<div
						className="absolute inset-0 grid place-items-center"
						style={{
							transform: "rotateY(180deg)",
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
						}}
					>
						<div className="absolute top-0 left-0 right-0 px-3 py-1.5 text-[11px] font-medium text-teal-700">
							Meaning / Translation
						</div>
						<div className="h-full w-full grid place-items-center px-6 pt-8">
							<div className="text-2xl font-semibold text-gray-800 text-center">
								{curr ? curr.back : ""}
							</div>
						</div>
					</div>
				</motion.div>
			</button>

			<div className="flex gap-2 justify-center">
				<button
					onClick={prev}
					disabled={!count}
					className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
				>
					Back
				</button>
				<button
					onClick={next}
					disabled={!count}
					className={`px-4 py-2 rounded-lg text-white ${palBtn} disabled:opacity-50`}
				>
					Next
				</button>
			</div>
		</div>
	);
}

/* tiny confetti dots (each fades out with the overlay) */
function ConfettiDot() {
	const x = Math.random() * 100; // vw
	const y = Math.random() * 100; // vh
	const s = 6 + Math.random() * 10;
	const dur = 0.8 + Math.random() * 0.8;
	return (
		<motion.span
			initial={{ opacity: 0, scale: 0.6, x: "0vw", y: "0vh" }}
			animate={{ opacity: 1, scale: 1, x: `${x - 50}vw`, y: `${y - 50}vh` }}
			exit={{ opacity: 0 }}
			transition={{ duration: dur, ease: "easeOut" }}
			className="pointer-events-none fixed z-50 rounded-full"
			style={{
				width: s,
				height: s,
				background: ["#0d9488", "#14b8a6", "#99f6e4", "#34d399", "#fcd34d"][
					Math.floor(Math.random() * 5)
				],
			}}
		/>
	);
}

function Celebration({ onClose }) {
	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		window.addEventListener("keydown", onEsc);
		const t = window.setTimeout(() => onClose?.(), 1600);
		return () => {
			window.removeEventListener("keydown", onEsc);
			window.clearTimeout(t);
		};
	}, [onClose]);

	return (
		<motion.div
			// click anywhere to dismiss
			onClick={onClose}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }} // overlay fades out
			transition={{ duration: 0.35 }}
			className="fixed inset-0 z-50 grid place-items-center bg-black/10"
		>
			<motion.div
				initial={{ scale: 0.9, rotate: -6, opacity: 0 }}
				animate={{ scale: 1.05, rotate: 0, opacity: 1 }}
				exit={{ scale: 0.96, opacity: 0 }} // card fades & shrinks out
				transition={{ type: "spring", stiffness: 220, damping: 16 }}
				className="rounded-2xl bg-white/90 backdrop-blur border border-teal-200 shadow-xl px-6 py-4"
			>
				<div className="flex items-center gap-3 text-teal-700">
					<Feather className="w-6 h-6" />
					<p className="text-lg font-semibold">
						You have completed the activity!
					</p>
				</div>
				<p className="text-sm text-slate-600 text-center mt-1">
					Flip your cards to practice, then mark the activity complete.
				</p>
			</motion.div>

			{/* confetti dots */}
			{[...Array(18)].map((_, i) => (
				<ConfettiDot key={i} />
			))}
		</motion.div>
	);
}
