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

/* SVG wrappers */
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

/* Format helpers */
const formatIngredient = (it) => {
	if (typeof it === "string") return it;
	if (!it || typeof it !== "object") return "";
	const qty = it.qty ? String(it.qty).trim() : "";
	const unit = it.unit || "";
	const name = it.item || "";
	return [qty, unit, name].filter(Boolean).join(" ");
};
const formatDirectionsText = (steps = []) =>
	steps.map((s, i) => `${i + 1}. ${s}`).join("\n");

export default function Activity03({
	content,
	notes,
	onNotes,
	completed,
	onToggleComplete,
	accent = "#b45309",
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

	// Model (normalize ingredients + directions)
	const initial = useMemo(() => {
		const fromNotes = notes && typeof notes === "object" ? notes : null;
		const tryLocal = () => {
			try {
				const raw = localStorage.getItem(storageKey);
				if (raw) return JSON.parse(raw);
			} catch {}
			return null;
		};
		const base = fromNotes ?? tryLocal() ?? { recipes: [] };
		const recipes = Array.isArray(base.recipes)
			? base.recipes.map((r) => ({
					...r,
					// directions normalized to array of steps
					directions: Array.isArray(r.directions)
						? r.directions
						: typeof r.directions === "string" && r.directions.trim()
						? [r.directions.trim()]
						: [],
					// ingredients normalized to objects
					ingredients: Array.isArray(r.ingredients)
						? r.ingredients.map((it) =>
								typeof it === "string" ? { item: it, qty: "", unit: "" } : it
						  )
						: [],
			  }))
			: [];
		return { recipes };
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
			const normalized = {
				recipes: notes.recipes.map((r) => ({
					...r,
					directions: Array.isArray(r.directions)
						? r.directions
						: typeof r.directions === "string" && r.directions.trim()
						? [r.directions.trim()]
						: [],
					ingredients: Array.isArray(r.ingredients)
						? r.ingredients.map((it) =>
								typeof it === "string" ? { item: it, qty: "", unit: "" } : it
						  )
						: [],
				})),
			};
			setModel(normalized);
			try {
				localStorage.setItem(storageKey, JSON.stringify(normalized));
			} catch {}
		}
	}, [notes, storageKey]);

	const started = hasActivityStarted(model, "recipes");

	// UI state for new recipe
	const [group, setGroup] = useState("firstNations");
	const [name, setName] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [steps, setSteps] = useState([]);

	// Ingredient composer (embedded controls)
	const [ingItem, setIngItem] = useState("");
	const [ingQty, setIngQty] = useState("");
	const [ingUnit, setIngUnit] = useState("");

	// Directions composer (add steps)
	const [stepText, setStepText] = useState("");

	// Inline edit state
	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState("");
	const [editIngredients, setEditIngredients] = useState([]);
	const [editSteps, setEditSteps] = useState([]);
	const [editIngItem, setEditIngItem] = useState("");
	const [editIngQty, setEditIngQty] = useState("");
	const [editIngUnit, setEditIngUnit] = useState("");
	const [editStepText, setEditStepText] = useState("");
	const [justSavedId, setJustSavedId] = useState(null);

	const unitOptions = [
		"tsp",
		"tbsp",
		"ml",
		"L",
		"cup",
		"cups",
		"g",
		"kg",
		"oz",
		"lb",
		"pinch",
		"clove",
		"slice",
	];

	const canAddIngredient = ingItem.trim().length > 0;
	const canAddStep = stepText.trim().length > 0;
	const canSave = group && name.trim().length > 0 && ingredients.length > 0;

	const addIngredient = () => {
		if (!canAddIngredient) return;
		const nextIt = {
			item: ingItem.trim(),
			qty: (ingQty || "").trim(),
			unit: (ingUnit || "").trim(),
		};
		setIngredients((prev) => [...prev, nextIt]);
		setIngItem("");
		setIngQty("");
		setIngUnit("");
	};
	const removeIngredient = (i) =>
		setIngredients((prev) => prev.filter((_, idx) => idx !== i));

	const addStep = () => {
		if (!canAddStep) return;
		setSteps((prev) => [...prev, stepText.trim()]);
		setStepText("");
	};
	const removeStep = (i) =>
		setSteps((prev) => prev.filter((_, idx) => idx !== i));

	const saveRecipe = () => {
		if (!canSave) return;
		const now = new Date().toISOString();
		const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
		const next = {
			recipes: [
				...model.recipes,
				{
					id,
					group,
					name: name.trim(),
					ingredients,
					directions: steps, // array of steps
					createdAt: now,
				},
			],
		};
		saveModel(next);
		setName("");
		setIngredients([]);
		setIngItem("");
		setIngQty("");
		setIngUnit("");
		setSteps([]);
		setStepText("");
	};

	const deleteRecipe = (id) => {
		const next = { recipes: model.recipes.filter((r) => r.id !== id) };
		saveModel(next);
	};

	const filtered = model.recipes.filter((r) => r.group === group);

	// Edit flow
	const startEdit = (r) => {
		setEditingId(r.id);
		setEditName(r.name);
		setEditIngredients([...r.ingredients]);
		setEditSteps(Array.isArray(r.directions) ? [...r.directions] : []);
		setEditIngItem("");
		setEditIngQty("");
		setEditIngUnit("");
		setEditStepText("");
		setJustSavedId(null);
	};
	const cancelEdit = () => {
		setEditingId(null);
		setEditName("");
		setEditIngredients([]);
		setEditSteps([]);
		setEditIngItem("");
		setEditIngQty("");
		setEditIngUnit("");
		setEditStepText("");
	};
	const addEditIngredient = () => {
		if (!editIngItem.trim()) return;
		setEditIngredients((prev) => [
			...prev,
			{
				item: editIngItem.trim(),
				qty: (editIngQty || "").trim(),
				unit: (editIngUnit || "").trim(),
			},
		]);
		setEditIngItem("");
		setEditIngQty("");
		setEditIngUnit("");
	};
	const removeEditIngredient = (i) =>
		setEditIngredients((prev) => prev.filter((_, idx) => idx !== i));

	const addEditStep = () => {
		if (!editStepText.trim()) return;
		setEditSteps((prev) => [...prev, editStepText.trim()]);
		setEditStepText("");
	};
	const removeEditStep = (i) =>
		setEditSteps((prev) => prev.filter((_, idx) => idx !== i));

	const saveEdit = () => {
		if (!editingId) return;
		const next = {
			recipes: model.recipes.map((r) =>
				r.id === editingId
					? {
							...r,
							name: editName.trim() || r.name,
							ingredients: editIngredients,
							directions: editSteps, // array
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

	// DOCX export (uses formatted ingredients + numbered directions)
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
														text: formatIngredient(it),
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

					const ingTable = new Table({
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

					sections.push(header, when, ingTable);

					if ((r.directions || []).length > 0) {
						sections.push(
							new Paragraph({
								spacing: { before: 160, after: 80 },
								children: [
									new TextRun({
										text: "Directions",
										bold: true,
										font: "Arial",
										size: 24,
										color: accent,
									}),
								],
							})
						);
						(r.directions || []).forEach((step, i) => {
							sections.push(
								new Paragraph({
									spacing: { before: 0, after: 80 },
									children: [
										new TextRun({
											text: `${i + 1}. ${step}`,
											font: "Arial",
											size: 24,
										}),
									],
								})
							);
						});
					}
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
			// Fallback: Word-compatible HTML
			const esc = (s = "") =>
				String(s)
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
			const items = Array.isArray(model.recipes) ? model.recipes : [];
			const rows = (items || [])
				.map((r) => {
					const ings = (r.ingredients || [])
						.map((it) => `<li>${esc(formatIngredient(it))}</li>`)
						.join("");
					const steps = (r.directions || [])
						.map((s, i) => `<li>${esc(`${i + 1}. ${s}`)}</li>`)
						.join("");
					const dir = steps
						? `<h3 style="font-size:13pt; color:${esc(
								accent
						  )}; margin:10pt 0 6pt;">Directions</h3>
               <ol style="margin:0 0 12pt 18pt; font-size:12pt; list-style:none; padding-left:0;">
                 ${steps}
               </ol>`
						: "";
					return `
            <h2 style="font-size:16pt; color:${esc(
							accent
						)}; margin:18pt 0 6pt;">${esc(r.name || "Untitled recipe")}</h2>
            <p style="margin:0 0 6pt; color:#6B7280;">${esc(
							labelForGroup(r.group)
						)} • ${esc(new Date(r.createdAt).toLocaleString())}</p>
            <h3 style="font-size:13pt; color:${esc(
							accent
						)}; margin:10pt 0 6pt;">Ingredients</h3>
            <ul style="margin:0 0 12pt 18pt; font-size:12pt;">${ings}</ul>
            ${dir}
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
            <p style="font-size:12pt; font-style:italic; margin:0 0 6pt;">Try your hand at making a traditional First Nations, Inuit or Métis recipe.</p>
            <p style="font-size:12pt; font-style:italic; margin:0 0 12pt;">Share your experience or maybe have a lunch-time potluck.</p>
            <h2 style="font-size:16pt; color:${esc(
							accent
						)}; margin:12pt 0 8pt;">Resources</h2>
            <p style="font-size:12pt; margin:0 0 18pt;">${esc(
							referenceLink.label
						)} —
              <a href="${esc(
								referenceLink.url
							)}" style="color:#1155CC; text-decoration:underline;">${esc(
				referenceLink.url
			)}</a>
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

	const downloadOne = (r) => {
		const body = [
			`Activity ${activityNumber}: ${
				content?.title || "Make a Traditional Recipe"
			}`,
			`Group: ${labelForGroup(r.group)}`,
			`Name: ${r.name}`,
			"",
			"Ingredients:",
			...(r.ingredients || []).map((x) => `- ${formatIngredient(x)}`),
			"",
			(r.directions || []).length
				? "Directions:\n" + formatDirectionsText(r.directions) + "\n"
				: "",
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
							</div>
						</aside>
					</div>
				</motion.header>

				{/* Reference card */}
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
						{/* Group pills */}
						<div className="flex items-center justify-center gap-2 sm:gap-3">
							{[
								{ id: "firstNations", label: "First Nations", Icon: Feather },
								{ id: "inuit", label: "Inuit", Icon: null },
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

						{/* Name */}
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

						{/* Ingredients */}
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

									{/* Embedded controls */}
									<div
										className="relative rounded-lg border text-sm flex items-stretch"
										style={{ borderColor: withAlpha(accent, "33") }}
									>
										{/* Item */}
										<input
											type="text"
											value={ingItem}
											onChange={(e) => setIngItem(e.target.value)}
											onKeyDown={(e) =>
												e.key === "Enter" && canAddIngredient && addIngredient()
											}
											placeholder="Ingredient (e.g., wild rice)"
											className="flex-1 bg-transparent px-3 py-2 rounded-l-lg focus:outline-none"
										/>

										{/* Divider */}
										<span
											aria-hidden
											className="self-stretch"
											style={{
												width: 1,
												backgroundColor: withAlpha(accent, "22"),
											}}
										/>

										{/* Qty */}
										<input
											type="text"
											inputMode="decimal"
											value={ingQty}
											onChange={(e) => setIngQty(e.target.value)}
											placeholder="qty"
											className="w-20 text-center bg-white"
											style={{
												color: accent,
												backgroundColor: withAlpha(accent, "0F"),
												borderLeft: `1px solid ${withAlpha(accent, "22")}`,
											}}
										/>

										{/* Unit (text field with suggestions) */}
										<input
											type="text"
											value={ingUnit}
											onChange={(e) => setIngUnit(e.target.value)}
											placeholder="unit"
											className="w-24 text-center bg-white rounded-r-lg"
											style={{
												color: accent,
												backgroundColor: withAlpha(accent, "0F"),
												borderLeft: `1px solid ${withAlpha(accent, "22")}`,
											}}
										/>
									</div>

									{/* Suggested units */}
									<datalist id="unitOptions">
										{unitOptions.map((u) => (
											<option key={u} value={u} />
										))}
									</datalist>

									{/* Add button */}
									<div className="mt-2">
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
												key={`${formatIngredient(it)}-${i}`}
												className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
												style={{ borderColor: withAlpha(accent, "33") }}
											>
												<span>{formatIngredient(it)}</span>
												<button
													type="button"
													onClick={() => removeIngredient(i)}
													className="p-0.5 rounded-full hover:bg-slate-100"
													aria-label={`Remove ${formatIngredient(it)}`}
													title={`Remove ${formatIngredient(it)}`}
												>
													<X className="w-3.5 h-3.5" />
												</button>
											</li>
										))}
									</ul>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Directions as addable steps */}
						<AnimatePresence initial={false}>
							{name.trim() && (
								<motion.div
									key="directions"
									variants={reveal}
									initial="hidden"
									animate="show"
									exit="exit"
									className="mt-4"
								>
									<label className="block text-xs text-slate-600 mb-1">
										Directions (steps)
									</label>

									<div
										className="relative rounded-lg border text-sm flex items-stretch"
										style={{ borderColor: withAlpha(accent, "33") }}
									>
										<input
											type="text"
											value={stepText}
											onChange={(e) => setStepText(e.target.value)}
											onKeyDown={(e) =>
												e.key === "Enter" && canAddStep && addStep()
											}
											placeholder="Add a step and press Enter (e.g., Rinse wild rice until water runs clear)"
											className="flex-1 bg-transparent px-3 py-2 rounded-l-lg focus:outline-none"
										/>
										<span
											aria-hidden
											className="self-stretch"
											style={{
												width: 1,
												backgroundColor: withAlpha(accent, "22"),
											}}
										/>
										<button
											type="button"
											onClick={addStep}
											disabled={!canAddStep}
											className="px-3 py-2 rounded-r-lg text-sm font-medium"
											style={{
												color: accent,
												backgroundColor: withAlpha(accent, "0F"),
												borderLeft: `1px solid ${withAlpha(accent, "22")}`,
											}}
											title="Add step"
										>
											Add
										</button>
									</div>

									{/* steps list */}
									<ol className="mt-2 grid gap-1 text-sm text-slate-700 list-none pl-0">
										{steps.map((s, i) => (
											<li key={`${s}-${i}`} className="flex items-start gap-2">
												<span
													className="inline-flex items-center justify-center mt-[2px] w-5 h-5 rounded-full text-[11px] font-semibold"
													style={{
														color: "#fff",
														backgroundColor: withAlpha(accent, "CC"),
													}}
													aria-hidden="true"
												>
													{i + 1}
												</span>
												<div className="flex-1">{s}</div>
												<button
													type="button"
													onClick={() => removeStep(i)}
													className="p-0.5 rounded hover:bg-slate-100"
													aria-label={`Remove step ${i + 1}`}
													title={`Remove step ${i + 1}`}
												>
													<X className="w-3.5 h-3.5" />
												</button>
											</li>
										))}
									</ol>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Save */}
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

				{/* ===== Saved recipes ===== */}
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
															{(r.ingredients || []).map((it, i) => (
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
																	{formatIngredient(it)}
																</li>
															))}
														</ul>

														{/* directions steps */}
														{(r.directions || []).length > 0 && (
															<div className="mt-3">
																<div
																	className="text-xs font-semibold"
																	style={{ color: accent }}
																>
																	Directions
																</div>
																<ol className="mt-1 grid gap-1 text-sm text-slate-700 list-none pl-0">
																	{(r.directions || []).map((s, i) => (
																		<li
																			key={`${r.id}-step-${i}`}
																			className="flex items-start gap-2"
																		>
																			<span
																				className="inline-flex items-center justify-center mt-[2px] w-5 h-5 rounded-full text-[11px] font-semibold"
																				style={{
																					color: "#fff",
																					backgroundColor: withAlpha(
																						accent,
																						"CC"
																					),
																				}}
																				aria-hidden="true"
																			>
																				{i + 1}
																			</span>
																			<div className="flex-1">{s}</div>
																		</li>
																	))}
																</ol>
															</div>
														)}

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

														{/* Ingredients editor */}
														<div>
															<label className="block text-xs text-slate-600 mb-1">
																Ingredients
															</label>

															<div
																className="relative rounded-lg border text-sm flex items-stretch"
																style={{ borderColor: withAlpha(accent, "33") }}
															>
																<input
																	type="text"
																	value={editIngItem}
																	onChange={(e) =>
																		setEditIngItem(e.target.value)
																	}
																	onKeyDown={(e) =>
																		e.key === "Enter" &&
																		editIngItem.trim() &&
																		addEditIngredient()
																	}
																	placeholder="Ingredient (e.g., bannock flour)"
																	className="flex-1 bg-transparent px-3 py-2 rounded-l-lg focus:outline-none"
																/>
																<span
																	aria-hidden
																	className="self-stretch"
																	style={{
																		width: 1,
																		backgroundColor: withAlpha(accent, "22"),
																	}}
																/>
																<input
																	type="text"
																	inputMode="decimal"
																	value={editIngQty}
																	onChange={(e) =>
																		setEditIngQty(e.target.value)
																	}
																	placeholder="qty"
																	className="w-20 text-center bg-white"
																	style={{
																		color: accent,
																		backgroundColor: withAlpha(accent, "0F"),
																		borderLeft: `1px solid ${withAlpha(
																			accent,
																			"22"
																		)}`,
																	}}
																/>
																<input
																	type="text"
																	value={editIngUnit}
																	onChange={(e) =>
																		setEditIngUnit(e.target.value)
																	}
																	list="unitOptions"
																	placeholder="unit"
																	className="w-24 text-center bg-white rounded-r-lg"
																	style={{
																		color: accent,
																		backgroundColor: withAlpha(accent, "0F"),
																		borderLeft: `1px solid ${withAlpha(
																			accent,
																			"22"
																		)}`,
																	}}
																/>
															</div>

															<div className="mt-2">
																<button
																	type="button"
																	onClick={addEditIngredient}
																	disabled={!editIngItem.trim()}
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
																		key={`ing-${r.id}-edit-${i}`}
																		className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
																		style={{
																			borderColor: withAlpha(accent, "33"),
																		}}
																	>
																		<span>{formatIngredient(it)}</span>
																		<button
																			type="button"
																			onClick={() => removeEditIngredient(i)}
																			className="p-0.5 rounded-full hover:bg-slate-100"
																			aria-label={`Remove ${formatIngredient(
																				it
																			)}`}
																			title={`Remove ${formatIngredient(it)}`}
																		>
																			<X className="w-3.5 h-3.5" />
																		</button>
																	</li>
																))}
															</ul>
														</div>

														{/* Directions editor (steps) */}
														<div>
															<label className="block text-xs text-slate-600 mb-1">
																Directions (steps)
															</label>

															<div
																className="relative rounded-lg border text-sm flex items-stretch"
																style={{ borderColor: withAlpha(accent, "33") }}
															>
																<input
																	type="text"
																	value={editStepText}
																	onChange={(e) =>
																		setEditStepText(e.target.value)
																	}
																	onKeyDown={(e) =>
																		e.key === "Enter" &&
																		editStepText.trim() &&
																		addEditStep()
																	}
																	placeholder="Add a step and press Enter"
																	className="flex-1 bg-transparent px-3 py-2 rounded-l-lg focus:outline-none"
																/>
																<span
																	aria-hidden
																	className="self-stretch"
																	style={{
																		width: 1,
																		backgroundColor: withAlpha(accent, "22"),
																	}}
																/>
																<button
																	type="button"
																	onClick={addEditStep}
																	disabled={!editStepText.trim()}
																	className="px-3 py-2 rounded-r-lg text-sm font-medium"
																	style={{
																		color: accent,
																		backgroundColor: withAlpha(accent, "0F"),
																		borderLeft: `1px solid ${withAlpha(
																			accent,
																			"22"
																		)}`,
																	}}
																	title="Add step"
																>
																	Add
																</button>
															</div>

															<ol className="mt-2 grid gap-1 text-sm text-slate-700 list-none pl-0">
																{editSteps.map((s, i) => (
																	<li
																		key={`step-${r.id}-${i}`}
																		className="flex items-start gap-2"
																	>
																		<span
																			className="inline-flex items-center justify-center mt-[2px] w-5 h-5 rounded-full text-[11px] font-semibold"
																			style={{
																				color: "#fff",
																				backgroundColor: withAlpha(
																					accent,
																					"CC"
																				),
																			}}
																			aria-hidden="true"
																		>
																			{i + 1}
																		</span>
																		<div className="flex-1">{s}</div>
																		<button
																			type="button"
																			onClick={() => removeEditStep(i)}
																			className="p-0.5 rounded hover:bg-slate-100"
																			aria-label={`Remove step ${i + 1}`}
																			title={`Remove step ${i + 1}`}
																		>
																			<X className="w-3.5 h-3.5" />
																		</button>
																	</li>
																))}
															</ol>
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

				{/* Bottom action bar */}
				<div className="flex justify-end gap-2">
					<CompleteButton
						started={started}
						completed={!!completed}
						onToggle={onToggleComplete}
						accent="#10B981"
					/>
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
