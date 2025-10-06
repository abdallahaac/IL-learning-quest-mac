import React, { useEffect, useMemo, useRef } from "react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { saveAs } from "file-saver";

// If you prefer `docx` instead of html-docx-js, swap this implementation.
import htmlDocx from "html-docx-js/dist/html-docx";

import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	List as BulletList,
	ListOrdered,
	Heading1,
	Heading2,
	Heading3,
	Quote,
	Code,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Highlighter,
	Link as LinkIcon,
	Unlink,
	Image as ImageIcon,
	Video,
	Table as TableIcon,
	Download,
} from "lucide-react";

/**
 * RichNoteComposer
 * -----------------
 * A polished, accessible WYSIWYG editor built on TipTap + Tailwind, matching the
 * props surface of your existing NoteComposer enough to be a near drop-in.
 *
 * Props (supported subset of your NoteComposer):
 * - value (string)           : HTML content
 * - onChange (fn)            : called with HTML string
 * - placeholder (string)
 * - pageLinks (array)        : [{label, url}]
 * - includeLinks (bool)
 * - downloadFileName (str)
 * - docTitle (str)
 * - docSubtitle (str)
 * - docIntro (str)
 * - headingColor (str)
 * - activityNumber (number|string)
 * - accent (str)             : hex or CSS color for accents (default #4380d6)
 */

const ToolbarButton = ({ onClick, active, disabled, label, children }) => (
	<button
		type="button"
		className={`inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}
      ${active ? "bg-gray-100" : "bg-white"}
    `}
		aria-pressed={!!active}
		onClick={onClick}
		disabled={disabled}
		title={label}
	>
		{children}
	</button>
);

const Toolbar = ({
	accent = "#4380d6",
	onRequestExport,
	onRequestLink,
	onRemoveLink,
	onInsertImage,
	onInsertVideo,
	onInsertTable,
}) => {
	const { editor } = useCurrentEditor();
	if (!editor) return null;

	const canUndo = editor.can().undo();
	const canRedo = editor.can().redo();

	return (
		<div className="sticky top-0 z-10 rounded-t-xl border border-gray-200 bg-white/90 backdrop-blur px-2 py-2">
			<div className="flex flex-wrap items-center gap-1.5">
				{/* left cluster */}
				<div className="flex items-center gap-1.5">
					<ToolbarButton
						label="Bold"
						active={editor.isActive("bold")}
						onClick={() => editor.chain().focus().toggleBold().run()}
					>
						<Bold className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Italic"
						active={editor.isActive("italic")}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					>
						<Italic className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Underline"
						active={editor.isActive("underline")}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
					>
						<UnderlineIcon className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Strike"
						active={editor.isActive("strike")}
						onClick={() => editor.chain().focus().toggleStrike().run()}
					>
						<Strikethrough className="w-4 h-4" />
					</ToolbarButton>
					<div className="w-px h-5 bg-gray-300 mx-1" />
					<ToolbarButton
						label="Paragraph"
						active={editor.isActive("paragraph")}
						onClick={() => editor.chain().focus().setParagraph().run()}
					>
						<span className="text-[11px]">P</span>
					</ToolbarButton>
					<ToolbarButton
						label="Heading 1"
						active={editor.isActive("heading", { level: 1 })}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
					>
						<Heading1 className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Heading 2"
						active={editor.isActive("heading", { level: 2 })}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
					>
						<Heading2 className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Heading 3"
						active={editor.isActive("heading", { level: 3 })}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
					>
						<Heading3 className="w-4 h-4" />
					</ToolbarButton>
					<div className="w-px h-5 bg-gray-300 mx-1" />
					<ToolbarButton
						label="Bulleted list"
						active={editor.isActive("bulletList")}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					>
						<BulletList className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Ordered list"
						active={editor.isActive("orderedList")}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					>
						<ListOrdered className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Blockquote"
						active={editor.isActive("blockquote")}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					>
						<Quote className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Code"
						active={editor.isActive("code")}
						onClick={() => editor.chain().focus().toggleCode().run()}
					>
						<Code className="w-4 h-4" />
					</ToolbarButton>
					<div className="w-px h-5 bg-gray-300 mx-1" />
					<ToolbarButton
						label="Align left"
						active={editor.isActive({ textAlign: "left" })}
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
					>
						<AlignLeft className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Align center"
						active={editor.isActive({ textAlign: "center" })}
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
					>
						<AlignCenter className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Align right"
						active={editor.isActive({ textAlign: "right" })}
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
					>
						<AlignRight className="w-4 h-4" />
					</ToolbarButton>
					<div className="w-px h-5 bg-gray-300 mx-1" />
					<ToolbarButton
						label="Highlight"
						active={editor.isActive("highlight")}
						onClick={() =>
							editor.chain().focus().toggleHighlight({ color: "#fff59d" }).run()
						}
					>
						<Highlighter className="w-4 h-4" />
					</ToolbarButton>
					{/* Simple color sampler */}
					<input
						type="color"
						className="h-8 w-8 cursor-pointer border rounded-md"
						aria-label="Text color"
						onChange={(e) =>
							editor.chain().focus().setColor(e.target.value).run()
						}
						value={editor.getAttributes("textStyle").color || "#111827"}
					/>
					<div className="w-px h-5 bg-gray-300 mx-1" />
					<ToolbarButton
						label="Add link"
						active={editor.isActive("link")}
						onClick={onRequestLink}
					>
						<LinkIcon className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton label="Remove link" onClick={onRemoveLink}>
						<Unlink className="w-4 h-4" />
					</ToolbarButton>
					<div className="w-px h-5 bg-gray-300 mx-1" />
					<ToolbarButton label="Insert image" onClick={onInsertImage}>
						<ImageIcon className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton label="Insert video" onClick={onInsertVideo}>
						<Video className="w-4 h-4" />
					</ToolbarButton>
					<ToolbarButton label="Insert table" onClick={onInsertTable}>
						<TableIcon className="w-4 h-4" />
					</ToolbarButton>
				</div>

				<div className="ml-auto flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => editor.commands.undo()}
						disabled={!canUndo}
						className="text-sm px-2.5 py-1.5 rounded-md border bg-white disabled:opacity-40"
					>
						Undo
					</button>
					<button
						type="button"
						onClick={() => editor.commands.redo()}
						disabled={!canRedo}
						className="text-sm px-2.5 py-1.5 rounded-md border bg-white disabled:opacity-40"
					>
						Redo
					</button>
					<button
						type="button"
						onClick={onRequestExport}
						className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-[var(--accent,#4380d6)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:brightness-105 focus:outline-none focus-visible:ring-2"
						style={{ ["--accent"]: accent }}
					>
						<Download className="w-4 h-4" />
						Download .docx
					</button>
				</div>
			</div>
		</div>
	);
};

const RichContentShell = ({
	value,
	onChange,
	placeholder,
	includeLinks = true,
	pageLinks = [],
	docTitle,
	docSubtitle,
	docIntro,
	headingColor = "#2563eb",
	downloadFileName = "Reflection.docx",
	activityNumber,
	accent = "#4380d6",
}) => {
	const { editor } = useCurrentEditor();

	// Emit changes
	useEffect(() => {
		if (!editor) return;
		const fn = () => onChange?.(editor.getHTML());
		editor.on("update", fn);
		return () => editor.off("update", fn);
	}, [editor, onChange]);

	// Export to DOCX
	const doExport = () => {
		if (!editor) return;
		const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${
			docTitle || "Reflection"
		}</title></head><body>
      <h1 style="color:${headingColor}; margin:0 0 8px 0; font-family:ui-sans-serif,system-ui">${
			docTitle || "Reflection"
		}</h1>
      ${
				docSubtitle
					? `<h3 style="margin:0 0 12px 0; color:#374151">${docSubtitle}</h3>`
					: ""
			}
      ${
				activityNumber
					? `<p style="font-weight:600; color:${accent}">Activity ${activityNumber}</p>`
					: ""
			}
      ${
				docIntro
					? `<p style="margin:8px 0 16px 0; color:#111827">${docIntro}</p>`
					: ""
			}
      ${editor.getHTML()}
      ${
				includeLinks && pageLinks?.length
					? `<hr/><h3 style="color:${headingColor}">Resources</h3><ul>${pageLinks
							.map((l) => `<li><a href="${l.url}">${l.label || l.url}</a></li>`)
							.join("")}</ul>`
					: ""
			}
    </body></html>`;

		const blob = htmlDocx.asBlob(html);
		saveAs(blob, downloadFileName);
	};

	// Link handlers
	const onRequestLink = () => {
		const url = window.prompt("Enter URL");
		if (!url) return;
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url, target: "_blank" })
			.run();
	};
	const onRemoveLink = () => editor.chain().focus().unsetLink().run();

	const onInsertImage = () => {
		const url = window.prompt("Image URL");
		if (!url) return;
		editor.chain().focus().setImage({ src: url, alt: "" }).run();
	};
	const onInsertVideo = () => {
		const url = window.prompt("YouTube URL");
		if (!url) return;
		editor
			.chain()
			.focus()
			.setYoutubeVideo({ src: url, width: 640, height: 360 })
			.run();
	};
	const onInsertTable = () => {
		editor
			.chain()
			.focus()
			.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
			.run();
	};

	return (
		<div
			className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden"
			style={{ ["--accent"]: accent }}
		>
			<Toolbar
				accent={accent}
				onRequestExport={doExport}
				onRequestLink={onRequestLink}
				onRemoveLink={onRemoveLink}
				onInsertImage={onInsertImage}
				onInsertVideo={onInsertVideo}
				onInsertTable={onInsertTable}
			/>

			<div className="px-4 py-3">
				{docTitle && (
					<div className="mb-3">
						<h2
							className="text-xl font-semibold"
							style={{ color: headingColor }}
						>
							{docTitle}
						</h2>
						{docSubtitle && (
							<p className="text-sm text-gray-600">{docSubtitle}</p>
						)}
						{activityNumber && (
							<p
								className="text-xs font-medium mt-0.5"
								style={{ color: accent }}
							>
								Activity {activityNumber}
							</p>
						)}
						{docIntro && <p className="mt-2 text-gray-800">{docIntro}</p>}
					</div>
				)}

				<div className="min-h-72 prose prose-slate max-w-none dark:prose-invert">
					{/* The editable area is mounted by EditorContent inside EditorProvider */}
				</div>

				{includeLinks && pageLinks?.length > 0 && (
					<div className="mt-6">
						<h3
							className="text-base font-semibold"
							style={{ color: headingColor }}
						>
							Resources
						</h3>
						<ul className="list-disc pl-5">
							{pageLinks.map((l, i) => (
								<li key={i}>
									<a
										className="text-[var(--accent,#4380d6)] underline underline-offset-2"
										href={l.url}
										target="_blank"
										rel="noreferrer"
									>
										{l.label || l.url}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default function RichNoteComposer(props) {
	const { value = "", placeholder = "Start typing…" } = props;

	const extensions = useMemo(
		() => [
			StarterKit.configure({ codeBlock: true }),
			Underline,
			Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
			Placeholder.configure({ placeholder }),
			TextStyle,
			Color,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Highlight,
			Image,
			Youtube.configure({ nolink: false, controls: true }),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
		],
		[placeholder]
	);

	// Keep EditorProvider controlled via `value`
	const contentRef = useRef(value);
	useEffect(() => {
		contentRef.current = value;
	}, [value]);

	return (
		<EditorProvider
			slotBefore={<RichContentShell {...props} />}
			extensions={extensions}
			content={contentRef.current}
			editorProps={{
				attributes: {
					class:
						"tiptap focus:outline-none block min-h-[18rem] px-4 pb-6 text-[15px] leading-7",
				},
			}}
			onCreate={({ editor }) => {
				// initial sync to parent
				props.onChange?.(editor.getHTML());
			}}
		/>
	);
}

/*
USAGE EXAMPLE (inside your Activity component):

<RichNoteComposer
  value={localNotes}
  onChange={saveNotes}
  placeholder={placeholder}
  pageLinks={pageLinks}
  includeLinks={true}
  downloadFileName={`Activity-${content?.id || "01"}-Reflection.docx`}
  docTitle={content?.title || "Explore an Indigenous Artist"}
  docSubtitle={content?.subtitle}
  docIntro="Explore works by an Indigenous artist that speak to you. How do you relate to this artist? How do they inspire you?"
  headingColor="#2563eb"
  activityNumber={1}
  accent="#4380d6"
/>

Required packages:
  npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-align @tiptap/extension-highlight @tiptap/extension-image @tiptap/extension-youtube @tiptap/extension-table @tiptap/extension-text-style @tiptap/extension-color file-saver html-docx-js lucide-react

Tailwind prose (optional): add @tailwindcss/typography and include `prose` classes if desired.
*/

// Basic TipTap styles (kept minimal; extend as you like)
// You can also move this into your global CSS.
const style = document.createElement("style");
style.innerHTML = `
  .tiptap p { margin: 0.25rem 0; }
  .tiptap h1, .tiptap h2, .tiptap h3 { font-weight: 700; line-height: 1.25; margin-top: 1rem; margin-bottom: 0.5rem; }
  .tiptap ul { list-style: disc; padding-left: 1.25rem; }
  .tiptap ol { list-style: decimal; padding-left: 1.25rem; }
  .tiptap blockquote { border-left: 3px solid #e5e7eb; margin: 0.75rem 0; padding-left: 0.75rem; color: #374151; }
  .tiptap a { color: var(--accent, #4380d6); text-decoration: underline; }
  .tiptap table { border-collapse: collapse; margin: .75rem 0; width: 100%; }
  .tiptap th, .tiptap td { border: 1px solid #e5e7eb; padding: .375rem .5rem; }
`;
document.head.appendChild(style);
