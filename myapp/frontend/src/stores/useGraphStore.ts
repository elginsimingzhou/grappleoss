import { create } from "zustand";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "reactflow";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";

/* ================================
   Types
================================ */

export type DetailNodeType =
  | "Position"
  | "Action"
  | "Reaction"
  | "Submission"
  | "None";

export type DetailNodeData = {
  title: string;
  type: DetailNodeType;
  descriptionHtml: string;
};

type GraphState = {
  nodes: Node<DetailNodeData>[];
  edges: Edge[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (position?: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, patch: Partial<DetailNodeData>) => void;
  addConnection: (sourceId: string, targetId: string, label?: string) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;

  clear: () => void;
};

/* ================================
   Initial Sample Data
================================ */

const shinToShinId = "node-shin-to-shin";
const standUpId = "node-stand-up";
const slxId = "node-slx";
const sweepId = "node-sweep";

const initialNodes: Node<DetailNodeData>[] = [
  {
    id: shinToShinId,
    type: "detailNode",
    position: { x: 0, y: 0 },
    data: {
      title: "Shin to Shin Guard",
      type: "Position",
      descriptionHtml: `
        <ul>
          <li>Wrap left arm over opponent’s right leg knee pit</li>
          <li>Place your shin across his shin</li>
          <li>Control the far ankle and off-balance</li>
        </ul>
      `,
    },
  },
  {
    id: standUpId,
    type: "detailNode",
    position: { x: 420, y: -120 },
    data: {
      title: "Opponent Tries to Stand",
      type: "Reaction",
      descriptionHtml: `
        <p>Opponent postures up or attempts to disengage.</p>
      `,
    },
  },
  {
    id: slxId,
    type: "detailNode",
    position: { x: 420, y: 120 },
    data: {
      title: "Single Leg X",
      type: "Position",
      descriptionHtml: `
        <p>Transition to SLX by elevating the leg and controlling the ankle.</p>
      `,
    },
  },
  {
    id: sweepId,
    type: "detailNode",
    position: { x: 840, y: -120 },
    data: {
      title: "Technical Stand-Up Sweep",
      type: "Action",
      descriptionHtml: `
        <p>Stand up with the leg, drive forward, and finish the sweep.</p>
      `,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "edge-1",
    source: shinToShinId,
    target: standUpId,
    label: "if opponent tries to stand",
    type: "default",
  },
  {
    id: "edge-2",
    source: shinToShinId,
    target: slxId,
    label: "off-balance forward",
    type: "default",
  },
  {
    id: "edge-3",
    source: standUpId,
    target: sweepId,
    label: "follow up",
    type: "default",
  },
];

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  /* React Flow callbacks */
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          id: nanoid(),
          type: "default",
        },
        get().edges,
      ),
    });
  },

  /* Custom actions */
  addNode: (position) => {
    const id = nanoid();

    const newNode: Node<DetailNodeData> = {
      id,
      type: "detailNode",
      position: position ?? { x: 200, y: 200 },
      data: {
        title: "Untitled",
        type: "None",
        descriptionHtml: "",
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  updateNodeData: (nodeId, patch) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...patch } }
          : node,
      ),
    }));
  },

  addConnection: (sourceId, targetId, label) => {
    const newEdge: Edge = {
      id: nanoid(),
      source: sourceId,
      target: targetId,
      label,
      type: "default",
    };

    set((state) => ({
      edges: [...state.edges, newEdge],
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId,
      ),
    }));
  },

  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    }));
  },

  clear: () => {
    set({ nodes: [], edges: [] });
  },
}));
