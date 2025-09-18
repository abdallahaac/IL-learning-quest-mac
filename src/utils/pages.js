import { ACTIVITIES } from "../questData.js";
import {
  COVER_CONTENT,
  INTRO_INFO_CONTENT,
  PREPARATION_CONTENT,
  TEAM_CONTENT,
  CONCLUSION_CONTENT,
  RESOURCES_CONTENT,
} from "../constants/content.js";

export function buildPages() {
  const pages = [];
  pages.push({ type: "cover", content: COVER_CONTENT });
  pages.push({ type: "contents", content: {} });
  pages.push({ type: "intro", content: INTRO_INFO_CONTENT });
  pages.push({ type: "preparation", content: PREPARATION_CONTENT });
  ACTIVITIES.forEach((act, idx) => {
    pages.push({ type: "activity", content: act, activityIndex: idx });
  });
  pages.push({ type: "team", content: TEAM_CONTENT });
  pages.push({ type: "conclusion", content: CONCLUSION_CONTENT });
  pages.push({ type: "resources", content: RESOURCES_CONTENT });
  return pages;
}
