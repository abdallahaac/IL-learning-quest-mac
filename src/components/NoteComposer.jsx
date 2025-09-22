import React from "react";
import { motion } from "framer-motion";

/** palette prop keeps colors consistent with the Activity page */
export default function NoteComposer({
	value,
	onChange,
	placeholder = "Type your reflections…",
	suggestedTags = [],
	storageKey = "notes-default",
	palette, // { text, ring, btn, badgeBg, border }
}) {
	const model = React.useMemo(() => {
		if (typeof value === "string" || !value) {
			return { text: value || "", bullets: [], tags: [] };
		}
		return {
			text: value.text || "",
			bullets: value.bullets || [],
			tags: value.tags || [],
		};
	}, [value]);

	const pal = {
		text: palette?.text || "text-sky-700",
		ring: palette?.ring || "focus-visible:ring-sky-700",
		btn: palette?.btn || "bg-sky-700 hover:bg-sky-800 active:bg-sky-900",
		badgeBg: palette?.badgeBg || "bg-sky-50",
		border: palette?.border || "border-sky-100",
	};

	const [tab, setTab] = React.useState("write");
	const signal = (next) => onChange?.(next);

	const addBullet = () => signal({ ...model, bullets: [...model.bullets, ""] });
	const updateBullet = (i, v) => {
		const next = [...model.bullets];
		next[i] = v;
		signal({ ...model, bullets: next });
	};
	const removeBullet = (i) => {
		const next = [...model.bullets];
		next.splice(i, 1);
		signal({ ...model, bullets: next });
	};

	const toggleTag = (t) => {
		const has = model.tags.includes(t);
		signal({
			...model,
			tags: has ? model.tags.filter((x) => x !== t) : [...model.tags, t],
		});
	};

	return (
		<div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl shadow p-4 space-y-3">
			<div className="flex gap-1">
				{["write", "bullets", "tags"].map((k) => (
					<button
						key={k}
						onClick={() => setTab(k)}
						className={`px-3 py-1.5 text-sm rounded-lg border
              ${
								tab === k
									? `${pal.btn} text-white border-transparent`
									: "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
							}`}
					>
						{k === "write"
							? "Write"
							: k === "bullets"
							? "Bullets"
							: "Highlights"}
					</button>
				))}
			</div>

			{tab === "write" && (
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					<label
						htmlFor={`${storageKey}-text`}
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Reflection
					</label>
					<textarea
						id={`${storageKey}-text`}
						key={`${storageKey}-text`}
						value={model.text}
						onChange={(e) => signal({ ...model, text: e.target.value })}
						placeholder={placeholder}
						className={`w-full min-h-32 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800
              focus:outline-none focus:ring-2 ${pal.ring} focus:border-transparent resize-vertical`}
					/>
				</motion.div>
			)}

			{tab === "bullets" && (
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
					className="space-y-2"
				>
					<div className="flex items-center justify-between">
						<label className="block text-sm font-medium text-gray-700">
							Bullet points
						</label>
						<button
							onClick={addBullet}
							className={`px-2 py-1 rounded-md text-white text-sm ${pal.btn}`}
						>
							Add
						</button>
					</div>
					<ul className="space-y-2">
						{model.bullets.map((b, i) => (
							<li key={i} className="flex gap-2">
								<span className="mt-2 text-gray-400">•</span>
								<input
									className={`flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 focus:outline-none focus:ring-2 ${pal.ring}`}
									value={b}
									onChange={(e) => updateBullet(i, e.target.value)}
									placeholder="Add a point…"
								/>
								<button
									onClick={() => removeBullet(i)}
									className="px-2 py-1 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm"
								>
									Remove
								</button>
							</li>
						))}
					</ul>
					{model.bullets.length === 0 && (
						<p className="text-sm text-gray-500">
							No bullets yet — click “Add”.
						</p>
					)}
				</motion.div>
			)}

			{tab === "tags" && (
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
					className="space-y-2"
				>
					<label className="block text-sm font-medium text-gray-700">
						Quick highlights
					</label>
					<div className="flex flex-wrap gap-2">
						{(suggestedTags.length
							? suggestedTags
							: [
									"Inspiring",
									"Challenging",
									"New perspective",
									"Action idea",
									"Community",
									"Language",
									"History",
							  ]
						).map((t) => {
							const on = model.tags.includes(t);
							return (
								<button
									key={t}
									onClick={() => toggleTag(t)}
									className={`px-3 py-1.5 rounded-full border text-sm
                    ${
											on
												? "bg-emerald-50 text-emerald-700 border-emerald-300"
												: "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
										}`}
								>
									{t}
								</button>
							);
						})}
					</div>
				</motion.div>
			)}
		</div>
	);
}
