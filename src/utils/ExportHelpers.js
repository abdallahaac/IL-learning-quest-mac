// src/utils/exportHelpers.js
export const colorizeHeadings = (html, hex) => {
	if (!hex) return html || "";
	return (html || "").replace(
		/<h([1-3])(\b[^>]*)?>/gi,
		(m, lvl, attrs = "") => {
			const hasColor = /style\s*=\s*["'][^"']*color\s*:/i.test(attrs);
			if (hasColor) return m;
			const styleAttr = /style\s*=\s*["'][^"']*["']/i.test(attrs)
				? attrs.replace(
						/style\s*=\s*["']([^"']*)["']/i,
						(sm, val) => `style="${val}; color: ${hex}"`
				  )
				: `${attrs} style="color: ${hex}"`;
			return `<h${lvl}${styleAttr}>`;
		}
	);
};

// very small allow-list sanitizer for rich text coming from Quill
export const sanitizeRichHtml = (dirty = "") => {
	const tmp = document.createElement("template");
	tmp.innerHTML = dirty;

	const ALLOWED_TAGS = new Set([
		"H1",
		"H2",
		"H3",
		"P",
		"BR",
		"STRONG",
		"EM",
		"U",
		"S",
		"BLOCKQUOTE",
		"UL",
		"OL",
		"LI",
		"SPAN",
		"DIV",
		"A",
	]);
	const ALLOWED_ATTR = new Set(["href", "rel", "target", "style"]); // Be strict with style if you prefer

	const walk = (node) => {
		// remove script/style tags outright
		if (node.nodeType === 1) {
			const tag = node.tagName.toUpperCase();
			if (!ALLOWED_TAGS.has(tag)) {
				node.replaceWith(...Array.from(node.childNodes));
				return;
			}
			// scrub attributes
			[...node.attributes].forEach((a) => {
				const name = a.name.toLowerCase();
				if (!ALLOWED_ATTR.has(name)) node.removeAttribute(a.name);
			});

			// lock anchors to safe targets + rel
			if (tag === "A") {
				const href = node.getAttribute("href") || "";
				const safe =
					/^(https?:)?\/\//i.test(href) || href.startsWith("mailto:");
				if (!safe) node.removeAttribute("href");
				node.setAttribute("target", "_blank");
				node.setAttribute("rel", "noopener noreferrer");
			}
		}
		[...node.childNodes].forEach(walk);
	};

	walk(tmp.content);
	return tmp.innerHTML;
};

export const buildAllReflectionsDoc = ({
	title = "All Reflections",
	headingColor = "#2563EB",
	sections = [], // [{ heading: "Activity 1: …", html: "<p>…</p>" }]
}) => {
	const css = `
  body { background:#fff; font-family:Arial, Helvetica, sans-serif; line-height:1.5; color:#0b1220; }
  h1,h2,h3 { margin:0 0 8pt; }
  h1 { font-size: 20pt; color:${headingColor}; }
  h2 { font-size: 14pt; color:${headingColor}; margin:14pt 0 6pt; }
  p { margin:0 0 10pt; white-space:pre-wrap; }
  ul,ol { margin:0 0 12pt 22pt; }
  li { margin:0 0 6pt; }
  a { color:${headingColor}; text-decoration:underline; }
  .ql-editor h1 { font-size:20pt; }
  .ql-editor h2 { font-size:14pt; }
  .ql-editor h3 { font-size:12pt; }
  .section { margin: 10pt 0 12pt; }
  `.trim();

	const blocks = sections
		.map((sec) => {
			const htmlColored = colorizeHeadings(
				sanitizeRichHtml(sec.html || ""),
				headingColor
			);
			return `
      <h2>${sec.heading || ""}</h2>
      <div class="section ql-editor">${htmlColored || "<p><br/></p>"}</div>
    `;
		})
		.join("\n");

	const doc = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>${css}</style>
      </head>
      <body>
        <h1>${title}</h1>
        ${blocks}
      </body>
    </html>
  `.trim();

	const blob = new Blob([doc], { type: "application/msword" });
	const url = URL.createObjectURL(blob);
	return { blobUrl: url };
};
