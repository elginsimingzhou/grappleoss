/* Connection type for relationships between nodes */
export type NodeConnection = {
  id: string;
  targetNodeId: string; // The node this connection points to
  description?: string; // Optional description of the relationship
  createdAt?: number;
};
