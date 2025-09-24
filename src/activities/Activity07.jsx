import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
	Feather,
	Link2,
	BookText,
	BookOpen,
	Bookmark,
	ExternalLink,
} from "lucide-react";

/* helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

export default function Activity07({
	content,
	notes,
	onNotes,
	accent = "#0D9488", // teal-600 — change to re-skin the page
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

	// celebration when reaching 3+ valid cards
	const validCount = (model.cards || []).filter(
		(c) => c?.front?.trim() && c?.back?.trim()
	).length;

	const [celebrate, setCelebrate] = useState(false);
	const prevValidRef = useRef(validCount);
	// allow celebration each time user goes from <3 to >=3
	useEffect(() => {
		const prev = prevValidRef.current;
		if (prev < 3 && validCount >= 3) setCelebrate(true);
		prevValidRef.current = validCount;
	}, [validCount]);

	// motion rhythm
	const reduceMotion = useReducedMotion();
	const STAGGER = 0.14;
	const DELAY_CHILDREN = 0.1;
	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};
	const gridStagger = {
		hidden: {},
		show: {
			transition: {
				delayChildren: reduceMotion ? 0 : DELAY_CHILDREN,
				staggerChildren: reduceMotion ? 0 : STAGGER,
			},
		},
	};
	const cardPop = {
		hidden: {
			opacity: 0,
			y: reduceMotion ? 0 : 8,
			scale: reduceMotion ? 1 : 0.99,
		},
		show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
	};

	// shared classes (accent via outlineColor inline)
	const linkCardBase =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div
				className={badgeBase + " absolute left-0 top-1/2 -translate-y-1/2"}
				style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
			>
				<Icon className="w-5 h-5" />
			</div>
			<div className="w-full text-center font-medium text-slate-900 group-hover:underline">
				{children}
			</div>
		</div>
	);

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* soft accent gradient */}
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha(accent, "26")} 0%,
            rgba(255,255,255,0) 45%,
            rgba(248,250,252,0) 100%
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ duration: 0.6 }}
			/>

			{/* celebration overlay */}
			<AnimatePresence initial={false} mode="wait">
				{celebrate && (
					<Celebration accent={accent} onClose={() => setCelebrate(false)} />
				)}
			</AnimatePresence>

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* Header */}
				<motion.header
					className="text-center space-y-4"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<p
						className="font-semibold uppercase tracking-wide text-sm sm:text-base"
						style={{ color: accent }}
					>
						Activity {activityNumber}
					</p>

					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
							Learn Three Words
						</h1>
						<Feather
							className="w-7 h-7"
							aria-hidden="true"
							style={{ color: accent }}
						/>
					</div>

					<TipCard accent={accent}>
						Learn to say a few words in an Indigenous language. <br />
						Share them with your team and use them often.
					</TipCard>
				</motion.header>

				{/* Resources */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<motion.a
							href="https://www.firstvoices.com/"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: FirstVoices (new tab)"
							aria-label="Open FirstVoices in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={Link2}>FirstVoices</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://tusaalanga.ca/glossary"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Inuktut glossary (new tab)"
							aria-label="Open Inuktut glossary in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={BookText}>
								Inuktut glossary (Inuktut Tusaalanga)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://speakmichif.ca/learn/resources"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Michif Language Revitalization Circle resources (new tab)"
							aria-label="Open Michif Language Revitalization Circle resources in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={BookOpen}>
								Michif Language Revitalization Circle (resources)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>

						<motion.a
							href="https://www.louisrielinstitute.ca/metis-languages-learning-resources"
							target="_blank"
							rel="noreferrer"
							className={linkCardBase}
							style={{ outlineColor: accent }}
							title="Open: Métis languages resources — Louis Riel Institute (new tab)"
							aria-label="Open Métis languages resources in a new tab"
							variants={cardPop}
						>
							<TitleRow Icon={Bookmark}>
								Métis languages resources (Louis Riel Institute)
							</TitleRow>
							<div className={linkFooterBase} style={{ color: accent }}>
								<ExternalLink className="w-4 h-4" />
								<span>Open link</span>
							</div>
						</motion.a>
					</div>
				</motion.section>

				{/* Instructions panel — larger font + more opaque background for contrast */}
				<div
					className="mx-auto max-w-3xl rounded-2xl border p-5 md:p-6 text-center shadow-sm"
					style={{
						borderColor: withAlpha(accent, "4D"), // ~30%
						backgroundColor: withAlpha(accent, "26"), // ~15% strong contrast
					}}
				>
					<p className="text-base md:text-lg text-slate-900">
						Add word cards below (word on the front, meaning on the back). Click
						a card to flip it and practice anytime.
					</p>
				</div>

				{/* Editor LEFT · Flip preview RIGHT */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* LEFT: Editor card */}
					<div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow p-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-slate-900">
								Add your words (Flip Cards)
							</h3>
							<span className="text-sm text-slate-500">{validCount} cards</span>
						</div>
						<p className="text-sm text-slate-600 mt-1">
							Tip: press <kbd>Enter</kbd> in the “Back” field to add quickly.
						</p>

						{/* input row */}
						<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
							<input
								value={newFront}
								onChange={(e) => setNewFront(e.target.value)}
								placeholder="Front (word / phrase)"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                           focus:outline-none focus-visible:ring-2"
								style={{ outlineColor: accent }}
							/>
							<input
								value={newBack}
								onChange={(e) => setNewBack(e.target.value)}
								onKeyDown={handleNewKey}
								placeholder="Back (meaning / translation)"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm leading-6
                           focus:outline-none focus-visible:ring-2"
								style={{ outlineColor: accent }}
							/>
						</div>

						<div className="mt-3 flex justify-center">
							<button
								type="button"
								onClick={addCard}
								disabled={!newFront.trim() || !newBack.trim()}
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white disabled:opacity-50
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
								style={{ backgroundColor: accent, outlineColor: accent }}
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
                                   focus:outline-none focus-visible:ring-2"
												style={{ outlineColor: accent }}
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
                                   focus:outline-none focus-visible:ring-2"
												style={{ outlineColor: accent }}
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
					<div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow p-4 flex items-center justify-center">
						<Flashcards cards={model.cards || []} accent={accent} />
					</div>
				</section>
			</div>
		</motion.div>
	);
}

/* ----- Flashcards ----- */
function Flashcards({ cards = [], accent = "#0D9488" }) {
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

			{/* Outer shell */}
			<button
				disabled={!curr}
				onClick={() => curr && setFlipped(!flipped)}
				className={`relative w-full aspect-[4/3] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden
          ${curr ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
				style={{ perspective: 1000 }}
				title={curr ? "Click to flip" : undefined}
				type="button"
			>
				{/* Inner flipper */}
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
						<div
							className="absolute top-0 left-0 right-0 px-3 py-1.5 text-[11px] font-medium"
							style={{ color: accent }}
						>
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
						<div
							className="absolute top-0 left-0 right-0 px-3 py-1.5 text-[11px] font-medium"
							style={{ color: accent }}
						>
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
					className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
					style={{ backgroundColor: accent }}
				>
					Next
				</button>
			</div>
		</div>
	);
}

/* ---- Celebration overlay (confetti dots + quick toast) ---- */
function Celebration({ onClose, accent = "#0D9488" }) {
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
			onClick={onClose}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.35 }}
			className="fixed inset-0 z-50 grid place-items-center"
			style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
		>
			<motion.div
				initial={{ scale: 0.9, rotate: -6, opacity: 0 }}
				animate={{ scale: 1.05, rotate: 0, opacity: 1 }}
				exit={{ scale: 0.96, opacity: 0 }}
				transition={{ type: "spring", stiffness: 220, damping: 16 }}
				className="rounded-2xl border shadow-xl px-6 py-4"
				style={{
					backgroundColor: "rgba(255,255,255,0.95)",
					borderColor: withAlpha(accent, "33"),
				}}
			>
				<div className="flex items-center gap-3" style={{ color: accent }}>
					<Feather className="w-6 h-6" />
					<p className="text-lg font-semibold">Nice! You added 3 words 🎉</p>
				</div>
				<p className="text-sm text-slate-700 text-center mt-1">
					Keep going—add more and practice by flipping the cards.
				</p>
			</motion.div>

			{[...Array(18)].map((_, i) => (
				<ConfettiDot key={i} accent={accent} />
			))}
		</motion.div>
	);
}

/* tiny confetti dots */
function ConfettiDot({ accent = "#0D9488" }) {
	const x = Math.random() * 100;
	const y = Math.random() * 100;
	const s = 6 + Math.random() * 10;
	const dur = 0.8 + Math.random() * 0.8;
	const colors = [accent, "#14b8a6", "#99f6e4", "#34d399", "#fcd34d"];
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
				background: colors[Math.floor(Math.random() * colors.length)],
			}}
		/>
	);
}

/* Accent-aware, dashed/translucent tip (shared with other redesigned pages) */
function TipCard({ accent = "#0D9488", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
			style={{
				borderColor: withAlpha(accent, "33"),
				backgroundColor: withAlpha(accent, "14"),
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);
}
