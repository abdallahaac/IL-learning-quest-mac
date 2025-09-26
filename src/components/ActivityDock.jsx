import React, {
	useMemo,
	useState,
	useRef,
	useLayoutEffect,
	useEffect,
} from "react";

/**
 * Inline Activities pill for the HEADER.
 * - Renders the pill inline (no fixed/portal).
 * - Opens a right-rail sheet that DOES NOT cover the centered content.
 */
export default function ActivityDock({
	steps = [],
	currentPageIndex = 0,
	onJump,
	contentMaxWidth = 1200, // keep panel outside centered content
}) {
	const [open, setOpen] = useState(false);
	const btnRef = useRef(null);

	if (!steps.length) return null;

	const activeIdx = useMemo(
		() => steps.findIndex((s) => s.index === currentPageIndex),
		[steps, currentPageIndex]
	);
	const completedCount = steps.filter((s) => s.completed).length;
	const pct = Math.round((completedCount / steps.length) * 100);

	// compute right-rail left/top so it never overlaps centered content
	const [panelLeft, setPanelLeft] = useState(0);
	const [panelTop, setPanelTop] = useState(0);

	// Measure before paint to avoid initial left->right slide
	const measurePosition = () => {
		const vw = window.innerWidth;
		const btnRect = btnRef.current?.getBoundingClientRect();
		const leftStart = Math.max(
			8,
			(vw - contentMaxWidth) / 2 + contentMaxWidth + 24
		);
		const computedLeft = Math.min(leftStart, Math.max(8, vw - 320 - 8));
		const computedTop = (btnRect?.bottom ?? 80) + 8;
		setPanelLeft(computedLeft);
		setPanelTop(computedTop);
	};

	useLayoutEffect(() => {
		if (!open) return;
		measurePosition();
		// Also re-measure on font load/layout shifts (optional but safe)
		// You can trigger measurePosition after a requestAnimationFrame if needed:
		// requestAnimationFrame(measurePosition);
	}, [open, contentMaxWidth]);

	// Keep aligned on resize/scroll while open
	useEffect(() => {
		if (!open) return;
		const onResize = () => measurePosition();
		const onScroll = () => measurePosition();
		window.addEventListener("resize", onResize);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("scroll", onScroll);
		};
	}, [open]);

	const positioned = panelLeft !== 0 || panelTop !== 0;

	return (
		<>
			{/* INLINE pill (lives inside header block) */}
			<button
				ref={btnRef}
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className="
          inline-flex items-center gap-3 rounded-full
          bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur
          border border-slate-200 shadow-sm px-3 py-2
          hover:shadow-lg transition
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
        "
				title={`${pct}% complete`}
			>
				<span
					aria-hidden="true"
					className="relative grid place-items-center w-9 h-9 rounded-full"
					style={{
						background: `conic-gradient(#38bdf8 ${pct * 3.6}deg, #e2e8f0 0)`,
					}}
				>
					<span className="absolute inset-[3px] rounded-full bg-white shadow-inner" />
					<span className="relative text-xs font-semibold text-slate-700">
						{completedCount}/{steps.length}
					</span>
				</span>
				<span className="text-sm font-medium text-slate-800">Activities</span>
				<svg
					className={`w-4 h-4 text-slate-500 transition-transform ${
						open ? "rotate-180" : ""
					}`}
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
				</svg>
			</button>

			{/* Right-rail panel (positioned with inline styles) */}
			<div
				aria-hidden={!open}
				className={`fixed z-[80] ${
					open
						? "opacity-100 translate-y-0 scale-100"
						: "opacity-0 translate-y-1 scale-[0.99] pointer-events-none"
				} duration-200 ease-out`} // ← no transition-all
				style={{
					left: panelLeft,
					top: panelTop,
					maxHeight: "calc(100vh - 32px)",
					transitionProperty: "opacity, transform", // ← only animate opacity/transform
					visibility: positioned ? "visible" : "hidden", // hide until measured
				}}
			>
				<div className="rounded-2xl border border-slate-200 bg-white/95 supports-[backdrop-filter]:bg-white/75 backdrop-blur shadow-xl p-3 origin-top w-[min(92vw,960px)] max-w-[300px] overflow-auto">
					<nav aria-label="Activities">
						<div className="grid gap-2 sm:grid-cols-1">
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
										type="button"
										onClick={() => {
											onJump?.(s.index);
											setOpen(false);
										}}
										className={`${base} ${state} w-full justify-start`}
										aria-current={isActive ? "step" : undefined}
										title={s.label}
										style={{
											animation: open
												? `fadeInUp .22s ease both ${i * 20}ms`
												: "none",
										}}
									>
										<span
											className={`grid place-items-center w-6 h-6 rounded-full text-xs font-semibold border bg-white
                        ${
													isActive
														? "border-sky-300 text-sky-700"
														: done
														? "border-emerald-300 text-emerald-700"
														: seen
														? "border-indigo-300 text-indigo-700"
														: "border-gray-300 text-gray-600"
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
					</nav>
				</div>
			</div>

			<style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(4px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
		</>
	);
}
