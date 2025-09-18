// src/components/ActivityViews.jsx
import React from "react";
import { MotionConfig, AnimatePresence, motion } from "framer-motion";
import {
	ImageIcon,
	CheckCircle2,
	PlayCircle,
	Languages,
	Globe,
	BookOpen,
	Film,
	ListChecks,
} from "lucide-react";

export function ActivityHeader({ icon: Icon, title, subtitle }) {
	return (
		<div className="text-center space-y-2">
			<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-100 text-sky-700">
				<Icon className="w-6 h-6" />
			</div>
			<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
			{subtitle && <p className="text-gray-600">{subtitle}</p>}
		</div>
	);
}

/** A. Gallery cards with expand-on-click (for “artist” / media discovery) */
export function GalleryCards({ items = [] }) {
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{items.map((x, i) => (
				<motion.button
					key={i}
					whileHover={{ y: -4 }}
					className="text-left rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md"
					onClick={() => window.open(x.href ?? "#", "_blank")}
				>
					<div className="aspect-video rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 grid place-items-center mb-3">
						<ImageIcon className="w-8 h-8 text-sky-700" />
					</div>
					<div className="font-medium text-gray-800">{x.title}</div>
					<div className="text-sm text-gray-600">{x.desc}</div>
				</motion.button>
			))}
		</div>
	);
}

/** B. Checklist (for recipe steps, plant facts, etc.) */
export function Checklist({ items = [], checked = {}, onToggle }) {
	return (
		<ul className="space-y-2">
			{items.map((label, i) => {
				const id = `chk-${i}`;
				const isOn = !!checked[id];
				return (
					<li key={id} className="flex items-start gap-3">
						<button
							onClick={() => onToggle(id)}
							className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md border ${
								isOn
									? "bg-emerald-500 border-emerald-500 text-white"
									: "border-gray-300 bg-white text-gray-500"
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

/** C. Flashcards (for the language activity) */
export function Flashcards({ cards = [] }) {
	const [i, setI] = React.useState(0);
	const [flipped, setFlipped] = React.useState(false);

	const next = () => {
		setFlipped(false);
		setI((v) => (v + 1) % cards.length);
	};
	const prev = () => {
		setFlipped(false);
		setI((v) => (v - 1 + cards.length) % cards.length);
	};

	return (
		<div className="grid gap-4 place-items-center">
			<div className="text-sm text-gray-600">
				{i + 1} / {cards.length}
			</div>
			<motion.button
				onClick={() => setFlipped(!flipped)}
				className="relative w-full max-w-md aspect-[4/3] rounded-2xl border border-gray-200 bg-white shadow-sm grid place-items-center"
				animate={{ rotateY: flipped ? 180 : 0 }}
				transition={{ duration: 0.45 }}
				style={{ transformStyle: "preserve-3d" }}
			>
				<div className="absolute inset-0 grid place-items-center backface-hidden">
					<Languages className="w-6 h-6 text-sky-600 absolute top-3 left-3" />
					<div className="text-2xl font-semibold text-gray-800">
						{cards[i].front}
					</div>
				</div>
				<div
					className="absolute inset-0 grid place-items-center backface-hidden"
					style={{ transform: "rotateY(180deg)" }}
				>
					<div className="text-2xl font-semibold text-gray-800">
						{cards[i].back}
					</div>
				</div>
			</motion.button>
			<div className="flex gap-2">
				<button
					onClick={prev}
					className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100"
				>
					Prev
				</button>
				<button
					onClick={next}
					className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600"
				>
					Next
				</button>
			</div>
		</div>
	);
}

/** D. Media cards (for film/podcast/book/news/shop discovery) */
export function MediaCards({ items = [], icon: Icon = PlayCircle }) {
	return (
		<div className="grid sm:grid-cols-2 gap-4">
			{items.map((x, i) => (
				<motion.a
					key={i}
					href={x.href ?? "#"}
					target="_blank"
					rel="noreferrer"
					whileHover={{ y: -3 }}
					className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md block"
				>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 grid place-items-center">
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
									className="px-2 py-0.5 text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-200"
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
