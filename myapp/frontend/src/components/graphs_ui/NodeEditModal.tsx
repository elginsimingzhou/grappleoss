import React, { useEffect, useMemo, useState } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import type { DetailNodeType } from "./DetailNode";

const TYPE_OPTIONS: DetailNodeType[] = [
  "Position",
  "Action",
  "Reaction",
  "Submission",
  "None",
];

export default function NodeEditModal() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);

  const closeNodeModal = useGraphStore((s) => s.closeNodeModal);
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const deleteNode = useGraphStore((s) => s.deleteNode);

  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  const initialLabel = String(node?.data?.label ?? "");
  const initialType = (node?.data?.type ?? "None") as DetailNodeType;

  const [label, setLabel] = useState(initialLabel);
  const [type, setType] = useState<DetailNodeType>(initialType);

  // Keep local state in sync when switching nodes
  useEffect(() => {
    setLabel(initialLabel);
    setType(initialType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId]);

  // If nothing selected, render nothing
  if (!selectedNodeId || !node) return null;

  const onSave = () => {
    updateNodeData(selectedNodeId, {
      label: label,
      type,
    });
    closeNodeModal();
  };

  const onDelete = () => {
    deleteNode(selectedNodeId);
    closeNodeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={closeNodeModal}
        aria-label="Close modal"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-[520px] max-w-[92vw] rounded-xl bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Edit Node</div>
            <div className="text-xs text-black/60">ID: {selectedNodeId}</div>
          </div>

          <button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={closeNodeModal}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {/* Title */}
          <div className="grid gap-1">
            <label className="text-xs text-black/70">Title</label>
            <input
              className="w-full rounded border px-3 py-2 text-sm text-black"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Untitled"
            />
          </div>

          {/* Type */}
          <div className="grid gap-1">
            <label className="text-xs text-black/70">Type</label>
            <select
              className="w-full rounded border px-3 py-2 text-sm text-black"
              value={type}
              onChange={(e) => setType(e.target.value as DetailNodeType)}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded border px-3 py-2 text-sm"
              onClick={closeNodeModal}
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700"
              onClick={onDelete}
            >
              Delete
            </button>

            <button
              type="button"
              className="rounded bg-black px-3 py-2 text-sm text-white"
              onClick={onSave}
            >
              Save
            </button>
          </div>

          {/* Later: you can mount your TipTap editor here too */}
          {/* e.g. Description editor, YouTube URL, Connections, etc. */}
        </div>
      </div>
    </div>
  );
}
