"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo2, Strikethrough, Undo2 } from "lucide-react";
import type { Editor } from "@tiptap/react";

/**
 * Rich text editor for documents, reusing the TipTap stack already in the repo. Stores HTML
 * in a hidden input named `name` so it submits with the surrounding <form>; the server keeps
 * `documents.body` as that HTML and converts it to text for action extraction (html-text.ts).
 * `immediatelyRender: false` keeps it SSR-safe under Next.
 */
export function RichTextEditor({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Placeholder.configure({ placeholder: placeholder ?? "Write here…" }),
    ],
    content: defaultValue || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-body min-h-[240px] rounded-b-lg bg-white px-3 py-3 text-sm leading-7 text-graphite outline-none",
        "aria-label": "Document body",
      },
    },
    onUpdate: ({ editor: current }) => setHtml(current.getHTML()),
  });

  return (
    <div className="rounded-lg border border-line">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

/** Read-only render of stored document HTML, parsed through TipTap so unknown/unsafe tags are dropped. */
export function RichTextView({ html }: { html: string }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } })],
    content: html || "<p></p>",
    editable: false,
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap-body text-sm leading-7 text-graphite" } },
  });
  return <EditorContent editor={editor} />;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-40 ${
        active ? "bg-surface-tint text-brand-teal" : "text-secondary hover:text-brand-teal"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      strike: e?.isActive("strike") ?? false,
      h2: e?.isActive("heading", { level: 2 }) ?? false,
      h3: e?.isActive("heading", { level: 3 }) ?? false,
      bullet: e?.isActive("bulletList") ?? false,
      ordered: e?.isActive("orderedList") ?? false,
      quote: e?.isActive("blockquote") ?? false,
      canUndo: e?.can().undo() ?? false,
      canRedo: e?.can().redo() ?? false,
    }),
  });

  if (!editor || !state) return <div className="h-10 rounded-t-lg border-b border-line bg-surface-soft" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-line bg-surface-soft p-1">
      <ToolbarButton label="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
      <ToolbarButton
        label="Heading 2"
        active={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={state.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Bullet list" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={state.ordered}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Quote" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
      <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}
