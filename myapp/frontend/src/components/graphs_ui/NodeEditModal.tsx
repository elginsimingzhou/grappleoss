import { useEffect, useMemo, useState } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import type { DetailNodeType } from "./DetailNode";
import type { NodeConnection } from "../../types/index";
import type { Node } from "reactflow";
import DescriptionEditor from "./DescriptionEditor";
import DeleteNodeSection from "./DeleteNodeSection";

const TYPE_OPTIONS: DetailNodeType[] = [
  "Position",
  "Action",
  "Reaction",
  "Submission",
  "None",
];

export default function NodeEditModal() {
  const nodes = useGraphStore((s) => s.nodes);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);

  const closeNodeModal = useGraphStore((s) => s.closeNodeModal);
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const deleteNode = useGraphStore((s) => s.deleteNode);
  const addConnection = useGraphStore((s) => s.addConnection);
  const updateConnection = useGraphStore((s) => s.updateConnection);
  const deleteConnection = useGraphStore((s) => s.deleteConnection);

  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  const initialLabel = String(node?.data?.label ?? "");
  const initialType = (node?.data?.type ?? "None") as DetailNodeType;
  const initialContent = node?.data?.content ?? "";
  const initialConnections = node?.data?.connections ?? [];

  const [label, setLabel] = useState(initialLabel);
  const [type, setType] = useState<DetailNodeType>(initialType);
  const [content, setContent] = useState(initialContent);
  const [connections, setConnections] =
    useState<NodeConnection[]>(initialConnections);
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(
    null,
  );

  // Keep local state in sync when switching nodes
  useEffect(() => {
    setLabel(initialLabel);
    setType(initialType);
    setContent(initialContent);
    setConnections(initialConnections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId]);

  // If nothing selected, render nothing
  if (!selectedNodeId) return null;

  // Fallback if node not found
  if (!node) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          onClick={closeNodeModal}
          aria-label="Close modal"
        />
        <div className="relative z-10 w-[640px] max-w-[92vw] rounded-xl bg-white p-4 shadow-lg">
          <p className="text-sm text-red-600">
            Error: Node not found (ID: {selectedNodeId})
          </p>
          <button
            type="button"
            className="mt-4 rounded bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
            onClick={closeNodeModal}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const onSave = () => {
    updateNodeData(selectedNodeId, {
      label: label,
      type,
      content: content,
      connections: connections,
    });
    closeNodeModal();
  };

  const onDelete = () => {
    deleteNode(selectedNodeId);
    closeNodeModal();
  };

  const handleConnectionAdd = (conn: NodeConnection) => {
    setConnections([...connections, conn]);
    addConnection(selectedNodeId, conn.targetNodeId, conn.description);
  };

  const handleConnectionUpdate = (
    connectionId: string,
    description: string,
  ) => {
    setConnections(
      connections.map((c) =>
        c.id === connectionId ? { ...c, description } : c,
      ),
    );
    updateConnection(selectedNodeId, connectionId, description);
  };

  const handleConnectionDelete = (connectionId: string) => {
    setConnections(connections.filter((c) => c.id !== connectionId));
    deleteConnection(selectedNodeId, connectionId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(57, 62, 70, 0.5)" }}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0"
        onClick={closeNodeModal}
        aria-label="Close modal"
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-[680px] max-w-[92vw] max-h-[90vh] rounded-lg shadow-lg overflow-y-auto"
        style={{ backgroundColor: "#F7F7F7" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: "#EEEEEE", borderColor: "#EEEEEE" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "#393E46" }}>
            {label || "Untitled"}
          </h2>
          <button
            type="button"
            className="rounded p-1 hover:bg-white transition-colors"
            onClick={closeNodeModal}
            style={{ color: "#393E46" }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Type Selector */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: "#393E46" }}
            >
              Type
            </label>
            <select
              className="w-full rounded px-4 py-2 text-sm transition-colors"
              style={{
                backgroundColor: "#EEEEEE",
                color: "#393E46",
                border: `2px solid #EEEEEE`,
              }}
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

          {/* Title Input */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: "#393E46" }}
            >
              Title
            </label>
            <input
              className="w-full rounded px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              style={{
                backgroundColor: "#EEEEEE",
                color: "#393E46",
                border: `2px solid #EEEEEE`,
              }}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          {/* Description Editor */}
          <DescriptionEditor content={content} onChange={setContent} />

          {/* Connections Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3
                className="text-sm font-semibold"
                style={{ color: "#393E46" }}
              >
                Connections ({connections.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowConnectionForm(!showConnectionForm)}
                className="text-xs font-semibold rounded px-3 py-1.5 hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "#393E46",
                  color: "#F7F7F7",
                }}
              >
                + ADD
              </button>
            </div>

            {/* Add Connection Form */}
            {showConnectionForm && (
              <AddConnectionFormComponent
                nodeId={selectedNodeId}
                nodes={nodes}
                connections={connections}
                onAdd={handleConnectionAdd}
                onCancel={() => setShowConnectionForm(false)}
              />
            )}

            {/* Connections List */}
            <div className="space-y-2">
              {connections.length === 0 ? (
                <p className="text-sm italic" style={{ color: "#929AAB" }}>
                  No connections yet
                </p>
              ) : (
                connections.map((conn) => (
                  <ConnectionItemDisplay
                    key={conn.id}
                    connection={conn}
                    nodes={nodes}
                    onEdit={() => setEditingConnectionId(conn.id)}
                    onDelete={() => handleConnectionDelete(conn.id)}
                    isEditing={editingConnectionId === conn.id}
                    onUpdate={(desc) => {
                      handleConnectionUpdate(conn.id, desc);
                      setEditingConnectionId(null);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{ borderTop: "1px solid #EEEEEE", marginTop: "1.5rem" }}
          />

          {/* Tags Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold" style={{ color: "#393E46" }}>
              Tags
            </h3>
            <div
              className="rounded px-4 py-3"
              style={{ backgroundColor: "#EEEEEE", color: "#929AAB" }}
            >
              <input
                type="text"
                placeholder="Add tags..."
                className="w-full bg-transparent text-sm focus:outline-none"
                style={{ color: "#393E46" }}
              />
            </div>
          </div>

          {/* Delete Section */}
          <div
            className="rounded px-4 py-4 space-y-3"
            style={{ backgroundColor: "#EEEEEE" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "#393E46" }}
                >
                  Delete Node
                </h3>
                <p className="text-xs mt-1" style={{ color: "#929AAB" }}>
                  Nodes and connections will be deleted
                </p>
              </div>
              <button
                type="button"
                onClick={onDelete}
                className="rounded px-3 py-2 text-xs font-semibold hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "#E74C3C",
                  color: "#F7F7F7",
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex items-center justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "#EEEEEE" }}
          >
            <button
              type="button"
              className="rounded px-5 py-2 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "#EEEEEE",
                color: "#393E46",
              }}
              onClick={closeNodeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#393E46",
                color: "#F7F7F7",
              }}
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Connection Form Component
function AddConnectionFormComponent({
  nodeId,
  nodes,
  connections,
  onAdd,
  onCancel,
}: {
  nodeId: string;
  nodes: any[];
  connections: NodeConnection[];
  onAdd: (conn: NodeConnection) => void;
  onCancel: () => void;
}) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [description, setDescription] = useState("");

  const availableTargets = nodes.filter(
    (n) =>
      n.id !== nodeId && !connections.map((c) => c.targetNodeId).includes(n.id),
  );

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
                {node.data?.label || "Unknown"}
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

// Helper component for displaying a connection item
function ConnectionItemDisplay({
  connection,
  nodes,
  onEdit,
  onDelete,
  isEditing,
  onUpdate,
}: {
  connection: NodeConnection;
  nodes: Node[];
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onUpdate: (description: string) => void;
}) {
  const targetNode = nodes.find((n) => n.id === connection.targetNodeId);
  const [editDesc, setEditDesc] = useState(connection.description || "");

  return (
    <div
      className="rounded px-3 py-3 space-y-2"
      style={{ backgroundColor: "#EEEEEE" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span style={{ color: "#929AAB" }}>→</span>
            <p className="text-sm font-medium" style={{ color: "#393E46" }}>
              {targetNode?.data?.label || "Unknown"}
            </p>
          </div>
          {connection.description && (
            <p className="text-xs mt-1" style={{ color: "#929AAB" }}>
              {connection.description}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded px-2 py-1 text-xs hover:opacity-70 transition-opacity"
            style={{ backgroundColor: "#F7F7F7", color: "#393E46" }}
            title="Edit"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded px-2 py-1 text-xs hover:opacity-70 transition-opacity"
            style={{ backgroundColor: "#F7F7F7", color: "#E74C3C" }}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {isEditing && (
        <div
          className="flex gap-2 pt-2 border-t"
          style={{ borderColor: "#F7F7F7" }}
        >
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Update description..."
            className="flex-1 text-xs rounded px-2 py-1"
            style={{
              backgroundColor: "#F7F7F7",
              color: "#393E46",
              border: "none",
            }}
          />
          <button
            type="button"
            onClick={() => onUpdate(editDesc)}
            className="rounded px-2 py-1 text-xs hover:opacity-70 transition-opacity"
            style={{ backgroundColor: "#393E46", color: "#F7F7F7" }}
          >
            ✓
          </button>
        </div>
      )}
    </div>
  );
}
