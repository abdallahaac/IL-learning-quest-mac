import React from "react";
import { motion } from "framer-motion";

/** ---------- utils ---------- */
const normalizeHex = (h) => {
	if (!h) return null;
	let s = String(h).trim();
	if (s[0] !== "#") s = `#${s}`;
	if (!/^#([0-9a-f]{6})$/i.test(s)) return null;
	return s.toUpperCase();
};
const hexToRgb = (hex) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
};
const shadeHex = (hex, amt) => {
	// amt in [-1..1], negative = darker, positive = lighter
	const { r, g, b } = hexToRgb(hex);
	const t = amt < 0 ? 0 : 255;
	const p = Math.abs(amt);
	const nr = Math.round((t - r) * p + r);
	const ng = Math.round((t - g) * p + g);
	const nb = Math.round((t - b) * p + b);
	const to2 = (n) => n.toString(16).padStart(2, "0");
	return `#${to2(nr)}${to2(ng)}${to2(nb)}`;
};
const isLight = (hex) => {
	const { r, g, b } = hexToRgb(hex);
	const srgb = [r, g, b].map((v) => v / 255);
	const toLin = (c) =>
		c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	const [R, G, B] = srgb.map(toLin);
	const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
	return L > 0.5;
};
function escapeHtml(s = "") {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/** ---------- Component ---------- */
export default function NoteComposer({
	value,
	onChange,
	placeholder = "Type your reflections…",
	storageKey = "notes-default",
	palette, // fallback tailwind palette { text, ring, btn, badgeBg, border }
	accent, // hex like "#f59e0b" (enables hex-mode)
	textColor, // "white" | "black" to override auto-contrast

	// sizing / overrides
	size = "md", // "sm" | "md" | "lg" | "xl"
	rows,
	minHeight = "min-h-32",
	wrapperClassName = "",
	textareaClassName = "",
	panelMinHClass = "min-h-64",

	// download options
	enableDownload = true,
	downloadFileName = "Reflection.docx",
	docTitle = "Reflection",
}) {
	/** model */
	const model = React.useMemo(() => {
		if (typeof value === "string" || !value) {
			return { text: value || "", bullets: [] };
		}
		return {
			text: value.text || "",
			bullets: Array.isArray(value.bullets) ? value.bullets : [],
		};
	}, [value]);

	/** palette / hex mode */
	const accentHex = normalizeHex(accent);
	const useHex = !!accentHex;

	const hexBtn = useHex ? accentHex : "#0EA5E9"; // sky-500 fallback
	const hexBtnHover = useHex ? shadeHex(accentHex, -0.1) : "#0284C7";
	const hexBtnActive = useHex ? shadeHex(accentHex, -0.18) : "#0369A1";

	// text on the accent button
	const btnText =
		textColor === "white"
			? "#FFFFFF"
			: textColor === "black"
			? "#0B1220"
			: useHex && isLight(hexBtn)
			? "#0B1220"
			: "#FFFFFF";

	// focus "ring" imitation
	const focusShadow = useHex ? `0 0 0 2px ${accentHex}` : undefined;

	const pal = useHex
		? {
				text: "text-slate-900",
				ringClass: "focus:outline-none", // we'll use inline boxShadow instead
				border: "border-gray-200",
		  }
		: {
				text: palette?.text || "text-sky-700",
				ringClass: palette?.ring || "focus-visible:ring-sky-700",
				border: palette?.border || "border-sky-100",
		  };

	/** sizes */
	const SIZES = {
		sm: {
			wrapper: "p-3 space-y-2",
			tabBtn: "px-2 py-1.5 text-xs",
			label: "text-xs",
			input: "px-2 py-1.5 text-sm",
			textarea: "p-2 text-sm",
		},
		md: {
			wrapper: "p-4 space-y-3",
			tabBtn: "px-3 py-1.5 text-sm",
			label: "text-sm",
			input: "px-2 py-1.5 text-sm",
			textarea: "p-3 text-base",
		},
		lg: {
			wrapper: "p-5 space-y-4",
			tabBtn: "px-3.5 py-2 text-base",
			label: "text-sm",
			input: "px-3 py-2 text-base",
			textarea: "p-4 text-lg",
		},
		xl: {
			wrapper: "p-6 space-y-5",
			tabBtn: "px-4 py-2 text-lg",
			label: "text-base",
			input: "px-3.5 py-2 text-lg",
			textarea: "p-5 text-xl",
		},
	};
	const sz = SIZES[size] || SIZES.md;

	/** state */
	const [tab, setTab] = React.useState("write");
	const signal = (next) => onChange?.(next);

	/** bullets helpers (restored) */
	const computedBullets =
		model.bullets && model.bullets.length > 0 ? model.bullets : [""];

	const updateBullet = (i, v) => {
		const base = Array.isArray(model.bullets) ? [...model.bullets] : [];
		if (i >= base.length) {
			while (base.length < i) base.push("");
			base.push(v);
		} else {
			base[i] = v;
		}
		signal({ ...model, bullets: base });
	};

	const insertBulletAfter = (i) => {
		const base = Array.isArray(model.bullets) ? [...model.bullets] : [];
		if (base.length === 0) base.push(computedBullets[0] || "");
		base.splice(i + 1, 0, "");
		signal({ ...model, bullets: base });
	};

	const removeBullet = (i) => {
		const base = Array.isArray(model.bullets) ? [...model.bullets] : [];
		if (base.length === 0) return;
		base.splice(i, 1);
		signal({ ...model, bullets: base });
	};

	const onBulletKeyDown = (i, e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			insertBulletAfter(i);
		}
	};

	/** download to DOCX (kept) */
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
			{/* Tabs + Download */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex gap-1">
					{["write", "bullets"].map((k) => {
						const active = tab === k;
						return (
							<button
								key={k}
								onClick={() => setTab(k)}
								className={`rounded-lg border ${sz.tabBtn} ${
									active
										? ""
										: "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
								}`}
								style={
									useHex && active
										? {
												backgroundColor: hexBtn,
												color: btnText,
												borderColor: "transparent",
										  }
										: undefined
								}
								title={k === "write" ? "Write" : "Bullets"}
							>
								{k === "write" ? "Write" : "Bullets"}
							</button>
						);
					})}
				</div>

				{enableDownload && (
					<button
						type="button"
						onClick={downloadDocx}
						className={`rounded-lg ${sz.tabBtn}`}
						style={{ backgroundColor: hexBtn, color: btnText }}
						onMouseEnter={(e) =>
							(e.currentTarget.style.backgroundColor = hexBtnHover)
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.backgroundColor = hexBtn)
						}
						onMouseDown={(e) =>
							(e.currentTarget.style.backgroundColor = hexBtnActive)
						}
						onMouseUp={(e) =>
							(e.currentTarget.style.backgroundColor = hexBtnHover)
						}
						title="Download as .docx"
					>
						Download (.docx)
					</button>
				)}
			</div>

			{/* Panel */}
			<div className={panelMinHClass}>
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
                focus:outline-none ${
									useHex ? "" : `focus:ring-2 ${pal.ringClass}`
								}
                resize-vertical ${sz.textarea} ${textareaClassName}`}
							style={useHex ? { boxShadow: "none" } : undefined}
							onFocus={(e) => {
								if (useHex) e.currentTarget.style.boxShadow = focusShadow;
							}}
							onBlur={(e) => {
								if (useHex) e.currentTarget.style.boxShadow = "none";
							}}
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
										className={`flex-1 rounded-md border border-gray-200 bg-gray-50 focus:outline-none ${
											useHex ? "" : `focus:ring-2 ${pal.ringClass}`
										} ${sz.input}`}
										value={b}
										onChange={(e) => updateBullet(i, e.target.value)}
										onKeyDown={(e) => onBulletKeyDown(i, e)}
										placeholder="Type a point and press Enter…"
										style={useHex ? { boxShadow: "none" } : undefined}
										onFocus={(e) => {
											if (useHex) e.currentTarget.style.boxShadow = focusShadow;
										}}
										onBlur={(e) => {
											if (useHex) e.currentTarget.style.boxShadow = "none";
										}}
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
					</motion.div>
				)}
			</div>
		</div>
	);
}
