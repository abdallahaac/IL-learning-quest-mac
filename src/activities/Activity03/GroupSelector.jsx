// src/pages/activities/Activity03/GroupSelector.jsx
import React from "react";
import { Feather, Infinity as InfinityIcon } from "lucide-react";
import { InukSwapIcon } from "./InukIcons.jsx";
import { withAlpha } from "../../utils/recipeUtils.js";

/**
 * groupLabels: { firstNations: string, inuit: string, metis: string }
 *
 * This component expects localized labels to be passed in via `groupLabels`.
 * If groupLabels is not present the component will fallback to hard-coded defaults.
 */
const GroupSelector = ({ group, setGroup, accent, groupLabels = {} }) => {
	const groups = [
		{
			id: "firstNations",
			label: groupLabels.firstNations || "First Nations",
			Icon: Feather,
		},
		{ id: "inuit", label: groupLabels.inuit || "Inuit", Icon: null },
		{ id: "metis", label: groupLabels.metis || "Métis", Icon: InfinityIcon },
	];

	return (
		<div className="flex items-center justify-center gap-2 sm:gap-3">
			{groups.map(({ id, label, Icon }) => {
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
							<Icon className="w-4 h-4 transition-colors" aria-hidden="true" />
						)}
						<span className="font-medium">{label}</span>
					</button>
				);
			})}
		</div>
	);
};

export default GroupSelector;
