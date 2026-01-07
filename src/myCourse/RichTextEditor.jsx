import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toolbarButtons = [
  { icon: Bold, label: "Bold", format: "bold" },
  { icon: Italic, label: "Italic", format: "italic" },
  { icon: Underline, label: "Underline", format: "underline" },
  { icon: Strikethrough, label: "Strikethrough", format: "strikethrough" },
  { type: "divider" },
  { icon: List, label: "Bullet List", format: "bulletList" },
  { icon: ListOrdered, label: "Numbered List", format: "orderedList" },
  { type: "divider" },
  { icon: Link, label: "Link", format: "link" },
  { icon: Image, label: "Image", format: "image" },
  { icon: Code, label: "Code", format: "code" },
];

const RichTextEditor = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
}) => {
  const [activeFormats, setActiveFormats] = useState([]);

  const toggleFormat = (format) => {
    setActiveFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="rich-editor-toolbar border-b border-border">
        {toolbarButtons.map((btn, index) =>
          btn.type === "divider" ? (
            <div key={index} className="w-px h-6 bg-border mx-1" />
          ) : (
            <button
              key={btn.format}
              onClick={() => toggleFormat(btn.format)}
              className={cn(
                "rich-editor-btn",
                activeFormats.includes(btn.format) && "active"
              )}
              title={btn.label}
              type="button"
            >
              {btn.icon && <btn.icon className="w-4 h-4" />}
            </button>
          )
        )}
      </div>

      {/* Editor Content */}
      <div className="p-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none"
        />

        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Take a Note"
          className="w-full h-32 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-sm leading-relaxed"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 px-4 pb-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-border text-muted-foreground hover:text-foreground"
        >
          CANCEL
        </Button>

        <Button
          onClick={onSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          SAVE
        </Button>
      </div>
    </div>
  );
};

export default RichTextEditor;
