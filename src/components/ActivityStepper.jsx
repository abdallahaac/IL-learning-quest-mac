import React, { useMemo, useRef, useEffect } from "react";

/**
 * ActivityStepper
 * - steps: [{ key, label, index, completed, visited }]
 * - currentPageIndex: number (AppShell's current pageIndex)
 * - onJump(stepIndex:number): called with steps[i].index (page index)
 */
export default function ActivityStepper({
	steps = [],
	currentPageIndex = 0,
	onJump,
}) {
	const containerRef = useRef(null);

	// find the active step (the one whose page index matches currentPageIndex)
	const activeIdx = useMemo(
		() => steps.findIndex((s) => s.index === currentPageIndex),
		[steps, currentPageIndex]
	);

	// center the active pill on mount/update (nice on mobile)
	useEffect(() => {
		if (!containerRef.current || activeIdx < 0) return;
		const node = containerRef.current.querySelector(
			`[data-step-idx="${activeIdx}"]`
		);
		if (!node) return;
		const { left, width } = node.getBoundingClientRect();
		const { left: cLeft, width: cWidth } =
			containerRef.current.getBoundingClientRect();
		const delta = left - cLeft - (cWidth - width) / 2;
		containerRef.current.scrollBy({ left: delta, behavior: "smooth" });
	}, [activeIdx]);

	// keyboard support (left/right to change focus)
	const onKeyDown = (e) => {
		const isLeft = e.key === "ArrowLeft";
		const isRight = e.key === "ArrowRight";
		if (!isLeft && !isRight) return;
		e.preventDefault();
		const dir = isLeft ? -1 : 1;
		const next = Math.max(0, Math.min(steps.length - 1, activeIdx + dir));
		const nextPage = steps[next]?.index;
		if (typeof nextPage === "number" && onJump) onJump(nextPage);
	};

	if (!steps.length) return null;

	return (
		<nav
			aria-label="Activity progress"
			className="w-full sm:max-w-xl"
			onKeyDown={onKeyDown}
		>
			<div
				ref={containerRef}
				className="flex items-center gap-3 overflow-x-auto no-scrollbar px-1 py-1"
				role="listbox"
				aria-orientation="horizontal"
			>
				{steps.map((s, i) => {
					const isActive = s.index === currentPageIndex;
					const done = !!s.completed;
					const seen = !!s.visited;

					const base =
						"inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400";
					const state = isActive
						? "bg-sky-50 border-sky-300 text-sky-800"
						: done
						? "bg-emerald-50 border-emerald-300 text-emerald-800"
						: seen
						? "bg-indigo-50 border-indigo-300 text-indigo-800"
						: "bg-gray-50 border-gray-300 text-gray-700";

					return (
						<button
							key={s.key ?? i}
							data-step-idx={i}
							role="option"
							aria-selected={isActive}
							aria-current={isActive ? "step" : undefined}
							title={s.label}
							className={`${base} ${state} shrink-0`}
							onClick={() => onJump?.(s.index)}
						>
							<span
								className={`grid place-items-center w-6 h-6 rounded-full text-xs font-semibold border ${
									isActive
										? "bg-white border-sky-300 text-sky-700"
										: done
										? "bg-white border-emerald-300 text-emerald-700"
										: seen
										? "bg-white border-indigo-300 text-indigo-700"
										: "bg-white border-gray-300 text-gray-600"
								}`}
								aria-hidden="true"
							>
								{i + 1}
							</span>
							<span className="whitespace-nowrap">{s.label}</span>
						</button>
					);
				})}
			</div>

			{/* subtle track under the pills */}
			<div className="mx-1 mt-2 h-1 rounded-full bg-slate-200 relative overflow-hidden">
				<div
					className="absolute left-0 top-0 h-full bg-sky-400"
					style={{
						width: `${Math.round(
							((steps.filter((s) => s.completed).length || 0) / steps.length) *
								100
						)}%`,
					}}
					aria-hidden="true"
				/>
			</div>
		</nav>
	);
}
