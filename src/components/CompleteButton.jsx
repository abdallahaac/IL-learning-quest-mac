import React from "react";
import { motion } from "framer-motion";

/**
 * CompleteButton
 *
 * States:
 * - Disabled until `started === true`
 * - When enabled, toggles complete via `onToggle()`
 *
 * Props:
 * - started: boolean (required) — computed by your page using helpers
 * - completed: boolean
 * - onToggle: () => void
 * - accent?: string (Tailwind-less inline color for border/focus/hover tints)
 * - size?: "sm" | "md"
 * - disabledHint?: string (tooltip/aria title when disabled)
 */
export default function CompleteButton({
	started,
	completed,
	onToggle,
	accent = "#10B981", // emerald default
	size = "md",
	disabledHint = "Start the activity to enable this",
}) {
	const base =
		"inline-flex items-center justify-center rounded-lg border font-medium transition-colors " +
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

	const pad = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

	const enabled = !!started;
	const commonStyle = { outlineColor: accent };

	const cls = enabled
		? completed
			? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
			: "border-gray-300 bg-white text-slate-800 hover:bg-slate-50"
		: "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed";

	const title = enabled
		? completed
			? "Marked Complete"
			: "Mark Complete"
		: disabledHint;

	return (
		<motion.button
			type="button"
			aria-pressed={enabled ? !!completed : undefined}
			disabled={!enabled}
			onClick={enabled ? onToggle : undefined}
			className={`${base} ${pad} ${cls}`}
			style={commonStyle}
			title={title}
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25 }}
		>
			{completed ? "Marked Complete" : "Mark Complete"}
		</motion.button>
	);
}
