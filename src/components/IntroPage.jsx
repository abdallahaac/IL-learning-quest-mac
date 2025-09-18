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

	// Optional richer details structure (non-breaking):
	// content.details?.steps = [
	//   { bullets: ["point 1", "point 2"] }, ...
	// ]
	const detailedSteps = content?.details?.steps ?? [];

	// Map steps to icons/titles + attach optional sub-bullets if provided
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

	// Section slices based on your doc layout
	const introParas = paragraphs.slice(0, 2);
	const whatParas = paragraphs.slice(2, 5);

	return (
		<div className="relative bg-transparent">
			{/* gradient layer */}
			<div
				aria-hidden
				className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-sky-50/85 via-white/75 to-slate-50/85"
			/>

			{/* content */}
			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
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
						className="text-2xl sm:text-3xl font-bold text-gray-900"
					>
						Introduction
					</h2>

					{/* keep your original title as a subtle subheader */}
					<p className="text-sm font-medium text-indigo-700/90">{title}</p>

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
						className="text-xl sm:text-2xl font-semibold text-gray-900"
					>
						What is the Learning Quest on Indigenous Cultures?
					</h3>

					{whatParas.map((p, i) => (
						<p key={i} className="text-gray-800 leading-relaxed">
							{p}
						</p>
					))}
				</motion.section>

				{/* Section: How does the Learning Quest work? */}
				<section role="region" aria-labelledby="how-section">
					<h3
						id="how-section"
						className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
					>
						{howHeading}
					</h3>

					<ol className="space-y-5">
						{steps.map((step, i) => {
							const Icon = step.icon;
							return (
								<motion.li
									key={i}
									initial={{ opacity: 0, x: -12 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
									transition={{ duration: 0.35, delay: i * 0.05 }}
									className="flex items-start gap-4"
								>
									<div
										aria-hidden="true"
										className="flex-none w-11 h-11 rounded-xl bg-sky-100 text-sky-700 grid place-items-center border border-sky-200"
									>
										<Icon className="w-6 h-6" />
									</div>

									<div className="min-w-0">
										<h4 className="text-base sm:text-lg font-medium text-gray-900">
											{i + 1}. {step.title}
										</h4>
										{step.text && <p className="text-gray-700">{step.text}</p>}

										{/* Optional sub-bullets, if provided */}
										{Array.isArray(step.bullets) && step.bullets.length > 0 && (
											<ul className="mt-2 space-y-1">
												{step.bullets.map((b, j) => (
													<li
														key={j}
														className="flex items-start gap-2 text-gray-700"
													>
														<CheckCircle2
															className="w-4 h-4 mt-0.5 text-emerald-600 flex-none"
															aria-hidden
														/>
														<span>{b}</span>
													</li>
												))}
											</ul>
										)}
									</div>
								</motion.li>
							);
						})}
					</ol>
				</section>

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
