import ReactFlow, { Background, Controls } from "reactflow";
import type { NodeMouseHandler } from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../../stores/useGraphStore";
import DetailNode from "./DetailNode";
import NodeEditModal from "./NodeEditModal";

// Define nodeTypes outside component to avoid recreation warnings
const nodeTypes = {
  detailNode: DetailNode,
};

export default function GraphCanvas() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const onNodesChange = useGraphStore((s) => s.onNodesChange);
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange);
  const onConnect = useGraphStore((s) => s.onConnect);

  const openNodeModal = useGraphStore((s) => s.openNodeModal);

  const onNodeClick: NodeMouseHandler = (_event, node) => {
    openNodeModal(node.id);
    console.log("Node clicked:", node.id);
  };

  return (
    <div className="w-screen h-screen">
      {/* <h1>This is Graph Canvas {nodes.length} nodes</h1> */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <NodeEditModal />
    </div>
  );
}
