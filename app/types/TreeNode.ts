export interface TreeNodeData {
  content: string;
  left?: TreeNodeData;
  right?: TreeNodeData;
  id: string; // Unique identifier for each node
} 