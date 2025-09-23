import React from "react";
import { motion } from "framer-motion";
import { ImageIcon, CheckCircle2, PlayCircle, Feather } from "lucide-react";

/** Small helper to read classes off the current palette (with safe defaults). */
function usePalette(palette = {}) {
	return {
		text: palette.text || "text-sky-700",
		ring: palette.ring || "focus-visible:ring-sky-700",
		btn: palette.btn || "bg-sky-700 hover:bg-sky-800 active:bg-sky-900",
		badgeBg: palette.badgeBg || "bg-sky-50",
		border: palette.border || "border-sky-100",
	};
}

/** Centered section header (kept for completeness; not used by Activity.jsx header) */
export function ActivityHeader({ icon: Icon, title, subtitle, palette }) {
	const pal = usePalette(palette);
	return (
		<div className="text-center space-y-2">
			<div
				className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${pal.badgeBg} ${pal.text}`}
			>
				<Icon className="w-6 h-6" />
			</div>
			<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
			{subtitle && <p className="text-gray-600">{subtitle}</p>}
		</div>
	);
}

/** A. Gallery cards with a soft accent */
export function GalleryCards({ items = [], palette, className = "" }) {
	const pal = usePalette(palette);
	return (
		<div className={`grid sm:grid-cols-2 lg:grid-cols gap-4 ${className}`}>
			{items.map((x, i) => (
				<motion.button
					key={i}
					whileHover={{ y: -4 }}
					className="text-left rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md"
					onClick={() => window.open(x.href ?? "#", "_blank")}
				>
					<div
						className={`aspect-video rounded-xl bg-gradient-to-br ${pal.badgeBg} grid place-items-center mb-3`}
					>
						<ImageIcon className={`w-8 h-8 ${pal.text}`} />
					</div>
					<div className="font-medium text-gray-800">{x.title}</div>
					<div className="text-sm text-gray-600">{x.desc}</div>
				</motion.button>
			))}
		</div>
	);
}

/** B. Checklist (accented ring; checked stays emerald for clear affordance) */
export function Checklist({ items = [], checked = {}, onToggle, palette }) {
	const pal = usePalette(palette);
	return (
		<ul className="space-y-2">
			{items.map((label, i) => {
				const id = `chk-${i}`;
				const isOn = !!checked[id];
				return (
					<li key={id} className="flex items-start gap-3">
						<button
							onClick={() => onToggle?.(id)}
							className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md border
                ${
									isOn
										? "bg-emerald-500 border-emerald-500 text-white"
										: `border-gray-300 bg-white text-gray-500 ${pal.ring} focus:outline-none focus-visible:ring-2`
								}`}
							aria-pressed={isOn}
						>
							<CheckCircle2 className="w-4 h-4" />
						</button>
						<span
							className={`text-gray-800 ${
								isOn ? "line-through text-gray-500" : ""
							}`}
						>
							{label}
						</span>
					</li>
				);
			})}
		</ul>
	);
}

/** C. Flashcards (empty-safe, palette-aware, neutral icon) */
export function Flashcards({ cards = [], palette }) {
	const pal = usePalette(palette);
	const safeCards = Array.isArray(cards) ? cards : [];
	const [i, setI] = React.useState(0);
	const [flipped, setFlipped] = React.useState(false);

	const count = safeCards.length;
	const curr =
		count > 0 ? safeCards[Math.max(0, Math.min(i, count - 1))] : null;

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
		<div className="grid gap-4 place-items-center">
			<div className="text-sm text-gray-600">
				{count ? `${i + 1} / ${count}` : "No cards yet"}
			</div>

			<motion.button
				disabled={!curr}
				onClick={() => curr && setFlipped(!flipped)}
				className={`relative w-full max-w-md aspect-[4/3] rounded-2xl border border-gray-200 bg-white shadow-sm grid place-items-center
          ${curr ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
				animate={{ rotateY: flipped ? 180 : 0 }}
				transition={{ duration: 0.45 }}
				style={{ transformStyle: "preserve-3d" }}
			>
				<div className="absolute inset-0 grid place-items-center backface-hidden">
					<Feather className={`w-6 h-6 ${pal.text} absolute top-3 left-3`} />
					<div className="text-2xl font-semibold text-gray-800">
						{curr ? curr.front : "Add cards to get started"}
					</div>
				</div>
				<div
					className="absolute inset-0 grid place-items-center backface-hidden"
					style={{ transform: "rotateY(180deg)" }}
				>
					<div className="text-2xl font-semibold text-gray-800">
						{curr ? curr.back : ""}
					</div>
				</div>
			</motion.button>

			<div className="flex gap-2">
				<button
					onClick={prev}
					disabled={!count}
					className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
				>
					Prev
				</button>
				<button
					onClick={next}
					disabled={!count}
					className={`px-4 py-2 rounded-lg text-white ${pal.btn} disabled:opacity-50`}
				>
					Next
				</button>
			</div>
		</div>
	);
}
/** D. Media cards (tags + icon adopt palette) */
export function MediaCards({ items = [], icon: Icon = PlayCircle, palette }) {
	const pal = usePalette(palette);

	// Decide layout based on number of items
	const gridClass =
		items.length === 1
			? "flex justify-center" // one card: center it
			: "grid sm:grid-cols-2 gap-4"; // two+ cards: normal grid

	return (
		<div className={gridClass}>
			{items.map((x, i) => (
				<motion.a
					key={i}
					href={x.href ?? "#"}
					target="_blank"
					rel="noreferrer"
					whileHover={{ y: -3 }}
					className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md block max-w-md w-full"
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 rounded-xl grid place-items-center ${pal.badgeBg} ${pal.text}`}
						>
							<Icon className="w-5 h-5" />
						</div>
						<div className="font-medium text-gray-800">{x.title}</div>
					</div>
					{x.desc && <p className="text-sm text-gray-600 mt-2">{x.desc}</p>}
					{x.tags && (
						<div className="mt-3 flex flex-wrap gap-1">
							{x.tags.map((t, j) => (
								<span
									key={j}
									className={`px-2 py-0.5 text-xs rounded-full ${pal.badgeBg} ${pal.text} ${pal.border} border`}
								>
									{t}
								</span>
							))}
						</div>
					)}
				</motion.a>
			))}
		</div>
	);
}
