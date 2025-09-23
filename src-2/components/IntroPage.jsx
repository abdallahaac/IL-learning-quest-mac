// src/components/IntroPage.jsx
import React from "react";
import { motion } from "framer-motion";
import {
	Users,
	Compass,
	Clock,
	CalendarCheck,
	RefreshCcw,
	CheckCircle2,
} from "lucide-react";

export default function IntroPage({ content }) {
	const title = content?.title || "Introduction & Quest Info";
	const paragraphs = content?.paragraphs ?? [];
	const howHeading =
		content?.bullets?.[0]?.heading ?? "How does the Learning Quest work?";
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
		/**
		 * Centering approach:
		 * - Outer wrapper is a flex container.
		 * - Inner content uses `my-auto` to vertically center ONLY when there’s extra space.
		 * - `pb-24` protects the content from the fixed footer.
		 */
		<div className="relative bg-transparent min-h-[100svh]  flex">
			{/* gradient layer — FIXED to cover the whole window */}
			<div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-sky-50/55 via-white/45 to-slate-50/55"
			/>

			{/* content */}
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
						className="text-2xl font-bold text-indigo-700/90"
					>
						{title}
					</h2>

					{introParas.map((p, i) => (
						<p key={i} className="text-gray-800 leading-relaxed">
							{p}
						</p>
					))}

					{/* quick summary chips */}
					<dl
						className="grid sm:grid-cols-3 gap-3 sm:gap-4 mt-4"
						aria-label="Quick summary"
					>
						<div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
							<dt className="text-xs font-medium text-sky-800">Format</dt>
							<dd className="text-sm text-gray-800">
								10 activities • self-paced
							</dd>
						</div>
						<div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
							<dt className="text-xs font-medium text-indigo-800">
								Collaboration
							</dt>
							<dd className="text-sm text-gray-800">Individual or team</dd>
						</div>
						<div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
							<dt className="text-xs font-medium text-emerald-800">Goal</dt>
							<dd className="text-sm text-gray-800">
								Awareness & action for reconciliation
							</dd>
						</div>
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
						className="text-2xl font-bold text-indigo-700/90"
					>
						What is the Learning Quest on Indigenous Cultures?
					</h3>

					{whatParas.map((p, i) => (
						<p key={i} className="text-gray-800 leading-relaxed">
							{p}
						</p>
					))}
				</motion.section>

				{/* Tip */}
				<div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
					<p className="text-sm text-gray-700">
						Tip: Use a{" "}
						<span className="font-medium">safe, respectful space</span> for team
						check-ins and keep learning by sharing resources together.
					</p>
				</div>
			</div>
		</div>
	);
}
