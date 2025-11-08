"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
}

export function CodeEditor({ code, onChange, language = "python", readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // Disable copy-paste functionality
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent copy and paste
    editor.addEventListener("copy", preventCopyPaste)
    editor.addEventListener("paste", preventCopyPaste)
    editor.addEventListener("cut", preventCopyPaste)

    return () => {
      editor.removeEventListener("copy", preventCopyPaste)
      editor.removeEventListener("paste", preventCopyPaste)
      editor.removeEventListener("cut", preventCopyPaste)
    }
  }, [])

  return (
    <div className="relative flex-1 overflow-hidden bg-slate-950 text-white">
      <div className="absolute left-0 top-0 z-10 w-full bg-slate-900 px-4 py-2 text-xs text-slate-400">
        {language.toUpperCase()}
      </div>
      <textarea
        ref={editorRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full w-full resize-none bg-transparent p-4 pt-10 font-mono text-sm text-slate-50 outline-none",
          readOnly && "opacity-80",
        )}
        style={{
          minHeight: "300px",
          tabSize: 2,
        }}
        readOnly={readOnly}
        spellCheck="false"
      />
    </div>
  )
}
