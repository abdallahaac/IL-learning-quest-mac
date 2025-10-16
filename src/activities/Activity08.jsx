// src/pages/activities/Activity08.jsx
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Rainbow } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import LinkCard from "../components/LinkCard.jsx";
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

export default function Activity08({
	notes,
	completed,
	onNotes,
	onToggleComplete,
	accent = "#E11D48",
}) {
	const lang = React.useMemo(() => (detectLang() === "fr" ? "fr" : "en"), []);
	const reduceMotion = useReducedMotion();

	// choose content by language (fall back to English)
	const a8Content =
		(ACTIVITIES_CONTENT &&
			ACTIVITIES_CONTENT.a8 &&
			(ACTIVITIES_CONTENT.a8[lang] || ACTIVITIES_CONTENT.a8.en)) ||
		{};

	const cdata = a8Content?.cdata || {};

	// TAKE THE TITLE FROM CONTENT (or fallback)
	const pageTitle =
		a8Content?.title ||
		cdata?.title ||
		(lang === "fr" ? "Activité" : "Activity");

	// TAKE INSTRUCTIONS FROM CONTENT (cdata.instructionsHtml preferred), otherwise use prompt/tip
	let instructionsHtml =
		cdata?.instructionsHtml ||
		a8Content?.instructionsHtml ||
		(a8Content?.prompt ? `<p>${a8Content.prompt}</p>` : "") ||
		"";

	// fallback plain tip text (used when we don't have HTML)
	const tipText =
		a8Content?.tip ||
		a8Content?.prompt ||
		(instructionsHtml ? instructionsHtml.replace(/<[^>]*>/g, "").trim() : "");

	// placeholder from content or fallback
	const placeholder =
		a8Content?.notePlaceholder ||
		(lang === "fr"
			? "Cliquez ou tapez ici pour saisir du texte."
			: "Voices you followed; what you learned…");

	const pageLinks = Array.isArray(a8Content?.links) ? a8Content.links : [];

	// ----- ADVOCATES parsing: build advocates array + name->bio map from content.resources -----
	// content.resources entries are strings like:
	//   "Dr. James Makokis — Cree Two-Spirit doctor and speaker"
	const rawResources = Array.isArray(a8Content?.resources)
		? a8Content.resources
		: [];

	const advocatesParsed = rawResources
		.map((item) => {
			if (!item) return null;
			if (typeof item === "string") {
				// split on em-dash, en-dash or hyphen (tolerant)
				const parts = item
					.split(/—|–| - /)
					.map((s) => s.trim())
					.filter(Boolean);
				const name = parts[0] || "";
				const bio = parts.slice(1).join(" — ").trim() || "";
				return { name, bio };
			}
			// already an object
			return {
				name: item.name || item.label || String(item),
				bio: item.bio || "",
			};
		})
		.filter(Boolean);

	const advocates = advocatesParsed.map((a) => ({ name: a.name, bio: a.bio }));
	const advocatesBios = advocatesParsed.reduce((acc, a) => {
		if (a.name && a.bio) acc[a.name] = a.bio;
		return acc;
	}, {});

	const activityNumber = Number.isFinite(a8Content?.number)
		? a8Content.number
		: 8;

	// notes state
	const [localNotes, setLocalNotes] = useState(notes ?? "");
	useEffect(() => setLocalNotes(notes ?? ""), [notes]);
	const saveNotes = (v) => {
		setLocalNotes(v);
		onNotes?.(v);
	};

	const started = hasActivityStarted(localNotes);

	// animations
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

	// decide whether to show advocates as 4th card (default: true)
	const showAdvocatesCard =
		a8Content?.showAdvocatesCard === undefined
			? true
			: Boolean(a8Content.showAdvocatesCard);

	// slice first3 BEFORE using it in JSX
	const first3 = pageLinks.slice(0, 3);

	// card sizing config: supports array of either strings (minHeight) or objects:
	const cardHeightsConfig = Array.isArray(a8Content?.cardHeights)
		? a8Content.cardHeights
		: [];

	const defaultForIdx = (idx) => {
		if (idx >= 2) return { cardMinHeight: "130px" };
		return {};
	};

	const getCardProps = (idx) => {
		const cfg = cardHeightsConfig[idx];
		if (!cfg) return defaultForIdx(idx);
		if (typeof cfg === "string") {
			return { cardMinHeight: cfg };
		}
		const allowed = [
			"cardHeight",
			"cardMinHeight",
			"cardMaxHeight",
			"cardWidth",
			"cardMinWidth",
			"cardMaxWidth",
		];
		const out = {};
		allowed.forEach((k) => {
			if (cfg[k]) out[k] = cfg[k];
		});
		return Object.keys(out).length ? out : defaultForIdx(idx);
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
							<Rainbow
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
									{a8Content?.resourcesHeading ||
										(lang === "fr" ? "Ressources" : "Resources")}
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
										<strong>Share what you learned with your team.</strong>
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resources + Advocates as LinkCards (grid) ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
						{/* Explicit LinkCard 1 */}
						<motion.div variants={cardPop}>
							{first3[0] ? (
								<LinkCard
									link={first3[0]}
									accent={accent}
									Icon={Rainbow}
									noMaxWidth={true}
									enOnlySuffix={
										lang === "fr" && first3[0].enOnly
											? " (en anglais seulement)"
											: ""
									}
									variants={cardPop}
									{...getCardProps(0)}
								/>
							) : (
								<div className="rounded-2xl border bg-white p-4 shadow-sm h-full" />
							)}
						</motion.div>

						{/* Explicit LinkCard 2 */}
						<motion.div variants={cardPop}>
							{first3[1] ? (
								<LinkCard
									link={first3[1]}
									accent={accent}
									Icon={Rainbow}
									noMaxWidth={true}
									enOnlySuffix={
										lang === "fr" && first3[1].enOnly
											? " (en anglais seulement)"
											: ""
									}
									variants={cardPop}
									{...getCardProps(1)}
								/>
							) : (
								<div className="rounded-2xl border bg-white p-4 shadow-sm h-full" />
							)}
						</motion.div>

						{/* Explicit LinkCard 3 */}
						<motion.div variants={cardPop}>
							{first3[2] ? (
								<LinkCard
									link={first3[2]}
									accent={accent}
									Icon={Rainbow}
									noMaxWidth={true}
									enOnlySuffix={
										lang === "fr" && first3[2].enOnly
											? " (en anglais seulement)"
											: ""
									}
									variants={cardPop}
									{...getCardProps(2)}
								/>
							) : (
								<div className="rounded-2xl border bg-white p-4 shadow-sm h-full" />
							)}
						</motion.div>

						{/* Advocates card (fourth) */}
						{showAdvocatesCard ? (
							<motion.div variants={cardPop}>
								<LinkCard
									showAdvocates={true}
									advocates={advocates}
									advocatesBios={advocatesBios}
									accent={accent}
									noMaxWidth={true}
									Icon={Rainbow}
									variants={cardPop}
									cardHeight={"220px"}
									{...getCardProps(3)}
								/>
							</motion.div>
						) : (
							<motion.div variants={cardPop}>
								<div className="rounded-2xl border bg-white p-4 shadow-sm h-full" />
							</motion.div>
						)}
					</div>
				</motion.section>

				{/* Notes */}
				<NoteComposer
					value={localNotes}
					onChange={saveNotes}
					storageKey={`notes-${a8Content?.id || "08"}`}
					placeholder={placeholder}
					size="md"
					rows={8}
					minHeight="min-h-72"
					panelMinHClass="min-h-72"
					accent={accent}
					downloadFileName={`Activity-${a8Content?.id || "08"}-Reflection.docx`}
					docTitle={pageTitle}
					docSubtitle={a8Content?.subtitle}
					activityNumber={activityNumber}
					docIntro={tipText}
					includeLinks={pageLinks && pageLinks.length > 0}
					linksHeading={
						a8Content?.resourcesHeading ||
						(lang === "fr" ? "Ressources" : "Resources")
					}
					pageLinks={pageLinks}
					headingColor={accent}
					showDownloadButton={false}
				/>

				{/* Complete + Download */}
				<div className="flex justify-end gap-2">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>
					<button
						type="button"
						onClick={() => {
							/* reuse existing downloadPageDocx logic if you keep it */
						}}
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
