import { hasNoteContent, formatNoteHtml } from "../utils/notesFormat.js";

const baseCss = `
  body { font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #0b1220; }
  h1 { font-size: 18pt; margin: 0 0 10pt; }
  h2 { font-size: 14pt; margin: 14pt 0 6pt; color: #0b1220; }
  p { margin: 0 0 10pt; white-space: pre-wrap; }
  ul, ol { margin: 0 0 12pt 22pt; }
  li { margin: 0 0 6pt; }
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-justify { text-align: justify; }
  .ql-indent-1 { margin-left: 2em; }
  .ql-indent-2 { margin-left: 4em; }
  .ql-indent-3 { margin-left: 6em; }
  .ql-indent-4 { margin-left: 8em; }
  table { width: auto; }
  th, td { vertical-align: top; }
`;

/**
 * Build & trigger a Word-compatible HTML download of all reflections.
 * @param {{activityMeta: Array<{id:string,title:string,number:number}>, notes: Record<string, any>, fileName?: string, docTitle?: string}} params
 */
export function downloadAllReflections({
	activityMeta,
	notes,
	fileName = "my-reflections.doc",
	docTitle = "My Reflections",
}) {
	const sections = activityMeta.map(({ number, title, id }) => {
		const note = notes[id];
		const body = hasNoteContent(note)
			? formatNoteHtml(note)
			: `<p><em>No reflection saved.</em></p>`;
		return `
      <h2 style="font-size:14pt; margin:14pt 0 6pt;">Activity ${number}: ${String(
			title
		)}</h2>
      ${body}
    `;
	});

	const html = `
    <html>
      <head><meta charset="utf-8"><title>${docTitle}</title><style>${baseCss}</style></head>
      <body><h1>${docTitle}</h1>${sections.join("\n")}</body>
    </html>
  `.trim();

	const blob = new Blob([html], { type: "application/msword" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
