import { useMemo } from "react";
import { useGraphStore } from "../../stores/useGraphStore";

interface DeleteNodeSectionProps {
  nodeId: string;
  onDelete: () => void;
  disabled?: boolean;
}

export default function DeleteNodeSection({
  nodeId,
  onDelete,
  disabled = false,
}: DeleteNodeSectionProps) {
  const edges = useGraphStore((s) => s.edges);

  // Get all connections related to this node
  const relatedEdges = useMemo(
    () => edges.filter((e) => e.source === nodeId || e.target === nodeId),
    [edges, nodeId],
  );

  const handleDelete = () => {
    const confirmMessage =
      relatedEdges.length > 0
        ? `This node has ${relatedEdges.length} connection(s) that will be deleted. Are you sure?`
        : "Are you sure you want to delete this node?";

    if (confirm(confirmMessage)) {
      onDelete();
    }
  };

  return (
    <div className="grid gap-3 rounded border border-red-200 bg-red-50 p-3">
      <div>
        <p className="text-xs font-semibold text-red-900">Danger Zone</p>
        <p className="text-xs text-red-700 mt-1">
          Deleting this node will permanently remove it and all its connections.
        </p>
      </div>

      {relatedEdges.length > 0 && (
        <div className="text-xs text-red-700 bg-red-100/50 rounded p-2">
          ⚠️ This node has <strong>{relatedEdges.length}</strong> connection(s)
          that will be deleted.
        </div>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={disabled}
        className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete Node
      </button>
    </div>
  );
}
