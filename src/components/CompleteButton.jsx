// src/pages/components/CompleteButton.jsx
import React from "react";
import { motion } from "framer-motion";

// Match your app's detection pattern so activities don't need to pass anything
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

const STRINGS = {
	en: {
		mark: "Mark Complete",
		marked: "Marked Complete",
		disabled: "Start the activity to enable this",
	},
	fr: {
		mark: "Marquer comme terminé",
		marked: "Terminé",
		disabled: "Commencez l’activité pour activer ceci",
	},
};

export default function CompleteButton({
	started,
	completed,
	onToggle,
	accent = "#10B981",
	size = "md",
	disabledHint, // optional override; if omitted we localize automatically
}) {
	// auto language, no prop required from activities
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const STR = STRINGS[lang];

	const base =
		"inline-flex items-center justify-center rounded-lg border font-medium transition-colors " +
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
	const pad = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

	const enabled = !!started;

	const cls = enabled
		? completed
			? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
			: "border-gray-300 bg-white text-slate-800 hover:bg-slate-50"
		: "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed";

	const label = completed ? STR.marked : STR.mark;
	const title = enabled ? label : disabledHint || STR.disabled;

	return (
		<motion.button
			type="button"
			aria-pressed={enabled ? !!completed : undefined}
			aria-label={label}
			disabled={!enabled}
			onClick={enabled ? onToggle : undefined}
			className={`${base} ${pad} ${cls}`}
			style={{ outlineColor: accent }}
			title={title}
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25 }}
		>
			{label}
		</motion.button>
	);
}
