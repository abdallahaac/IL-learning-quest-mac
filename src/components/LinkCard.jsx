// src/components/LinkCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { withAlpha } from "../utils/recipeUtils.js";

/**
 * LinkCard
 * Props:
 *  - link: { label, url }           // for regular link cards (optional)
 *  - accent: hex color string
 *  - Icon: React component for the badge icon (optional)
 *  - enOnlySuffix: string to append (optional)
 *  - variants: framer-motion variants (optional)
 *  - openLinkLabel: override string for the footer label (optional)
 *  - showAdvocates: boolean -> render advocates card (not a link)
 *  - advocates: array of strings OR objects { name, bio }
 *  - advocatesBios: optional map { [name]: bio } to override
 *  - noMaxWidth: boolean -> remove `max-w-md` from the card classes
 *  - cardWidth / cardHeight / cardMinWidth / cardMinHeight / cardMaxWidth / cardMaxHeight
 */
export default function LinkCard({
	link = {},
	accent = "#047857",
	Icon = null,
	enOnlySuffix = "",
	variants = undefined,
	openLinkLabel,
	showAdvocates = false,
	advocates = [],
	advocatesBios = {},
	noMaxWidth = false,
	// sizing props (strings with units, e.g. "220px" or "12rem")
	cardWidth,
	cardHeight,
	cardMinWidth,
	cardMinHeight,
	cardMaxWidth,
	cardMaxHeight,
}) {
	function detectLang() {
		try {
			const qs = new URLSearchParams(window.location.search);
			if (qs.get("lang")) return qs.get("lang").toLowerCase().slice(0, 2);
			const html = document.documentElement?.getAttribute("lang");
			if (html) return html.toLowerCase().slice(0, 2);
			const nav = navigator?.language || navigator?.languages?.[0];
			if (nav) return nav.toLowerCase().slice(0, 2);
		} catch (e) {}
		return "en";
	}
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const defaultOpenLabel = lang === "fr" ? "Ouvrir le lien" : "Open link";
	const footerLabel =
		typeof openLinkLabel === "string" && openLinkLabel.trim()
			? openLinkLabel
			: defaultOpenLabel;

	// when showAdvocates === true we want no card-level hover transform/scale or pointer
	const hoverAndCursor = showAdvocates
		? ""
		: " hover:shadow-md hover:-translate-y-0.5 cursor-pointer";

	// base width classes: conditional max-w-md removal via `noMaxWidth`
	const baseWidthClasses = noMaxWidth ? "w-full" : "max-w-md w-full";

	// main card classes; h-full so cards match heights in grid
	const linkCardBase =
		`group block ${baseWidthClasses} rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition transform h-full ` +
		`${hoverAndCursor} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col justify-between`;

	// badge base used for spacing & visual identity (40px)
	const BADGE_SIZE_PX = 40;
	const badgeBase =
		"flex-none shrink-0 w-10 h-10 min-w-[40px] min-h-[40px] aspect-square rounded-xl grid place-items-center";

	const linkFooterBase =
		"mt-3 flex items-center justify-center gap-1 text-sm font-medium";

	let suffixText = "";
	if (lang === "fr" && enOnlySuffix) suffixText = enOnlySuffix;

	const isAnchor = Boolean(link && link.url) && !showAdvocates;
	const Wrapper = isAnchor ? motion.a : motion.div;
	const wrapperProps = isAnchor
		? { href: link.url, target: "_blank", rel: "noreferrer" }
		: {};

	const normalizeAdvocates = (arr = []) =>
		arr
			.map((it) => {
				if (!it) return null;
				if (typeof it === "string") {
					const parts = it.split("—").map((s) => s.trim());
					return {
						name: parts[0],
						bio: parts.slice(1).join(" — ").trim() || "",
					};
				}
				return { name: it.name || it.label || String(it), bio: it.bio || "" };
			})
			.filter(Boolean);

	// limit to 6 to preserve 3-per-row × up to 2 rows layout
	const advocatesList = normalizeAdvocates(advocates).slice(0, 6);
	const mergedBios = { ...advocatesBios };

	const [openIdx, setOpenIdx] = useState(-1);
	const [hoverIdx, setHoverIdx] = useState(-1);

	const popVariants = {
		initial: { opacity: 0, scale: 0.98, y: -4 },
		animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16 } },
		exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12 } },
	};

	// inline style overrides for sizing (if provided). Also force default cursor for advocates.
	const inlineStyle = {
		outlineColor: accent,
		borderColor: withAlpha(accent, "22"),
		...(cardMinWidth ? { minWidth: cardMinWidth } : {}),
		...(cardMinHeight ? { minHeight: cardMinHeight } : {}),
		...(cardMaxWidth ? { maxWidth: cardMaxWidth } : {}),
		...(cardMaxHeight ? { maxHeight: cardMaxHeight } : {}),
		...(cardWidth ? { width: cardWidth } : {}),
		...(cardHeight ? { height: cardHeight } : {}),
		...(showAdvocates ? { cursor: "default" } : {}),
	};

	// helper styles used inline to avoid tailwind plugin dependencies for line-clamp
	const twoLineClampStyle = {
		display: "-webkit-box",
		WebkitLineClamp: 2,
		WebkitBoxOrient: "vertical",
		overflow: "hidden",
	};

	return (
		<Wrapper
			{...wrapperProps}
			className={linkCardBase}
			style={inlineStyle}
			title={
				link?.label ||
				(showAdvocates
					? lang === "fr"
						? "Personnes à découvrir"
						: "Advocates"
					: "")
			}
			aria-label={
				link?.label ||
				(showAdvocates
					? lang === "fr"
						? "Personnes à découvrir"
						: "Advocates"
					: "")
			}
			variants={variants}
		>
			{/* TOP: icon + text always vertically aligned */}
			<div className="relative flex-1 flex items-center justify-center">
				<div className="flex items-center justify-center w-full gap-3 px-2">
					{Icon ? (
						<div
							className={badgeBase}
							style={{
								backgroundColor: withAlpha(accent, "1A"),
								color: accent,
							}}
						>
							<Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
						</div>
					) : null}

					<div className="flex-1 min-w-0 text-center">
						{showAdvocates ? (
							<>
								<div
									className="font-medium text-slate-900"
									style={twoLineClampStyle}
								>
									{lang === "fr"
										? "Personnes à découvrir"
										: "Advocates to explore"}
								</div>
								<div
									className="text-sm text-slate-600 mt-1"
									style={{ whiteSpace: "pre-wrap" }}
								>
									{lang === "fr"
										? "Cliquez sur un nom et explorez plus en profondeur par vous-même."
										: "Click on a name and take a deeper dive on your own."}
								</div>
							</>
						) : (
							<div
								className="min-w-0 text-center font-medium"
								style={twoLineClampStyle}
							>
								<span className="group-hover:underline inline-block">
									{link.label}
								</span>
								{suffixText && (
									<span
										className="ml-1 no-underline inline-block"
										style={{ color: accent }}
									>
										{suffixText}
									</span>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* MIDDLE: advocates grid */}
			{showAdvocates && advocatesList.length > 0 ? (
				<div className="mt-3">
					<ul
						className="grid grid-cols-2 sm:grid-cols-3 gap-2"
						aria-label="advocates list"
					>
						{advocatesList.map((a, i) => {
							const isOpen = openIdx === i;
							const isHover = hoverIdx === i;
							const name = a.name || `Advocate ${i + 1}`;
							const bio = mergedBios[name] || a.bio || "No details available.";

							const bgColor =
								isOpen || isHover ? withAlpha(accent, "0F") : "#fff";
							const borderColor = withAlpha(accent, isOpen ? "66" : "33");

							return (
								<li key={name + i} className="relative">
									<button
										type="button"
										onClick={() => setOpenIdx(isOpen ? -1 : i)}
										onMouseEnter={() => setHoverIdx(i)}
										onMouseLeave={() => setHoverIdx(-1)}
										className="relative w-full h-12 flex items-center justify-center rounded-full border px-4 text-sm shadow-sm transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
										style={{
											borderColor,
											backgroundColor: bgColor,
											color: "#0f172a",
											outlineColor: accent,
											textAlign: "center",
										}}
										aria-expanded={isOpen}
										aria-controls={`adv-pop-${i}`}
									>
										<span
											className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
											style={{ backgroundColor: accent }}
											aria-hidden="true"
										/>
										<span
											className="min-w-0 block px-4 text-center"
											style={{ ...twoLineClampStyle, lineHeight: "1.1rem" }}
										>
											{name}
										</span>
									</button>

									<AnimatePresence>
										{isOpen && (
											<motion.div
												id={`adv-pop-${i}`}
												role="dialog"
												aria-label={`${name} quick info`}
												className="absolute z-10 mt-2 w-72 rounded-2xl border bg-white p-3 text-sm shadow-lg"
												style={{
													borderColor: withAlpha(accent, "33"),
													transform: "translateX(-50%)",
												}}
												variants={popVariants}
												initial="initial"
												animate="animate"
												exit="exit"
											>
												<div className="flex items-start gap-2">
													<div
														className="mt-0.5 h-2 w-2 rounded-full shrink-0"
														style={{ backgroundColor: accent }}
														aria-hidden="true"
													/>
													<div className="min-w-0">
														<div className="font-medium text-slate-900">
															{name}
														</div>
														<p className="text-slate-700 mt-0.5">{bio}</p>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</li>
							);
						})}
					</ul>
				</div>
			) : null}

			{/* FOOTER: centered across the card */}
			<div className="mt-3" aria-hidden={!isAnchor} style={{ color: accent }}>
				{!showAdvocates ? (
					<div className={linkFooterBase}>
						<ExternalLink
							className="inline-block w-4 h-4 mr-2 align-middle"
							aria-hidden="true"
						/>
						<span>{footerLabel}</span>
					</div>
				) : null}
			</div>
		</Wrapper>
	);
}
