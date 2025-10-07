// src/components/IntroPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Users, Compass, Clock, CalendarCheck, RefreshCcw } from "lucide-react";

/* helpers for accent styling */
const withAlpha = (hex, aa) => `${hex}${aa}`;
const ACCENT = "#4380d6";

/* pill-header callout container (matches Instructions style) */
function AccentBox({ label, children, accent = ACCENT }) {
	return (
		<section
			role="note"
			className="mx-auto w-full rounded-2xl border bg-white/85 backdrop-blur-sm px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]"
			style={{ borderColor: withAlpha(accent, "33") }}
			aria-label={label}
		>
			<div className="flex flex-col items-center gap-3 text-center">
				<div
					className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold"
					style={{ backgroundColor: withAlpha(accent, "15"), color: accent }}
					aria-hidden="true"
				>
					{label}
				</div>
				<div className="w-full">{children}</div>
			</div>
		</section>
	);
}

/* summary chip where the label is a pill (same visual language as "Tip") */
function SummaryChip({ dt, dd, accent = ACCENT }) {
	return (
		<div
			className="rounded-2xl border p-3 shadow-sm text-left"
			style={{
				borderColor: withAlpha(accent, "26"),
				backgroundColor: "white",
			}}
		>
			<dt
				className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
				style={{ backgroundColor: withAlpha(accent, "15"), color: accent }}
			>
				{dt}
			</dt>
			<dd className="mt-2 text-sm text-gray-800">{dd}</dd>
		</div>
	);
}

export default function IntroPage({ content }) {
	const title = content?.title || "Introduction";
	const paragraphs = content?.paragraphs ?? [];
	const items = content?.bullets?.[0]?.items ?? [];
	const detailedSteps = content?.details?.steps ?? [];

	const steps = [
		{
			icon: Users,
			title: "Gather your team",
			text: items[0],
			bullets: detailedSteps[0]?.bullets,
		},
		{
			icon: Compass,
			title: "Set your parameters",
			text: items[1],
			bullets: detailedSteps[1]?.bullets,
		},
		{
			icon: Clock,
			title: "Give yourself time",
			text: items[2],
			bullets: detailedSteps[2]?.bullets,
		},
		{
			icon: CalendarCheck,
			title: "Meet & reflect",
			text: items[3],
			bullets: detailedSteps[3]?.bullets,
		},
		{
			icon: RefreshCcw,
			title: "Wrap up & keep questing",
			text: items[4],
			bullets: detailedSteps[4]?.bullets,
		},
	].filter(Boolean);

	const introParas = paragraphs.slice(0, 2);
	const whatParas = paragraphs.slice(2, 5);

	return (
		<div className="relative bg-transparent min-h-[100svh] flex">
			{/* background wash */}
			<div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-sky-50/55 via-white/45 to-slate-50/55"
			/>

			<div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 my-auto">
				{/* Section: Introduction */}
				<motion.section
					role="region"
					aria-labelledby="intro-section"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5"
				>
					<h2
						id="intro-section"
						className="text-2xl font-bold"
						style={{ color: ACCENT }}
					>
						{title}
					</h2>

					{introParas.map((p, i) => (
						<p key={i} className="text-gray-800 leading-relaxed">
							{p}
						</p>
					))}

					{/* Quick summary — chips now use pill labels like "Tip" */}
					<dl
						className="grid sm:grid-cols-3 gap-3 sm:gap-4"
						aria-label="Quick summary"
					>
						<SummaryChip dt="Format" dd="10 activities • self-paced" />
						<SummaryChip dt="Collaboration" dd="Individual or team" />
						<SummaryChip dt="Goal" dd="Awareness & action for reconciliation" />
					</dl>
				</motion.section>

				{/* Section: What is the Learning Quest… */}
				<motion.section
					role="region"
					aria-labelledby="what-section"
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5"
				>
					<h3
						id="what-section"
						className="text-2xl font-bold"
						style={{ color: ACCENT }}
					>
						What is the Learning Quest on Indigenous Cultures?
					</h3>

					{whatParas.map((p, i) => (
						<p key={i} className="text-gray-800 leading-relaxed">
							{p}
						</p>
					))}
				</motion.section>

				{/* Tip — same callout style with a pill header */}
				<AccentBox label="Tip" accent={ACCENT}>
					<p className="text-base sm:text-lg text-center text-slate-800">
						Use a{" "}
						<span className="font-medium" style={{ color: ACCENT }}>
							safe, respectful space
						</span>{" "}
						for team check-ins and keep learning by sharing resources together.
					</p>
				</AccentBox>
			</div>
		</div>
	);
}
