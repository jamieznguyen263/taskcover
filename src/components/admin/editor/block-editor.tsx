"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditorState, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Table as TableIcon,
  Undo2,
} from "lucide-react";
import { StructuredBlock } from "./structured-block-node";
import { SlashCommands } from "./slash-commands";

export function buildEditorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      link: { openOnClick: false },
    }),
    Placeholder.configure({ placeholder: "Write, or type / to insert a block…" }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    StructuredBlock,
    SlashCommands,
  ];
}

export type OutlineEntry = { level: 2 | 3 | 4; text: string; pos: number };

export function collectOutline(editor: Editor | null): OutlineEntry[] {
  if (!editor) return [];
  const entries: OutlineEntry[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      const level = node.attrs.level === 3 ? 3 : node.attrs.level === 4 ? 4 : 2;
      entries.push({ level, text: node.textContent || "Untitled heading", pos });
      return false;
    }
    return true;
  });
  return entries;
}

export function DocumentOutline({ editor }: { editor: Editor | null }) {
  const [outline, setOutline] = useState<OutlineEntry[]>(() => collectOutline(editor));

  useEffect(() => {
    if (!editor) return;
    const refresh = () => setOutline(collectOutline(editor));
    refresh();
    editor.on("update", refresh);
    return () => {
      editor.off("update", refresh);
    };
  }, [editor]);

  if (!outline.length) return <p className="text-xs text-muted">Add headings to build the outline.</p>;

  return (
    <nav aria-label="Document outline" className="grid gap-0.5">
      {outline.map((entry, index) => (
        <button
          key={`${entry.pos}-${index}`}
          type="button"
          onClick={() => {
            editor?.chain().focus().setTextSelection(entry.pos + 1).run();
            const dom = editor?.view.nodeDOM(entry.pos);
            if (dom instanceof HTMLElement) dom.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className={`truncate rounded-md px-2 py-1 text-left text-xs text-secondary hover:bg-surface-tint hover:text-brand-teal ${entry.level === 3 ? "ml-3" : entry.level === 4 ? "ml-6" : "font-medium"}`}
        >
          {entry.text}
        </button>
      ))}
    </nav>
  );
}

function ToolbarButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-secondary disabled:opacity-40 ${active ? "border-brand-teal bg-surface-tint text-brand-teal" : "border-line hover:text-brand-teal"}`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, disabled }: { editor: Editor | null; disabled: boolean }) {
  const state = useEditorState({
    editor,
    selector: (context) => ({
      bold: context.editor?.isActive("bold") ?? false,
      italic: context.editor?.isActive("italic") ?? false,
      h2: context.editor?.isActive("heading", { level: 2 }) ?? false,
      h3: context.editor?.isActive("heading", { level: 3 }) ?? false,
      h4: context.editor?.isActive("heading", { level: 4 }) ?? false,
      bullet: context.editor?.isActive("bulletList") ?? false,
      ordered: context.editor?.isActive("orderedList") ?? false,
      quote: context.editor?.isActive("blockquote") ?? false,
      code: context.editor?.isActive("codeBlock") ?? false,
      canUndo: context.editor?.can().undo() ?? false,
      canRedo: context.editor?.can().redo() ?? false,
    }),
  });

  if (!editor) return null;
  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Document formatting">
      <ToolbarButton label="Bold" active={state?.bold} disabled={disabled} onClick={() => chain().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Italic" active={state?.italic} disabled={disabled} onClick={() => chain().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Heading 2" active={state?.h2} disabled={disabled} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Heading 3" active={state?.h3} disabled={disabled} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Heading 4" active={state?.h4} disabled={disabled} onClick={() => chain().toggleHeading({ level: 4 }).run()}><Heading4 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Bulleted list" active={state?.bullet} disabled={disabled} onClick={() => chain().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Numbered list" active={state?.ordered} disabled={disabled} onClick={() => chain().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Quote" active={state?.quote} disabled={disabled} onClick={() => chain().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Code block" active={state?.code} disabled={disabled} onClick={() => chain().toggleCodeBlock().run()}><Code2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Insert table" disabled={disabled} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Divider" disabled={disabled} onClick={() => chain().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Undo" disabled={disabled || !state?.canUndo} onClick={() => chain().undo().run()}><Undo2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton label="Redo" disabled={disabled || !state?.canRedo} onClick={() => chain().redo().run()}><Redo2 className="h-4 w-4" /></ToolbarButton>
    </div>
  );
}

export function EditorBubbleMenu({ editor }: { editor: Editor | null }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} shouldShow={({ editor: current, state }) => current.isEditable && !state.selection.empty && !current.isActive("structuredBlock")}>
      <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1 shadow-lg">
        {linkOpen ? (
          <form
            className="flex items-center gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              if (linkValue.trim()) editor.chain().focus().setLink({ href: linkValue.trim() }).run();
              else editor.chain().focus().unsetLink().run();
              setLinkOpen(false);
            }}
          >
            <input
              autoFocus
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
              placeholder="https:// or /path"
              aria-label="Link URL"
              className="min-h-8 w-56 rounded-lg border border-line px-2 text-xs"
            />
            <button type="submit" className="min-h-8 rounded-lg bg-brand-teal px-2 text-xs font-semibold text-white">Set</button>
            <button type="button" onClick={() => setLinkOpen(false)} className="min-h-8 rounded-lg border border-line px-2 text-xs">Cancel</button>
          </form>
        ) : (
          <>
            <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton
              label={editor.isActive("link") ? "Edit link" : "Add link"}
              active={editor.isActive("link")}
              onClick={() => {
                setLinkValue((editor.getAttributes("link").href as string) ?? "");
                setLinkOpen(true);
              }}
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}
      </div>
    </BubbleMenu>
  );
}

export function BlockEditorSurface({ editor, disabled }: { editor: Editor | null; disabled: boolean }) {
  return (
    <div className="grid gap-3">
      <EditorToolbar editor={editor} disabled={disabled} />
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
