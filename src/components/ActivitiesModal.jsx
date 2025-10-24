// src/components/ActivitiesModal.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	return /^#([0-9a-f]{6})$/i.test(s) ? s.toUpperCase() : null;
};

function FocusTrap({ active, children }) {
	const trapRef = useRef(null);
	useEffect(() => {
		if (!active || !trapRef.current) return;
		const el = trapRef.current;
		const selectors =
			'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
		const getNodes = () =>
			Array.from(el.querySelectorAll(selectors)).filter(
				(n) => !n.hasAttribute("disabled")
			);
		const firstFocus = () => {
			const nodes = getNodes();
			if (nodes[0]) nodes[0].focus();
		};
		firstFocus();

		const onKeydown = (e) => {
			if (e.key !== "Tab") return;
			const nodes = getNodes();
			if (!nodes.length) return;
			const first = nodes[0];
			const last = nodes[nodes.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		el.addEventListener("keydown", onKeydown);
		return () => el.removeEventListener("keydown", onKeydown);
	}, [active]);

	return <div ref={trapRef}>{children}</div>;
}

function ModalContent({
	open,
	onClose,
	steps,
	currentPageIndex,
	onJump,
	title,
	accentHex,
}) {
	const backdropRef = useRef(null);

	useEffect(() => {
		if (!open) return;
		const onEsc = (e) => {
			if (e.key === "Escape") onClose?.();
		};
		document.addEventListener("keydown", onEsc);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onEsc);
			document.body.style.overflow = prevOverflow;
		};
	}, [open, onClose]);

	const handleBackdropClick = (e) => {
		if (e.target === backdropRef.current) onClose?.();
	};

	return (
		<div
			ref={backdropRef}
			id="activities-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="activities-modal-title"
			className={`fixed inset-0 z-[100] pointer-events-auto ${
				open ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			style={{
				transition: "opacity 160ms ease-out",
				backgroundColor: open
					? "rgba(15, 23, 42, 0.45)"
					: "rgba(15, 23, 42, 0)",
			}}
			onMouseDown={handleBackdropClick}
		>
			<div className="min-h-full flex items-center justify-center p-2 sm:p-4">
				<FocusTrap active={open}>
					<div
						className={`w-full max-w-md sm:max-w-lg max-h-[calc(100vh-32px)] overflow-auto
            bg-white rounded-2xl shadow-2xl border border-slate-200 transform transition ${
							open
								? "translate-y-0 scale-100"
								: "translate-y-2 sm:translate-y-0 sm:scale-95"
						}`}
						style={{ transitionDuration: "180ms" }}
						onMouseDown={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-200">
							<h2
								id="activities-modal-title"
								className="text-base sm:text-lg font-semibold text-slate-900"
							>
								{title}
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 hover:shadow-sm focus:outline-none"
								style={{ boxShadow: `0 0 0 0 transparent` }}
								onFocus={(e) =>
									(e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}`)
								}
								onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
								aria-label="Close modal"
							>
								<svg
									className="w-4 h-4"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>

						{/* Body: vertical list */}
						<div className="px-2 sm:px-3 py-2">
							<nav aria-label="Activities list" className="space-y-2">
								{steps.map((s, i) => {
									const isActive = s.index === currentPageIndex;
									const a = normalizeHex(s._accent || s.accent) || accentHex;
									const bg = isActive ? `${a}22` : `${a}18`;
									const border = `${a}44`;
									return (
										<button
											key={s.key ?? i}
											type="button"
											onClick={() => {
												onJump?.(s.index);
												onClose?.();
											}}
											className={`w-full text-left rounded-xl px-3.5 py-3 transition focus:outline-none hover:shadow-sm ${
												isActive ? "font-semibold" : "font-medium"
											}`}
											style={{
												backgroundColor: bg,
												border: `1px solid ${border}`,
												color: "#0F172A",
												boxShadow: "0 0 0 0 transparent",
											}}
											onFocus={(e) =>
												(e.currentTarget.style.boxShadow = `0 0 0 2px ${a}`)
											}
											onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
											title={s.label}
										>
											<div className="flex items-center gap-2">
												<span className="inline-grid place-items-center w-6 h-6 rounded-full bg-white border text-[11px] font-semibold">
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
												<span className="truncate">{s.label}</span>
											</div>
										</button>
									);
								})}
							</nav>
						</div>

						{/* Footer */}
						<div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-slate-200">
							<button
								type="button"
								onClick={onClose}
								className="w-full inline-flex items-center justify-center h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none"
								style={{ boxShadow: `0 0 0 0 transparent` }}
								onFocus={(e) =>
									(e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}`)
								}
								onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
							>
								Close
							</button>
						</div>
					</div>
				</FocusTrap>
			</div>
		</div>
	);
}

export default function ActivitiesModal(props) {
	const accentHex = normalizeHex(props.accent) || "#67AAF9";
	// Render outside of Header to avoid pointer-events:none on ancestors
	return createPortal(
		<ModalContent {...props} accentHex={accentHex} />,
		document.body
	);
}
