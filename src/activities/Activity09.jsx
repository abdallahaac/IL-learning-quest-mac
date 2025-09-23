import React, { useState } from "react";
import { Newspaper } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity09({ content, notes, completed, onNotes, onToggleComplete }) {
  const placeholder = content?.notePlaceholder || "Story link, your reflections…";
  const [localNotes, setLocalNotes] = useState(notes);
  const saveNotes = (v) => { setLocalNotes(v); onNotes?.(v); };

  return (
    <div className="relative bg-transparent min-h-[80svh]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Indigenous-Focused News Story</h1>
            < Newspaper className="w-6 h-6 text-slate-700" aria-hidden="true" />
          </div>
          <p className="text-slate-700 max-w-2xl mx-auto">Uncover a news story with an Indigenous focus and reflect on its scope. What challenges/biases are visible?</p>
        </header>

        <section className="flex justify-center"><div className="grid sm:grid-cols-2 gap-4">

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">APTN</div>
            <div className="text-sm text-gray-600">Uncover a news story with an Indigenous focus and reflect on its scope. What challenges/biases are visible?</div>
          </a>

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">The Turtle Island News</div>
            <div className="text-sm text-gray-600">Uncover a news story with an Indigenous focus and reflect on its scope. What challenges/biases are visible?</div>
          </a>

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">Kukukwes.com</div>
            <div className="text-sm text-gray-600">Uncover a news story with an Indigenous focus and reflect on its scope. What challenges/biases are visible?</div>
          </a>

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">IndigiNews</div>
            <div className="text-sm text-gray-600">Uncover a news story with an Indigenous focus and reflect on its scope. What challenges/biases are visible?</div>
          </a>
        </div></section>

        <NoteComposer
          value={localNotes}
          onChange={saveNotes}
          storageKey={`notes-${content?.id || "09"}`}
          suggestedTags={["Inspiring","Community","Language","Action","History"]}
          placeholder={placeholder || "Type your reflections…"}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onToggleComplete}
            aria-pressed={!!completed}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${completed ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100"}`}
          >
            {completed ? "Marked Complete" : "Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
