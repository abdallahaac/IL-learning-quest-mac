import React, { useMemo, useRef, useState, useEffect } from "react";

const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};

// tiny helpers
const hexToRgb = (hex) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
};
const rgbToHex = ({ r, g, b }) =>
	`#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const blendOverWhite = (hex, a) => {
	const { r, g, b } = hexToRgb(hex);
	const R = Math.round(255 * (1 - a) + r * a);
	const G = Math.round(255 * (1 - a) + g * a);
	const B = Math.round(255 * (1 - a) + b * a);
	return rgbToHex({ r: R, g: G, b: B });
};

// responsive, accessible chip bar for md-only
function MidrangeChipBar({
	steps,
	currentPageIndex,
	onJump,
	accent = "#67AAF9",
}) {
	const listRef = useRef(null);
	const items = steps ?? [];

	// keyboard nav: Left/Right/Home/End
	useEffect(() => {
		const el = listRef.current;
		if (!el) return;
		const onKey = (e) => {
			const focusables = Array.from(el.querySelectorAll('button[role="tab"]'));
			if (!focusables.length) return;
			const i = focusables.indexOf(document.activeElement);
			const move = (idx) => {
				const next = focusables[idx];
				if (next) next.focus();
			};
			switch (e.key) {
				case "ArrowRight":
					e.preventDefault();
					move(Math.min(i + 1, focusables.length - 1));
					break;
				case "ArrowLeft":
					e.preventDefault();
					move(Math.max(i - 1, 0));
					break;
				case "Home":
					e.preventDefault();
					move(0);
					break;
				case "End":
					e.preventDefault();
					move(focusables.length - 1);
					break;
				default:
			}
		};
		el.addEventListener("keydown", onKey);
		return () => el.removeEventListener("keydown", onKey);
	}, []);

	return (
		<div className="md:block lg:hidden w-full">
			<div
				ref={listRef}
				role="tablist"
				aria-label="Activities"
				className="flex gap-2 overflow-x-auto no-scrollbar py-2"
			>
				{items.map((s, i) => {
					const isActive = s.index === currentPageIndex;
					const a = normalizeHex(s.accent) || accent;
					const bg = isActive
						? blendOverWhite(a, 0.22)
						: blendOverWhite(a, 0.12);
					const border = blendOverWhite(a, isActive ? 0.3 : 0.2);
					return (
						<button
							key={s.key ?? i}
							role="tab"
							aria-selected={isActive}
							tabIndex={isActive ? 0 : -1}
							onClick={() => onJump?.(s.index)}
							className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm focus:outline-none hover:shadow-sm ${
								isActive ? "font-semibold" : "font-medium"
							}`}
							style={{
								backgroundColor: bg,
								border: `1px solid ${border}`,
								color: "#0F172A",
							}}
							onFocus={(e) =>
								(e.currentTarget.style.boxShadow = `0 0 0 2px ${a}`)
							}
							onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
							title={s.label}
						>
							<span className="inline-grid place-items-center w-5 h-5 rounded-full bg-white border text-[11px] font-semibold">
								{s.completed ? (
									<svg
										className="w-3.5 h-3.5 text-emerald-600"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.3 6.23-2.29-2.27a1 1 0 10-1.42 1.41l3 2.98a1 1 0 001.407-.003l7.01-6.93z" />
									</svg>
								) : (
									<span>{i + 1}</span>
								)}
							</span>
							<span className="truncate max-w-[14ch] sm:max-w-[18ch]">
								{s.label}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/**
 * AdaptiveActivityDock
 * - sm: use a button you control in Header to open ActivitiesModal (you already have it)
 * - md: show MidrangeChipBar (compact, scrollable, inside header)
 * - lg+: show your original full ActivityDock row (you’ll render that separately)
 */
export default function AdaptiveActivityDock({
	steps = [],
	currentPageIndex = 0,
	onJump,
	accent = "#67AAF9",
}) {
	// nothing to do if there are no steps
	if (!steps?.length) return null;

	// md-only chip bar; sm is handled by the modal button in Header; lg+ handled by full dock
	return (
		<MidrangeChipBar
			steps={steps}
			currentPageIndex={currentPageIndex}
			onJump={onJump}
			accent={accent}
		/>
	);
}
