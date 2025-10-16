// src/pages/activities/Activity03/RecipeBuilder.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { withAlpha, formatIngredient } from "../../utils/recipeUtils.js";

/**
 * Receives a `strings` prop to render localized labels/placeholders.
 */
const RecipeBuilder = ({
	name,
	setName,
	ingItem,
	setIngItem,
	ingQty,
	setIngQty,
	ingUnit,
	setIngUnit,
	ingredients,
	addIngredient,
	removeIngredient,
	stepText,
	setStepText,
	steps,
	addStep,
	removeStep,
	canAddIngredient,
	canAddStep,
	canSave,
	saveRecipe,
	accent,
	unitOptions = [],
	reveal,
	strings = {},
}) => {
	const qtyPlaceholder = strings.qtyPlaceholder || "qty";
	const unitPlaceholder = strings.unitPlaceholder || "unit";
	const units =
		Array.isArray(strings.unitOptions) && strings.unitOptions.length
			? strings.unitOptions
			: unitOptions;

	return (
		<>
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
						{strings.namePlaceholder || "Recipe name"}
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={strings.namePlaceholder || "e.g. Wild Rice Hamburgers"}
						className="w-full rounded-lg border px-3 py-2 text-sm"
						style={{ borderColor: withAlpha(accent, "33") }}
					/>
				</motion.div>
			</AnimatePresence>

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
							{strings.ingredientPlaceholder || "Ingredients"}
						</label>

						<div
							className="relative rounded-lg border text-sm flex items-stretch"
							style={{ borderColor: withAlpha(accent, "33") }}
						>
							<input
								type="text"
								value={ingItem}
								onChange={(e) => setIngItem(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && canAddIngredient && addIngredient()
								}
								placeholder={
									strings.ingredientPlaceholder || "Ingredient (e.g. wild rice)"
								}
								className="flex-1 bg-transparent px-3 py-2 rounded-l-lg focus:outline-none"
							/>
							<span
								aria-hidden
								className="self-stretch"
								style={{ width: 1, backgroundColor: withAlpha(accent, "22") }}
							/>
							<input
								type="text"
								inputMode="decimal"
								value={ingQty}
								onChange={(e) => setIngQty(e.target.value)}
								placeholder={qtyPlaceholder}
								className="w-20 text-center bg-white"
								style={{
									color: accent,
									backgroundColor: withAlpha(accent, "0F"),
									borderLeft: `1px solid ${withAlpha(accent, "22")}`,
								}}
							/>
							<input
								type="text"
								value={ingUnit}
								onChange={(e) => setIngUnit(e.target.value)}
								placeholder={unitPlaceholder}
								className="w-24 text-center bg-white rounded-r-lg"
								style={{
									color: accent,
									backgroundColor: withAlpha(accent, "0F"),
									borderLeft: `1px solid ${withAlpha(accent, "22")}`,
								}}
							/>
						</div>

						<datalist id="unitOptions">
							{units.map((u) => (
								<option key={u} value={u} />
							))}
						</datalist>

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
								title={strings.addBtn || "Add"}
							>
								<Plus className="w-4 h-4" />
								{strings.addBtn || "Add"}
							</button>
						</div>

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
							{strings.directionsLabel || "Directions (steps)"}
						</label>
						<div
							className="relative rounded-lg border text-sm flex items-stretch"
							style={{ borderColor: withAlpha(accent, "33") }}
						>
							<input
								type="text"
								value={stepText}
								onChange={(e) => setStepText(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && canAddStep && addStep()}
								placeholder={
									strings.stepPlaceholder || "Add a step and press Enter"
								}
								className="flex-1 bg-transparent px-3 py-2 rounded-l-lg focus:outline-none"
							/>
							<span
								aria-hidden
								className="self-stretch"
								style={{ width: 1, backgroundColor: withAlpha(accent, "22") }}
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
								title={strings.addBtn || "Add"}
							>
								{strings.addBtn || "Add"}
							</button>
						</div>

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
							title={strings.saveRecipeBtn || "Save recipe"}
						>
							{strings.saveRecipeBtn || "Save recipe"}
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default RecipeBuilder;
