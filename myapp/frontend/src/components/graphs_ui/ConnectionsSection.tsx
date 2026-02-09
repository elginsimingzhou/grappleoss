import { useMemo, useState } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import type { NodeConnection } from "../../types/index";

interface ConnectionsSectionProps {
  nodeId: string;
  connections: NodeConnection[];
  onAdd?: (connection: NodeConnection) => void;
  onDelete?: (connectionId: string) => void;
  onUpdate?: (connectionId: string, description: string) => void;
}

export default function ConnectionsSection({
  nodeId,
  connections,
  onAdd,
  onDelete,
  onUpdate,
}: ConnectionsSectionProps) {
  const nodes = useGraphStore((s) => s.nodes);

  // Get available nodes to connect to (excludes current node)
  const availableNodes = useMemo(
    () => nodes.filter((n) => n.id !== nodeId),
    [nodes, nodeId],
  );

  // Get already connected target IDs
  const connectedIds = useMemo(
    () => connections.map((c) => c.targetNodeId),
    [connections],
  );

  // Get available targets that aren't already connected
  const availableTargets = useMemo(
    () => availableNodes.filter((n) => !connectedIds.includes(n.id)),
    [availableNodes, connectedIds],
  );

  const getNodeLabel = (id: string) => {
    return nodes.find((n) => n.id === id)?.data?.label || id;
  };

  return {
    availableTargets,
    connectedIds,
    getNodeLabel,
    AddFormComponent: AddConnectionForm,
  };
}

export { AddConnectionForm };

// Add Connection Form Component
function AddConnectionForm({
  nodeId,
  availableTargets,
  getNodeLabel,
  onAdd,
  onCancel,
}: {
  nodeId: string;
  availableTargets: any[];
  getNodeLabel: (id: string) => string;
  onAdd: (conn: NodeConnection) => void;
  onCancel: () => void;
}) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!selectedTargetId) {
      alert("Please select a target node");
      return;
    }

    const newConnection: NodeConnection = {
      id: `conn-${Date.now()}`,
      targetNodeId: selectedTargetId,
      description: description || undefined,
      createdAt: Date.now(),
    };

    onAdd(newConnection);
    setSelectedTargetId("");
    setDescription("");
    onCancel();
  };

  return (
    <div
      className="rounded px-4 py-3 space-y-3"
      style={{ backgroundColor: "#EEEEEE" }}
    >
      <div>
        <label
          className="text-xs font-semibold block mb-2"
          style={{ color: "#393E46" }}
        >
          Target Node
        </label>
        <select
          value={selectedTargetId}
          onChange={(e) => setSelectedTargetId(e.target.value)}
          className="w-full text-sm rounded px-3 py-2 transition-colors"
          style={{
            backgroundColor: "#F7F7F7",
            color: "#393E46",
            border: "none",
          }}
        >
          <option value="">Select a node...</option>
          {availableTargets.length > 0 ? (
            availableTargets.map((node) => (
              <option key={node.id} value={node.id}>
                {getNodeLabel(node.id)}
              </option>
            ))
          ) : (
            <option disabled>No available nodes</option>
          )}
        </select>
      </div>

      <div>
        <label
          className="text-xs font-semibold block mb-2"
          style={{ color: "#393E46" }}
        >
          Description (optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., 'follow up', 'if opponent resists'..."
          className="w-full text-sm rounded px-3 py-2 transition-colors"
          style={{
            backgroundColor: "#F7F7F7",
            color: "#393E46",
            border: "none",
          }}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "#F7F7F7",
            color: "#393E46",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "#393E46",
            color: "#F7F7F7",
          }}
        >
          Add Connection
        </button>
      </div>
    </div>
  );
}
