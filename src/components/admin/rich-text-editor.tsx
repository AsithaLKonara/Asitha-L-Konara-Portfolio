"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  function handleCommand(command: string) {
    document.execCommand(command);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-slate-200">
        <button type="button" onClick={() => handleCommand("bold")} className="rounded bg-white/10 px-2 py-1">
          Bold
        </button>
        <button type="button" onClick={() => handleCommand("italic")} className="rounded bg-white/10 px-2 py-1">
          Italic
        </button>
        <button type="button" onClick={() => handleCommand("underline")} className="rounded bg-white/10 px-2 py-1">
          Underline
        </button>
        <button type="button" onClick={() => handleCommand("insertUnorderedList")} className="rounded bg-white/10 px-2 py-1">
          Bullets
        </button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[200px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/30"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
      />
    </div>
  );
}
