import { useEffect, useRef, useState } from "react";

interface DescriptionEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export default function DescriptionEditor({
  content,
  onChange,
  disabled = false,
}: DescriptionEditorProps) {
  const [localContent, setLocalContent] = useState(content || "");
  const [error, setError] = useState<string | null>(null);

  // Sync external content changes
  useEffect(() => {
    if (content !== localContent) {
      setLocalContent(content);
    }
  }, [content]);

  const handleChange = (text: string) => {
    setLocalContent(text);
    onChange(text);
  };

  if (error) {
    return (
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold"
          style={{ color: "#393E46" }}
        >
          Description
        </label>
        <p className="text-xs text-red-600">
          Error initializing editor: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <label
          className="block text-sm font-semibold"
          style={{ color: "#393E46" }}
        >
          Description
        </label>
        <p className="text-xs mt-1" style={{ color: "#929AAB" }}>
          Start with anything — a note, reminder, or detail
        </p>
      </div>

      <div
        className="rounded border"
        style={{
          backgroundColor: "#F7F7F7",
          borderColor: "#EEEEEE",
          overflow: "hidden",
        }}
      >
        {/* Simple Editor Textarea */}
        <textarea
          value={localContent}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter text or details here..."
          className="w-full p-4 min-h-[280px] resize-none rounded-none focus:outline-none text-sm"
          style={{
            backgroundColor: "#F7F7F7",
            color: "#393E46",
            border: "none",
          }}
        />

        {/* Toolbar - Placeholder buttons */}
        <div
          className="flex flex-wrap gap-1 p-3 border-t"
          style={{
            backgroundColor: "#EEEEEE",
            borderColor: "#F7F7F7",
          }}
        >
          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Heading"
            className="p-2 rounded hover:opacity-70 transition-opacity text-xs"
            style={{
              backgroundColor: "transparent",
              color: "#393E46",
            }}
          >
            H
          </button>

          <div
            style={{
              width: "1px",
              backgroundColor: "#929AAB",
              margin: "0 4px",
            }}
          />

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Bullet List"
            className="p-2 rounded hover:opacity-70 transition-opacity text-xs"
            style={{
              color: "#393E46",
            }}
          >
            ≡
          </button>

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Ordered List"
            className="p-2 rounded hover:opacity-70 transition-opacity text-xs"
            style={{
              color: "#393E46",
            }}
          >
            1.
          </button>

          <div
            style={{
              width: "1px",
              backgroundColor: "#929AAB",
              margin: "0 4px",
            }}
          />

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Bold"
            className="p-2 rounded hover:opacity-70 transition-opacity text-xs font-bold"
            style={{
              color: "#393E46",
            }}
          >
            B
          </button>

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Italic"
            className="p-2 rounded hover:opacity-70 transition-opacity text-xs italic"
            style={{
              color: "#393E46",
            }}
          >
            I
          </button>

          <div
            style={{
              width: "1px",
              backgroundColor: "#929AAB",
              margin: "0 4px",
            }}
          />

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Insert Image"
            className="p-2 rounded hover:opacity-70 transition-opacity text-base"
            style={{
              color: "#393E46",
            }}
          >
            🖼️
          </button>

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Insert YouTube"
            className="p-2 rounded hover:opacity-70 transition-opacity text-base"
            style={{
              color: "#393E46",
            }}
          >
            📹
          </button>

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Insert Link"
            className="p-2 rounded hover:opacity-70 transition-opacity text-base"
            style={{
              color: "#393E46",
            }}
          >
            🔗
          </button>

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Draw"
            className="p-2 rounded hover:opacity-70 transition-opacity text-base"
            style={{
              color: "#393E46",
            }}
          >
            ✏️
          </button>

          <button
            onClick={() => alert("Coming soon!")}
            disabled={disabled}
            title="Reminder"
            className="p-2 rounded hover:opacity-70 transition-opacity text-base"
            style={{
              color: "#393E46",
            }}
          >
            ⏱️
          </button>
        </div>
      </div>
    </div>
  );
}
