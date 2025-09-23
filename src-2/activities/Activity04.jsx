import React from "react";
import Activity from "../components/Activity.jsx";
import { ACTIVITIES } from "../questData.js";

export default function Activity04({
	notes,
	completed,
	onNotes,
	onToggleComplete,
}) {
	const activityIndex = 3;
	const content = ACTIVITIES[activityIndex];
	return (
		<Activity
			content={content}
			notes={notes}
			completed={completed}
			onNotes={onNotes}
			onToggleComplete={onToggleComplete}
			activityIndex={activityIndex}
		/>
	);
}
