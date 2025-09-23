import React, { useState } from "react";

export default function CommitmentsCard({ commitments = [], onAdd, onRemove }) {
	const [value, setValue] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		const v = value.trim();
		if (!v) return;
		onAdd(v);
		setValue("");
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-semibold text-slate-900">Commitments</h3>
			</div>

			<form onSubmit={onSubmit} className="flex items-center gap-2">
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="Add a concrete action…"
					className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-900
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#67AAF9] focus-visible:ring-offset-2"
				/>
				<button
					type="submit"
					className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white
                     border-[#67AAF9]/30 text-[#67AAF9]
                     hover:bg-[#67AAF9]/5
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#67AAF9] focus-visible:ring-offset-2"
				>
					Add
				</button>
			</form>

			{commitments.length > 0 ? (
				<ul className="flex flex-wrap gap-2">
					{commitments.map((c, i) => (
						<li
							key={`${c}-${i}`}
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                         bg-[#67AAF9]/10 text-[#67AAF9]"
						>
							<span className="text-sm">{c}</span>
							<button
								type="button"
								onClick={() => onRemove(i)}
								className="rounded-full p-1 hover:bg-[#67AAF9]/15
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#67AAF9]"
								aria-label={`Remove commitment ${i + 1}`}
								title="Remove"
							>
								×
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="text-sm text-slate-600">
					No commitments yet. Add at least one action you’ll take forward.
				</p>
			)}
		</div>
	);
}
