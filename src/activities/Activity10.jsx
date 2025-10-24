// src/pages/activities/Activity10.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	Store, // header icon
	Landmark, // government directory
	ExternalLink,
} from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";
import { ACTIVITIES_CONTENT } from "../constants/content.js";

/* tiny helper: #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

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

export default function Activity10({
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#DB5A42",
}) {
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const reduceMotion = useReducedMotion();

	// pull content for a10 from constants (language-aware)
	const a10Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a10 &&
			(ACTIVITIES_CONTENT.a10[lang] || ACTIVITIES_CONTENT.a10.en)) ||
		{};

	const activityNumber = Number.isFinite(a10Content?.number)
		? a10Content.number
		: 10;
	const pageTitle = a10Content?.title || "Indigenous-Owned Business";
	const tipText =
		a10Content?.tip ||
		(lang === "fr"
			? "Découvrez, en personne ou en ligne, une entreprise appartenant à une personne inuite, métisse ou des Premières Nations."
			: "Explore a First Nations, Inuit or Métis-owned business (in person or online). What products or services spoke to you and why?");
	const placeholder =
		a10Content?.notePlaceholder ||
		(lang === "fr"
			? "Entreprise, offres, comment vous soutiendrez…"
			: "Business, offerings, how you’ll support…");
	const linksHeading =
		a10Content?.resourcesHeading ||
		(lang === "fr" ? "Ressources" : "Resources");

	const instructionsHtml = a10Content?.instructionsHtml || null;

	// keep local notes in sync
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const started = hasActivityStarted(localNotes);

	// animations (same as other activities)
	const STAGGER = 0.14;
	const DELAY_CHILDREN = 0.1;
	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.35 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
	};
	const gridStagger = {
		hidden: {},
		show: {
			transition: {
				delayChildren: reduceMotion ? 0 : DELAY_CHILDREN,
				staggerChildren: reduceMotion ? 0 : STAGGER,
			},
		},
	};
	const cardPop = {
		hidden: {
			opacity: 0,
			y: reduceMotion ? 0 : 8,
			scale: reduceMotion ? 1 : 0.99,
		},
		show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
	};

	// shared classes
	const linkCardBase =
		"group block w-full rounded-2xl border border-gray-200 bg-white p-4 " +
		"shadow-sm transition hover:shadow-md hover:-translate-y-0.5 " +
		"cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
	const badgeBase = "w-10 h-10 rounded-xl grid place-items-center";
	const linkFooterBase =
		"mt-2 flex items-center justify-center gap-1 text-xs font-medium";

	// pageLinks for export (from content.links)
	const pageLinks = useMemo(() => {
		if (Array.isArray(a10Content?.links)) {
			return a10Content.links.map((l) =>
				typeof l === "string"
					? { label: l, url: "" }
					: {
							label: l.label || "",
							url: l.url || l.href || "",
							enOnly: !!l.enOnly,
					  }
			);
		}
		return [];
	}, [a10Content]);

	// outlet tiles for UI (from content.outlets)
	const outletTiles = useMemo(() => {
		if (Array.isArray(a10Content?.outlets) && a10Content.outlets.length > 0) {
			return a10Content.outlets.map((o) => ({
				href: o.href || o.url || o.link || "",
				title: o.title || o.label || "",
				desc: o.desc || o.description || "",
				enOnly: !!o.enOnly,
				Icon:
					o.icon === "shopping"
						? Store
						: o.icon === "directory"
						? Landmark
						: Store,
			}));
		}
		return [];
	}, [a10Content]);

	// TitleRow helper (keeps the same visual layout)
	const TitleRow = ({ Icon, children }) => (
		<div className="relative flex items-center pl-14">
			<div
				className={`${badgeBase} absolute left-0 top-1/2 -translate-y-1/2`}
				style={{ backgroundColor: withAlpha(accent, "1A"), color: accent }}
			>
				<Icon className="w-5 h-5" aria-hidden="true" />
			</div>
			<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
				{children}
			</div>
		</div>
	);

	// Download handler uses the NoteComposer export helper (still imported)
	const handleDownload = () => {
		const html =
			typeof localNotes === "string"
				? localNotes || ""
				: localNotes?.text || "";
		downloadNotesAsWord({
			html,
			downloadFileName: `Activity-${
				a10Content?.id || String(activityNumber)
			}-Reflection.docx`,
			docTitle: pageTitle,
			docSubtitle: a10Content?.subtitle,
			activityNumber,
			docIntro: tipText,
			includeLinks: true,
			linksHeading,
			pageLinks,
			headingColor: accent,
			accent,
		});
	};

	return (
		<motion.div
			className="relative bg-transparent min-h-[80svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b via-white/65 to-slate-50/80"
				style={{
					backgroundImage: `linear-gradient(to bottom, ${withAlpha(
						accent,
						"3D"
					)}, rgba(255,255,255,0.65), rgba(248,250,252,0.8))`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.35 }}
				transition={{ duration: 0.6 }}
			/>

			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				<motion.header
					className="text-center"
					variants={titleFade}
					initial="hidden"
					animate="show"
				>
					<div className="mx-auto space-y-4 sm:space-y-5">
						<p
							className="font-semibold uppercase tracking-wider text-2xl sm:text-3xl"
							style={{ color: accent }}
						>
							{lang === "fr" ? "Activité" : "Activity"} {activityNumber}
						</p>

						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{pageTitle}
							</h1>
							<Store
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						<aside
							role="note"
							aria-label="Activity instructions"
							className="mx-auto max-w-3xl rounded-2xl border bg-white/85 backdrop-blur-sm px-5 py-4 text-base sm:text-lg leading-relaxed shadow-[0_1px_0_rgba(0,0,0,0.05)]"
							style={{ borderColor: withAlpha(accent, "33") }}
						>
							<div className="flex flex-col items-center gap-3 text-center">
								<div
									className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold"
									style={{
										backgroundColor: withAlpha(accent, "15"),
										color: accent,
									}}
									aria-hidden="true"
								>
									{lang === "fr" ? "Consignes" : "Instructions"}
								</div>

								{instructionsHtml ? (
									<div
										className="text-slate-800 max-w-2xl"
										style={{ color: accent }}
										dangerouslySetInnerHTML={{ __html: instructionsHtml }}
									/>
								) : (
									<p
										className="text-slate-800 max-w-2xl"
										style={{ color: accent }}
									>
										{tipText}
										<br />
										<strong>
											{lang === "fr"
												? "Quels produits ou services ont attiré votre attention et pourquoi?"
												: "What products or services spoke to you and why?"}
										</strong>
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{outletTiles.length > 0
							? outletTiles
									.filter((t) => t.href)
									.map(({ href, title, desc, Icon, enOnly }, i) => {
										const TheIcon = Icon || Store;
										const showSuffix = lang === "fr" && enOnly;
										const suffixText = " (en anglais seulement)";
										const ariaTitle = showSuffix
											? `${title}${suffixText}`
											: title;

										return (
											<motion.a
												key={href + i}
												href={href}
												target="_blank"
												rel="noreferrer"
												className={linkCardBase}
												style={{ outlineColor: accent }}
												title={`Open: ${ariaTitle}`}
												aria-label={`Open ${ariaTitle} in a new tab`}
												variants={cardPop}
											>
												<div className="relative flex items-center pl-14">
													<div
														className={`${badgeBase} absolute left-0 top-1/2 -translate-y-1/2`}
														style={{
															backgroundColor: withAlpha(accent, "1A"),
															color: accent,
														}}
														aria-hidden="true"
													>
														<TheIcon className="w-5 h-5" />
													</div>
													<div className="w-full text-center font-medium text-gray-800 group-hover:underline">
														{title}
														{showSuffix && (
															<span
																className="ml-1 font-semibold"
																style={{ color: accent }}
															>
																(en anglais seulement)
															</span>
														)}
													</div>
												</div>

												<div
													className={linkFooterBase}
													style={{ color: accent }}
												>
													<ExternalLink
														className="w-4 h-4"
														aria-hidden="true"
													/>
													<span>
														{lang === "fr" ? "Ouvrir le lien" : "Open link"}
													</span>
												</div>
											</motion.a>
										);
									})
							: null}
					</div>
				</motion.section>

				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${a10Content?.id || String(activityNumber)}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${
						a10Content?.id || String(activityNumber)
					}-Reflection.docx`}
					docTitle={pageTitle}
					docSubtitle={a10Content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={true}
					linksHeading={linksHeading}
					pageLinks={pageLinks}
					headingColor={accent}
					showDownloadButton={false}
				/>

				<div className="flex gap-2 justify-center sm:justify-end mb-20 sm:mb-4">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>
					<button
						type="button"
						onClick={handleDownload}
						className="px-4 py-2 rounded-lg text-white"
						style={{ backgroundColor: accent }}
						title={
							lang === "fr"
								? "Télécharger vos notes et ressources en .docx"
								: "Download your notes and resources as .docx"
						}
					>
						{lang === "fr" ? "Télécharger (.docx)" : "Download (.docx)"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

/* Accent-aware dashed tip */
function TipCard({ accent = "#DB5A42", children }) {
	return (
		<section
			className="mx-auto max-w-xl w-full rounded-2xl border border-dashed p-4 shadow-sm"
			role="note"
			aria-label="Activity tip"
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
}
