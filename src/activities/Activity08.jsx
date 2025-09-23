import React, { useState } from "react";
import { HeartHandshake } from "lucide-react";
import NoteComposer from "../components/NoteComposer.jsx";

export default function Activity08({ content, notes, completed, onNotes, onToggleComplete }) {
  const placeholder = content?.notePlaceholder || "Voices you followed; what you learned…";
  const [localNotes, setLocalNotes] = useState(notes);
  const saveNotes = (v) => { setLocalNotes(v); onNotes?.(v); };

  return (
    <div className="relative bg-transparent min-h-[80svh]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">2SLGBTQQIA+ / Two-Spirit & Indigiqueer Communities</h1>
            < HeartHandshake className="w-6 h-6 text-slate-700" aria-hidden="true" />
          </div>
          <p className="text-slate-700 max-w-2xl mx-auto">Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.</p>
        </header>

        <section className="flex justify-center"><div className="grid sm:grid-cols-2 gap-4">

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">Indigenous knowledge & Two-Spirit leadership</div>
            <div className="text-sm text-gray-600">Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.</div>
          </a>

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">Two-Spirit Library</div>
            <div className="text-sm text-gray-600">Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.</div>
          </a>

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">Two spirits, one voice</div>
            <div className="text-sm text-gray-600">Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.</div>
          </a>

          <a href="#" className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="font-medium text-gray-800">Advocates: Dr. James Makokis, Jaris Swidrovich, Raven Davis, TJ Cuthand, Alexa Keleutak, Chelsea Vowel</div>
            <div className="text-sm text-gray-600">Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.</div>
          </a>
        </div></section>

        <NoteComposer
          value={localNotes}
          onChange={saveNotes}
          storageKey={`notes-${content?.id || "08"}`}
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
