import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { TOC_ANIM } from "../../constants/content.js";
import { NODE_RADIUS, CARD_GAP_Y } from "../../constants/content.js";
import { hslToHex } from "../../utils/color.js";

/**
 * One node + its card.
 * Pure presentational; all calculations are passed in from parent.
 */
export default function TocItem({
	i,
	item,
	pos,
	isVisited,
	isActivities,
	nodeOffsetX = 0,
	nodeOffsetY = 0,
	cardLeft,
	cardTop,
	cardWidth,
	nodeColorHue,
	onClick,
}) {
	const hue = nodeColorHue ?? item.hue ?? 210;
	const nodeHex = hslToHex(hue, 64, 55);

	return (
		<li className="absolute" style={{ left: 0, top: 0 }}>
			{/* Node */}
			<motion.button
				id={`toc-node-${i}`}
				type="button"
				onClick={onClick}
				className="outline-none pointer-events-auto rounded-full focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
				style={{
					position: "absolute",
					left: pos.x + nodeOffsetX,
					top: pos.y + nodeOffsetY,
					transform: "translate(-50%, -50%)",
					WebkitTapHighlightColor: "transparent",
					["--node-color"]: nodeHex,
				}}
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				whileHover={{ scale: 1.06 }}
				whileTap={{ scale: 0.96 }}
				transition={{
					delay: TOC_ANIM.nodeDelay0 + i * TOC_ANIM.nodeStagger,
					type: "spring",
					stiffness: 230,
					damping: 26,
				}}
				aria-label={
					isActivities
						? item.ariaActivities
						: `${item.label}${isVisited ? " (visited)" : ""}`
				}
			>
				<motion.div
					className="backdrop-blur-md flex items-center justify-center no-backdrop-glass border-2 rounded-full relative"
					style={{
						width: 52,
						height: 52,
						borderColor: "var(--node-color)",
						background: isVisited
							? `hsla(${hue}, 70%, 92%, 0.95)`
							: `hsla(${hue}, 70%, 97%, 0.85)`,
						boxShadow: isVisited
							? "0 10px 26px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.75)"
							: "0 8px 24px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
						filter: isVisited ? "grayscale(0.1)" : "none",
					}}
					whileHover={{
						boxShadow:
							"0 12px 30px rgba(15,23,42,0.24), inset 0 1px 0 rgba(255,255,255,0.8)",
					}}
				>
					<FontAwesomeIcon
						icon={item.icon}
						className="text-lg"
						style={{ color: "var(--node-color)", opacity: isVisited ? 0.9 : 1 }}
						aria-hidden
					/>
					{!isActivities && isVisited && (
						<span
							className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full grid place-items-center text-white"
							style={{
								backgroundColor: "#10B981",
								boxShadow: "0 2px 6px rgba(16,185,129,0.45)",
							}}
							aria-hidden
						>
							<FontAwesomeIcon icon={faCircleCheck} className="text-[11px]" />
						</span>
					)}
				</motion.div>
			</motion.button>

			{/* Card */}
			<motion.button
				id={`toc-card-${i}`}
				type="button"
				onClick={onClick}
				tabIndex={-1}
				aria-hidden="true"
				className="pointer-events-auto absolute text-left origin-top outline-none rounded-2xl focus-visible:ring-4 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80"
				style={{
					left: cardLeft,
					top: cardTop,
					transform: `translate(-50%, 0)`,
					WebkitTapHighlightColor: "transparent",
					["--node-color"]: nodeHex,
					width: "max-content",
					maxWidth: "calc(100vw - 48px)",
				}}
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0 }}
				whileHover={{ y: -2, scale: 1.02 }}
				whileTap={{ scale: 0.99 }}
				transition={{
					delay: TOC_ANIM.cardDelay0 + i * TOC_ANIM.cardStagger,
					duration: 0.55,
					ease: "easeOut",
				}}
			>
				<div
					className="rounded-2xl border backdrop-blur transition-shadow no-backdrop-glass"
					style={{
						background: isVisited
							? "rgba(241,245,249,0.95)"
							: "rgba(255,255,255,0.92)",
						borderColor: isVisited
							? "rgba(148,163,184,0.6)"
							: "rgba(203,213,225,0.8)",
						boxShadow: isVisited
							? "0 12px 36px rgba(2,6,23,0.16)"
							: "0 10px 30px rgba(2,6,23,0.12)",
					}}
				>
					<div className="px-4 py-3 hover:shadow-[0_14px_40px_rgba(2,6,23,0.16)]">
						<div className="inline-flex items-center gap-2 whitespace-nowrap">
							<span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--node-color)]" />
							<span
								className={`text-sm font-semibold ${
									isVisited ? "text-slate-700" : "text-slate-900"
								}`}
							>
								{item.label}
							</span>
							{isActivities ? (
								<span
									className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-700"
									style={{
										backgroundColor: "rgba(16,185,129,0.12)",
										border: "1px solid rgba(16,185,129,0.25)",
									}}
									aria-hidden
								>
									{item.activitiesVisitedCount}/{item.activitiesTotal}
								</span>
							) : (
								isVisited && (
									<span
										className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-700"
										style={{
											backgroundColor: "rgba(16,185,129,0.12)",
											border: "1px solid rgba(16,185,129,0.25)",
										}}
										aria-hidden
									>
										<FontAwesomeIcon
											icon={faCircleCheck}
											className="text-[10px]"
										/>
										Visited
									</span>
								)
							)}
						</div>
					</div>
				</div>
			</motion.button>
		</li>
	);
}
