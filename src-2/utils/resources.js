import {
  faGraduationCap,
  faGavel,
  faCampground,
  faFeather,
  faBook,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

export function iconForGroup(title) {
  const t = title.toLowerCase();
  if (t.includes("training")) return faGraduationCap;
  if (t.includes("legal")) return faGavel;
  if (t.includes("conservation")) return faCampground;
  if (t.includes("inuit")) return faFeather;
  if (t.includes("métis") || t.includes("metis")) return faFeather;
  if (t.includes("media")) return faBook;
  return faBookOpen;
}

export function categorizeResources(items) {
  const groups = {
    "Starter media": [],
    "Reconciliation tools & training": [],
    "Conservation & land relationships": [],
    "Inuit & Métis knowledge": [],
    "Legal & public education": [],
  };
  items.forEach((txt) => {
    const t = txt.toLowerCase();
    if (t.includes("best media")) groups["Starter media"].push(txt);
    else if (
      t.includes("reconciliation path") ||
      t.includes("training") ||
      t.includes("learning")
    )
      groups["Reconciliation tools & training"].push(txt);
    else if (
      t.includes("conservation") ||
      t.includes("partnership") ||
      t.includes("campfire") ||
      t.includes("protected and conserved")
    )
      groups["Conservation & land relationships"].push(txt);
    else if (t.includes("inuit") || t.includes("métis") || t.includes("metis"))
      groups["Inuit & Métis knowledge"].push(txt);
    else if (t.includes("legal") || t.includes("rights") || t.includes("treaties"))
      groups["Legal & public education"].push(txt);
    else groups["Starter media"].push(txt);
  });
  Object.keys(groups).forEach((k) => {
    if (!groups[k].length) delete groups[k];
  });
  return groups;
}
