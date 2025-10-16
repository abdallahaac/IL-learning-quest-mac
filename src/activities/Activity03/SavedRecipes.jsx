// SavedRecipes.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { withAlpha, formatIngredient } from "../../utils/recipeUtils.js";

/**
 * SavedRecipes displays the saved recipes and supports inline editing.
 * Props include `strings` (localized) and `labelForGroupLocalized` function
 * which returns localized group labels.
 */
const SavedRecipes = ({
	filtered = [],
	accent,
	editingId,
	editName,
	setEditName,
	editIngredients,
	setEditIngredients,
	editSteps,
	setEditSteps,
	editIngItem,
	setEditIngItem,
	editIngQty,
	setEditIngQty,
	editIngUnit,
	setEditIngUnit,
	editStepText,
	setEditStepText,
	justSavedId,
	startEdit,
	cancelEdit,
	saveEdit,
	deleteRecipe,
	removeEditIngredient,
	removeEditStep,
	addEditIngredient,
	addEditStep,
	downloadOne,
	strings = {},
	labelForGroupLocalized = (id) => id,
}) => {
	if (!filtered || filtered.length === 0) {
		return (
			<p className="text-sm text-slate-600">
				{strings.nothingHere || "Nothing here yet. Save a recipe above."}
			</p>
		);
	}

	return (
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
											<div className="font-semibold" style={{ color: accent }}>
												{r.name}
											</div>
											<div className="text-xs text-slate-500 mt-0.5">
												{new Date(r.createdAt).toLocaleString()} •{" "}
												{r.ingredients.length}{" "}
												{strings.recipeCountSuffix || "ingredient"}
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
												title={strings.editBtn || "Edit"}
											>
												{strings.editBtn || "Edit"}
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
												title={strings.deleteBtn || "Delete"}
											>
												<Trash2 className="w-4 h-4" />
												{strings.deleteBtn || "Delete"}
											</button>
										</div>
									</div>

									<ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
										{(r.ingredients || []).map((it, i) => (
											<li
												key={`${r.id}-${i}`}
												className="flex items-center gap-2"
											>
												<span
													className="inline-block w-1.5 h-1.5 rounded-full"
													style={{ backgroundColor: withAlpha(accent, "AA") }}
													aria-hidden="true"
												/>
												{formatIngredient(it)}
											</li>
										))}
									</ul>

									{(r.directions || []).length > 0 && (
										<div className="mt-3">
											<div
												className="text-xs font-semibold"
												style={{ color: accent }}
											>
												{strings.directionsLabel || "Directions"}
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
																backgroundColor: withAlpha(accent, "CC"),
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

									{/* <div className="mt-2 flex items-center gap-2">
										<button
											type="button"
											onClick={() => downloadOne(r)}
											className="text-xs underline"
											title="Download"
										>
											{strings.downloadOneBtn || "Download"}
										</button>
									</div> */}

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
												{strings.savedFlash || "Saved"}
											</motion.div>
										)}
									</AnimatePresence>
								</>
							) : (
								<div className="space-y-3">
									<div>
										<label className="block text-xs text-slate-600 mb-1">
											{strings.namePlaceholder || "Recipe name"}
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
										<div
											className="relative rounded-lg border text-sm flex items-stretch"
											style={{ borderColor: withAlpha(accent, "33") }}
										>
											<input
												type="text"
												value={editIngItem}
												onChange={(e) => setEditIngItem(e.target.value)}
												onKeyDown={(e) =>
													e.key === "Enter" &&
													editIngItem.trim() &&
													addEditIngredient()
												}
												placeholder={
													strings.ingredientPlaceholder ||
													"Ingredient (e.g., bannock flour)"
												}
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
												onChange={(e) => setEditIngQty(e.target.value)}
												placeholder="qty"
												className="w-20 text-center bg-white"
												style={{
													color: accent,
													backgroundColor: withAlpha(accent, "0F"),
													borderLeft: `1px solid ${withAlpha(accent, "22")}`,
												}}
											/>
											<input
												type="text"
												value={editIngUnit}
												onChange={(e) => setEditIngUnit(e.target.value)}
												placeholder="unit"
												className="w-24 text-center bg-white rounded-r-lg"
												style={{
													color: accent,
													backgroundColor: withAlpha(accent, "0F"),
													borderLeft: `1px solid ${withAlpha(accent, "22")}`,
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
												title={strings.addBtn || "Add"}
											>
												<Plus className="w-4 h-4" />
												{strings.addBtn || "Add"}
											</button>
										</div>
										<ul className="mt-2 flex flex-wrap gap-2">
											{editIngredients.map((it, i) => (
												<li
													key={`ing-${r.id}-edit-${i}`}
													className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
													style={{ borderColor: withAlpha(accent, "33") }}
												>
													<span>{formatIngredient(it)}</span>
													<button
														type="button"
														onClick={() => removeEditIngredient(i)}
														className="p-0.5 rounded-full hover:bg-slate-100"
														aria-label={`Remove ${formatIngredient(it)}`}
														title={`Remove ${formatIngredient(it)}`}
													>
														<X className="w-3.5 h-3.5" />
													</button>
												</li>
											))}
										</ul>
									</div>

									<div>
										<label className="block text-xs text-slate-600 mb-1">
											{strings.directionsLabel || "Directions (steps)"}
										</label>
										<div
											className="relative rounded-lg border text-sm flex items-stretch"
											style={{ borderColor: withAlpha(accent, "33") }}
										>
											<input
												type="text"
												value={editStepText}
												onChange={(e) => setEditStepText(e.target.value)}
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
													borderLeft: `1px solid ${withAlpha(accent, "22")}`,
												}}
												title="Add step"
											>
												{strings.addBtn || "Add"}
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
															backgroundColor: withAlpha(accent, "CC"),
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
											title={strings.cancelBtn || "Cancel"}
										>
											{strings.cancelBtn || "Cancel"}
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
											title={strings.saveBtn || "Save"}
										>
											{strings.saveBtn || "Save"}
										</button>
									</div>
								</div>
							)}
						</li>
					);
				})}
		</ul>
	);
};

export default SavedRecipes;
