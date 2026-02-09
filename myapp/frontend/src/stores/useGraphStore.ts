import { create } from "zustand";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "reactflow";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";
import type { DetailNodeData } from "../components/graphs_ui/DetailNode";
import type { NodeConnection } from "../types/index";

/* ================================
   Types
================================ */

type GraphState = {
  nodes: Node<DetailNodeData>[];
  edges: Edge[];

  selectedNodeId: string | null;
  openNodeModal: (nodeId: string) => void;
  closeNodeModal: () => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (position?: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, patch: Partial<DetailNodeData>) => void;
  addConnection: (
    sourceId: string,
    targetId: string,
    description?: string,
  ) => void;
  updateConnection: (
    nodeId: string,
    connectionId: string,
    description: string,
  ) => void;
  deleteConnection: (nodeId: string, connectionId: string) => void;
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
      label: "Shin to Shin Guard",
      type: "Position",
      description: `
        Opponent postures up or attempts to disengage.
      `,
      content: "",
      connections: [],
      youtubeUrl: "https://www.youtube.com/watch?v=23enzBqgkhs",
      youtubeVideoId: "23enzBqgkhs",
    },
  },
  {
    id: standUpId,
    type: "detailNode",
    position: { x: 420, y: -120 },
    data: {
      label: "Opponent Tries to Stand",
      type: "Reaction",
      description: `
        Opponent postures up or attempts to disengage.
      `,
      content: "",
      connections: [],
      youtubeUrl: "https://youtu.be/23enzBqgkhs?si=R772e0MTScJRad0W",
      youtubeVideoId: "23enzBqgkhs",
    },
  },
  {
    id: slxId,
    type: "detailNode",
    position: { x: 420, y: 120 },
    data: {
      label: "Single Leg X",
      type: "Position",
      description: `
        Transition to SLX by elevating the leg and controlling the ankle
      `,
      content: "",
      connections: [],
      youtubeUrl: "https://www.youtube.com/shorts/pY4Irfhh9NU",
      youtubeVideoId: "pY4Irfhh9NU",
    },
  },
  {
    id: sweepId,
    type: "detailNode",
    position: { x: 840, y: -120 },
    data: {
      label: "Technical Stand-Up Sweep",
      type: "Action",
      description: `
        Stand up with the leg, drive forward, and finish the sweep.
      `,
      content: "",
      connections: [],
      youtubeUrl: "https://youtube.com/shorts/0N_HyIf669E?si=Q5bE_l5DQkmB_ozS",
      youtubeVideoId: "0N_HyIf669E",
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
  selectedNodeId: null,

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
  openNodeModal: (nodeId) => set({ selectedNodeId: nodeId }),

  closeNodeModal: () => set({ selectedNodeId: null }),

  addNode: (position) => {
    const id = nanoid();

    const newNode: Node<DetailNodeData> = {
      id,
      type: "detailNode",
      position: position ?? { x: 200, y: 200 },
      data: {
        label: "Untitled",
        type: "None",
        description: "",
        content: "",
        connections: [],
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

  addConnection: (sourceId, targetId, description) => {
    const newEdge: Edge = {
      id: nanoid(),
      source: sourceId,
      target: targetId,
      label: description,
      type: "default",
    };

    // Also store in node connections
    set((state) => ({
      edges: [...state.edges, newEdge],
      nodes: state.nodes.map((node) => {
        if (node.id === sourceId) {
          const newConnection: NodeConnection = {
            id: newEdge.id,
            targetNodeId: targetId,
            description,
            createdAt: Date.now(),
          };
          return {
            ...node,
            data: {
              ...node.data,
              connections: [...(node.data.connections || []), newConnection],
            },
          };
        }
        return node;
      }),
    }));
  },

  updateConnection: (nodeId, connectionId, description) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId && node.data.connections) {
          return {
            ...node,
            data: {
              ...node.data,
              connections: node.data.connections.map((conn) =>
                conn.id === connectionId ? { ...conn, description } : conn,
              ),
            },
          };
        }
        return node;
      }),
      edges: state.edges.map((edge) =>
        edge.id === connectionId ? { ...edge, label: description } : edge,
      ),
    }));
  },

  deleteConnection: (nodeId, connectionId) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId && node.data.connections) {
          return {
            ...node,
            data: {
              ...node.data,
              connections: node.data.connections.filter(
                (c) => c.id !== connectionId,
              ),
            },
          };
        }
        return node;
      }),
      edges: state.edges.filter((e) => e.id !== connectionId),
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
