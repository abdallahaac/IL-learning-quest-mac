// src/pages/activities/Activity03.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
	Utensils,
	ExternalLink,
	Feather,
	Infinity as InfinityIcon,
	Plus,
	X,
	Trash2,
} from "lucide-react";
import inuk from "../assets/inuk.svg";
import inukGrey from "../assets/inuk-grey.svg";

import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

/* #RRGGBB + "AA" → #RRGGBBAA */
const withAlpha = (hex, aa) => `${hex}${aa}`;

/* Simple wrapper so the imported SVG behaves like an icon component */
/* Simple wrapper so the imported SVG tints with currentColor */
function InukIcon({ className = "w-4 h-4", title = "Inuk symbol" }) {
	return (
		<span
			role="img"
			aria-label={title}
			className={className}
			style={{
				display: "inline-block",
				backgroundColor: "currentColor",
				WebkitMask: `url(${inuk}) center / contain no-repeat`,
				mask: `url(${inuk}) center / contain no-repeat`,
			}}
		/>
	);
}
/* Cross-fades between grey and orange versions of the Inuk SVG */
function InukSwapIcon({
	active,
	className = "w-4 h-4",
	title = "Inuk symbol",
}) {
	return (
		<span
			className={className}
			role="img"
			aria-label={title}
			style={{ display: "inline-block" }}
		>
			<motion.img
				key={active ? "inuk-color" : "inuk-grey"}
				src={active ? inuk : inukGrey}
				alt=""
				className="w-full h-full"
			/>
		</span>
	);
}

export default function Activity03({
	content,
	notes,
	onNotes,
	completed,
	onToggleComplete,
	accent = "#b45309", // theme color
}) {
	const reduceMotion = useReducedMotion();
	const activityNumber = 3;
	const storageKey = `recipes-${content?.id || "03"}`;

	// animations
	const pageFade = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.3 } },
	};
	const titleFade = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
		show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	};
	const cardPop = {
		hidden: {
			opacity: 0,
			y: reduceMotion ? 0 : 8,
			scale: reduceMotion ? 1 : 0.99,
		},
		show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
	};
	const reveal = {
		hidden: { opacity: 0, height: 0 },
		show: { opacity: 1, height: "auto", transition: { duration: 0.25 } },
		exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
	};

	// Reference link
	const referenceLink = {
		label: "Native/Indigenous recipes (First Nations Development Institute)",
		url: "https://www.firstnations.org/knowledge-center/recipes/",
	};

	// Model
	const initial = useMemo(() => {
		if (notes && typeof notes === "object" && Array.isArray(notes.recipes)) {
			return { recipes: notes.recipes };
		}
		try {
			const raw = localStorage.getItem(storageKey);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed && Array.isArray(parsed.recipes))
					return { recipes: parsed.recipes };
			}
		} catch {}
		return { recipes: [] };
	}, [notes, storageKey]);

	const [model, setModel] = useState(initial);

	const saveModel = (next) => {
		setModel(next);
		onNotes?.(next);
		try {
			localStorage.setItem(storageKey, JSON.stringify(next));
		} catch {}
	};

	useEffect(() => {
		if (notes && typeof notes === "object" && Array.isArray(notes.recipes)) {
			setModel({ recipes: notes.recipes });
			try {
				localStorage.setItem(
					storageKey,
					JSON.stringify({ recipes: notes.recipes })
				);
			} catch {}
		}
	}, [notes, storageKey]);

	// compute "started" from freshest model state (recipes)
	const started = hasActivityStarted(model, "recipes");

	// UI state for new recipe
	const [group, setGroup] = useState("firstNations");
	const [name, setName] = useState("");
	const [ing, setIng] = useState("");
	const [ingredients, setIngredients] = useState([]);

	// Inline edit state for saved items
	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState("");
	const [editIng, setEditIng] = useState("");
	const [editIngredients, setEditIngredients] = useState([]);
	const [justSavedId, setJustSavedId] = useState(null);

	const pills = [
		{ id: "firstNations", label: "First Nations", Icon: Feather },
		{ id: "inuit", label: "Inuit", Icon: InukIcon },
		{ id: "metis", label: "Métis", Icon: InfinityIcon },
	];

	const canAddIngredient = ing.trim().length > 0;
	const canSave = group && name.trim().length > 0 && ingredients.length > 0;

	const addIngredient = () => {
		const v = ing.trim();
		if (!v) return;
		setIngredients((prev) => [...prev, v]);
		setIng("");
	};

	const removeIngredient = (i) => {
		setIngredients((prev) => prev.filter((_, idx) => idx !== i));
	};

	const saveRecipe = () => {
		if (!canSave) return;
		const now = new Date().toISOString();
		const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
		const next = {
			recipes: [
				...model.recipes,
				{ id, group, name: name.trim(), ingredients, createdAt: now },
			],
		};
		saveModel(next);
		setName("");
		setIngredients([]);
		setIng("");
	};

	const deleteRecipe = (id) => {
		const next = { recipes: model.recipes.filter((r) => r.id !== id) };
		saveModel(next);
	};

	const filtered = model.recipes.filter((r) => r.group === group);

	// Inline edit controls
	const startEdit = (r) => {
		setEditingId(r.id);
		setEditName(r.name);
		setEditIng("");
		setEditIngredients([...r.ingredients]);
		setJustSavedId(null);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditName("");
		setEditIng("");
		setEditIngredients([]);
	};

	const canAddEditIngredient = editIng.trim().length > 0;
	const addEditIngredient = () => {
		const v = editIng.trim();
		if (!v) return;
		setEditIngredients((prev) => [...prev, v]);
		setEditIng("");
	};

	const removeEditIngredient = (i) => {
		setEditIngredients((prev) => prev.filter((_, idx) => idx !== i));
	};

	const saveEdit = () => {
		if (!editingId) return;
		const next = {
			recipes: model.recipes.map((r) =>
				r.id === editingId
					? {
							...r,
							name: editName.trim() || r.name,
							ingredients: editIngredients,
					  }
					: r
			),
		};
		saveModel(next);
		const savedId = editingId;
		cancelEdit();
		setJustSavedId(savedId);
		window.setTimeout(() => setJustSavedId(null), 1400);
	};

	// DOCX export for all recipes
	const downloadAllDocx = async () => {
		const items = Array.isArray(model.recipes) ? model.recipes : [];
		if (!items.length) return;

		const baseTitle = content?.title || "Make a Traditional Recipe";
		const title = `Activity ${activityNumber}: ${baseTitle}`;
		const fileName = "activity-a3-recipes.docx";

		try {
			const {
				Document,
				Packer,
				Paragraph,
				TextRun,
				AlignmentType,
				Table,
				TableRow,
				TableCell,
				WidthType,
				BorderStyle,
			} = await import("docx");

			const H1 = new Paragraph({
				alignment: AlignmentType.LEFT,
				spacing: { before: 0, after: 300 },
				children: [
					new TextRun({
						text: title,
						bold: true,
						size: 48,
						font: "Arial",
						color: accent,
					}),
				],
			});

			const tip1 = new Paragraph({
				spacing: { before: 0, after: 160 },
				children: [
					new TextRun({
						text: "Try your hand at making a traditional First Nations, Inuit or Métis recipe.",
						italics: true,
						font: "Arial",
						size: 24,
					}),
				],
			});
			const tip2 = new Paragraph({
				spacing: { before: 0, after: 180 },
				children: [
					new TextRun({
						text: "Share your experience or maybe have a lunch-time potluck.",
						italics: true,
						font: "Arial",
						size: 24,
					}),
				],
			});

			// Resources header
			const resourceHeading = new Paragraph({
				spacing: { before: 80, after: 120 },
				children: [
					new TextRun({
						text: "Resources",
						bold: true,
						font: "Arial",
						size: 32,
						color: accent,
					}),
				],
			});

			// Link line
			const resourceLine = new Paragraph({
				spacing: { before: 0, after: 280 },
				children: [
					new TextRun({
						text: `${referenceLink.label} — `,
						font: "Arial",
						size: 24,
					}),
					new TextRun({
						text: referenceLink.url,
						font: "Arial",
						size: 24,
						underline: {},
						color: "1155CC",
					}),
				],
			});

			const sections = [H1, tip1, tip2, resourceHeading, resourceLine];

			items
				.slice()
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				.forEach((r, idx) => {
					const header = new Paragraph({
						spacing: { before: idx === 0 ? 200 : 300, after: 120 },
						children: [
							new TextRun({
								text: r.name || "Untitled recipe",
								bold: true,
								font: "Arial",
								size: 32,
								color: accent,
							}),
							new TextRun({ text: "  •  ", font: "Arial", size: 24 }),
							new TextRun({
								text: labelForGroup(r.group),
								font: "Arial",
								size: 24,
								italics: true,
							}),
						],
					});

					const when = new Paragraph({
						spacing: { before: 0, after: 120 },
						children: [
							new TextRun({
								text: new Date(r.createdAt).toLocaleString(),
								font: "Arial",
								size: 20,
								color: "6B7280",
							}),
						],
					});

					const ingHeaderRow = new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph({
										children: [
											new TextRun({
												text: "Ingredients",
												bold: true,
												font: "Arial",
												size: 24,
											}),
										],
									}),
								],
							}),
						],
						tableHeader: true,
					});

					const ingRows = (r.ingredients || []).map(
						(it) =>
							new TableRow({
								children: [
									new TableCell({
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: String(it),
														font: "Arial",
														size: 24,
													}),
												],
											}),
										],
									}),
								],
							})
					);

					const table = new Table({
						width: { size: 100, type: WidthType.PERCENTAGE },
						rows: [ingHeaderRow, ...ingRows],
						borders: {
							top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
							bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
							left: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
							right: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
							insideHorizontal: {
								style: BorderStyle.SINGLE,
								size: 1,
								color: "E5E7EB",
							},
							insideVertical: {
								style: BorderStyle.SINGLE,
								size: 1,
								color: "E5E7EB",
							},
						},
					});

					sections.push(header, when, table);
				});

			const doc = new Document({
				styles: {
					default: {
						document: {
							run: { font: "Arial", size: 24 },
							paragraph: { spacing: { line: 360 } },
						},
					},
				},
				sections: [{ properties: {}, children: sections }],
			});

			const blob = await Packer.toBlob(doc);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch {
			// Fallback: Word-compatible HTML (+ Resources header)
			const esc = (s = "") =>
				String(s)
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
			const items = Array.isArray(model.recipes) ? model.recipes : [];
			const rows = (items || [])
				.map((r) => {
					const ings = (r.ingredients || [])
						.map((it) => `<li>${esc(it)}</li>`)
						.join("");
					return `
          <h2 style="font-size:16pt; color:${esc(
						accent
					)}; margin:18pt 0 6pt;">${esc(r.name || "Untitled recipe")}</h2>
          <p style="margin:0 0 6pt; color:#6B7280;">${esc(
						labelForGroup(r.group)
					)} • ${esc(new Date(r.createdAt).toLocaleString())}</p>
          <ul style="margin:0 0 12pt 18pt; font-size:12pt;">${ings}</ul>
        `;
				})
				.join("");

			const title = `Activity ${activityNumber}: ${esc(
				content?.title || "Make a Traditional Recipe"
			)}`;
			const html = `
      <html>
        <head><meta charset="utf-8"><title>${title}</title></head>
        <body style="font-family:Arial; line-height:1.5;">
          <h1 style="font-size:24pt; color:${esc(
						accent
					)}; margin:0 0 12pt;">${title}</h1>
          <p style="font-size:12pt; font-style:italic; margin:0 0 6pt;">
            Try your hand at making a traditional First Nations, Inuit or Métis recipe.
          </p>
          <p style="font-size:12pt; font-style:italic; margin:0 0 12pt;">
            Share your experience or maybe have a lunch-time potluck.
          </p>

          <!-- Resources header styled like a subheader -->
          <h2 style="font-size:16pt; color:${esc(
						accent
					)}; margin:12pt 0 8pt;">Resources</h2>
          <p style="font-size:12pt; margin:0 0 18pt;">
            ${esc(referenceLink.label)} —
            <a href="${esc(
							referenceLink.url
						)}" style="color:#1155CC; text-decoration:underline;">
              ${esc(referenceLink.url)}
            </a>
          </p>

          ${rows}
        </body>
      </html>
    `.trim();

			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "activity-a3-recipes.doc";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	// legacy txt downloader (kept for single-recipe buttons if you want to keep them)
	const downloadOne = (r) => {
		const body = [
			`Activity ${activityNumber}: ${
				content?.title || "Make a Traditional Recipe"
			}`,
			`Group: ${labelForGroup(r.group)}`,
			`Name: ${r.name}`,
			"",
			"Ingredients:",
			...r.ingredients.map((x) => `- ${x}`),
			"",
			`Saved: ${new Date(r.createdAt).toLocaleString()}`,
			`Source: ${referenceLink.url}`,
		].join("\n");
		downloadBlob(body, `Recipe-${safe(r.name)}.txt`);
	};

	return (
		<motion.div
			className="relative bg-transparent min-h-[70svh]"
			variants={pageFade}
			initial="hidden"
			animate="show"
		>
			{/* background gradient */}
			<motion.div
				aria-hidden
				className="fixed inset-0 -z-10 pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(to bottom, ${withAlpha(
						accent,
						"26"
					)} 0%, rgba(255,255,255,0.0) 45%, rgba(248,250,252,0) 100%)`,
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			/>

			<div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
				{/* ===== HEADER ===== */}
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
							Activity {activityNumber}
						</p>

						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{content?.title || "Make a Traditional Recipe"}
							</h1>
							<Utensils
								className="w-8 h-8 align-middle"
								aria-hidden="true"
								style={{ color: accent }}
								title="Activity icon"
							/>
						</div>

						{/* Instructions callout */}
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
									Instructions
								</div>
								<p
									className="text-slate-800 max-w-2xl"
									style={{ color: accent }}
								>
									Try your hand at making a traditional First Nations, Inuit or
									Métis recipe.
									<br />
									<strong>
										Share your experience or maybe have a lunch-time potluck.
									</strong>
								</p>
								<div className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600"></div>
							</div>
						</aside>
					</div>
				</motion.header>

				{/* Reference card — directly below instructions */}
				<motion.section
					className="flex justify-center"
					variants={cardPop}
					initial="hidden"
					animate="show"
				>
					<a
						href={referenceLink.url}
						target="_blank"
						rel="noreferrer"
						className="group block max-w-md w-full rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
						style={{
							outlineColor: accent,
							borderColor: withAlpha(accent, "33"),
						}}
						title="Open Indigenous recipes resource (new tab)"
						aria-label="Open Indigenous recipes resource in a new tab"
					>
						<div className="flex items-center gap-3">
							<span
								className="w-10 h-10 rounded-xl grid place-items-center"
								style={{
									backgroundColor: withAlpha(accent, "1A"),
									color: accent,
								}}
							>
								<Utensils className="w-5 h-5" aria-hidden="true" />
							</span>
							<div className="font-medium text-gray-800 group-hover:underline">
								{referenceLink.label}
							</div>
						</div>
						<div
							className="mt-2 flex items-center justify-center gap-1 text-xs font-medium"
							style={{ color: accent }}
						>
							<ExternalLink className="w-4 h-4" aria-hidden="true" />
							<span>Open link</span>
						</div>
					</a>
				</motion.section>

				{/* ===== Builder ===== */}
				<section className="mx-auto max-w-3xl w-full">
					<motion.div
						className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm"
						style={{ borderColor: withAlpha(accent, "33") }}
						variants={cardPop}
						initial="hidden"
						animate="show"
					>
						<div className="flex items-center justify-center gap-2 sm:gap-3">
							{[
								{ id: "firstNations", label: "First Nations", Icon: Feather },
								{ id: "inuit", label: "Inuit", Icon: null }, // we'll render custom
								{ id: "metis", label: "Métis", Icon: InfinityIcon },
							].map(({ id, label, Icon }) => {
								const active = id === group;
								return (
									<button
										key={id}
										type="button"
										onClick={() => setGroup(id)}
										className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border transition ${
											active ? "bg-white shadow-sm" : "bg-white/70"
										}`}
										style={{
											borderColor: active
												? withAlpha(accent, "66")
												: "rgba(203,213,225,0.8)",
											color: active ? accent : "#334155",
										}}
										aria-pressed={active}
									>
										{id === "inuit" ? (
											<InukSwapIcon active={active} className="w-4 h-4" />
										) : (
											<Icon
												className="w-4 h-4 transition-colors"
												aria-hidden="true"
											/>
										)}
										<span className="font-medium">{label}</span>
									</button>
								);
							})}
						</div>

						{/* Step 2: name field */}
						<AnimatePresence initial={false}>
							<motion.div
								key="name"
								variants={reveal}
								initial="hidden"
								animate="show"
								exit="exit"
								className="mt-4"
							>
								<label className="block text-xs text-slate-600 mb-1">
									Recipe name
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g., Wild Rice Hamburgers"
									className="w-full rounded-lg border px-3 py-2 text-sm"
									style={{ borderColor: withAlpha(accent, "33") }}
								/>
							</motion.div>
						</AnimatePresence>

						{/* Step 3: ingredients */}
						<AnimatePresence initial={false}>
							{name.trim() && (
								<motion.div
									key="ingredients"
									variants={reveal}
									initial="hidden"
									animate="show"
									exit="exit"
									className="mt-4"
								>
									<label className="block text-xs text-slate-600 mb-1">
										Ingredients
									</label>
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={ing}
											onChange={(e) => setIng(e.target.value)}
											onKeyDown={(e) =>
												e.key === "Enter" && canAddIngredient && addIngredient()
											}
											placeholder="Add an ingredient and press Enter"
											className="flex-1 rounded-lg border px-3 py-2 text-sm"
											style={{ borderColor: withAlpha(accent, "33") }}
										/>
										<button
											type="button"
											onClick={addIngredient}
											disabled={!canAddIngredient}
											className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
											style={{
												borderColor: withAlpha(accent, "44"),
												color: accent,
												backgroundColor: withAlpha(accent, "0F"),
											}}
											title="Add ingredient"
										>
											<Plus className="w-4 h-4" />
											Add
										</button>
									</div>

									{/* chips */}
									<ul className="mt-2 flex flex-wrap gap-2">
										{ingredients.map((it, i) => (
											<li
												key={`${it}-${i}`}
												className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
												style={{ borderColor: withAlpha(accent, "33") }}
											>
												<span>{it}</span>
												<button
													type="button"
													onClick={() => removeIngredient(i)}
													className="p-0.5 rounded-full hover:bg-slate-100"
													aria-label={`Remove ${it}`}
													title={`Remove ${it}`}
												>
													<X className="w-3.5 h-3.5" />
												</button>
											</li>
										))}
									</ul>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Step 4: save */}
						<AnimatePresence initial={false}>
							{ingredients.length > 0 && (
								<motion.div
									key="save"
									variants={reveal}
									initial="hidden"
									animate="show"
									exit="exit"
									className="mt-4 flex items-center justify-end"
								>
									<button
										type="button"
										onClick={saveRecipe}
										disabled={!canSave}
										className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
										style={{
											borderColor: withAlpha(accent, "44"),
											color: accent,
											backgroundColor: withAlpha(accent, "0F"),
										}}
										title="Save recipe"
									>
										Save recipe
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</section>

				{/* ===== Saved recipes (filtered by current pill) ===== */}
				<section className="mx-auto max-w-3xl w-full">
					<motion.div
						className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm"
						style={{ borderColor: withAlpha(accent, "33") }}
						variants={cardPop}
						initial="hidden"
						animate="show"
					>
						<div className="mb-2 flex items-center justify-between">
							<h2 className="text-sm font-semibold text-slate-800">
								Saved recipes ·{" "}
								<span style={{ color: accent }}>{labelForGroup(group)}</span>
							</h2>
						</div>

						{filtered.length === 0 ? (
							<p className="text-sm text-slate-600">
								Nothing here yet. Save a recipe above.
							</p>
						) : (
							<ul className="grid gap-3">
								{filtered
									.slice()
									.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
									.map((r) => {
										const isEditing = r.id === editingId;
										const showSavedFlash = r.id === justSavedId;

										return (
											<li
												key={r.id}
												className="rounded-xl border p-3 sm:p-4"
												style={{ borderColor: withAlpha(accent, "33") }}
											>
												{!isEditing ? (
													<>
														<div className="flex items-start justify-between gap-3">
															<div>
																<div
																	className="font-semibold"
																	style={{ color: accent }}
																>
																	{r.name}
																</div>
																<div className="text-xs text-slate-500 mt-0.5">
																	{new Date(r.createdAt).toLocaleString()} •{" "}
																	{r.ingredients.length} ingredient
																	{r.ingredients.length !== 1 ? "s" : ""}
																</div>
															</div>
															<div className="flex items-center gap-2">
																<button
																	type="button"
																	onClick={() => startEdit(r)}
																	className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
																	style={{
																		borderColor: withAlpha(accent, "44"),
																		color: accent,
																		backgroundColor: withAlpha(accent, "0F"),
																	}}
																	title={`Edit ${r.name}`}
																>
																	Edit
																</button>
																<button
																	type="button"
																	onClick={() => deleteRecipe(r.id)}
																	className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium hover:bg-red-50"
																	style={{
																		borderColor: withAlpha(accent, "22"),
																		color: "#991b1b",
																		backgroundColor: "white",
																	}}
																	title={`Delete ${r.name}`}
																>
																	<Trash2 className="w-4 h-4" />
																	Delete
																</button>
															</div>
														</div>

														{/* ingredients list */}
														<ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
															{r.ingredients.map((it, i) => (
																<li
																	key={`${r.id}-${i}`}
																	className="flex items-center gap-2"
																>
																	<span
																		className="inline-block w-1.5 h-1.5 rounded-full"
																		style={{
																			backgroundColor: withAlpha(accent, "AA"),
																		}}
																		aria-hidden="true"
																	/>
																	{it}
																</li>
															))}
														</ul>

														{/* tiny saved flash */}
														<AnimatePresence>
															{showSavedFlash && (
																<motion.div
																	initial={{ opacity: 0 }}
																	animate={{ opacity: 1 }}
																	exit={{ opacity: 0 }}
																	transition={{ duration: 0.25 }}
																	className="mt-2 text-xs font-medium"
																	style={{ color: accent }}
																	aria-live="polite"
																>
																	Saved
																</motion.div>
															)}
														</AnimatePresence>
													</>
												) : (
													// EDIT MODE
													<div className="space-y-3">
														<div>
															<label className="block text-xs text-slate-600 mb-1">
																Recipe name
															</label>
															<input
																type="text"
																value={editName}
																onChange={(e) => setEditName(e.target.value)}
																className="w-full rounded-lg border px-3 py-2 text-sm"
																style={{ borderColor: withAlpha(accent, "33") }}
															/>
														</div>

														<div>
															<label className="block text-xs text-slate-600 mb-1">
																Ingredients
															</label>
															<div className="flex items-center gap-2">
																<input
																	type="text"
																	value={editIng}
																	onChange={(e) => setEditIng(e.target.value)}
																	onKeyDown={(e) =>
																		e.key === "Enter" &&
																		canAddEditIngredient &&
																		addEditIngredient()
																	}
																	placeholder="Add an ingredient and press Enter"
																	className="flex-1 rounded-lg border px-3 py-2 text-sm"
																	style={{
																		borderColor: withAlpha(accent, "33"),
																	}}
																/>
																<button
																	type="button"
																	onClick={addEditIngredient}
																	disabled={!canAddEditIngredient}
																	className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
																	style={{
																		borderColor: withAlpha(accent, "44"),
																		color: accent,
																		backgroundColor: withAlpha(accent, "0F"),
																	}}
																	title="Add ingredient"
																>
																	<Plus className="w-4 h-4" />
																	Add
																</button>
															</div>

															<ul className="mt-2 flex flex-wrap gap-2">
																{editIngredients.map((it, i) => (
																	<li
																		key={`${r.id}-edit-${i}`}
																		className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
																		style={{
																			borderColor: withAlpha(accent, "33"),
																		}}
																	>
																		<span>{it}</span>
																		<button
																			type="button"
																			onClick={() => removeEditIngredient(i)}
																			className="p-0.5 rounded-full hover:bg-slate-100"
																			aria-label={`Remove ${it}`}
																			title={`Remove ${it}`}
																		>
																			<X className="w-3.5 h-3.5" />
																		</button>
																	</li>
																))}
															</ul>
														</div>

														<div className="pt-1 flex items-center justify-end gap-2">
															<button
																type="button"
																onClick={cancelEdit}
																className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
																style={{
																	borderColor: withAlpha(accent, "22"),
																	color: "#334155",
																	backgroundColor: "white",
																}}
																title="Cancel"
															>
																Cancel
															</button>
															<button
																type="button"
																onClick={saveEdit}
																className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
																style={{
																	borderColor: withAlpha(accent, "44"),
																	color: accent,
																	backgroundColor: withAlpha(accent, "0F"),
																}}
																title="Save"
															>
																Save
															</button>
														</div>
													</div>
												)}
											</li>
										);
									})}
							</ul>
						)}
					</motion.div>
				</section>

				{/* Bottom action bar: Mark Complete on left, Download DOCX on right */}
				<div className="flex justify-end gap-2">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>

					{/* Download all (.docx) sits to the RIGHT; greyed out when empty */}
					<button
						type="button"
						onClick={downloadAllDocx}
						className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
						style={{
							backgroundColor: accent,
							color: "#fff",
							borderColor: withAlpha(accent, "66"),
						}}
						title="Download all saved recipes as .docx"
					>
						Download all (.docx)
					</button>
				</div>
			</div>
		</motion.div>
	);
}

/* ---------------- helpers ---------------- */
function downloadBlob(text, filename) {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

function labelForGroup(id) {
	switch (id) {
		case "firstNations":
			return "First Nations";
		case "inuit":
			return "Inuit";
		case "metis":
			return "Métis";
		default:
			return id;
	}
}

function safe(s) {
	return String(s)
		.replace(/[^\w\-]+/g, "_")
		.slice(0, 60);
}
