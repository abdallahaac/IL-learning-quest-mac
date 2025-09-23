import React from "react";
import { motion } from "framer-motion";

/**
 * NoteComposer (no Highlights)
 * Tabs: Write + Bullets
 * - Always renders at least one bullet input
 * - Press Enter (no Shift) in a bullet to add a new bullet row
 * - .docx export with HTML .doc fallback
 */
export default function NoteComposer({
	value,
	onChange,
	placeholder = "Type your reflections…",
	storageKey = "notes-default",
	palette, // { text, ring, btn, badgeBg, border }

	// sizing / overrides
	size = "md", // "sm" | "md" | "lg" | "xl"
	rows,
	minHeight = "min-h-32",
	wrapperClassName = "",
	textareaClassName = "",
	// keep panel height stable across tabs
	panelMinHClass = "min-h-64",

	// download options
	enableDownload = true,
	downloadFileName = "Reflection.docx",
	docTitle = "Reflection",
}) {
	// ---- model ----
	const model = React.useMemo(() => {
		if (typeof value === "string" || !value) {
			return { text: value || "", bullets: [] };
		}
		return {
			text: value.text || "",
			bullets: Array.isArray(value.bullets) ? value.bullets : [],
		};
	}, [value]);

	const pal = {
		text: palette?.text || "text-sky-700",
		ring: palette?.ring || "focus-visible:ring-sky-700",
		btn: palette?.btn || "bg-sky-700 hover:bg-sky-800 active:bg-sky-900",
		badgeBg: palette?.badgeBg || "bg-sky-50",
		border: palette?.border || "border-sky-100",
	};

	const SIZES = {
		sm: {
			wrapper: "p-3 space-y-2",
			tabBtn: "px-2 py-1.5 text-xs",
			label: "text-xs",
			input: "px-2 py-1.5 text-sm",
			textarea: "p-2 text-sm",
			addBtn: "px-2 py-1 text-xs",
		},
		md: {
			wrapper: "p-4 space-y-3",
			tabBtn: "px-3 py-1.5 text-sm",
			label: "text-sm",
			input: "px-2 py-1.5 text-sm",
			textarea: "p-3 text-base",
			addBtn: "px-2 py-1 text-sm",
		},
		lg: {
			wrapper: "p-5 space-y-4",
			tabBtn: "px-3.5 py-2 text-base",
			label: "text-sm",
			input: "px-3 py-2 text-base",
			textarea: "p-4 text-lg",
			addBtn: "px-3 py-1.5 text-base",
		},
		xl: {
			wrapper: "p-6 space-y-5",
			tabBtn: "px-4 py-2 text-lg",
			label: "text-base",
			input: "px-3.5 py-2 text-lg",
			textarea: "p-5 text-xl",
			addBtn: "px-3.5 py-2 text-lg",
		},
	};
	const sz = SIZES[size] || SIZES.md;

	// ---- state & helpers ----
	const [tab, setTab] = React.useState("write");
	const signal = (next) => onChange?.(next);

	// Ensure there is always at least one bullet input shown
	const computedBullets =
		model.bullets && model.bullets.length > 0 ? model.bullets : [""];

	// Update or create a bullet at index i
	const updateBullet = (i, v) => {
		const base = Array.isArray(model.bullets) ? [...model.bullets] : [];
		if (i >= base.length) {
			// extend with empties up to i, then set
			while (base.length < i) base.push("");
			base.push(v);
		} else {
			base[i] = v;
		}
		signal({ ...model, bullets: base });
	};

	// Insert a new empty bullet after index i
	const insertBulletAfter = (i) => {
		const base = Array.isArray(model.bullets) ? [...model.bullets] : [];
		// if user is on the virtual first input (no bullets yet), start with one empty then add second
		if (base.length === 0) {
			base.push(computedBullets[0] || "");
		}
		base.splice(i + 1, 0, "");
		signal({ ...model, bullets: base });
	};

	// Remove bullet at index i (but keep at least one input visible)
	const removeBullet = (i) => {
		const base = Array.isArray(model.bullets) ? [...model.bullets] : [];
		if (base.length === 0) {
			// nothing to remove; keep the virtual one
			return;
		}
		base.splice(i, 1);
		signal({ ...model, bullets: base });
	};

	// Handle Enter to add a new bullet row (no Shift)
	const onBulletKeyDown = (i, e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			insertBulletAfter(i);
		}
	};

	// ---- export to DOCX (with fallback to HTML .doc) ----
	const downloadDocx = async () => {
		const title = docTitle || "Reflection";
		const bullets = (model.bullets || []).filter(Boolean);
		try {
			const { Document, Packer, Paragraph, HeadingLevel, TextRun } =
				await import("docx");
			const children = [
				new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
			];
			if (model.text?.trim()) {
				children.push(
					new Paragraph({
						children: [new TextRun({ text: model.text, size: 24 })],
					})
				);
			}
			if (bullets.length) {
				children.push(
					new Paragraph({
						text: "Bullet points",
						heading: HeadingLevel.HEADING_2,
					})
				);
				bullets.forEach((b) =>
					children.push(new Paragraph({ text: b, bullet: { level: 0 } }))
				);
			}
			const doc = new Document({ sections: [{ properties: {}, children }] });
			const blob = await Packer.toBlob(doc);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = downloadFileName || "Reflection.docx";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch {
			const html = `
        <html><head><meta charset="utf-8"><title>${escapeHtml(
					title
				)}</title></head>
        <body>
          <h1>${escapeHtml(title)}</h1>
          ${
						model.text
							? `<p>${escapeHtml(model.text).replace(/\n/g, "<br/>")}</p>`
							: ""
					}
          ${
						bullets.length
							? `<h2>Bullet points</h2><ul>${bullets
									.map((b) => `<li>${escapeHtml(b)}</li>`)
									.join("")}</ul>`
							: ""
					}
        </body></html>
      `.trim();
			const blob = new Blob([html], { type: "application/msword" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = (downloadFileName || "Reflection.docx").replace(
				/\.docx$/i,
				".doc"
			);
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	};

	return (
		<div
			className={`bg-white/80 backdrop-blur border border-gray-200 rounded-xl shadow ${sz.wrapper} ${wrapperClassName}`}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex gap-1">
					{["write", "bullets"].map((k) => (
						<button
							key={k}
							onClick={() => setTab(k)}
							className={`rounded-lg border ${sz.tabBtn} ${
								tab === k
									? `${pal.btn} text-white border-transparent`
									: "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
							}`}
						>
							{k === "write" ? "Write" : "Bullets"}
						</button>
					))}
				</div>

				{enableDownload && (
					<button
						type="button"
						onClick={downloadDocx}
						className={`rounded-lg text-white ${pal.btn} ${sz.tabBtn}`}
						title="Download as .docx"
					>
						Download (.docx)
					</button>
				)}
			</div>

			{/* Panel container with fixed min-height to avoid jumping */}
			<div className={`${panelMinHClass}`}>
				{tab === "write" && (
					<motion.div
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
					>
						<label
							htmlFor={`${storageKey}-text`}
							className={`block font-medium text-gray-700 mb-1 ${sz.label}`}
						>
							Reflection
						</label>
						<textarea
							id={`${storageKey}-text`}
							value={model.text}
							onChange={(e) => signal({ ...model, text: e.target.value })}
							placeholder={placeholder}
							rows={rows}
							className={`w-full ${minHeight} bg-gray-50 border border-gray-200 rounded-lg text-gray-800
                focus:outline-none focus:ring-2 ${pal.ring} focus:border-transparent resize-vertical ${sz.textarea} ${textareaClassName}`}
						/>
					</motion.div>
				)}

				{tab === "bullets" && (
					<motion.div
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
						className="space-y-2"
					>
						<label className={`block font-medium text-gray-700 ${sz.label}`}>
							Bullet points
						</label>

						<ul className="space-y-2">
							{computedBullets.map((b, i) => (
								<li key={i} className="flex gap-2">
									<span className="mt-2 text-gray-400">•</span>
									<input
										className={`flex-1 rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 ${pal.ring} ${sz.input}`}
										value={b}
										onChange={(e) => updateBullet(i, e.target.value)}
										onKeyDown={(e) => onBulletKeyDown(i, e)}
										placeholder="Type a point and press Enter…"
									/>
									<button
										onClick={() => removeBullet(i)}
										className="px-2 py-1 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm"
										title="Remove"
									>
										Remove
									</button>
								</li>
							))}
						</ul>

						{/* Optional: still keep a button for mouse users */}
					</motion.div>
				)}
			</div>
		</div>
	);
}

function escapeHtml(s = "") {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
