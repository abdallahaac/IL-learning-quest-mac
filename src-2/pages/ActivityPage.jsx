import React from "react";
import { ACTIVITY_PAGES } from "../activities/index.js";

/**
 * ActivityPage dispatcher
 * - Picks the correct ActivityXX component based on activityIndex
 * - Passes notes/completed + handlers straight through
 */
export default function ActivityPage({ content, notes, completed, onNotes, onToggleComplete, activityIndex = 0 }) {
  const Comp = ACTIVITY_PAGES[activityIndex] ?? ACTIVITY_PAGES[0];
  return (
    <Comp
      notes={notes}
      completed={completed}
      onNotes={onNotes}
      onToggleComplete={onToggleComplete}
    />
  );
}
