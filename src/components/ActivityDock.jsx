import React, { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ActivityDock({
	steps = [],
	currentPageIndex = 0,
	onJump,
	initialPosition = { x: null, y: null },
	storageKey = "dock_pos_v1",
	snapToEdge = true,
	onPositionChange,
	debug = false,
	/** Max width of your main centered content; used to keep the panel out of it. */
	contentMaxWidth = 1200, // tweak if your page is 5xl/6xl/7xl etc.
}) {
	const [open, setOpen] = useState(false);

	// --- position state (draggable pill) ---------------------------------------
	const readStore = () => {
		if (!storageKey) return null;
		try {
			const raw = localStorage.getItem(storageKey);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	};
	const stored = readStore();
	const defaultX =
		typeof initialPosition.x === "number" ? initialPosition.x : null;
	const defaultY =
		typeof initialPosition.y === "number" ? initialPosition.y : null;

	const [pos, setPos] = useState(() => {
		const m = 16,
			vw = window.innerWidth || 1280,
			vh = window.innerHeight || 800;
		return (
			stored ?? { x: defaultX ?? vw - 260 - m, y: defaultY ?? vh - 120 - m }
		);
	});

	useEffect(() => {
		const id = requestAnimationFrame(() => {
			onPositionChange?.(pos);
			if (debug) console.log("[ActivityDock] pos:", pos);
		});
		return () => cancelAnimationFrame(id);
	}, [pos, onPositionChange, debug]);

	const dockRef = useRef(null);
	const dragging = useRef(false);
	const dragOffset = useRef({ x: 0, y: 0 });

	useEffect(() => {
		if (!storageKey) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify(pos));
		} catch {}
	}, [pos, storageKey]);

	const clampIntoViewport = (x, y) => {
		const m = 8,
			vw = window.innerWidth,
			vh = window.innerHeight;
		const r = dockRef.current?.getBoundingClientRect();
		const w = r?.width ?? 220,
			h = r?.height ?? 48;
		return {
			x: Math.min(Math.max(x, m), Math.max(m, vw - w - m)),
			y: Math.min(Math.max(y, m), Math.max(m, vh - h - m)),
		};
	};

	useEffect(() => {
		const onResize = () => setPos((p) => clampIntoViewport(p.x, p.y));
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		const onMove = (e) => {
			if (!dragging.current) return;
			const pt = "touches" in e ? e.touches[0] : e;
			setPos(
				clampIntoViewport(
					pt.clientX - dragOffset.current.x,
					pt.clientY - dragOffset.current.y
				)
			);
			e.preventDefault();
		};
		const onUp = (e) => {
			if (!dragging.current) return;
			dragging.current = false;

			let { x, y } = pos;
			if (snapToEdge) {
				const vw = window.innerWidth,
					vh = window.innerHeight;
				const r = dockRef.current?.getBoundingClientRect();
				const w = r?.width ?? 220,
					h = r?.height ?? 48;
				const d = {
					left: x,
					right: vw - (x + w),
					top: y,
					bottom: vh - (y + h),
				};
				const min = Math.min(d.left, d.right, d.top, d.bottom);
				if (min === d.left) x = 8;
				else if (min === d.right) x = vw - w - 8;
				else if (min === d.top) y = 8;
				else y = vh - h - 8;
			}
			const final = clampIntoViewport(x, y);
			setPos(final);
			if (debug) console.log("[ActivityDock] dropped at:", final);
			document.body.style.userSelect = "";
			e.preventDefault();
		};

		window.addEventListener("pointermove", onMove, { passive: false });
		window.addEventListener("pointerup", onUp, { passive: false });
		window.addEventListener("touchmove", onMove, { passive: false });
		window.addEventListener("touchend", onUp, { passive: false });
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onUp);
		};
	}, [pos, snapToEdge, debug]);

	const startDrag = (e) => {
		const r = dockRef.current?.getBoundingClientRect();
		const pt = "touches" in e ? e.touches[0] : e;
		dragOffset.current = {
			x: pt.clientX - (r?.left ?? 0),
			y: pt.clientY - (r?.top ?? 0),
		};
		dragging.current = true;
		document.body.style.userSelect = "none";
	};

	// click outside to close, Esc to close
	const containerRef = useRef(null);
	useEffect(() => {
		const onDocClick = (ev) => {
			if (
				open &&
				containerRef.current &&
				!containerRef.current.contains(ev.target)
			)
				setOpen(false);
		};
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, [open]);

	const activeIdx = useMemo(
		() => steps.findIndex((s) => s.index === currentPageIndex),
		[steps, currentPageIndex]
	);
	useEffect(() => {
		const onKey = (e) => {
			if (open && e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	if (!steps.length) return null;

	const completedCount = steps.filter((s) => s.completed).length;
	const pct = steps.length
		? Math.round((completedCount / steps.length) * 100)
		: 0;

	// --- RIGHT-RAIL SHEET PLACEMENT (no overlap with centered content) ---------
	// We measure the panel after render to compute a left that stays OUTSIDE
	// the centered content’s right edge.
	const panelRef = useRef(null);
	const [panelW, setPanelW] = useState(420); // estimate until measured
	useEffect(() => {
		if (!open) return;
		const r = panelRef.current?.getBoundingClientRect();
		if (r?.width) setPanelW(r.width);
	}, [open]);

	const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
	const gutterStart = Math.max(
		8,
		(vw - contentMaxWidth) / 2 + contentMaxWidth + 50
	); // right edge of content + margin
	const leftForRail = Math.min(
		Math.max(gutterStart, 8),
		Math.max(8, vw - panelW - 8)
	);

	// vertical: try to align near the pill, but keep on-screen
	const topForRail = Math.min(
		Math.max(16, pos.y), // not above the viewport
		Math.max(16, (window.innerHeight || 800) - 16 - 480) // keep some room (panel will scroll)
	);

	return createPortal(
		<>
			{/* Draggable pill */}
			<div
				ref={dockRef}
				className="fixed z-[9999] pointer-events-auto"
				style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
			>
				<div ref={containerRef} className="select-none">
					<button
						type="button"
						onPointerDown={startDrag}
						onTouchStart={startDrag}
						onClick={() => setOpen((v) => !v)}
						aria-expanded={open}
						title={`${pct}% of activities complete (drag me)`}
						className="group inline-flex items-center gap-3  rounded-full bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border border-slate-200 shadow-md px-3 py-2 hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-grab active:cursor-grabbing"
					>
						<span
							aria-hidden="true"
							className="relative grid place-items-center w-9 h-9 rounded-full"
							style={{
								background: `conic-gradient(#38bdf8 ${
									pct * 3.6
								}deg, #e2e8f0 0)`,
							}}
						>
							<span className="absolute inset-[3px] rounded-full bg-white shadow-inner" />
							<span className="relative text-xs font-semibold text-slate-700">
								{completedCount}/{steps.length}
							</span>
						</span>
						<span className="text-sm font-medium text-slate-800">
							Activities
						</span>
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

					{debug && (
						<span className="ml-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white">
							{Math.round(pos.x)},{Math.round(pos.y)}
						</span>
					)}
				</div>
			</div>

			{/* Right-rail sheet (never overlaps the centered content) */}
			<div
				aria-hidden={!open}
				className={`fixed z-[9998] ${
					open
						? "opacity-100 translate-y-0 scale-100"
						: "opacity-0 translate-y-1 scale-[0.99] pointer-events-none"
				} transition-all duration-200 ease-out`}
				style={{
					left: `${leftForRail}px`,
					top: `${topForRail}px`,
					maxHeight: "calc(100vh - 32px)",
				}}
			>
				<div
					ref={panelRef}
					className="rounded-2xl border border-slate-200 bg-white/95 supports-[backdrop-filter]:bg-white/75 backdrop-blur shadow-xl p-3 origin-top w-[min(92vw,960px)] max-w-[280px] overflow-auto mt-15"
				>
					<nav aria-label="Activities">
						<div className="grid gap-2 sm:grid-cols-1 ">
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
										className={`${base} ${state} text-left w-full justify-start`}
										aria-current={isActive ? "step" : undefined}
										title={s.label}
										style={{
											animation: open
												? `fadeInUp .25s ease both ${i * 25}ms`
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
        @keyframes fadeInUp { from { opacity:0; transform: translateY(4px);} to { opacity:1; transform: translateY(0);} }
      `}</style>
		</>,
		document.body
	);
}
