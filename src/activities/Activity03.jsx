// src/pages/activities/Activity03.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Utensils, ExternalLink } from "lucide-react";

import GroupSelector from "./Activity03/GroupSelector.jsx";
import RecipeBuilder from "./Activity03/RecipeBuilder.jsx";
import SavedRecipes from "./Activity03/SavedRecipes.jsx";
import {
	withAlpha,
	formatIngredient,
	formatDirectionsText,
	labelForGroup,
	safe,
	downloadBlob,
} from "../utils/recipeUtils.js";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

export default function Activity03({
	content, // localized content object for a3 (e.g. ACTIVITIES_CONTENT.a3.en / .fr)
	notes,
	onNotes,
	completed,
	onToggleComplete,
	accent = "#b45309",
}) {
	const reduceMotion = useReducedMotion();
	const activityNumber = 3;
	const storageKey = `recipes-${content?.id || "03"}`;

	// localized strings for this activity
	const strings = content || {};

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

	// reference link: use first link from content.links if present
	const referenceLink =
		Array.isArray(strings.links) && strings.links.length
			? strings.links[0]
			: {
					label:
						"Native/Indigenous recipes (First Nations Development Institute)",
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notes]);

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

	// localized unitOptions fallback
	const unitOptions =
		Array.isArray(strings.unitOptions) && strings.unitOptions.length
			? strings.unitOptions
			: [
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
					directions: steps,
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
							directions: editSteps,
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

	// DOCX export (localized labels used throughout)
	const downloadAllDocx = async () => {
		const items = Array.isArray(model.recipes) ? model.recipes : [];
		if (!items.length) return;

		// localized labels
		const activityLabel = strings.activityLabel || "Activity";
		const baseTitle = strings.title || "Make a Traditional Recipe";
		const title = `${activityLabel} ${activityNumber}: ${baseTitle}`;
		const fileName = `activity-${activityNumber}-recipes.docx`;

		// localized headings
		const ingredientsHeading = strings.ingredientsHeading || "Ingredients";
		const directionsHeading = strings.directionsLabel || "Directions";
		const resourcesHeading = strings.resourcesHeading || "Resources";

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
						text:
							strings.tip ||
							"Try your hand at making a traditional First Nations, Inuit or Métis recipe.",
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
						text:
							strings.tip && strings.tip.includes("\n")
								? strings.tip.split("\n")[1] || ""
								: "Share your experience or maybe have a lunch-time potluck.",
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
						text: resourcesHeading,
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
												text: ingredientsHeading,
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
										text: directionsHeading,
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

			const ingredientsHeading = strings.ingredientsHeading || "Ingredients";
			const directionsHeading = strings.directionsLabel || "Directions";
			const resourcesHeading = strings.resourcesHeading || "Resources";
			const activityLabel = strings.activityLabel || "Activity";

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
						  )}; margin:10pt 0 6pt;">${esc(directionsHeading)}</h3>
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
						)}; margin:10pt 0 6pt;">${esc(ingredientsHeading)}</h3>
            <ul style="margin:0 0 12pt 18pt; font-size:12pt;">${ings}</ul>
            ${dir}
          `;
				})
				.join("");

			const title = `${activityLabel} ${activityNumber}: ${esc(
				strings.title || "Make a Traditional Recipe"
			)}`;
			const html = `
        <html>
          <head><meta charset="utf-8"><title>${title}</title></head>
          <body style="font-family:Arial; line-height:1.5;">
            <h1 style="font-size:24pt; color:${esc(
							accent
						)}; margin:0 0 12pt;">${title}</h1>
            <p style="font-size:12pt; font-style:italic; margin:0 0 6pt;">${esc(
							strings.tip || ""
						)}</p>
            <h2 style="font-size:16pt; color:${esc(
							accent
						)}; margin:12pt 0 8pt;">${esc(resourcesHeading)}</h2>
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
			a.download = `activity-${activityNumber}-recipes.doc`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	const downloadOne = (r) => {
		const activityLabel = strings.activityLabel || "Activity";
		const ingredientsHeading = strings.ingredientsHeading || "Ingredients";
		const directionsHeading = strings.directionsLabel || "Directions";

		const body = [
			`${activityLabel} ${activityNumber}: ${
				strings.title || "Make a Traditional Recipe"
			}`,
			`Group: ${labelForGroup(r.group)}`,
			`Name: ${r.name}`,
			"",
			`${ingredientsHeading}:`,
			...(r.ingredients || []).map((x) => `- ${formatIngredient(x)}`),
			"",
			(r.directions || []).length
				? `${directionsHeading}:\n` + formatDirectionsText(r.directions) + "\n"
				: "",
			`Saved: ${new Date(r.createdAt).toLocaleString()}`,
			`Source: ${referenceLink.url}`,
		].join("\n");
		downloadBlob(body, `Recipe-${safe(r.name)}.txt`);
	};

	// helper to render newlines in strings.tip (simple)
	const renderTip = (text) => {
		if (!text) return null;
		// prefer cdata HTML when available
		if (typeof strings.cdata === "object" && strings.cdata.instructionsHtml) {
			return (
				<div
					dangerouslySetInnerHTML={{ __html: strings.cdata.instructionsHtml }}
				/>
			);
		}
		return text.split("\n").map((line, i) => (
			<p key={i} className={i === 0 ? "" : "mt-2"}>
				{line}
			</p>
		));
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
							{strings.activityLabel || "Activity"} {activityNumber}
						</p>

						<div className="inline-flex items-center justify-center gap-3">
							<h1 className="text-4xl font-bold text-slate-900 leading-tight">
								{strings.title || "Make a Traditional Recipe"}
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
							aria-label={strings.instructionsLabel || "Activity instructions"}
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
									{strings.instructionsLabel || "Instructions"}
								</div>
								<div
									className="text-slate-800 max-w-2xl"
									style={{ color: accent }}
								>
									{renderTip(strings.tip)}
								</div>
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
						title={referenceLink.label}
						aria-label={referenceLink.label}
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
							<span>{strings.openLinkLabel || "Open link"}</span>
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
						<GroupSelector
							group={group}
							setGroup={setGroup}
							accent={accent}
							groupLabels={strings.groupLabels}
						/>
						<RecipeBuilder
							name={name}
							setName={setName}
							ingItem={ingItem}
							setIngItem={setIngItem}
							ingQty={ingQty}
							setIngQty={setIngQty}
							ingUnit={ingUnit}
							setIngUnit={setIngUnit}
							ingredients={ingredients}
							addIngredient={addIngredient}
							removeIngredient={removeIngredient}
							stepText={stepText}
							setStepText={setStepText}
							steps={steps}
							addStep={addStep}
							removeStep={removeStep}
							canAddIngredient={canAddIngredient}
							canAddStep={canAddStep}
							canSave={canSave}
							saveRecipe={saveRecipe}
							accent={accent}
							unitOptions={unitOptions}
							reveal={reveal}
							strings={strings}
						/>
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
								{strings.savedRecipesHeading || "Saved recipes"} ·{" "}
								<span style={{ color: accent }}>
									{strings.groupLabels?.[group] || labelForGroup(group)}
								</span>
							</h2>
						</div>
						<SavedRecipes
							filtered={filtered}
							accent={accent}
							editingId={editingId}
							editName={editName}
							setEditName={setEditName}
							editIngredients={editIngredients}
							setEditIngredients={setEditIngredients}
							editSteps={editSteps}
							setEditSteps={setEditSteps}
							editIngItem={editIngItem}
							setEditIngItem={setEditIngItem}
							editIngQty={editIngQty}
							setEditIngQty={setEditIngQty}
							editIngUnit={editIngUnit}
							setEditIngUnit={setEditIngUnit}
							editStepText={editStepText}
							setEditStepText={setEditStepText}
							justSavedId={justSavedId}
							startEdit={startEdit}
							cancelEdit={cancelEdit}
							saveEdit={saveEdit}
							deleteRecipe={deleteRecipe}
							removeEditIngredient={removeEditIngredient}
							removeEditStep={removeEditStep}
							addEditIngredient={addEditIngredient}
							addEditStep={addEditStep}
							downloadOne={downloadOne}
							strings={strings}
							labelForGroupLocalized={(id) =>
								strings.groupLabels?.[id] || labelForGroup(id)
							}
						/>
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
						title={strings.downloadAllBtn || "Download all (.docx)"}
					>
						{strings.downloadAllBtn || "Download all (.docx)"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}
