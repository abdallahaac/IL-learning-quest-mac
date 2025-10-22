// src/pages/ResourcesPage.jsx
import React, {
	useEffect,
	useMemo,
	useState,
	useCallback,
	useRef,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPrint,
	faFileArrowDown,
	faArrowUpRightFromSquare,
	faLink,
	faStar as faStarSolid,
	faCircleCheck,
	faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import {
	RESOURCES_CONTENT,
	RESOURCES_CONTENT_FR,
} from "../constants/content.js";

/* #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

// detect doc lang (fall back to navigator or en)
const detectLang = () => {
	if (typeof document !== "undefined" && document.documentElement?.lang) {
		return document.documentElement.lang;
	}
	if (typeof navigator !== "undefined" && navigator.language) {
		return navigator.language;
	}
	return "en";
};

// detect/strip “(en anglais)” markers in labels/titles so we can render a styled suffix
const hasEnglishMarker = (s = "") =>
	/\(en anglais(?: seulement)?\)/i.test(String(s));

const stripEnglishMarker = (s = "") =>
	String(s)
		.replace(/\s*\(en anglais(?: seulement)?\)\s*/gi, "")
		.trim();

export default function ResourcesPage() {
	const reduceMotion = useReducedMotion();

	// pick content based on page lang
	const docLang = (detectLang() || "en").toLowerCase();
	const content = docLang.startsWith("fr")
		? RESOURCES_CONTENT_FR
		: RESOURCES_CONTENT;

	const PAGE_TITLE = content.title || content.ui?.pageTitle || "Resources";

	// Theme / tokens
	const accent = "#10B981"; // emerald-500
	const brandDark = "#064E3B";
	const iconSize = 18;

	// Data from content
	const SECTIONS = Array.isArray(content.sections) ? content.sections : [];

	// Persisted states
	const [favorites, setFavorites] = useState(() => {
		try {
			return new Set(JSON.parse(localStorage.getItem("resources_fav") || "[]"));
		} catch {
			return new Set();
		}
	});
	const [readMap, setReadMap] = useState(() => {
		try {
			return new Map(
				Object.entries(
					JSON.parse(localStorage.getItem("resources_read") || "{}")
				)
			);
		} catch {
			return new Map();
		}
	});

	// UI state
	const [openCardKey, setOpenCardKey] = useState(null);
	const [typeFilter, setTypeFilter] = useState("All");
	const liveRegionRef = useRef(null);

	// Persist
	useEffect(() => {
		localStorage.setItem(
			"resources_fav",
			JSON.stringify(Array.from(favorites))
		);
	}, [favorites]);

	useEffect(() => {
		localStorage.setItem(
			"resources_read",
			JSON.stringify(Object.fromEntries(readMap.entries()))
		);
	}, [readMap]);

	// Helpers
	const isFavorite = useCallback((url) => favorites.has(url), [favorites]);

	const announce = (msg) => {
		if (!liveRegionRef.current) return;
		liveRegionRef.current.textContent = "";
		setTimeout(() => (liveRegionRef.current.textContent = msg), 30);
	};

	const toggleFavorite = useCallback(
		(url, label) => {
			setFavorites((prev) => {
				const next = new Set(prev);
				if (next.has(url)) {
					next.delete(url);
					announce(
						`${label || content.ui?.pageTitle || "Link"} ${
							content.ui?.removedFromFav || "removed from favourites."
						}`
					);
				} else {
					next.add(url);
					announce(
						`${label || content.ui?.pageTitle || "Link"} ${
							content.ui?.addedToFav || "added to favourites."
						}`
					);
				}
				return next;
			});
		},
		[content.ui?.addedToFav, content.ui?.removedFromFav]
	);

	const markRead = useCallback(
		(url, label) => {
			setReadMap((prev) => {
				if (prev.has(url)) return prev;
				const next = new Map(prev);
				next.set(url, Date.now());
				announce(`${label || "Link"} ${content.ui?.read || "Read"}`);
				return next;
			});
		},
		[content.ui?.read]
	);

	const isRead = useCallback((url) => readMap.has(url), [readMap]);

	// Page-level animation
	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};

	// Filter segments read from content.ui
	const filterSegments = useMemo(
		() => [
			{ key: "All", label: content.ui?.filterAll || "All" },
			{
				key: "Favourites",
				label: content.ui?.filterFavourites || "Favourites",
				icon: faStarSolid,
			},
		],
		[content]
	);

	const filteredSections = useMemo(() => {
		return typeFilter === "Favourites"
			? SECTIONS.filter((s) =>
					(s.links || []).some((l) => favorites.has(l.url))
			  )
			: SECTIONS;
	}, [typeFilter, favorites, SECTIONS]);

	// Title click: mark read
	const onPrimaryClick = (url, label) => markRead(url, label);

	// Favorite button (ui strings come from content)
	const FavoriteButton = ({ url, label, size = 18 }) => {
		const fav = isFavorite(url);
		return (
			<button
				type="button"
				onClick={() => toggleFavorite(url, label)}
				aria-pressed={fav}
				title={
					fav
						? content.ui?.unfavorite || "Unfavorite"
						: content.ui?.favorite || "Favorite"
				}
				className="inline-flex items-center justify-center rounded-md border transition px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				style={{
					borderColor: withAlpha(accent, "33"),
					color: fav ? brandDark : "#334155",
					backgroundColor: fav ? withAlpha(accent, "14") : "white",
				}}
			>
				<FontAwesomeIcon
					icon={fav ? faStarSolid : faStarRegular}
					style={{ width: size, height: size }}
					aria-hidden="true"
				/>
				<span className="sr-only">
					{fav
						? content.ui?.unfavorite || "Unfavorite"
						: content.ui?.favorite || "Favorite"}
				</span>
			</button>
		);
	};

	const ReadBadge = ({ url }) => {
		if (!isRead(url)) return null;
		return (
			<span
				className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
				style={{
					backgroundColor: withAlpha("#059669", "10"),
					borderColor: withAlpha("#059669", "40"),
					color: "#065F46",
				}}
			>
				<FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />
				{content.ui?.read || "Read"}
			</span>
		);
	};

	// Tip card (concise)
	const TipCard = ({ children }) => (
		<section
			className="mx-auto max-w-3xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Usage tip"
			style={{
				borderColor: withAlpha(accent, "33"),
				backgroundColor: withAlpha(accent, "14"),
			}}
		>
			<p className="text-base sm:text-lg text-center text-slate-900">
				{children}
			</p>
		</section>
	);

	// Export helpers
	const escapeHTML = (s) =>
		String(s || "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");

	const enSuffixHTML = ` <strong style="color:${accent};">(en&nbsp;anglais seulement)</strong>`;

	const composeHTML = () => {
		const style = `
      <style>
        :root{
          --emerald-50:#ECFDF5; --emerald-200:#A7F3D0; --emerald-600:#065F46;
          --text:#111827; --muted:#374151;
        }
        @page { margin: 18mm; }
        * { box-sizing: border-box; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: var(--text); line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        h1 { font-size: 1.8rem; margin: 0 0 .8rem; }
        h2 { font-size: 1.125rem; margin: 1rem 0 .25rem; color: var(--muted); }
        p { margin: .25rem 0 .5rem; }
        a { color: var(--emerald-600); text-decoration: underline; text-underline-offset: 2px; }
        a:hover, a:focus { text-decoration-thickness: 2px; outline: none; }
        .section { page-break-inside: avoid; margin-bottom: .75rem; }
        .list { margin: .35rem 0 0; padding-left: 1rem; }
        .list li { margin: .25rem 0; }
      </style>
    `;

		const sections = filteredSections
			.map(({ title, summary, links }) => {
				const [primary, ...rest] = links || [];

				const primaryIsEn =
					!!primary?.enOnly || hasEnglishMarker(primary?.label || "");

				const restMarkup = rest?.length
					? `<ul class="list">${rest
							.map((l) => {
								const en = !!l.enOnly || hasEnglishMarker(l.label || "");
								const cleanLabel = stripEnglishMarker(l.label || "");
								return `<li><a href="${escapeHTML(
									l.url
								)}" target="_blank" rel="noreferrer noopener">${escapeHTML(
									cleanLabel
								)}</a>${en ? enSuffixHTML : ""}</li>`;
							})
							.join("")}</ul>`
					: "";

				const titleHasEn = hasEnglishMarker(title) || primaryIsEn;
				const displayTitle = stripEnglishMarker(title);

				return `
      <div class="section">
        <h2><a href="${escapeHTML(
					primary?.url || "#"
				)}" target="_blank" rel="noreferrer noopener">${escapeHTML(
					displayTitle
				)}</a>${titleHasEn ? enSuffixHTML : ""}</h2>
        ${summary ? `<p>${escapeHTML(summary)}</p>` : ""}
        ${restMarkup}
      </div>
    `;
			})
			.join("");

		return `
      <html lang="${content.lang || "en"}">
        <head><meta charset="utf-8">${style}</head>
        <body>
          <h1>${escapeHTML(PAGE_TITLE)}</h1>
          ${
						sections ||
						`<p>${escapeHTML(
							content.ui?.noResources || "No resources available."
						)}</p>`
					}
        </body>
      </html>
    `;
	};

	const exportWord = () => {
		const html = composeHTML();
		const blob = new Blob([html], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "resources.doc";
		a.click();
		URL.revokeObjectURL(url);
	};

	const exportPdf = () => {
		const html = composeHTML();
		const iframe = document.createElement("iframe");
		Object.assign(iframe.style, {
			position: "fixed",
			right: "0",
			bottom: "0",
			width: "0",
			height: "0",
			border: "0",
		});
		document.body.appendChild(iframe);
		const doc = iframe.contentDocument || iframe.contentWindow?.document;
		if (!doc) return;
		doc.open();
		doc.write(html);
		doc.close();
		const printNow = () => {
			try {
				iframe.contentWindow?.focus();
				iframe.contentWindow?.print();
			} finally {
				setTimeout(() => document.body.removeChild(iframe), 800);
			}
		};
		if (doc.readyState === "complete") setTimeout(printNow, 120);
		else iframe.onload = () => setTimeout(printNow, 120);
	};

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* Live region for screen reader announcements */}
			<div
				ref={liveRegionRef}
				className="sr-only"
				aria-live="polite"
				aria-atomic="true"
			/>

			{/* soft emerald gradient overlay */}
			<motion.div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(
            to bottom,
            ${withAlpha("#10B981", "1F")} 0%,
            rgba(255,255,255,0) 40%,
            rgba(248,250,252,0) 100%
          )`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.25 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
				{/* Header */}
				<motion.header
					className="text-center space-y-4"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
							{PAGE_TITLE}
						</h1>
						<FontAwesomeIcon
							icon={faLink}
							className="shrink-0"
							style={{ color: accent, width: iconSize, height: iconSize }}
							aria-hidden="true"
							title={PAGE_TITLE}
						/>
					</div>

					{/* Actions */}
					<div className="mt-1 flex flex-wrap items-center justify-center gap-2">
						<motion.button
							whileHover={{ scale: reduceMotion ? 1 : 1.03 }}
							whileTap={{ scale: reduceMotion ? 1 : 0.97 }}
							type="button"
							onClick={exportPdf}
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-medium transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
							style={{ borderColor: withAlpha(accent, "66"), color: brandDark }}
							title={
								content.ui?.openPrintAria || "Open print dialog to save as PDF"
							}
						>
							<FontAwesomeIcon
								icon={faPrint}
								className="shrink-0"
								style={{ color: accent, width: iconSize, height: iconSize }}
								aria-hidden="true"
							/>
							<span>{content.ui?.exportPdf || "Export PDF"}</span>
						</motion.button>

						<motion.button
							whileHover={{ scale: reduceMotion ? 1 : 1.03 }}
							whileTap={{ scale: reduceMotion ? 1 : 0.97 }}
							type="button"
							onClick={exportWord}
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-medium transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
							style={{ borderColor: withAlpha(accent, "66"), color: brandDark }}
							title={content.ui?.exportWordAria || "Download a Word document"}
						>
							<FontAwesomeIcon
								icon={faFileArrowDown}
								className="shrink-0"
								style={{ color: accent, width: iconSize, height: iconSize }}
								aria-hidden="true"
							/>
							<span>{content.ui?.exportWord || "Export Word"}</span>
						</motion.button>
					</div>

					{/* Segmented Filter */}
					<nav
						className="mt-3 flex items-center justify-center"
						aria-label="Resource filters"
					>
						<ul className="flex gap-2 overflow-x-auto px-1 py-1 scrollbar-thin">
							{filterSegments.map(({ key, label, icon }) => {
								const active = typeFilter === key;
								return (
									<li key={key} className="shrink-0">
										<motion.button
											whileHover={{ y: reduceMotion ? 0 : -1 }}
											whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
											type="button"
											onClick={() => setTypeFilter(key)}
											className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
											style={{
												borderColor: withAlpha(accent, active ? "66" : "33"),
												backgroundColor: active
													? withAlpha(accent, "14")
													: "white",
												color: active ? brandDark : "#0f172a",
											}}
											aria-pressed={active}
											aria-label={label}
											title={label}
										>
											{icon ? (
												<FontAwesomeIcon
													icon={icon}
													className="opacity-80"
													style={{ width: 14, height: 14 }}
													aria-hidden="true"
												/>
											) : null}
											<span>{label}</span>
										</motion.button>
									</li>
								);
							})}
						</ul>
					</nav>
				</motion.header>

				{/* Cards */}
				<section>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredSections.length === 0 ? (
							<div className="col-span-full text-center text-slate-600">
								{content.ui?.noResources || "No resources available."}
							</div>
						) : null}

						{filteredSections.map(({ title, summary, links }) => {
							const [primary, ...rest] = links || [];
							const primaryUrl = primary?.url || null;
							const cardKey = title;
							const open = openCardKey === cardKey;

							const primaryIsEn =
								!!primary?.enOnly || hasEnglishMarker(primary?.label || "");

							const titleHasEn = hasEnglishMarker(title) || primaryIsEn;

							const displayTitle = stripEnglishMarker(title);

							return (
								<article
									key={cardKey}
									className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition hover:shadow-md"
								>
									{/* Header */}
									<div className="flex items-start gap-3">
										<span
											className="inline-grid h-10 w-10 place-items-center rounded-xl"
											style={{
												backgroundColor: withAlpha(accent, "14"),
												color: accent,
											}}
											aria-hidden="true"
										>
											<FontAwesomeIcon
												icon={faLink}
												className="shrink-0"
												style={{ width: iconSize, height: iconSize }}
											/>
										</span>

										<div className="flex-1 min-w-0">
											{/* Title: underlined + optional EN suffix */}
											{primaryUrl ? (
												<a
													href={primaryUrl}
													target="_blank"
													rel="noreferrer noopener"
													onClick={() =>
														onPrimaryClick(primaryUrl, displayTitle)
													}
													className="text-lg font-semibold text-slate-900 underline underline-offset-2 decoration-emerald-600 hover:decoration-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
													title={primary?.label || primaryUrl}
												>
													{displayTitle}
													{titleHasEn ? (
														<span
															className="ml-1 font-semibold"
															style={{ color: accent }}
														>
															(en anglais seulement)
														</span>
													) : null}
												</a>
											) : (
												<h3 className="text-lg font-semibold text-slate-900 underline underline-offset-2 decoration-emerald-600">
													{displayTitle}
													{titleHasEn ? (
														<span
															className="ml-1 font-semibold"
															style={{ color: accent }}
														>
															(en anglais seulement)
														</span>
													) : null}
												</h3>
											)}

											{/* Summary + read */}
											<div className="mt-1 flex flex-wrap items-center gap-2">
												{summary ? (
													<p className="text-sm text-slate-600">{summary}</p>
												) : null}
												{primaryUrl ? <ReadBadge url={primaryUrl} /> : null}
											</div>
										</div>

										{/* Favorite (primary) */}
										{primaryUrl ? (
											<FavoriteButton
												url={primaryUrl}
												label={displayTitle}
												size={16}
											/>
										) : null}
									</div>

									{/* More links – expand in card */}
									{rest?.length > 0 ? (
										<div className="mt-4">
											<button
												type="button"
												onClick={() =>
													setOpenCardKey((k) =>
														k === cardKey ? null : cardKey
													)
												}
												className="flex items-center justify-between w-full cursor-pointer select-none rounded-md px-3 py-2 border bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
												style={{ borderColor: withAlpha(accent, "33") }}
												aria-expanded={open}
												aria-controls={`expanel-${cardKey}`}
												title={`${content.ui?.moreLinks || "More links"} (${
													rest.length
												})`}
											>
												<span className="text-sm font-medium text-slate-900">
													{content.ui?.moreLinks || "More links"} ({rest.length}
													)
												</span>
												<FontAwesomeIcon
													icon={faChevronDown}
													className={`text-slate-500 text-xs transition-transform ${
														open ? "rotate-180" : ""
													}`}
													aria-hidden="true"
												/>
											</button>

											<AnimatePresence initial={false}>
												{open && (
													<motion.div
														id={`expanel-${cardKey}`}
														initial="collapsed"
														animate="open"
														exit="collapsed"
														variants={{
															open: { height: "auto", opacity: 1 },
															collapsed: { height: 0, opacity: 0 },
														}}
														transition={{
															duration: 0.24,
															ease: [0.22, 1, 0.36, 1],
														}}
														className="overflow-hidden"
													>
														<div className="pt-2">
															<ul className="space-y-2">
																{rest.map((l, idx) => {
																	const url = l.url;
																	const en =
																		!!l.enOnly ||
																		hasEnglishMarker(l.label || "");
																	const cleanLabel = stripEnglishMarker(
																		l.label || ""
																	);
																	return (
																		<li
																			key={`${title}-more-${idx}`}
																			className="flex items-start justify-between gap-2"
																		>
																			<a
																				href={url}
																				target="_blank"
																				rel="noreferrer noopener"
																				onClick={() =>
																					markRead(url, cleanLabel)
																				}
																				className="group flex-1 min-w-0 items-start gap-2 rounded-lg border px-3 py-2 bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition cursor-pointer"
																				style={{
																					borderColor: withAlpha(accent, "33"),
																				}}
																				title={cleanLabel}
																				aria-label={`${
																					content.ui?.openLinkAriaPrefix ||
																					"Open link:"
																				} ${cleanLabel}`}
																			>
																				<FontAwesomeIcon
																					icon={faArrowUpRightFromSquare}
																					className="mt-0.5 shrink-0"
																					style={{
																						color: accent,
																						width: iconSize,
																						height: iconSize,
																					}}
																					aria-hidden="true"
																				/>
																				<div className="min-w-0">
																					<div className="font-medium text-slate-900 group-hover:underline truncate">
																						{cleanLabel}
																						{en ? (
																							<span
																								className="ml-1 font-semibold"
																								style={{ color: accent }}
																							>
																								(en anglais seulement)
																							</span>
																						) : null}
																					</div>
																					<div className="text-xs break-all text-emerald-800/90 underline decoration-transparent group-hover:decoration-inherit">
																						{url}
																					</div>
																				</div>
																			</a>
																			<div className="flex items-center gap-2">
																				<ReadBadge url={url} />
																				<FavoriteButton
																					url={url}
																					label={cleanLabel}
																					size={16}
																				/>
																			</div>
																		</li>
																	);
																})}
															</ul>
														</div>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									) : null}
								</article>
							);
						})}
					</div>
				</section>
			</div>
		</motion.div>
	);
}
