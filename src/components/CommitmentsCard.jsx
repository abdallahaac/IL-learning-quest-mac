import React, { useState } from "react";

export default function CommitmentsCard({ commitments, onAdd, onRemove }) {
	const [value, setValue] = useState("");
	const onSubmit = (e) => {
		e.preventDefault();
		const v = value.trim();
		if (!v) return;
		onAdd(v);
		setValue("");
	};
	return (
		<div className="bg-white/90 border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-semibold text-gray-800">Commitments</h3>
			</div>
			<form onSubmit={onSubmit} className="flex items-center gap-2">
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="Add a concrete action…"
					className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
				/>
				<button
					type="submit"
					className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-300 bg-white text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400"
				>
					Add
				</button>
			</form>
			{commitments?.length ? (
				<ul className="flex flex-wrap gap-2">
					{commitments.map((c, i) => (
						<li
							key={`${c}-${i}`}
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-800"
						>
							<span className="text-sm">{c}</span>
							<button
								type="button"
								onClick={() => onRemove(i)}
								className="rounded-full p-1 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
								aria-label={`Remove commitment ${i + 1}`}
								title="Remove"
							>
								×
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="text-sm text-gray-600">
					No commitments yet. Add at least one action you’ll take forward.
				</p>
			)}
		</div>
	);
}
