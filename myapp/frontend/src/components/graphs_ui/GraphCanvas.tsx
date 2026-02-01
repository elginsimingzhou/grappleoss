import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../../stores/useGraphStore";
// import DetailNode from "./DetailNode";

export default function GraphCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useGraphStore();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h1>This is Graph Canvas {nodes.length} nodes</h1>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
