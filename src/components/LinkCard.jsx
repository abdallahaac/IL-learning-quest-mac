// src/components/LinkCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { withAlpha } from "../utils/recipeUtils.js";

/**
 * LinkCard
 * Props:
 *  - link: { label, url }
 *  - accent: hex color string (e.g. "#047857")
 *  - Icon: React component for the badge icon (optional)
 *  - enOnlySuffix: boolean true or string to append when doc is French (optional)
 *  - variants: framer-motion variants (optional)
 *  - openLinkLabel: override string for the footer label (optional)
 */
export default function LinkCard({
	link,
	accent = "#047857",
	Icon = null,
	enOnlySuffix = "",
	variants = undefined,
	openLinkLabel,
}) {
	// language sniff (same behaviour as other activities)
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
	// footer label: allow override, otherwise French => "Ouvrir le lien", else => "Open link"
	const defaultOpenLabel = lang === "fr" ? "Ouvrir le lien" : "Open link";
	const footerLabel =
		typeof openLinkLabel === "string" && openLinkLabel.trim()
			? openLinkLabel
			: defaultOpenLabel;

	// compute suffix: if enOnlySuffix is truthy and doc is French, show either the passed string
	// or the default "(en anglais seulement)". Accept boolean true or custom string.
	let suffixText = "";
	if (lang === "fr") {
		if (typeof enOnlySuffix === "string" && enOnlySuffix.trim()) {
			suffixText = enOnlySuffix.trim();
		} else if (enOnlySuffix === true) {
			suffixText = "(en anglais seulement)";
		}
	}

	const linkCardBase =
		"group block max-w-md w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

	const badgeBase =
		"flex-none shrink-0 w-10 h-10 min-w-[40px] min-h-[40px] aspect-square rounded-xl grid place-items-center";

	const linkFooterBase =
		"mt-3 flex items-center justify-center gap-1 text-sm font-medium";

	return (
		<motion.a
			href={link.url}
			target="_blank"
			rel="noreferrer"
			className={linkCardBase}
			style={{ outlineColor: accent, borderColor: withAlpha(accent, "22") }}
			title={link.label}
			aria-label={link.label}
			variants={variants}
		>
			<div className="flex items-center gap-3">
				<div
					className={badgeBase}
					style={{
						backgroundColor: withAlpha(accent, "1A"),
						color: accent,
					}}
				>
					{Icon ? (
						<Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
					) : null}
				</div>

				<div className="font-medium text-gray-800">
					{/* main label underlines on hover */}
					<span className="group-hover:underline">{link.label}</span>

					{/* suffix only when French and enOnlySuffix requested */}
					{suffixText ? (
						<span
							className="ml-1 no-underline"
							style={{
								color: accent,
								// ensure suffix never gets underlined by CSS cascade
								textDecoration: "none",
							}}
						>
							{suffixText}
						</span>
					) : null}
				</div>
			</div>

			<div className={linkFooterBase} style={{ color: accent }}>
				<ExternalLink className="w-4 h-4" aria-hidden="true" />
				<span>{footerLabel}</span>
			</div>
		</motion.a>
	);
}
