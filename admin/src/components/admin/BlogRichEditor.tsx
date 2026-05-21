import { useCallback, useRef, useEffect } from "react";
import { Icon } from "@/components/Icon";

type BlogRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const TOOLBAR = [
  { cmd: "bold", icon: "format_bold", label: "Bold" },
  { cmd: "italic", icon: "format_italic", label: "Italic" },
  { cmd: "underline", icon: "format_underlined", label: "Underline" },
  { divider: true },
  { cmd: "formatBlock", arg: "h2", icon: "title", label: "Heading" },
  { cmd: "formatBlock", arg: "h3", icon: "view_headline", label: "Subheading" },
  { cmd: "formatBlock", arg: "p", icon: "notes", label: "Paragraph" },
  { divider: true },
  { cmd: "insertUnorderedList", icon: "format_list_bulleted", label: "Bullet list" },
  { cmd: "insertOrderedList", icon: "format_list_numbered", label: "Numbered list" },
  { cmd: "formatBlock", arg: "blockquote", icon: "format_quote", label: "Quote" },
  { divider: true },
  { cmd: "justifyLeft", icon: "format_align_left", label: "Align left" },
  { cmd: "justifyCenter", icon: "format_align_center", label: "Center" },
  { cmd: "justifyRight", icon: "format_align_right", label: "Align right" },
  { divider: true },
  { cmd: "createLink", icon: "link", label: "Link" },
  { cmd: "removeFormat", icon: "format_clear", label: "Clear format" },
] as const;

export default function BlogRichEditor({ value, onChange, placeholder }: BlogRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || el.innerHTML === value) return;
    el.innerHTML = value || "";
  }, [value]);

  const exec = useCallback(
    (command: string, arg?: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      if (command === "createLink") {
        const url = window.prompt("Enter URL", "https://");
        if (url) document.execCommand("createLink", false, url);
      } else if (command === "formatBlock" && arg) {
        document.execCommand(command, false, arg);
      } else {
        document.execCommand(command, false, arg);
      }
      onChange(el.innerHTML);
    },
    [onChange],
  );

  const handleInput = () => {
    const el = editorRef.current;
    if (el) onChange(el.innerHTML);
  };

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-stone-100 bg-stone-50/80">
        {TOOLBAR.map((item, i) =>
          "divider" in item ? (
            <span key={`d-${i}`} className="w-px h-6 bg-stone-200 mx-1" />
          ) : (
            <button
              key={item.cmd + (item.arg || "")}
              type="button"
              title={item.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(item.cmd, "arg" in item ? item.arg : undefined)}
              className="p-2 rounded-lg text-stone-600 hover:bg-white hover:text-orange-700 hover:shadow-sm transition-colors"
            >
              <Icon name={item.icon} className="text-lg" />
            </button>
          ),
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline
        data-placeholder={placeholder || "Write your story…"}
        onInput={handleInput}
        className="blog-editor min-h-[320px] max-h-[60vh] overflow-y-auto p-6 text-stone-800 text-base leading-relaxed focus:outline-none prose prose-stone max-w-none prose-headings:font-headline prose-headings:text-stone-900 prose-a:text-orange-600 prose-blockquote:border-orange-300 prose-blockquote:text-stone-600"
        suppressContentEditableWarning
      />
      <style>{`
        .blog-editor:empty:before {
          content: attr(data-placeholder);
          color: #a8a29e;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
