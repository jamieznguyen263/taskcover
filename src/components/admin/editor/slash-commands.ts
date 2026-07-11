import { Extension, type Editor, type Range } from "@tiptap/core";
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from "@tiptap/suggestion";
import { structuredBlockTypes } from "@/lib/admin/normalization";
import { defaultStructuredBlockData, structuredBlockMeta } from "./structured-block-defaults";

export type SlashCommandItem = {
  title: string;
  description: string;
  keywords: string;
  run: (editor: Editor, range: Range) => void;
};

const basicItems: SlashCommandItem[] = [
  { title: "Paragraph", description: "Plain body text.", keywords: "text body paragraph", run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: "Heading 2", description: "Section heading.", keywords: "h2 heading section", run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run() },
  { title: "Heading 3", description: "Subsection heading.", keywords: "h3 heading subsection", run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run() },
  { title: "Heading 4", description: "Minor heading.", keywords: "h4 heading", run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run() },
  { title: "Bulleted list", description: "Unordered list.", keywords: "bullet ul list", run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: "Numbered list", description: "Ordered list.", keywords: "ordered ol numbered list", run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: "Quote", description: "Block quotation.", keywords: "quote blockquote", run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
  { title: "Code block", description: "Preformatted code.", keywords: "code snippet pre", run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
  { title: "Table", description: "Editable table (published as comparison table).", keywords: "table comparison grid", run: (editor, range) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { title: "Divider", description: "Horizontal rule.", keywords: "divider rule hr separator", run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
];

const structuredItems: SlashCommandItem[] = structuredBlockTypes.map((type) => ({
  title: structuredBlockMeta[type].label,
  description: structuredBlockMeta[type].description,
  keywords: `${type} ${structuredBlockMeta[type].label.toLowerCase()}`,
  run: (editor, range) => editor.chain().focus().deleteRange(range).insertStructuredBlock(type, defaultStructuredBlockData(type)).run(),
}));

export const slashCommandItems: SlashCommandItem[] = [...basicItems, ...structuredItems];

export function filterSlashItems(query: string): SlashCommandItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return slashCommandItems;
  return slashCommandItems.filter((item) => item.title.toLowerCase().includes(needle) || item.keywords.includes(needle));
}

class SlashMenu {
  private element: HTMLDivElement | null = null;
  private items: SlashCommandItem[] = [];
  private selectedIndex = 0;
  private command: ((item: SlashCommandItem) => void) | null = null;

  start(props: SuggestionProps<SlashCommandItem, SlashCommandItem>) {
    this.element = document.createElement("div");
    this.element.setAttribute("role", "listbox");
    this.element.setAttribute("aria-label", "Insert block");
    this.element.className = "z-50 max-h-80 w-80 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-lg";
    this.element.style.position = "fixed";
    document.body.appendChild(this.element);
    this.update(props);
  }

  update(props: SuggestionProps<SlashCommandItem, SlashCommandItem>) {
    this.items = props.items;
    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, this.items.length - 1));
    this.command = (item) => props.command(item);
    this.position(props.clientRect?.() ?? null);
    this.renderItems();
  }

  keyDown(props: SuggestionKeyDownProps): boolean {
    if (props.event.key === "ArrowDown") {
      this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.items.length);
      this.renderItems();
      return true;
    }
    if (props.event.key === "ArrowUp") {
      this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % Math.max(1, this.items.length);
      this.renderItems();
      return true;
    }
    if (props.event.key === "Enter") {
      const item = this.items[this.selectedIndex];
      if (item && this.command) this.command(item);
      return true;
    }
    if (props.event.key === "Escape") {
      this.destroy();
      return true;
    }
    return false;
  }

  destroy() {
    this.element?.remove();
    this.element = null;
  }

  private position(rect: DOMRect | null) {
    if (!this.element || !rect) return;
    const menuHeight = Math.min(320, this.element.scrollHeight || 320);
    const below = rect.bottom + 6;
    const top = below + menuHeight > window.innerHeight ? Math.max(8, rect.top - menuHeight - 6) : below;
    this.element.style.top = `${top}px`;
    this.element.style.left = `${Math.min(rect.left, window.innerWidth - 336)}px`;
  }

  private renderItems() {
    if (!this.element) return;
    this.element.replaceChildren();
    if (!this.items.length) {
      const empty = document.createElement("p");
      empty.className = "px-3 py-2 text-sm text-secondary";
      empty.textContent = "No matching blocks.";
      this.element.appendChild(empty);
      return;
    }
    this.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", String(index === this.selectedIndex));
      button.className = `block w-full rounded-lg px-3 py-2 text-left ${index === this.selectedIndex ? "bg-surface-tint" : "hover:bg-surface-soft"}`;
      const title = document.createElement("span");
      title.className = "block text-sm font-medium text-graphite";
      title.textContent = item.title;
      const description = document.createElement("span");
      description.className = "block text-xs text-muted";
      description.textContent = item.description;
      button.appendChild(title);
      button.appendChild(description);
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        this.command?.(item);
      });
      this.element?.appendChild(button);
      if (index === this.selectedIndex) button.scrollIntoView({ block: "nearest" });
    });
  }
}

export const SlashCommands = Extension.create({
  name: "slashCommands",

  addProseMirrorPlugins() {
    let menu: SlashMenu | null = null;
    return [
      Suggestion<SlashCommandItem, SlashCommandItem>({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }) => props.run(editor, range),
        items: ({ query }) => filterSlashItems(query),
        render: () => ({
          onStart: (props) => {
            menu = new SlashMenu();
            menu.start(props);
          },
          onUpdate: (props) => menu?.update(props),
          onKeyDown: (props) => menu?.keyDown(props) ?? false,
          onExit: () => {
            menu?.destroy();
            menu = null;
          },
        }),
      }),
    ];
  },
});
