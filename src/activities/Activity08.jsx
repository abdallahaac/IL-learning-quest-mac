// src/pages/activities/Activity08.jsx

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Rainbow } from "lucide-react";
import NoteComposer, {
	downloadNotesAsWord,
} from "../components/NoteComposer.jsx";
import CompleteButton from "../components/CompleteButton.jsx";
import LinkCard from "../components/LinkCard.jsx";
import DownloadButton from "../components/DownloadButton.jsx";
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

	// title from content (or fallback)
	const pageTitle =
		a8Content?.title ||
		cdata?.title ||
		(lang === "fr" ? "Activité" : "Activity");

	// instructions from content (prefer HTML), else prompt/tip
	let instructionsHtml =
		cdata?.instructionsHtml ||
		a8Content?.instructionsHtml ||
		(a8Content?.prompt ? `<p>${a8Content.prompt}</p>` : "") ||
		"";

	// fallback tip text if HTML missing
	const tipText =
		a8Content?.tip ||
		a8Content?.prompt ||
		(instructionsHtml ? instructionsHtml.replace(/<[^>]*>/g, "").trim() : "");

	// placeholder from content or fallback
	const placeholder =
		a8Content?.notePlaceholder ||
		(lang === "fr"
			? "Cliquez ici pour saisir du texte."
			: "Voices you followed; what you learned…");

	const pageLinks = Array.isArray(a8Content?.links) ? a8Content.links : [];

	// ----- ADVOCATES parsing: build list + name->bio map from content.resources -----
	const rawResources = Array.isArray(a8Content?.resources)
		? a8Content.resources
		: [];

	const advocatesParsed = rawResources
		.map((item) => {
			if (!item) return null;
			if (typeof item === "string") {
				const parts = item
					.split(/—|–| - /)
					.map((s) => s.trim())
					.filter(Boolean);
				const name = parts[0] || "";
				const bio = parts.slice(1).join(" — ").trim() || "";
				return { name, bio };
			}
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
	const hasLinks = pageLinks && pageLinks.length > 0;
	const linksHeading =
		a8Content?.resourcesHeading || (lang === "fr" ? "Ressources" : "Resources");

	// download state + labels (same pattern as Activity 05/07)
	const [isDownloading, setIsDownloading] = useState(false);
	const docLocale = {
		en: { suffix: "Reflection", downloadingLabel: "Downloading..." },
		fr: { suffix: "Réflexion", downloadingLabel: "Téléchargement..." },
	}[lang];

	// async download handler with guard + cooldown
	const handleDownload = async () => {
		if (!started || isDownloading) return;

		setIsDownloading(true);

		try {
			const html =
				typeof localNotes === "string" ? localNotes : localNotes?.text || "";
			const suffix = (docLocale?.suffix || "Reflection").replace(/\s+/g, "-");
			const filename = `Activity-${
				a8Content?.id || String(activityNumber).padStart(2, "0")
			}-${suffix}.docx`;

			await Promise.resolve(
				downloadNotesAsWord({
					html,
					downloadFileName: filename,
					docTitle: pageTitle,
					docSubtitle: a8Content?.subtitle,
					activityNumber,
					docIntro: tipText,
					includeLinks: hasLinks,
					linksHeading,
					pageLinks,
					headingColor: accent,
					accent,
					locale: lang,
				})
			);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error("downloadNotesAsWord failed (Activity 08):", err);
		} finally {
			setTimeout(() => setIsDownloading(false), 700);
		}
	};

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

	// whether to show advocates as 4th card
	const showAdvocatesCard =
		a8Content?.showAdvocatesCard === undefined
			? true
			: Boolean(a8Content.showAdvocatesCard);

	// first three links for cards
	const first3 = pageLinks.slice(0, 3);

	// optional per-card sizing from content.cardHeights
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
										{lang === "fr"
											? "Partagez vos apprentissages avec votre équipe."
											: "Share what you learned with your team."}
									</p>
								)}
							</div>
						</aside>
					</div>
				</motion.header>

				{/* ===== Resources + Advocates as LinkCards (grid) ===== */}
				<motion.section variants={gridStagger} initial="hidden" animate="show">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
						{/* LinkCard 1 */}
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

						{/* LinkCard 2 */}
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

						{/* LinkCard 3 */}
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
							<motion.div
								variants={cardPop}
								className="[--card-h:290px] sm:[--card-h:250px]"
							>
								<LinkCard
									showAdvocates={true}
									advocates={advocates}
									advocatesBios={advocatesBios}
									accent={accent}
									noMaxWidth={true}
									Icon={Rainbow}
									variants={cardPop}
									{...getCardProps(3)} // keep config
									cardHeight="var(--card-h)" // responsive height via CSS var
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
					includeLinks={hasLinks}
					linksHeading={linksHeading}
					pageLinks={pageLinks}
					headingColor={accent}
					showDownloadButton={false}
					onRequestDownload={handleDownload}
				/>

				{/* Complete + Download */}
				<div className="flex gap-2 justify-center sm:justify-end mb-20 sm:mb-4">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>

					<DownloadButton
						onClick={handleDownload}
						disabled={!started || isDownloading}
						isDownloading={isDownloading}
						accent={accent}
						label={lang === "fr" ? "Télécharger (.docx)" : "Download (.docx)"}
						downloadingLabel={docLocale.downloadingLabel}
						ariaLabel={
							lang === "fr"
								? "Télécharger vos notes et ressources en .docx"
								: "Download your notes and resources as .docx"
						}
					/>
				</div>
			</div>
		</motion.div>
	);
}
