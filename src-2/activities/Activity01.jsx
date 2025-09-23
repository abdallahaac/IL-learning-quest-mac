import React from "react";
import Activity from "../components/Activity.jsx";
import { ACTIVITIES } from "../questData.js";

export default function Activity01({
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const activityIndex = 0;
	const content = ACTIVITIES[activityIndex];

	return (
		<div className="flex justify-center">
			<Activity
				content={content}
				notes={notes}
				completed={completed}
				onNotes={onNotes}
				onToggleComplete={onToggleComplete}
				activityIndex={activityIndex}
			/>
		</div>
	);
}
