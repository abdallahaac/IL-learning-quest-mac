// src/pages/activities/Activity03.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Utensils } from "lucide-react";

import GroupSelector from "./Activity03/GroupSelector.jsx";
import RecipeBuilder from "./Activity03/RecipeBuilder.jsx";
import SavedRecipes from "./Activity03/SavedRecipes.jsx";
import LinkCard from "../components/LinkCard.jsx";
import {
	withAlpha,
	formatIngredient,
	formatDirectionsText,
	labelForGroup,
	safe,
	downloadBlob,
} from "../utils/recipeUtils.js";
import { downloadAllDocx, downloadOne } from "../utils/downloadRecipes.js";
import CompleteButton from "../components/CompleteButton.jsx";
import { hasActivityStarted } from "../utils/activityProgress.js";

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

	// Reference link: pulled from content.links[0] if present (no hardcoded fallback)
	const referenceLink =
		Array.isArray(strings.links) && strings.links.length
			? strings.links[0]
			: null;

	// MODEL normalization
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

	// UI state
	const [group, setGroup] = useState("firstNations");
	const [name, setName] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [steps, setSteps] = useState([]);

	const [ingItem, setIngItem] = useState("");
	const [ingQty, setIngQty] = useState("");
	const [ingUnit, setIngUnit] = useState("");

	const [stepText, setStepText] = useState("");

	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState("");
	const [editIngredients, setEditIngredients] = useState([]);
	const [editSteps, setEditSteps] = useState([]);
	const [editIngItem, setEditIngItem] = useState("");
	const [editIngQty, setEditIngQty] = useState("");
	const [editIngUnit, setEditIngUnit] = useState("");
	const [editStepText, setEditStepText] = useState("");
	const [justSavedId, setJustSavedId] = useState(null);

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

	// EXPORT handlers
	const handleDownloadAll = async () =>
		downloadAllDocx({
			items: Array.isArray(model.recipes) ? model.recipes : [],
			strings,
			activityNumber,
			accent,
			referenceLink,
		});

	const handleDownloadOne = (r) =>
		downloadOne(r, strings, activityNumber, accent, referenceLink);

	// render tip helper
	const renderTip = (text) => {
		if (!text) return null;
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

				{/* Reference card (pulled from content.links[0] if present) */}
				{referenceLink ? (
					<motion.section
						className="flex justify-center"
						variants={cardPop}
						initial="hidden"
						animate="show"
					>
						<LinkCard
							link={referenceLink}
							accent={accent}
							Icon={Utensils}
							openLinkLabel={strings.openLinkLabel}
							variants={cardPop}
						/>
					</motion.section>
				) : null}

				{/* Builder */}
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

				{/* Saved recipes */}
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
							downloadOne={handleDownloadOne}
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
						onClick={handleDownloadAll}
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
